import re
from typing import Dict, Any, List, Optional, Tuple

# Comprehensive clinical alias map
# Maps canonical biomarker keys to recognized aliases and patterns
BIOMARKER_ALIASES: Dict[str, Dict[str, Any]] = {
    "platelets": {
        "canonical_name": "Platelet Count",
        "aliases": [
            "platelet", "platelets", "plt", "platelet count", 
            "thrombocyte", "thrombocytes", "thrombocyte count"
        ],
        "exclusions": ["mean platelet volume", "mpv"]
    },
    "mpv": {
        "canonical_name": "Mean Platelet Volume (MPV)",
        "aliases": ["mpv", "mean platelet volume"],
        "exclusions": []
    },
    "wbc": {
        "canonical_name": "Total Leucocyte Count (WBC)",
        "aliases": [
            "wbc", "wbcs", "white blood cell", "white blood cells", 
            "white blood cell count", "white blood count", 
            "total leucocyte count", "total leukocyte count", "tlc", 
            "leukocyte", "leucocyte", "leukocytes", "leucocytes"
        ],
        "exclusions": ["platelet", "platelets", "rbc", "red blood cell"]
    },
    "hemoglobin": {
        "canonical_name": "Hemoglobin (Hb)",
        "aliases": [
            "hemoglobin", "haemoglobin", "hb", "hgb", "total hemoglobin"
        ],
        "exclusions": ["mch", "mchc", "hba1c"]
    },
    "rbc": {
        "canonical_name": "Red Blood Cell Count (RBC)",
        "aliases": [
            "rbc", "rbcs", "red blood cell", "red blood cells", 
            "red blood cell count", "red blood count", 
            "erythrocyte", "erythrocytes", "total red cells"
        ],
        "exclusions": ["wbc", "platelet", "rbc distribution", "rdw"]
    },
    "hematocrit": {
        "canonical_name": "Hematocrit (PCV / HCT)",
        "aliases": [
            "hematocrit", "haematocrit", "hct", "pcv", 
            "packed cell volume", "crit"
        ],
        "exclusions": []
    },
    "mcv": {
        "canonical_name": "Mean Corpuscular Volume (MCV)",
        "aliases": ["mcv", "mean corpuscular volume", "mean cell volume"],
        "exclusions": ["mch", "mchc"]
    },
    "mch": {
        "canonical_name": "Mean Corpuscular Hemoglobin (MCH)",
        "aliases": ["mch", "mean corpuscular hemoglobin", "mean cell hemoglobin"],
        "exclusions": ["mchc", "mcv"]
    },
    "mchc": {
        "canonical_name": "Mean Corpuscular Hemoglobin Concentration (MCHC)",
        "aliases": ["mchc", "mean corpuscular hemoglobin concentration"],
        "exclusions": ["mch", "mcv"]
    },
    "rdw": {
        "canonical_name": "Red Cell Distribution Width (RDW)",
        "aliases": ["rdw", "rdw-cv", "rdw-sd", "red cell distribution width"],
        "exclusions": []
    },
    "neutrophils": {
        "canonical_name": "Neutrophils",
        "aliases": ["neutrophil", "neutrophils", "segs", "polys", "neutrophil count"],
        "exclusions": []
    },
    "lymphocytes": {
        "canonical_name": "Lymphocytes",
        "aliases": ["lymphocyte", "lymphocytes", "lymphs", "lymphocyte count"],
        "exclusions": []
    },
    "monocytes": {
        "canonical_name": "Monocytes",
        "aliases": ["monocyte", "monocytes", "monocyte count"],
        "exclusions": []
    },
    "eosinophils": {
        "canonical_name": "Eosinophils",
        "aliases": ["eosinophil", "eosinophils", "eos", "eosinophil count"],
        "exclusions": []
    },
    "basophils": {
        "canonical_name": "Basophils",
        "aliases": ["basophil", "basophils", "basophil count"],
        "exclusions": []
    },
    "total_cholesterol": {
        "canonical_name": "Total Cholesterol",
        "aliases": [
            "total cholesterol", "serum cholesterol", "cholesterol total",
            "overall cholesterol", "cholesterol"
        ],
        "exclusions": ["hdl", "ldl", "vldl", "triglycerides"]
    },
    "hdl": {
        "canonical_name": "HDL Cholesterol",
        "aliases": [
            "hdl", "hdl-c", "hdl cholesterol", "high density lipoprotein", 
            "good cholesterol"
        ],
        "exclusions": ["ldl", "vldl", "non-hdl"]
    },
    "ldl": {
        "canonical_name": "LDL Cholesterol",
        "aliases": [
            "ldl", "ldl-c", "ldl cholesterol", "low density lipoprotein", 
            "bad cholesterol"
        ],
        "exclusions": ["hdl", "vldl"]
    },
    "triglycerides": {
        "canonical_name": "Serum Triglycerides",
        "aliases": ["triglyceride", "triglycerides", "tg", "tgl", "serum triglycerides"],
        "exclusions": []
    },
    "fasting_glucose": {
        "canonical_name": "Fasting Blood Sugar (Glucose)",
        "aliases": [
            "fasting blood sugar", "fbs", "fasting glucose", 
            "fasting blood glucose", "glucose fasting"
        ],
        "exclusions": ["post prandial", "ppbs", "hba1c"]
    },
    "pp_glucose": {
        "canonical_name": "Post-Prandial Glucose (PPBS)",
        "aliases": [
            "post prandial", "ppbs", "pp glucose", 
            "post prandial blood sugar", "postprandial"
        ],
        "exclusions": ["fasting", "fbs"]
    },
    "hba1c": {
        "canonical_name": "HbA1c (Glycated Hemoglobin)",
        "aliases": [
            "hba1c", "a1c", "glycated hemoglobin", "glycosylated hemoglobin"
        ],
        "exclusions": []
    },
    "creatinine": {
        "canonical_name": "Serum Creatinine",
        "aliases": ["creatinine", "serum creatinine", "creat"],
        "exclusions": []
    },
    "bun": {
        "canonical_name": "Blood Urea Nitrogen (BUN)",
        "aliases": ["bun", "blood urea nitrogen", "urea", "serum urea"],
        "exclusions": []
    },
    "egfr": {
        "canonical_name": "eGFR (Filtration Rate)",
        "aliases": [
            "egfr", "gfr", "estimated gfr", 
            "estimated glomerular filtration rate"
        ],
        "exclusions": []
    },
    "uric_acid": {
        "canonical_name": "Uric Acid",
        "aliases": ["uric acid", "serum uric acid"],
        "exclusions": []
    },
    "bilirubin": {
        "canonical_name": "Total Bilirubin",
        "aliases": ["bilirubin", "total bilirubin", "serum bilirubin"],
        "exclusions": ["direct bilirubin", "indirect bilirubin"]
    },
    "sgot": {
        "canonical_name": "SGOT / AST",
        "aliases": ["sgot", "ast", "aspartate aminotransferase"],
        "exclusions": ["sgpt", "alt"]
    },
    "sgpt": {
        "canonical_name": "SGPT / ALT",
        "aliases": ["sgpt", "alt", "alanine aminotransferase"],
        "exclusions": ["sgot", "ast"]
    },
    "alp": {
        "canonical_name": "Alkaline Phosphatase (ALP)",
        "aliases": ["alp", "alkaline phosphatase", "alk phos"],
        "exclusions": []
    },
    "tsh": {
        "canonical_name": "Thyroid Stimulating Hormone (TSH)",
        "aliases": ["tsh", "thyroid stimulating hormone", "thyrotropin"],
        "exclusions": ["free t3", "free t4", "t3", "t4"]
    },
    "t3": {
        "canonical_name": "Triiodothyronine (T3)",
        "aliases": ["t3", "free t3", "ft3", "total t3", "triiodothyronine"],
        "exclusions": ["t4", "ft4", "tsh"]
    },
    "t4": {
        "canonical_name": "Thyroxine (T4)",
        "aliases": ["t4", "free t4", "ft4", "total t4", "thyroxine"],
        "exclusions": ["t3", "ft3", "tsh"]
    }
}

# Generic words that should NEVER be used alone to match a biomarker
STOP_WORDS = {
    "count", "test", "tests", "total", "level", "levels", "value", "values",
    "blood", "serum", "report", "reports", "my", "is", "what", "how", "the",
    "in", "of", "normal", "range", "ranges", "result", "results", "high",
    "low", "tell", "me", "about", "show", "give", "check", "explain", "meaning",
    "numbers", "please", "can", "you", "does", "have", "panel"
}

# Pronouns indicating a conversational follow-up
FOLLOWUP_PRONOUNS = {
    "it", "this", "that", "this result", "that result", "this value", 
    "that value", "this test", "that test", "the test"
}

FOLLOWUP_PATTERNS = [
    r"\bis it\b",
    r"\bis this\b",
    r"\bwhat does it do\b",
    r"\bwhat does this mean\b",
    r"\bwhy is it\b",
    r"\bis it concerning\b",
    r"\bis it dangerous\b",
    r"\bis it normal\b",
    r"\bis it bad\b",
    r"\bis it high\b",
    r"\bis it low\b",
    r"\bwhat should i do about it\b",
    r"\bhow does it work\b",
    r"\btell me more about it\b",
    r"\bwhat causes it\b"
]

def clean_text(text: str) -> str:
    """Normalizes text by lowercasing and standardizing spaces and punctuation."""
    if not text:
        return ""
    # Replace punctuation with spaces except dashes and dots in numbers
    t = text.lower()
    t = re.sub(r"[^\w\s\-\.]", " ", t)
    return " ".join(t.split())

def match_query_to_canonical_key(query: str) -> Optional[str]:
    """
    Identifies which canonical biomarker key a query refers to, if any.
    Ensures strict specificity (e.g. 'platelet count' never matches 'wbc').
    """
    q_clean = clean_text(query)
    q_words = set(q_clean.split())

    best_match_key = None
    best_match_len = 0

    for key, data in BIOMARKER_ALIASES.items():
        # Check exclusions first
        excluded = False
        for exc in data.get("exclusions", []):
            if re.search(r"\b" + re.escape(exc) + r"\b", q_clean):
                excluded = True
                break
        if excluded:
            continue

        # Check aliases
        for alias in data["aliases"]:
            alias_clean = clean_text(alias)
            # Must match as a whole phrase or whole token
            pattern = r"\b" + re.escape(alias_clean) + r"\b"
            if re.search(pattern, q_clean):
                if len(alias_clean) > best_match_len:
                    best_match_key = key
                    best_match_len = len(alias_clean)

    return best_match_key

def match_biomarker_to_canonical_key(biomarker: Dict[str, Any]) -> Optional[str]:
    """Identifies the canonical key for a given biomarker record from the report."""
    test_name = biomarker.get("test_name") or biomarker.get("name") or ""
    common_name = biomarker.get("common_name") or biomarker.get("standard_name") or ""
    combined = f"{test_name} {common_name}"
    
    return match_query_to_canonical_key(combined)

def is_followup_query(query: str) -> bool:
    """Determines whether a query is a conversational follow-up referencing a previous item."""
    q_lower = query.strip().lower()
    for pattern in FOLLOWUP_PATTERNS:
        if re.search(pattern, q_lower):
            return True
            
    words = set(re.findall(r"\b\w+\b", q_lower))
    if words.intersection(FOLLOWUP_PRONOUNS) and len(words) <= 8:
        # Check that it doesn't name a new biomarker
        if not match_query_to_canonical_key(query):
            return True
            
    return False

def resolve_target_biomarker(
    query: str,
    biomarkers: List[Dict[str, Any]],
    history: Optional[List[Dict[str, str]]] = None
) -> Tuple[Optional[Dict[str, Any]], bool, bool]:
    """
    Finds the exact matching biomarker for a query.
    
    Returns:
        (matching_biomarker, was_followup, is_ambiguous)
        - matching_biomarker: the exact Biomarker dict or None
        - was_followup: True if resolved via conversation history
        - is_ambiguous: True if the query appears to be a follow-up but context is unclear
    """
    if not biomarkers:
        return None, False, False

    # 1. Direct query matching
    target_key = match_query_to_canonical_key(query)
    if target_key:
        for b in biomarkers:
            b_key = match_biomarker_to_canonical_key(b)
            if b_key == target_key:
                return b, False, False

        # Fallback exact phrase matching if biomarker not in predefined canonical table
        q_clean = clean_text(query)
        for b in biomarkers:
            name = clean_text(b.get("test_name") or b.get("name") or "")
            common = clean_text(b.get("common_name") or b.get("standard_name") or "")
            
            # Remove stop words from biomarker name for distinctiveness check
            distinct_words = [w for w in name.split() if w not in STOP_WORDS]
            if distinct_words:
                all_found = all(re.search(r"\b" + re.escape(w) + r"\b", q_clean) for w in distinct_words)
                if all_found:
                    return b, False, False
            elif name and re.search(r"\b" + re.escape(name) + r"\b", q_clean):
                return b, False, False

    # 2. Check if the query names a biomarker that simply is NOT in the report
    if target_key:
        # User asked for a specific test (e.g. TSH or Creatinine), but it's not present in this report
        return None, False, False

    # 3. Follow-up resolution via conversation history
    if is_followup_query(query) and history:
        # Search backwards through user and assistant history
        for msg in reversed(history):
            content = msg.get("content", "")
            # Try to identify which biomarker was discussed
            hist_key = match_query_to_canonical_key(content)
            if hist_key:
                for b in biomarkers:
                    if match_biomarker_to_canonical_key(b) == hist_key:
                        return b, True, False

        # If it looks like a follow-up but no past biomarker was found
        return None, True, True

    return None, False, False
