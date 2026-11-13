const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Health check endpoint failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function analyzeReportFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/reports/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to process report file');
  }

  return await res.json();
}

export async function askReportQuestion(question, reportContext, reportId = null) {
  const res = await fetch(`${API_BASE}/api/reports/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      report_context: reportContext,
      report_id: reportId
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to get chat response');
  }

  return await res.json();
}

export async function saveReportOptIn(report) {
  const payload = {
    report_id: report.id,
    report_type: report.summary?.report_type || 'Laboratory Report',
    filename: report.filename,
    summary_text: report.summary?.overall_summary || '',
    biomarkers_summary: (report.biomarkers || []).map(b => ({
      name: b.test_name || b.name,
      value: b.extracted_value || b.value,
      status: b.status
    })),
    user_id: 'guest'
  };

  const res = await fetch(`${API_BASE}/api/reports/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to save report');
  }

  return await res.json();
}

export async function fetchSavedReports(userId = 'guest') {
  const res = await fetch(`${API_BASE}/api/reports/saved?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to retrieve saved reports');
  return await res.json();
}

export async function deleteSavedReport(reportId, userId = 'guest') {
  const res = await fetch(`${API_BASE}/api/reports/saved/${reportId}?user_id=${userId}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete report');
  return await res.json();
}
