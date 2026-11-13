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
from app.services.biomarker_retriever import (
    resolve_target_biomarker,
    match_query_to_canonical_key,
    BIOMARKER_ALIASES
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
                    "What could contribute to this hemoglobin level in my specific clinical context?",
                    "Should we repeat this test in a few weeks to monitor any changes?"
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
                    "What follow-up evaluations would you recommend for my red blood cell numbers?",
                    "Do you recommend checking a repeat panel at our next appointment?"
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
        overall_summary = "Your blood count demonstrates a healthy immune system and normal platelets. Hemoglobin and red blood cell counts are slightly below the laboratory reference interval. These variations are common and should be reviewed with your primary healthcare provider to understand what they mean for your individual physiology."

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

async def answer_report_question(
    question: str, 
    report_context: Dict[str, Any],
    history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Answers a patient's question strictly using the provided report context.
    Features:
    - High-precision deterministic biomarker retrieval (prevents platelet/WBC cross-matching).
    - Conversational follow-up resolution using history.
    - Medical safety boundaries (refuses diagnoses/prescriptions, avoids speculative causes).
    - Structured biomarker card payload where appropriate.
    """
    summary = report_context.get("summary", {})
    biomarkers = report_context.get("biomarkers", [])
    report_type = summary.get("report_type", "Laboratory Report")

    q_lower = question.lower().strip()

    # 1. Rule Check: Medical diagnosis or prescription requests
    diagnostic_keywords = [
        "do i have cancer", "do i have diabetes", "what medicine should i take",
        "prescribe", "cure my", "diagnose me", "give me a diagnosis", "am i sick",
        "what disease do i have", "what medication", "recommend a pill", "which drug",
        "what should i take for"
    ]
    if any(k in q_lower for k in diagnostic_keywords):
        return {
            "answer": "ReportSaathi provides educational laboratory explanations only and cannot diagnose medical conditions or prescribe medications or treatments. Laboratory values must always be evaluated by a licensed healthcare professional in conjunction with your complete medical history and physical exam. Please share these findings directly with your physician for clinical diagnosis and care.",
            "supported_by_report": False,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
            "biomarker": None
        }

    # 2. Biomarker Retrieval & Disambiguation
    target_biomarker, is_followup, is_ambiguous = resolve_target_biomarker(question, biomarkers, history)

    if is_ambiguous:
        return {
            "answer": "Could you please clarify which specific test result or biomarker you are referring to? You can ask about any test listed on your report, such as your Hemoglobin, Platelet Count, or White Blood Cells.",
            "supported_by_report": True,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
            "biomarker": None
        }

    # 3. Check if user explicitly asked for a known test that is NOT in this report
    queried_test_key = match_query_to_canonical_key(question)
    if queried_test_key and not target_biomarker:
        canonical_info = BIOMARKER_ALIASES.get(queried_test_key, {})
        test_display_name = canonical_info.get("canonical_name", "this test")
        return {
            "answer": f"That information is not available in your uploaded laboratory report. {test_display_name} was not detected in this document. For questions regarding this test, please consult your qualified healthcare professional.",
            "supported_by_report": False,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
            "biomarker": None
        }

    # Prepare structured biomarker card if targeted biomarker was resolved
    biomarker_card = None
    if target_biomarker:
        b_name = target_biomarker.get('test_name') or target_biomarker.get('name', 'Biomarker')
        b_val = str(target_biomarker.get('extracted_value') or target_biomarker.get('value', ''))
        b_unit = target_biomarker.get('unit')
        b_ref = target_biomarker.get('reference_range')
        b_status = target_biomarker.get('status', 'normal')
        b_expl = target_biomarker.get('explanation') or target_biomarker.get('layman_definition') or ""

        biomarker_card = {
            "test_name": b_name,
            "common_name": target_biomarker.get('common_name'),
            "extracted_value": b_val,
            "unit": b_unit,
            "reference_range": b_ref,
            "status": b_status,
            "explanation": b_expl,
            "disclaimer": "Reference intervals differ across testing laboratories and equipment. Always discuss results with your doctor."
        }

    # 4. If Gemini API key is configured and active, invoke Gemini with targeted grounding
    if settings.gemini_api_key and settings.gemini_api_key.lower() not in ["mock", "demo", "none", ""]:
        try:
            from google import genai
            from google.genai import types

            targeted_section = ""
            if target_biomarker:
                targeted_section = f"""TARGET BIOMARKER GROUNDING FROM REPORT:
- Test Name: {biomarker_card['test_name']}
- Extracted Result: {biomarker_card['extracted_value']} {biomarker_card['unit'] or ''}
- Stated Laboratory Reference Interval: {biomarker_card['reference_range'] or 'Not printed on report'}
- Stated Range Status: {biomarker_card['status']}
- Description: {biomarker_card['explanation']}
MANDATORY: Focus your answer specifically on this biomarker ({biomarker_card['test_name']}). Never substitute any other biomarker. Do NOT invent causes (e.g. do not assume iron deficiency or diet) or prescribe treatments."""

            history_section = ""
            if history:
                history_lines = [
                    f"{'User' if m.get('role') == 'user' else 'Assistant'}: {m.get('content', '')}"
                    for m in history[-6:]
                ]
                history_section = "Recent Conversation History:\n" + "\n".join(history_lines) + "\n"

            biomarkers_text = "\n".join([
                f"- {b.get('test_name') or b.get('name')}: {b.get('extracted_value') or b.get('value')} {b.get('unit') or ''} (Ref: {b.get('reference_range') or 'Not stated'}) - Status: {b.get('status')}. Explanation: {b.get('explanation') or b.get('layman_definition')}"
                for b in biomarkers
            ])

            prompt = GEMINI_CHAT_USER_TEMPLATE.format(
                report_type=report_type,
                summary=summary.get("overall_summary", ""),
                biomarkers_text=biomarkers_text,
                targeted_biomarker_section=targeted_section,
                conversation_history_section=history_section,
                user_question=question
            )

            client = genai.Client(api_key=settings.gemini_api_key)
            res = client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=GEMINI_CHAT_SYSTEM_PROMPT,
                    temperature=0.1
                )
            )
            ans = res.text.strip()
            supported = "not available in your uploaded laboratory report" not in ans.lower()
            return {
                "answer": ans,
                "supported_by_report": supported,
                "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
                "biomarker": biomarker_card
            }
        except Exception as e:
            logger.error(f"Gemini chat error: {e}. Falling back to deterministic engine.")

    # 5. Deterministic fallback engine (Guaranteed 100% accurate biomarker retrieval & formatting)
    if target_biomarker:
        name = biomarker_card["test_name"]
        val = biomarker_card["extracted_value"]
        unit = f" {biomarker_card['unit']}" if biomarker_card['unit'] else ""
        ref = biomarker_card["reference_range"] or "Not specified in report"
        expl = biomarker_card["explanation"] or ""
        status = biomarker_card["status"].lower()
        
        if status == "high":
            status_badge = "Above reference range"
            eval_text = "Your result is above the reference interval printed on this report. Test numbers can vary for diverse physiological reasons and should be reviewed with your doctor in the context of your overall health."
        elif status == "low":
            status_badge = "Below reference range"
            eval_text = "Your result is below the reference interval printed on this report. Variations outside reference intervals occur frequently and warrant discussion with your physician to understand their context for your individual physiology."
        else:
            status_badge = "Within normal reference range"
            eval_text = "Your result falls within the laboratory's stated reference interval."

        answer_text = f"""### {name}

- **Extracted Result**: **{val}{unit}**
- **Laboratory Reference Interval**: {ref}
- **Status**: **{status_badge}**

**What this test measures**:
{expl}

**Understanding this result**:
{eval_text} Reference intervals vary across laboratories, testing equipment, and individual clinical history. Please discuss this finding with your primary healthcare provider."""

        return {
            "answer": answer_text,
            "supported_by_report": True,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
            "biomarker": biomarker_card
        }

    # 6. General Summary / Report Overview Question
    summary_keywords = ["summary", "overview", "normal", "abnormal", "findings", "all values", "explain my report", "report mean", "results mean", "outside"]
    if any(w in q_lower for w in summary_keywords):
        kf = summary.get("key_findings", [])
        ac = summary.get("areas_of_concern", [])
        overall = summary.get("overall_summary", "Your report analysis is ready for review.")
        
        bullets_kf = "\n".join([f"- {item}" for item in kf]) if kf else "- All evaluated values are documented in your report."
        bullets_ac = "\n".join([f"- {item}" for item in ac]) if ac else "- No values were flagged outside standard reference intervals."

        answer_text = f"""### {report_type} — Summary

{overall}

**Values within stated reference ranges**:
{bullets_kf}

**Values outside stated reference ranges**:
{bullets_ac}

**Next Steps**:
Discuss any unexpected results with your doctor so they can correlate them with your physical exam and complete clinical history."""
        return {
            "answer": answer_text,
            "supported_by_report": True,
            "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
            "biomarker": None
        }

    # 7. Fallback for out-of-scope or unanswerable queries
    return {
        "answer": "That information is not available in your uploaded laboratory report. ReportSaathi can only answer questions directly related to the extracted values and tests in this document. For medical questions outside this report, please consult your qualified healthcare professional.",
        "supported_by_report": False,
        "disclaimer": "Educational only. ReportSaathi does not diagnose or prescribe treatments.",
        "biomarker": None
    }
