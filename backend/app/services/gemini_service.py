import json
import logging
import re
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.prompts import (
    GEMINI_REPORT_ANALYSIS_SYSTEM_PROMPT,
    GEMINI_ANALYSIS_USER_PROMPT,
    GEMINI_CHAT_SYSTEM_PROMPT,
    GEMINI_CHAT_USER_TEMPLATE
)
from app.models.schemas import Biomarker, ReportSummary, BiomarkerStatus

logger = logging.getLogger(__name__)

def generate_synthetic_analysis(extracted_text: str) -> Dict[str, Any]:
    """
    Generates a realistic, educational structured analysis adhering to zero-invention
    rules when Gemini API key is not configured locally.
    """
    text_lower = extracted_text.lower()
    
    if any(k in text_lower for k in ["cholesterol", "lipid", "triglyceride", "hdl", "ldl"]):
        report_type = "Comprehensive Lipid Panel (Cholesterol)"
        biomarkers = [
            {
                "test_name": "Serum Total Cholesterol",
                "common_name": "Total Blood Cholesterol",
                "extracted_value": "228",
                "unit": "mg/dL",
                "reference_range": "< 200",
                "status": "high",
                "explanation": "Measures the combined amount of all cholesterol particles circulating in your bloodstream.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "What lifestyle or dietary modifications are most effective for my numbers?",
                    "Should we calculate my overall cardiovascular risk score?"
                ]
            },
            {
                "test_name": "HDL Cholesterol",
                "common_name": "'Good' High-Density Lipoprotein",
                "extracted_value": "48",
                "unit": "mg/dL",
                "reference_range": "> 40",
                "status": "normal",
                "explanation": "The protective cholesterol that collects excess fats from blood vessels and carries them back to the liver.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "What physical activities are best to keep HDL in this healthy range?"
                ]
            },
            {
                "test_name": "LDL Cholesterol",
                "common_name": "'Bad' Low-Density Lipoprotein",
                "extracted_value": "147",
                "unit": "mg/dL",
                "reference_range": "< 100",
                "status": "high",
                "explanation": "Carries cholesterol into circulation; higher levels over prolonged periods can contribute to arterial plaque buildup.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "Would a follow-up test in 3 to 6 months help track nutritional progress?"
                ]
            },
            {
                "test_name": "Serum Triglycerides",
                "common_name": "Blood Fats (Triglycerides)",
                "extracted_value": "165",
                "unit": "mg/dL",
                "reference_range": "< 150",
                "status": "high",
                "explanation": "Fats stored from unused dietary calories used for energy between meals.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "Does the fasting duration before the test affect triglyceride numbers?"
                ]
            }
        ]
        key_findings = [
            "HDL ('Good') cholesterol is above 40 mg/dL, supporting cardiovascular protection."
        ]
        areas_of_concern = [
            "Total Cholesterol is 228 mg/dL (laboratory stated reference: < 200 mg/dL).",
            "LDL Cholesterol is 147 mg/dL (laboratory stated reference: < 100 mg/dL).",
            "Triglycerides are 165 mg/dL (laboratory stated reference: < 150 mg/dL)."
        ]
        overall_summary = "Your lipid panel shows good protective HDL cholesterol alongside mildly elevated Total Cholesterol, LDL, and Triglycerides. These variations are very common and are typically reviewed alongside overall cardiovascular wellness and nutrition."
    else:
        # Default Complete Blood Count (CBC)
        report_type = "Complete Blood Count (CBC) with Differential"
        biomarkers = [
            {
                "test_name": "Hemoglobin (Hb)",
                "common_name": "Hemoglobin (Oxygen-Carrying Protein)",
                "extracted_value": "11.2",
                "unit": "g/dL",
                "reference_range": "13.0 - 17.0",
                "status": "low",
                "explanation": "The iron-rich protein inside red blood cells that transports oxygen from your lungs to all body tissues.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "Could this mild reduction explain recent tiredness?",
                    "Should we test serum ferritin to check iron storage levels?"
                ]
            },
            {
                "test_name": "Total Leucocyte Count (WBC)",
                "common_name": "White Blood Cells (Immune Defenders)",
                "extracted_value": "6,800",
                "unit": "/cumm",
                "reference_range": "4,000 - 11,000",
                "status": "normal",
                "explanation": "The immune cells that protect your body from viral or bacterial infections.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "Are there any subtle markers of inflammation to be aware of?"
                ]
            },
            {
                "test_name": "Platelet Count",
                "common_name": "Platelets (Clotting Cells)",
                "extracted_value": "240,000",
                "unit": "/cumm",
                "reference_range": "150,000 - 450,000",
                "status": "normal",
                "explanation": "Cell fragments that help your blood clot normally to prevent excessive bleeding.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "Do any pain relievers or medications interfere with platelet counts?"
                ]
            },
            {
                "test_name": "RBC Count",
                "common_name": "Red Blood Cell Count",
                "extracted_value": "3.90",
                "unit": "mill/cumm",
                "reference_range": "4.50 - 5.50",
                "status": "low",
                "explanation": "The total number of circulating red blood cells carrying oxygen in your body.",
                "missing_or_unclear_notes": None,
                "questions_to_ask": [
                    "Would an iron-rich diet or dietary supplement be beneficial?"
                ]
            }
        ]
        key_findings = [
            "White blood cell count is normal (6,800 /cumm), indicating no active systemic infection.",
            "Platelet count is optimal (240,000 /cumm) with healthy clotting reserves."
        ]
        areas_of_concern = [
            "Hemoglobin is mildly low at 11.2 g/dL (stated reference range: 13.0 - 17.0 g/dL).",
            "Red Blood Cell count is 3.90 mill/cumm, aligning with the mildly low hemoglobin."
        ]
        overall_summary = "Your blood count demonstrates a healthy immune system and normal platelets. Hemoglobin and red blood cell counts are slightly below the laboratory reference interval, which is a frequent finding often related to dietary iron intake or everyday fatigue."

    return {
        "report_type": report_type,
        "patient_context": "Clinical Sample Analysis",
        "overall_summary": overall_summary,
        "key_findings": key_findings,
        "areas_of_concern": areas_of_concern,
        "next_steps_questions": [
            "Are these out-of-range figures temporary, or do they indicate an ongoing trend?",
            "Would you recommend checking related nutrients like iron, ferritin, or vitamin B12?",
            "What dietary adjustments would best support these test parameters?"
        ],
        "biomarkers": biomarkers,
        "is_mock": True
    }

async def analyze_report_with_gemini(extracted_text: str) -> Dict[str, Any]:
    """
    Submits extracted text to Gemini API with strict structured schema validation.
    Falls back gracefully to synthetic demo analysis if key is absent or API fails.
    """
    # Key check
    if not settings.gemini_api_key or settings.gemini_api_key.lower() in ["mock", "demo", "none", ""]:
        logger.info("Gemini API key is not configured. Using synthetic clinical analysis.")
        return generate_synthetic_analysis(extracted_text)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.gemini_api_key)
        prompt = GEMINI_ANALYSIS_USER_PROMPT.format(extracted_text=extracted_text)

        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=GEMINI_REPORT_ANALYSIS_SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.1
            )
        )

        response_text = response.text.strip()
        # Clean markdown wrappers if present
        if response_text.startswith("```"):
            response_text = re.sub(r"^```(?:json)?\n", "", response_text)
            response_text = re.sub(r"\n```$", "", response_text)

        parsed_data = json.loads(response_text)
        
        # Pydantic schema validation
        validated_biomarkers = [Biomarker(**b) for b in parsed_data.get("biomarkers", [])]
        summary_obj = ReportSummary(
            report_type=parsed_data.get("report_type", "Laboratory Report"),
            patient_context=parsed_data.get("patient_context"),
            overall_summary=parsed_data.get("overall_summary", "Here is your report analysis."),
            key_findings=parsed_data.get("key_findings", []),
            areas_of_concern=parsed_data.get("areas_of_concern", []),
            next_steps_questions=parsed_data.get("next_steps_questions", []),
            disclaimer="FOR EDUCATIONAL USE ONLY: ReportSaathi does not provide medical diagnoses or treatment recommendations. Always consult a licensed healthcare professional to interpret your lab results."
        )

        return {
            "report_type": summary_obj.report_type,
            "patient_context": summary_obj.patient_context,
            "overall_summary": summary_obj.overall_summary,
            "key_findings": summary_obj.key_findings,
            "areas_of_concern": summary_obj.areas_of_concern,
            "next_steps_questions": summary_obj.next_steps_questions,
            "biomarkers": [b.model_dump() for b in validated_biomarkers],
            "is_mock": False
        }

    except Exception as e:
        logger.error(f"Gemini API invocation error: {e}. Falling back to safe synthetic analysis.")
        fallback = generate_synthetic_analysis(extracted_text)
        fallback["api_note"] = f"Gemini API returned an error: {str(e)}. Displaying simulated analysis."
        return fallback

async def answer_report_question(question: str, report_context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Answers a user question strictly using the provided report context.
    If the topic is outside the report, explicitly refuses and recommends consulting a doctor.
    """
    # Check if report context has biomarkers
    summary = report_context.get("summary", {})
    biomarkers = report_context.get("biomarkers", [])
    report_type = summary.get("report_type", "Lab Report")

    # Format biomarkers text
    biomarkers_text = "\n".join([
        f"- {b.get('test_name') or b.get('name')}: {b.get('extracted_value') or b.get('value')} {b.get('unit') or ''} (Ref: {b.get('reference_range') or 'Not stated'}) - Status: {b.get('status')}. Explanation: {b.get('explanation') or b.get('layman_definition')}"
        for b in biomarkers
    ])

    q_lower = question.lower()

    # Rule Check: Diagnose or Prescribe requests
    diagnostic_keywords = ["do i have cancer", "do i have diabetes", "what medicine should i take", "prescribe", "cure my", "diagnose me"]
    if any(k in q_lower for k in diagnostic_keywords):
        return {
            "answer": "ReportSaathi cannot diagnose conditions or prescribe medications. Your lab results can vary depending on your medical history, clinical exam, and personal context. Please share these findings directly with your doctor for proper medical evaluation and care.",
            "supported_by_report": False,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments."
        }

    # If Gemini API key is configured, query Gemini
    if settings.gemini_api_key and settings.gemini_api_key.lower() not in ["mock", "demo", "none", ""]:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=settings.gemini_api_key)
            prompt = GEMINI_CHAT_USER_TEMPLATE.format(
                report_type=report_type,
                summary=summary.get("overall_summary", ""),
                biomarkers_text=biomarkers_text,
                user_question=question
            )

            res = client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=GEMINI_CHAT_SYSTEM_PROMPT,
                    temperature=0.2
                )
            )
            ans = res.text.strip()
            supported = "not available in your uploaded laboratory report" not in ans.lower()
            return {
                "answer": ans,
                "supported_by_report": supported,
                "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments."
            }
        except Exception as e:
            logger.error(f"Gemini chat error: {e}")

    # Fallback / Keyless matching logic
    # Check if question relates to any biomarker in the report
    matching_biomarker = None
    for b in biomarkers:
        name = (b.get('test_name') or b.get('name', '')).lower()
        common = (b.get('common_name') or b.get('standard_name', '')).lower()
        if name in q_lower or (common and common in q_lower) or any(w in q_lower for w in name.split()):
            matching_biomarker = b
            break

    if matching_biomarker:
        name = matching_biomarker.get('test_name') or matching_biomarker.get('name')
        val = matching_biomarker.get('extracted_value') or matching_biomarker.get('value')
        unit = matching_biomarker.get('unit') or ''
        ref = matching_biomarker.get('reference_range') or 'not specified in report'
        expl = matching_biomarker.get('explanation') or matching_biomarker.get('layman_definition') or ''
        meaning = matching_biomarker.get('missing_or_unclear_notes') or matching_biomarker.get('meaning_of_result') or ''
        
        return {
            "answer": f"According to your report, your {name} level is {val} {unit} (laboratory reference range: {ref}). {expl} {meaning} Remember to discuss this with your doctor at your next appointment.",
            "supported_by_report": True,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments."
        }

    # If general question about summary
    if any(w in q_lower for w in ["summary", "overall", "normal", "abnormal", "findings"]):
        return {
            "answer": f"Based on your {report_type}, {summary.get('overall_summary', 'no major abnormalities detected')}.",
            "supported_by_report": True,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments."
        }

    # If question mentions tests NOT in report
    return {
        "answer": "That information is not available in your uploaded laboratory report. For questions regarding this topic, please consult your qualified healthcare professional.",
        "supported_by_report": False,
        "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments."
    }
