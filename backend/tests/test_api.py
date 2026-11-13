import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoints():
    """Verify both /health and /api/health respond with 200 and required fields."""
    for path in ["/health", "/api/health"]:
        response = client.get(path)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "tesseract_available" in data
        assert "gemini_configured" in data
        assert "supabase_configured" in data

def test_upload_rejection_for_unsupported_format():
    """Uploading an unsupported file format like .txt or .exe must return 400."""
    fake_txt = io.BytesIO(b"Dummy report text content")
    response = client.post(
        "/api/reports/analyze",
        files={"file": ("report.txt", fake_txt, "text/plain")}
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]

def test_upload_rejection_for_empty_file():
    """Uploading an empty 0-byte file must return 400."""
    empty_file = io.BytesIO(b"")
    response = client.post(
        "/api/reports/analyze",
        files={"file": ("empty.pdf", empty_file, "application/pdf")}
    )
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_upload_valid_synthetic_pdf():
    """Upload a valid digital PDF and verify structured extraction & Gemini response."""
    import pymupdf

    # Create a small in-memory synthetic PDF with standard blood count text
    doc = pymupdf.open()
    page = doc.new_page()
    sample_text = (
        "METROPOLIS HEALTHCARE - PATIENT BLOOD REPORT\n"
        "Patient: Ramesh Sharma | Age: 42 | Gender: Male\n"
        "Hemoglobin (Hb): 11.2 g/dL (Reference Range: 13.0 - 17.0)\n"
        "Total Leucocyte Count (WBC): 6,800 /cumm (Reference Range: 4,000 - 11,000)\n"
        "Platelet Count: 240,000 /cumm (Reference Range: 150,000 - 450,000)\n"
    )
    page.insert_text((50, 72), sample_text)
    pdf_bytes = doc.write()
    doc.close()

    response = client.post(
        "/api/reports/analyze",
        files={"file": ("synthetic_cbc.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "extracted_text" in data
    assert len(data["biomarkers"]) > 0

    # Verify zero-invention rules on biomarkers
    for b in data["biomarkers"]:
        assert "test_name" in b
        assert "extracted_value" in b
        assert "explanation" in b
        assert b["status"] in ["normal", "high", "low", "unclear", "not_specified"]

    # Verify visible educational disclaimer
    assert "disclaimer" in data["summary"]
    assert "EDUCATIONAL" in data["summary"]["disclaimer"].upper()

def test_chat_within_report_scope():
    """Asking about a biomarker that exists in the report returns a factual answer."""
    sample_context = {
        "summary": {
            "report_type": "Complete Blood Count",
            "overall_summary": "Hemoglobin is slightly below the reference interval."
        },
        "biomarkers": [
            {
                "test_name": "Hemoglobin (Hb)",
                "common_name": "Hemoglobin",
                "extracted_value": "11.2",
                "unit": "g/dL",
                "reference_range": "13.0 - 17.0",
                "status": "low",
                "explanation": "Carries oxygen throughout the body.",
                "missing_or_unclear_notes": None
            }
        ]
    }

    response = client.post(
        "/api/reports/chat",
        json={"question": "What is my hemoglobin level and is it low?", "report_context": sample_context}
    )
    assert response.status_code == 200
    res = response.json()
    assert res["supported_by_report"] is True
    assert "11.2" in res["answer"]
    assert "Hemoglobin" in res["answer"]

def test_chat_refusal_for_diagnostic_requests():
    """Asking for a medical diagnosis must be safely refused."""
    sample_context = {
        "summary": {"report_type": "Blood Test", "overall_summary": "Routine checkup"},
        "biomarkers": []
    }
    response = client.post(
        "/api/reports/chat",
        json={"question": "Do I have cancer or diabetes? Diagnose me.", "report_context": sample_context}
    )
    assert response.status_code == 200
    res = response.json()
    assert res["supported_by_report"] is False
    assert "cannot diagnose" in res["answer"].lower()

def test_chat_refusal_for_unsupported_topics():
    """Asking about tests not present in the report must indicate information is unavailable."""
    sample_context = {
        "summary": {"report_type": "Complete Blood Count", "overall_summary": "Blood cell count"},
        "biomarkers": [
            {"test_name": "Hemoglobin", "extracted_value": "11.2", "explanation": "Oxygen carrier"}
        ]
    }
    response = client.post(
        "/api/reports/chat",
        json={"question": "What was my Thyroid TSH result?", "report_context": sample_context}
    )
    assert response.status_code == 200
    res = response.json()
    assert res["supported_by_report"] is False
    assert "not available in your uploaded laboratory report" in res["answer"].lower()

def test_supabase_opt_in_save_and_delete_flow():
    """Test saving a report, listing saved reports, and deleting a report."""
    save_payload = {
        "report_id": "test-rep-101",
        "report_type": "Complete Blood Count",
        "filename": "my_report.pdf",
        "summary_text": "Normal blood count with slight iron variation.",
        "biomarkers_summary": [{"test": "Hemoglobin", "value": "11.2"}],
        "user_id": "guest"
    }

    # 1. Save
    res_save = client.post("/api/reports/save", json=save_payload)
    assert res_save.status_code == 200
    save_data = res_save.json()
    assert save_data["success"] is True

    # 2. List
    res_list = client.get("/api/reports/saved?user_id=guest")
    assert res_list.status_code == 200
    saved_items = res_list.json()
    assert any(item["id"] == "test-rep-101" for item in saved_items)

    # 3. Delete
    res_del = client.delete("/api/reports/saved/test-rep-101?user_id=guest")
    assert res_del.status_code == 200
    assert res_del.json()["success"] is True
