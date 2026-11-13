"""
ReportSaathi Telegram Bot
Educational assistant for simplifying medical laboratory reports via Telegram.
Safety: Does not log sensitive patient data or bot tokens.
"""

import os
import sys
import logging
import asyncio
from typing import Optional
import httpx

from app.core.config import settings
from app.services.extractor import process_uploaded_file_safely
from app.services.gemini_service import analyze_report_with_gemini

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("reportsaathi_telegram_bot")

TELEGRAM_API_URL = "https://api.telegram.org/bot"

DISCLAIMER_TEXT = (
    "\n\n⚠️ *Educational Use Only:*\n"
    "ReportSaathi is not a diagnostic tool or substitute for a doctor. "
    "Always consult a licensed healthcare professional to interpret your lab tests."
)

async def send_telegram_message(token: str, chat_id: int, text: str, parse_mode: str = "Markdown") -> bool:
    """Sends a text message to a Telegram chat."""
    url = f"{TELEGRAM_API_URL}{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": parse_mode}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            res = await client.post(url, json=payload)
            return res.status_code == 200
        except Exception as e:
            logger.error(f"Failed to send telegram message: {e}")
            return False

async def get_file_bytes(token: str, file_id: str) -> Optional[tuple[bytes, str]]:
    """Fetches file metadata and downloads bytes from Telegram servers."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Get file path
        url = f"{TELEGRAM_API_URL}{token}/getFile?file_id={file_id}"
        res = await client.get(url)
        if res.status_code != 200:
            return None
        file_info = res.json().get("result", {})
        file_path = file_info.get("file_path")
        if not file_path:
            return None

        # 2. Download file
        download_url = f"https://api.telegram.org/file/bot{token}/{file_path}"
        download_res = await client.get(download_url)
        if download_res.status_code != 200:
            return None

        filename = os.path.basename(file_path)
        return download_res.content, filename

async def process_telegram_update(update: dict, token: str):
    """Processes an incoming Telegram message update."""
    message = update.get("message", {})
    chat = message.get("chat", {})
    chat_id = chat.get("id")
    if not chat_id:
        return

    text = message.get("text", "")

    # Handle Commands
    if text.startswith("/start") or text.startswith("/help"):
        welcome_msg = (
            "👋 *Welcome to ReportSaathi Bot!*\n\n"
            "I help you understand your medical laboratory test reports in simple, patient-friendly language.\n\n"
            "📄 *How to use:* Send me a PDF, JPG, or PNG of your blood test or lab report.\n\n"
            "🔒 *Privacy:* Your report is processed for educational explanation and is not stored."
            + DISCLAIMER_TEXT
        )
        await send_telegram_message(token, chat_id, welcome_msg)
        return

    # Handle Document (PDF / Images sent as uncompressed files)
    document = message.get("document")
    photo = message.get("photo")

    file_id = None
    original_filename = "report"

    if document:
        file_id = document.get("file_id")
        original_filename = document.get("file_name", "document.pdf")
    elif photo:
        # Pick highest resolution photo
        highest_photo = photo[-1]
        file_id = highest_photo.get("file_id")
        original_filename = "photo.jpg"

    if not file_id:
        await send_telegram_message(
            token, chat_id,
            "Please send a medical lab report document (PDF) or photo (JPG/PNG) to analyze." + DISCLAIMER_TEXT
        )
        return

    await send_telegram_message(token, chat_id, "⏳ *Reading your report and extracting tests...*")

    # Download file safely
    file_data = await get_file_bytes(token, file_id)
    if not file_data:
        await send_telegram_message(token, chat_id, "❌ Unable to download file from Telegram servers. Please try again.")
        return

    file_bytes, downloaded_name = file_data
    eval_filename = original_filename if original_filename != "report" else downloaded_name

    try:
        # Extract Text with safety & validation
        extracted_text, method = process_uploaded_file_safely(eval_filename, file_bytes)

        await send_telegram_message(token, chat_id, "🧠 *Analyzing biomarkers and preparing plain-English explanation...*")

        # Explain with Gemini
        analysis = await analyze_report_with_gemini(extracted_text)

        report_type = analysis.get("report_type", "Laboratory Report")
        overall = analysis.get("overall_summary", "")
        concerns = analysis.get("areas_of_concern", [])
        questions = analysis.get("next_steps_questions", [])

        concerns_text = "\n".join([f"• {c}" for c in concerns[:3]]) if concerns else "All standard tested values look within normal ranges."
        questions_text = "\n".join([f"{i+1}. {q}" for q in questions[:3]]) if questions else "Discuss standard health checkups with your doctor."

        response_msg = (
            f"📋 *Report: {report_type}*\n\n"
            f"💡 *Summary:*\n{overall}\n\n"
            f"🔍 *Items to Discuss:*\n{concerns_text}\n\n"
            f"❓ *Questions to Ask Your Doctor:*\n{questions_text}"
            + DISCLAIMER_TEXT
        )

        await send_telegram_message(token, chat_id, response_msg)

    except ValueError as ve:
        await send_telegram_message(token, chat_id, f"⚠️ *Validation Notice:*\n{str(ve)}" + DISCLAIMER_TEXT)
    except Exception as e:
        logger.error(f"Processing error: {e}")
        await send_telegram_message(token, chat_id, "⚠️ We could not process this file. Please make sure the document is a clear, legible laboratory test report.")

async def run_bot_polling():
    """Starts polling loop for the Telegram Bot."""
    token = settings.telegram_bot_token
    if not token:
        logger.warning("TELEGRAM_BOT_TOKEN is not set in environment. Telegram bot polling disabled.")
        return

    logger.info("Starting ReportSaathi Telegram Bot polling...")
    offset = 0
    url = f"{TELEGRAM_API_URL}{token}/getUpdates"

    async with httpx.AsyncClient(timeout=35.0) as client:
        while True:
            try:
                res = await client.get(f"{url}?offset={offset}&timeout=30")
                if res.status_code == 200:
                    data = res.json()
                    for update in data.get("result", []):
                        offset = update["update_id"] + 1
                        asyncio.create_task(process_telegram_update(update, token))
            except Exception as e:
                logger.error(f"Polling exception: {e}")
                await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(run_bot_polling())
