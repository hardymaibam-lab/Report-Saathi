import logging
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Temporary in-memory session cache for guest testing
_SESSION_SAVED_REPORTS: List[Dict[str, Any]] = []

_supabase_client = None

def get_supabase_client():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.supabase_url and settings.supabase_key:
        try:
            from supabase import create_client
            _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
            logger.info("Supabase client initialized.")
            return _supabase_client
        except Exception as e:
            logger.error(f"Supabase initialization error: {e}")
            return None
    return None

def is_supabase_configured() -> bool:
    return bool(settings.supabase_url and settings.supabase_key)

async def save_user_report(
    report_id: str,
    filename: str,
    report_type: str,
    summary_text: str,
    biomarkers_summary: List[Dict[str, Any]],
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Saves an opted-in report to Supabase or session storage.
    Note: Does NOT store original uploaded binary files or raw medical text.
    """
    record_id = report_id or str(uuid.uuid4())
    record = {
        "id": record_id,
        "user_id": user_id or "demo-user",
        "filename": filename,
        "report_type": report_type,
        "summary_text": summary_text,
        "biomarkers_summary": biomarkers_summary,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    client = get_supabase_client()
    if client and user_id and user_id != "guest":
        try:
            res = client.table("saved_reports").insert(record).execute()
            if res.data:
                return {"success": True, "saved_to_cloud": True, "record": res.data[0]}
        except Exception as e:
            logger.error(f"Failed to insert report into Supabase: {e}")
            return {"success": False, "saved_to_cloud": False, "error": str(e)}

    # Demo mode fallback
    _SESSION_SAVED_REPORTS.insert(0, record)
    return {
        "success": True,
        "saved_to_cloud": False,
        "is_demo_mode": not is_supabase_configured(),
        "record": record,
        "notice": "Saved to local session. Cloud sync requires Supabase credentials in .env"
    }

async def get_saved_reports(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Fetches saved reports for the authenticated user or local session."""
    client = get_supabase_client()
    if client and user_id and user_id != "guest":
        try:
            res = client.table("saved_reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Failed to fetch saved reports from Supabase: {e}")

    return _SESSION_SAVED_REPORTS

async def delete_saved_report(report_id: str, user_id: Optional[str] = None) -> bool:
    """Deletes a saved report by ID."""
    global _SESSION_SAVED_REPORTS
    client = get_supabase_client()
    if client and user_id and user_id != "guest":
        try:
            res = client.table("saved_reports").delete().eq("id", report_id).eq("user_id", user_id).execute()
            return True
        except Exception as e:
            logger.error(f"Failed to delete report from Supabase: {e}")
            return False

    initial_len = len(_SESSION_SAVED_REPORTS)
    _SESSION_SAVED_REPORTS = [r for r in _SESSION_SAVED_REPORTS if r["id"] != report_id]
    return len(_SESSION_SAVED_REPORTS) < initial_len
