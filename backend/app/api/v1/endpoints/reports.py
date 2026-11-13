import uuid
from datetime import datetime, timezone
import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Body

from app.core.config import settings
from app.models.schemas import (
    ReportAnalysisResponse, 
    Biomarker, 
    ReportSummary,
    ChatRequest,
    ChatResponse,
    SaveReportRequest
)
from app.services.extractor import process_uploaded_file_safely
from app.services.gemini_service import (
    analyze_report_with_gemini, 
    answer_report_question,
    generate_synthetic_analysis
)
from app.services.supabase_service import (
    save_user_report,
    get_saved_reports,
    delete_saved_report
)

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for recently analyzed reports during the session
_RECENT_REPORTS_CACHE: Dict[str, Dict[str, Any]] = {}

@router.post("/analyze", response_model=ReportAnalysisResponse)
async def analyze_report_endpoint(
    file: UploadFile = File(...)
):
    """
    POST /api/reports/analyze
    Accepts PDF, JPG or PNG report uploads.
    Validates file format, enforces size restrictions (<10MB),
    extracts text safely using PyMuPDF / Tesseract OCR,
    and returns a structured educational breakdown with Gemini.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing file name in upload request.")

    # Read binary bytes safely
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read upload stream: {str(e)}")

    # 1. Validation & Safe Extraction
    try:
        extracted_text, extraction_method = process_uploaded_file_safely(file.filename, contents)
    except ValueError as ve:
        # Client validation or format errors (unsupported extension, size limit, blank text)
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        # Processing / OCR failures
        raise HTTPException(status_code=422, detail=str(re))
    except Exception as e:
        logger.error(f"Unexpected extraction error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the document.")

    # 2. Gemini Analysis with strict medical guardrails
    analysis_data = await analyze_report_with_gemini(extracted_text)

    # 3. Format Response
    report_id = f"rep-{uuid.uuid4()}"
    summary_data = ReportSummary(
        report_type=analysis_data.get("report_type", "Laboratory Report"),
        patient_context=analysis_data.get("patient_context"),
        overall_summary=analysis_data.get("overall_summary", "Report analysis ready."),
        key_findings=analysis_data.get("key_findings", []),
        areas_of_concern=analysis_data.get("areas_of_concern", []),
        next_steps_questions=analysis_data.get("next_steps_questions", []),
        disclaimer="FOR EDUCATIONAL USE ONLY: ReportSaathi is not a diagnostic tool and does not provide medical diagnoses or treatment recommendations. Always consult a licensed healthcare professional to interpret your lab results."
    )

    biomarkers_list = []
    for b in analysis_data.get("biomarkers", []):
        try:
            biomarkers_list.append(Biomarker(**b))
        except Exception as be:
            logger.warning(f"Skipping malformed biomarker record: {be}")

    response_payload = ReportAnalysisResponse(
        id=report_id,
        filename=file.filename,
        status="success",
        extracted_text=extracted_text,
        extracted_text_preview=extracted_text[:1200] + ("..." if len(extracted_text) > 1200 else ""),
        summary=summary_data,
        biomarkers=biomarkers_list,
        created_at=datetime.now(timezone.utc).isoformat(),
        is_mock=analysis_data.get("is_mock", False),
        source_extracted_facts_count=len(biomarkers_list)
    )

    # Cache in session memory for interactive chat
    _RECENT_REPORTS_CACHE[report_id] = response_payload.model_dump()

    return response_payload

@router.post("/chat", response_model=ChatResponse)
async def chat_about_report(payload: ChatRequest):
    """
    POST /api/reports/chat
    Answers questions strictly using the currently selected report's extracted information.
    Refuses out-of-scope inquiries or diagnosis requests.
    """
    # Retrieve report context
    context = payload.report_context
    if not context and payload.report_id:
        context = _RECENT_REPORTS_CACHE.get(payload.report_id)

    if not context:
        raise HTTPException(
            status_code=400, 
            detail="No report context found. Please provide active report data to ask questions."
        )

    # Convert pydantic history models to dicts if present
    history_dicts = [h.model_dump() for h in payload.history] if payload.history else []

    result = await answer_report_question(
        question=payload.question, 
        report_context=context,
        history=history_dicts
    )
    return ChatResponse(**result)

@router.post("/save")
async def save_report_opt_in(payload: SaveReportRequest):
    """
    POST /api/reports/save
    Explicit opt-in to save report summary to Supabase or session history.
    Does not save raw original upload binary or raw OCR text.
    """
    res = await save_user_report(
        report_id=payload.report_id,
        filename=payload.filename,
        report_type=payload.report_type,
        summary_text=payload.summary_text,
        biomarkers_summary=payload.biomarkers_summary,
        user_id=payload.user_id
    )
    return res

@router.get("/saved")
async def list_saved_reports(user_id: Optional[str] = Query("guest")):
    """
    GET /api/reports/saved
    Returns saved reports for the authenticated user or local session.
    """
    return await get_saved_reports(user_id=user_id)

@router.delete("/saved/{report_id}")
async def remove_saved_report(report_id: str, user_id: Optional[str] = Query("guest")):
    """
    DELETE /api/reports/saved/{report_id}
    Deletes a saved report.
    """
    success = await delete_saved_report(report_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved report not found or could not be deleted.")
    return {"success": True, "message": "Report deleted successfully."}
