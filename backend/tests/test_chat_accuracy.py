import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Standard synthetic Complete Blood Count (CBC) fixture
CBC_FIXTURE = {
    "summary": {
        "report_type": "Complete Blood Count (CBC)",
        "overall_summary": "Overall blood counts are within expected limits, with a mildly reduced hemoglobin level.",
        "key_findings": [
            "White blood cell count is normal (6,800 /cumm)",
            "Platelet count is optimal (240,000 /cumm)"
        ],
        "areas_of_concern": [
            "Hemoglobin is mildly low at 11.2 g/dL (reference range: 13.0 - 17.0 g/dL)"
        ]
    },
    "biomarkers": [
        {
            "test_name": "Total Leucocyte Count (WBC)",
            "common_name": "White Blood Cells",
            "extracted_value": "6,800",
            "unit": "/cumm",
            "reference_range": "4,000 - 11,000",
            "status": "normal",
            "explanation": "White blood cells defend the body against bacterial and viral infections.",
            "missing_or_unclear_notes": None
        },
        {
            "test_name": "Platelet Count",
            "common_name": "Platelets",
            "extracted_value": "240,000",
            "unit": "/cumm",
            "reference_range": "150,000 - 450,000",
            "status": "normal",
            "explanation": "Platelets are cellular fragments essential for healthy blood clotting.",
            "missing_or_unclear_notes": None
        },
        {
            "test_name": "Hemoglobin (Hb)",
            "common_name": "Hemoglobin",
            "extracted_value": "11.2",
            "unit": "g/dL",
            "reference_range": "13.0 - 17.0",
            "status": "low",
            "explanation": "Hemoglobin is the oxygen-carrying protein inside red blood cells.",
            "missing_or_unclear_notes": None
        },
        {
            "test_name": "RBC Count",
            "common_name": "Red Blood Cell Count",
            "extracted_value": "3.90",
            "unit": "mill/cumm",
            "reference_range": "4.50 - 5.50",
            "status": "low",
            "explanation": "Measures total circulating erythrocytes delivering oxygen.",
            "missing_or_unclear_notes": None
        }
    ]
}

def test_1_platelet_count_returns_platelet_not_wbc():
    """CRITICAL REGRESSION TEST: Asking for platelet count MUST return platelet value (240,000), NEVER WBC (6,800)."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "What is my platelet count?",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["supported_by_report"] is True
    # Must contain Platelet and 240,000
    assert "240,000" in data["answer"]
    assert "Platelet" in data["answer"]
    # Must NOT substitute WBC value
    assert "6,800" not in data["answer"]
    # Structured card must be present and accurate
    assert data["biomarker"] is not None
    assert data["biomarker"]["test_name"] == "Platelet Count"
    assert data["biomarker"]["extracted_value"] == "240,000"

def test_1b_platelet_alias_plt():
    """Asking using abbreviation 'PLT' must return platelet count."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "What is my PLT level?",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "240,000" in data["answer"]
    assert "6,800" not in data["answer"]

def test_2_wbc_retrieval():
    """Asking for WBC returns WBC value (6,800)."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "What is my WBC count and is it normal?",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["supported_by_report"] is True
    assert "6,800" in data["answer"]
    assert data["biomarker"]["test_name"] == "Total Leucocyte Count (WBC)"

def test_3_hemoglobin_retrieval():
    """Asking for hemoglobin returns hemoglobin value (11.2 g/dL) and low status."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "Tell me about my hemoglobin.",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["supported_by_report"] is True
    assert "11.2" in data["answer"]
    assert "g/dL" in data["answer"]
    assert data["biomarker"]["extracted_value"] == "11.2"
    assert data["biomarker"]["status"] == "low"

def test_4_missing_biomarker_response():
    """Asking for a test not in the report (e.g. TSH or Creatinine) returns a clear missing-data response."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "What is my Thyroid TSH level?",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["supported_by_report"] is False
    assert "not available in your uploaded laboratory report" in data["answer"].lower()
    assert data["biomarker"] is None

def test_5_followup_question_maintains_context():
    """Follow-up questions like 'Is it concerning?' or 'What does it do?' retain prior biomarker context."""
    history = [
        {"role": "user", "content": "What is my platelet count?"},
        {"role": "assistant", "content": "### Platelet Count\n- Extracted Result: 240,000 /cumm\n- Status: Within normal reference range"}
    ]
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "Is it concerning?",
            "report_context": CBC_FIXTURE,
            "history": history
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["supported_by_report"] is True
    assert "Platelet" in data["answer"]
    assert data["biomarker"]["test_name"] == "Platelet Count"

def test_6_abnormal_result_neutral_safety():
    """Abnormal result explanations must be neutral and NEVER speculate causes (no iron deficiency assumptions or supplements)."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "Why is my hemoglobin 11.2?",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    answer_lower = data["answer"].lower()
    # Must NOT diagnose or speculate specific medical causes
    assert "you have anemia" not in answer_lower
    assert "take iron supplements" not in answer_lower
    assert "iron pills" not in answer_lower
    assert "discuss" in answer_lower or "doctor" in answer_lower or "physician" in answer_lower

def test_7_diagnostic_refusal():
    """Direct diagnosis or prescription inquiries must be safely refused."""
    for dangerous_q in [
        "Do I have cancer or diabetes? Diagnose me.",
        "What medicine should I take for this?",
        "Prescribe an antibiotic for my lab result"
    ]:
        response = client.post(
            "/api/reports/chat",
            json={
                "question": dangerous_q,
                "report_context": CBC_FIXTURE
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["supported_by_report"] is False
        assert "cannot diagnose" in data["answer"].lower()

def test_8_unrelated_out_of_scope_query():
    """Questions unrelated to laboratory reports must be politely handled."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "What is the weather in Mumbai tomorrow?",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["supported_by_report"] is False
    assert "not available in your uploaded laboratory report" in data["answer"].lower()

def test_9_markdown_formatting_structure():
    """Output contains structured Markdown headings, bold markers, and bullet lists."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "Explain my platelet count.",
            "report_context": CBC_FIXTURE
        }
    )
    assert response.status_code == 200
    ans = response.json()["answer"]
    assert "### " in ans or "**" in ans
    assert "- **" in ans

def test_10_missing_or_malformed_context_graceful_handling():
    """Malformed or empty context returns 400 with a clean, descriptive message."""
    response = client.post(
        "/api/reports/chat",
        json={
            "question": "What is my result?",
            "report_context": None
        }
    )
    assert response.status_code == 400
    assert "No report context found" in response.json()["detail"]
