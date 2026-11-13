from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BiomarkerStatus(str, Enum):
    NORMAL = "normal"
    HIGH = "high"
    LOW = "low"
    UNCLEAR = "unclear"
    NOT_SPECIFIED = "not_specified"

class Biomarker(BaseModel):
    test_name: str = Field(..., description="Name of the test as printed on the report")
    common_name: Optional[str] = Field(None, description="Simple, common name in plain language")
    extracted_value: str = Field(..., description="Exact numerical or qualitative value extracted from source")
    unit: Optional[str] = Field(None, description="Unit only if explicitly present in the report. Never invented.")
    reference_range: Optional[str] = Field(None, description="Reference range only if explicitly present in the report. Never invented.")
    status: BiomarkerStatus = Field(BiomarkerStatus.NORMAL, description="Whether value falls inside or outside the stated reference range")
    explanation: str = Field(..., description="Plain-language, patient-friendly explanation of what this test measures")
    missing_or_unclear_notes: Optional[str] = Field(None, description="Note if reference interval, unit, or value was partially obscured or absent")
    questions_to_ask: List[str] = Field(default_factory=list, description="Suggested questions for a physician")

class ReportSummary(BaseModel):
    report_type: str = Field(..., description="Identified report category, e.g. Complete Blood Count, Lipid Profile")
    patient_context: Optional[str] = Field(None, description="De-identified patient context if present (e.g. Adult Male, fasting)")
    overall_summary: str = Field(..., description="High-level, empathetic, educational overview")
    key_findings: List[str] = Field(default_factory=list, description="Values that appear within expected ranges")
    areas_of_concern: List[str] = Field(default_factory=list, description="Values outside stated reference ranges to discuss with doctor")
    next_steps_questions: List[str] = Field(default_factory=list, description="Curated questions to bring to a clinician")
    disclaimer: str = Field(
        default="FOR EDUCATIONAL USE ONLY: ReportSaathi is not a diagnostic tool and does not provide medical diagnoses or treatment recommendations. Always consult a licensed healthcare professional to interpret your lab results.",
        description="Mandatory medical disclaimer"
    )

class ReportAnalysisResponse(BaseModel):
    id: str
    filename: str
    status: str = "success"
    extracted_text: str = Field(..., description="Raw text extracted from the document")
    extracted_text_preview: str
    summary: ReportSummary
    biomarkers: List[Biomarker]
    created_at: str
    is_mock: bool = False
    source_extracted_facts_count: int = 0

class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    tesseract_available: bool
    gemini_configured: bool
    supabase_configured: bool
    telegram_bot_configured: bool

# Chat schemas
class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(...)

class BiomarkerCardData(BaseModel):
    test_name: str
    common_name: Optional[str] = None
    extracted_value: str
    unit: Optional[str] = None
    reference_range: Optional[str] = None
    status: str
    explanation: Optional[str] = None
    disclaimer: Optional[str] = None

class ChatRequest(BaseModel):
    report_id: Optional[str] = None
    question: str = Field(..., min_length=1, max_length=1000)
    report_context: Optional[Dict[str, Any]] = None
    history: Optional[List[ChatMessage]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    answer: str
    supported_by_report: bool
    disclaimer: str = "Educational only. ReportSaathi does not diagnose or prescribe treatments."
    biomarker: Optional[BiomarkerCardData] = None

# Supabase save schemas
class SaveReportRequest(BaseModel):
    report_id: str
    report_type: str
    filename: str
    summary_text: str
    biomarkers_summary: List[Dict[str, Any]] = []
    user_id: Optional[str] = "guest"

class SavedReportRecord(BaseModel):
    id: str
    user_id: str
    filename: str
    report_type: str
    summary_text: str
    biomarkers_count: int
    created_at: str
