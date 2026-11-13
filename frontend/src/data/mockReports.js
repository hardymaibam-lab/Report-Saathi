export const MOCK_REPORTS = [
  {
    id: "rep-cbc-001",
    filename: "CBC_Routine_Lab_Report.pdf",
    fileSize: "1.4 MB",
    uploadedAt: "Today, 10:24 AM",
    summary: {
      report_type: "Complete Blood Count (CBC) with Differential",
      patient_context: "Patient: Ramesh Sharma (Age: 42, Male) • Routine Health Check",
      overall_summary: "Your complete blood count is generally reassuring with a strong immune profile and normal platelet reserves. Your hemoglobin and red blood cell counts are slightly below standard laboratory ranges, which commonly correlates with mild iron deficiency or everyday dietary fatigue.",
      key_findings: [
        "White blood cell count (6,800 /cumm) is healthy, indicating no acute infection.",
        "Platelet count (240,000 /cumm) is optimal, ensuring normal clotting capacity.",
        "Immune cell differentials are well within expected baseline parameters."
      ],
      areas_of_concern: [
        "Hemoglobin is mildly low at 11.2 g/dL (normal range: 13.0 - 17.0 g/dL).",
        "Packed Cell Volume (Hematocrit) is 34.0%, indicating fewer packed red blood cells.",
        "Mean Corpuscular Volume (MCV) is 76.5 fL, suggesting red cells are smaller than average."
      ],
      next_steps_questions: [
        "Could my mildly reduced hemoglobin explain recent feelings of afternoon fatigue?",
        "Would you recommend checking my serum ferritin (iron storage) or vitamin B12 levels?",
        "Are dietary changes (such as more iron-rich foods) appropriate before considering supplements?",
        "When would you like me to re-test to see if the levels have normalized?"
      ],
      disclaimer: "Educational tool only. ReportSaathi does not provide medical diagnoses or treatment advice. Always consult a licensed healthcare professional to interpret your laboratory tests."
    },
    biomarkers: [
      {
        name: "Hemoglobin (Hb)",
        standard_name: "Hemoglobin (Oxygen Carrier)",
        value: "11.2",
        unit: "g/dL",
        reference_range: "13.0 - 17.0",
        status: "low",
        layman_definition: "The iron-containing protein inside red blood cells responsible for carrying fresh oxygen from your lungs to tissues across your whole body.",
        meaning_of_result: "Slightly below standard reference range. Mildly low hemoglobin is often linked to mild iron deficiency, dietary intake, or fatigue.",
        questions_to_ask: [
          "Should we check my ferritin or iron stores?",
          "Are iron supplements or dietary changes recommended?"
        ]
      },
      {
        name: "Total Leucocyte Count (WBC)",
        standard_name: "White Blood Cells (Immune Defenders)",
        value: "6,800",
        unit: "/cumm",
        reference_range: "4,000 - 11,000",
        status: "normal",
        layman_definition: "The defense cells of your immune system that identify, fight off bacterial or viral infections, and assist in tissue recovery.",
        meaning_of_result: "Optimal and balanced. There is no indication of active systemic infection or excessive immune stress.",
        questions_to_ask: [
          "Is my immune system showing any signs of chronic inflammation?"
        ]
      },
      {
        name: "RBC Count",
        standard_name: "Red Blood Cell Count",
        value: "3.90",
        unit: "mill/cumm",
        reference_range: "4.50 - 5.50",
        status: "low",
        layman_definition: "The actual count of circulating red blood cells carrying oxygen through your cardiovascular system.",
        meaning_of_result: "Borderline low, directly correlating with the slightly decreased hemoglobin figure.",
        questions_to_ask: [
          "Could hydration levels or recent illness affect this number?"
        ]
      },
      {
        name: "Platelet Count",
        standard_name: "Platelets (Clotting Cells)",
        value: "240,000",
        unit: "/cumm",
        reference_range: "150,000 - 450,000",
        status: "normal",
        layman_definition: "Microscopic cell fragments that stick together to form plugs when blood vessels are injured, stopping bleeding.",
        meaning_of_result: "Well within normal limits, confirming healthy clotting reserves.",
        questions_to_ask: [
          "Do any medications or pain relievers impact platelet function?"
        ]
      },
      {
        name: "Packed Cell Volume (PCV / HCT)",
        standard_name: "Hematocrit (Red Cell Percentage)",
        value: "34.0",
        unit: "%",
        reference_range: "40.0 - 50.0",
        status: "low",
        layman_definition: "The percentage of your total blood volume made up of red blood cells.",
        meaning_of_result: "Lower than average, aligning with mild anemia.",
        questions_to_ask: [
          "Does this require medical treatment or simple dietary review?"
        ]
      },
      {
        name: "Mean Corpuscular Volume (MCV)",
        standard_name: "Average Red Blood Cell Size",
        value: "76.5",
        unit: "fL",
        reference_range: "83.0 - 101.0",
        status: "low",
        layman_definition: "Measures the physical volume/size of individual red blood cells.",
        meaning_of_result: "Cells are smaller than normal ('microcytic'), a hallmark finding in early iron deficiency.",
        questions_to_ask: [
          "Is microcytosis commonly caused by low dietary iron?"
        ]
      }
    ],
    extracted_text_preview: `METROPOLIS DIAGNOSTIC SERVICES - PATIENT LAB REPORT
Patient: Ramesh Sharma | Age: 42 | Gender: Male
Date: 12-Nov-2026 | Ref By: Dr. A. Gupta, MD
Specimen: Whole Blood (EDTA)

TEST NAME                           OBSERVED VALUE   REFERENCE RANGE   UNITS
Hemoglobin (Hb)                     11.2             13.0 - 17.0       g/dL      [LOW]
Total Leucocyte Count (WBC)         6,800            4,000 - 11,000    /cumm     [NORMAL]
RBC Count                           3.90             4.50 - 5.50       mill/cumm [LOW]
Platelet Count                      240,000          150,000 - 450,000 /cumm     [NORMAL]
Packed Cell Volume (PCV / Hematocrit) 34.0           40.0 - 50.0       %         [LOW]
Mean Corpuscular Volume (MCV)       76.5             83.0 - 101.0      fL        [LOW]
Mean Corpuscular Hb (MCH)           25.2             27.0 - 32.0       pg        [LOW]`
  },
  {
    id: "rep-lipid-002",
    filename: "Lipid_Profile_Screening.jpg",
    fileSize: "2.1 MB",
    uploadedAt: "Yesterday, 3:15 PM",
    summary: {
      report_type: "Comprehensive Lipid Profile (Cholesterol Panel)",
      patient_context: "Patient: Sunita Patel (Age: 51, Female) • Annual Wellness Panel",
      overall_summary: "Your lipid panel shows reassuring protective HDL ('good') cholesterol, but total cholesterol and LDL ('bad') cholesterol are higher than ideal targets. These values are very common and often respond positively to lifestyle nutrition adjustments and regular cardiovascular exercise.",
      key_findings: [
        "HDL cholesterol is 48 mg/dL, safely above the 40 mg/dL protective threshold.",
        "Blood glucose markers included in panel were in optimal ranges."
      ],
      areas_of_concern: [
        "Total Cholesterol is 228 mg/dL (recommended target is below 200 mg/dL).",
        "LDL ('Bad') Cholesterol is 147 mg/dL (optimal target is below 100 mg/dL).",
        "Triglycerides are mildly elevated at 165 mg/dL (desirable is under 150 mg/dL)."
      ],
      next_steps_questions: [
        "What is my overall 10-year cardiovascular risk assessment score?",
        "Are dietary changes such as increasing soluble fiber and reducing saturated fats appropriate to try first?",
        "Should we repeat this test in 3 to 6 months to track progress?"
      ],
      disclaimer: "Educational tool only. ReportSaathi does not provide medical diagnoses or treatment advice. Always consult a licensed healthcare professional to interpret your laboratory tests."
    },
    biomarkers: [
      {
        name: "Serum Total Cholesterol",
        standard_name: "Total Cholesterol",
        value: "228",
        unit: "mg/dL",
        reference_range: "< 200",
        status: "high",
        layman_definition: "Measures all types of cholesterol circulating in your bloodstream, both the protective kind and the kind that can form arterial plaques.",
        meaning_of_result: "Mildly higher than the optimal cutoff of 200 mg/dL.",
        questions_to_ask: [
          "Does family history play a strong role in this number?"
        ]
      },
      {
        name: "HDL Cholesterol",
        standard_name: "'Good' High-Density Lipoprotein",
        value: "48",
        unit: "mg/dL",
        reference_range: "> 40",
        status: "normal",
        layman_definition: "The beneficial cholesterol that sweeps surplus fats from your artery walls back to the liver for safe processing.",
        meaning_of_result: "In a protective, healthy zone.",
        questions_to_ask: [
          "What aerobic activities are best for maintaining or increasing HDL?"
        ]
      },
      {
        name: "LDL Cholesterol",
        standard_name: "'Bad' Low-Density Lipoprotein",
        value: "147",
        unit: "mg/dL",
        reference_range: "< 100",
        status: "high",
        layman_definition: "The particle that carries cholesterol through your bloodstream; elevated levels can slowly accumulate on artery walls over years.",
        meaning_of_result: "Higher than recommended target of 100 mg/dL.",
        questions_to_ask: [
          "Would lifestyle modifications alone be sufficient at this stage?"
        ]
      },
      {
        name: "Serum Triglycerides",
        standard_name: "Blood Fats (Triglycerides)",
        value: "165",
        unit: "mg/dL",
        reference_range: "< 150",
        status: "high",
        layman_definition: "Fat molecules derived from calories your body didn't immediately need for energy, often influenced by refined carbohydrates and activity levels.",
        meaning_of_result: "Borderline elevated.",
        questions_to_ask: [
          "Does fasting duration impact this result?"
        ]
      }
    ],
    extracted_text_preview: `APOLLO CLINICAL LABORATORIES - LIPID PROFILE REPORT
Patient: Sunita Patel | Age: 51 | Gender: Female
Date: 10-Nov-2026 | Specimen: Serum (Fasting 12 hours)

TEST NAME                           OBSERVED VALUE   REFERENCE RANGE   UNITS
Serum Total Cholesterol             228              < 200             mg/dL     [HIGH]
Serum Triglycerides                 165              < 150             mg/dL     [HIGH]
HDL Cholesterol ('Good')            48               > 40              mg/dL     [NORMAL]
LDL Cholesterol ('Bad')             147              < 100             mg/dL     [HIGH]`
  }
];
