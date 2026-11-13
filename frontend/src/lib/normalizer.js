/**
 * Normalizes biomarker data from both API responses and mock datasets
 * into a single consistent structure.
 */

export function normalizeBiomarker(b = {}) {
  const testName = b.test_name || b.name || 'Laboratory Test';
  const commonName = b.common_name || b.standard_name || testName;
  const value = b.extracted_value !== undefined ? String(b.extracted_value) : (b.value !== undefined ? String(b.value) : '');
  const unit = b.unit || '';
  const refRange = b.reference_range || null;
  const rawStatus = (b.status || 'normal').toLowerCase();
  
  // Normalized status: 'normal', 'high', 'low', 'unclear'
  let status = 'normal';
  if (['high', 'elevated', 'above'].includes(rawStatus)) status = 'high';
  else if (['low', 'below', 'decreased'].includes(rawStatus)) status = 'low';
  else if (['unclear', 'borderline', 'abnormal'].includes(rawStatus)) status = 'unclear';
  else status = 'normal';

  const explanation = b.explanation || b.layman_definition || 'This test measures specific clinical indicators in your laboratory sample.';
  const notes = b.missing_or_unclear_notes || b.meaning_of_result || null;
  const questionsToAsk = Array.isArray(b.questions_to_ask) ? b.questions_to_ask : [];

  return {
    test_name: testName,
    common_name: commonName,
    value,
    unit,
    reference_range: refRange,
    status,
    explanation,
    notes,
    questions_to_ask: questionsToAsk,
    // Range parsing for horizontal meter
    rangeMetrics: parseReferenceRange(refRange, value)
  };
}

/**
 * Safely parses reference range strings like "13.5 - 17.5", "< 200", "> 40"
 * without inventing any values.
 */
export function parseReferenceRange(rangeStr, valueStr) {
  if (!rangeStr || typeof rangeStr !== 'string') return null;
  
  const val = parseFloat(valueStr);
  const isValValid = !isNaN(val);

  // Pattern: "min - max" or "min to max"
  const rangeMatch = rangeStr.match(/([0-9.]+)\s*(?:-|to)\s*([0-9.]+)/i);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && !isNaN(max) && max > min) {
      let percent = 50;
      if (isValValid) {
        const span = max - min;
        // Map min-max to 25% - 75% on a 0-100 visual meter
        const offset = val - min;
        const normalized = 25 + (offset / span) * 50;
        percent = Math.max(5, Math.min(95, normalized));
      }
      return { type: 'range', min, max, percent, isValValid };
    }
  }

  // Pattern: "< max" or "<= max"
  const upperMatch = rangeStr.match(/(?:<|<=|less than)\s*([0-9.]+)/i);
  if (upperMatch) {
    const max = parseFloat(upperMatch[1]);
    if (!isNaN(max)) {
      let percent = 40;
      if (isValValid) {
        percent = Math.max(5, Math.min(95, (val / (max * 1.5)) * 100));
      }
      return { type: 'upper', max, percent, isValValid };
    }
  }

  // Pattern: "> min" or ">= min"
  const lowerMatch = rangeStr.match(/(?:>|>=|greater than)\s*([0-9.]+)/i);
  if (lowerMatch) {
    const min = parseFloat(lowerMatch[1]);
    if (!isNaN(min)) {
      let percent = 60;
      if (isValValid) {
        percent = Math.max(5, Math.min(95, (val / (min * 2)) * 100));
      }
      return { type: 'lower', min, percent, isValValid };
    }
  }

  return null;
}
