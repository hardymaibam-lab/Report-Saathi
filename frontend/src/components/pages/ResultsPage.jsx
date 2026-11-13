import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Copy, 
  Check, 
  MessageSquare, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  Loader2,
  Lock,
  Calendar,
  Sparkles,
  Info,
  HelpCircle,
  ShieldCheck,
  Plus
} from 'lucide-react';
import ReportChat from '../report/ReportChat';
import ReferenceRangeMeter from '../report/ReferenceRangeMeter';
import { normalizeBiomarker } from '../../lib/normalizer';
import { saveReportOptIn, deleteSavedReport } from '../../lib/api';

export default function ResultsPage({ report, onBackToDashboard, onUploadNew }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'attention' | 'normal'
  const [expandedCards, setExpandedCards] = useState({});
  
  // Supabase Opt-in Saving state
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);

  if (!report) return null;

  const toggleExpand = (name) => {
    setExpandedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCopyQuestions = () => {
    if (!report.summary?.next_steps_questions?.length) return;
    const text = report.summary.next_steps_questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(`Questions for my Doctor (from ReportSaathi):\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToggle = async () => {
    if (isSaved) {
      setIsSaving(true);
      try {
        await deleteSavedReport(report.id);
        setIsSaved(false);
        setSaveFeedback({ type: 'info', msg: 'Report removed from your saved records.' });
      } catch (e) {
        setSaveFeedback({ type: 'error', msg: 'Could not remove report.' });
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const res = await saveReportOptIn(report);
      setIsSaved(true);
      if (res.saved_to_cloud) {
        setSaveFeedback({ type: 'success', msg: 'Saved securely to your Supabase account!' });
      } else {
        setSaveFeedback({ type: 'demo', msg: 'Saved to local session (Demo mode: Configure Supabase in .env for cloud sync).' });
      }
    } catch (err) {
      setSaveFeedback({ type: 'error', msg: 'Failed to save report.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Normalize all biomarkers consistently
  const rawBiomarkers = report.biomarkers || [];
  const biomarkers = rawBiomarkers.map(b => normalizeBiomarker(b));

  const abnormalCount = biomarkers.filter(b => ['high', 'low', 'unclear'].includes(b.status)).length;
  const normalCount = biomarkers.filter(b => b.status === 'normal').length;

  const filteredBiomarkers = biomarkers.filter(b => {
    if (activeTab === 'attention') return ['high', 'low', 'unclear'].includes(b.status);
    if (activeTab === 'normal') return b.status === 'normal';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5ECEA]">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16324A] hover:text-[#0D9488] bg-white hover:bg-[#EFF6F5] px-3.5 py-2 rounded-btn border border-[#E5ECEA] transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Supabase Opt-in Save Action */}
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-btn border transition-all shadow-subtle ${
              isSaved 
                ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:bg-[#FEF2F2] hover:text-[#991B1B] hover:border-[#FECACA]' 
                : 'bg-white hover:bg-[#F7FAF9] text-[#16324A] border-[#E5ECEA]'
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D9488]" />
            ) : isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span>Saved (Click to remove)</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Save to History</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16324A] bg-white hover:bg-[#F7FAF9] px-3.5 py-2 rounded-btn border border-[#E5ECEA] transition-colors shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onUploadNew}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] px-4 py-2 rounded-btn shadow-teal-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Another Report</span>
          </button>
        </div>
      </div>

      {/* Save Feedback Alert & Privacy Assurance */}
      {saveFeedback && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between border animate-fadeIn ${
          saveFeedback.type === 'success' ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]' :
          saveFeedback.type === 'demo' ? 'bg-[#E7F5F2] border-[#CCFBEF] text-[#0F766E]' :
          saveFeedback.type === 'error' ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]' :
          'bg-[#F7FAF9] border-[#E5ECEA] text-[#16324A]'
        }`}>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0D9488] shrink-0" />
            <span>{saveFeedback.msg}</span>
          </div>
          <span className="text-[11px] text-[#64748B] hidden sm:inline">
            Original files and raw document text are never stored.
          </span>
        </div>
      )}

      {/* A. Visible Educational Disclaimer */}
      <div className="p-4 sm:p-5 rounded-card bg-[#FFF7E6] border border-[#FEEBC8] text-[#78350F] flex items-start gap-3.5 shadow-subtle">
        <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <h2 className="font-heading font-bold text-sm text-[#92400E]">
            Educational Disclaimer
          </h2>
          <p className="text-xs text-[#78350F] leading-relaxed">
            {report.summary?.disclaimer || "This explanation is for educational purposes only. Laboratory results must be interpreted in the context of your health history and clinical assessment. Please consult a qualified healthcare professional."}
          </p>
        </div>
      </div>

      {/* B. Report Overview Section */}
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E5ECEA] shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] bg-[#E7F5F2] px-2.5 py-0.5 rounded-md border border-[#CCFBEF]">
                {report.summary?.report_type || "Laboratory Report"}
              </span>
              <span className="text-xs text-[#94A3B8]">•</span>
              <span className="text-xs text-[#64748B]">
                {report.uploadedAt || report.created_at?.split('T')?.[0] || 'Recent'}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16324A] mt-1.5">
              Report Insights & Summary
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              {report.summary?.patient_context ? `${report.summary.patient_context} • ` : ''}
              Source file: <span className="font-mono text-[#16324A]">{report.filename}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-btn bg-[#F7FAF9] text-[#16324A] border border-[#E5ECEA]">
              {biomarkers.length} Tests Analysed
            </span>
            {abnormalCount > 0 ? (
              <span className="text-xs font-bold px-3 py-1.5 rounded-btn bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8]">
                {abnormalCount} to discuss
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1.5 rounded-btn bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                All within range
              </span>
            )}
          </div>
        </div>

        {/* Overall Summary Card */}
        <div className="bg-[#EFF6F5] rounded-xl p-5 border border-[#E5ECEA] text-[#172B3A] leading-relaxed text-xs sm:text-sm">
          <p className="font-medium text-[#16324A]">{report.summary?.overall_summary}</p>
        </div>

        {/* Key Findings vs Items to Discuss */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#ECFDF5]/50 border border-[#A7F3D0] rounded-xl p-5">
            <div className="flex items-center gap-2 text-[#065F46] font-heading font-bold text-sm mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Looking Normal & Stable</span>
            </div>
            <ul className="space-y-2 text-xs text-[#16324A]">
              {report.summary?.key_findings?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#FFF7E6]/60 border border-[#FEEBC8] rounded-xl p-5">
            <div className="flex items-center gap-2 text-[#92400E] font-heading font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>Items to Discuss with Your Doctor</span>
            </div>
            <ul className="space-y-2 text-xs text-[#78350F]">
              {report.summary?.areas_of_concern?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* C. Section: Extracted Values & Laboratory Results */}
      <section className="bg-white rounded-card p-6 sm:p-8 border border-[#E5ECEA] shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#16324A]">
              Laboratory Results
            </h2>
            <p className="text-xs text-[#64748B]">
              Exact values extracted from your report. Reference intervals are shown only when present on source document.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F7FAF9] p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-[#E5ECEA]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-white text-[#16324A] shadow-subtle' : 'text-[#64748B] hover:text-[#16324A]'
              }`}
            >
              All ({biomarkers.length})
            </button>
            <button
              onClick={() => setActiveTab('attention')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'attention' ? 'bg-white text-[#92400E] shadow-subtle' : 'text-[#64748B] hover:text-[#16324A]'
              }`}
            >
              Outside Range ({abnormalCount})
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'normal' ? 'bg-white text-[#065F46] shadow-subtle' : 'text-[#64748B] hover:text-[#16324A]'
              }`}
            >
              Within Range ({normalCount})
            </button>
          </div>
        </div>

        {/* Responsive Table with Visual Range Indicator */}
        <div className="overflow-x-auto rounded-xl border border-[#E5ECEA]">
          <table className="w-full text-left text-xs text-[#172B3A]">
            <thead className="bg-[#F7FAF9] text-[#64748B] font-semibold border-b border-[#E5ECEA] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Test / Biomarker</th>
                <th className="py-3.5 px-4">Observed Value</th>
                <th className="py-3.5 px-4">Reference Range & Scale</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] font-medium">
              {filteredBiomarkers.map((b, idx) => {
                const isHigh = b.status === 'high';
                const isLow = b.status === 'low';
                const isUnclear = b.status === 'unclear';

                return (
                  <tr key={idx} className="hover:bg-[#F7FAF9]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-sm text-[#16324A]">
                        {b.common_name}
                      </div>
                      {b.common_name !== b.test_name && (
                        <div className="text-[11px] font-mono text-[#94A3B8]">
                          {b.test_name}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm text-[#16324A] tabular-nums font-mono">
                      {b.value} {b.unit && <span className="font-sans font-normal text-xs text-[#64748B]">{b.unit}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <ReferenceRangeMeter 
                        metrics={b.rangeMetrics}
                        status={b.status}
                        value={b.value}
                        unit={b.unit}
                        referenceRange={b.reference_range}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isHigh ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8]">
                          <ArrowUpRight className="w-3 h-3 text-[#D97706]" /> Above Range
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8]">
                          <ArrowDownRight className="w-3 h-3 text-[#D97706]" /> Below Range
                        </span>
                      ) : isUnclear ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F7FAF9] text-[#64748B] border border-[#E5ECEA]">
                          <HelpCircle className="w-3 h-3 text-[#94A3B8]" /> Unclear
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                          <Check className="w-3 h-3 text-[#059669]" /> Within Range
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* D. Section: Plain-Language Explanations */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#16324A]">
            Plain-Language Explanations
          </h2>
          <p className="text-xs text-[#64748B]">
            Understand what each test measures in simple terms without medical jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredBiomarkers.map((b, idx) => {
            const isExpanded = expandedCards[b.test_name];
            const isAbnormal = ['high', 'low', 'unclear'].includes(b.status);

            return (
              <div
                key={idx}
                className={`bg-white rounded-card border transition-all overflow-hidden ${
                  isAbnormal ? 'border-[#FEEBC8] shadow-subtle' : 'border-[#E5ECEA]'
                }`}
              >
                <div
                  onClick={() => toggleExpand(b.test_name)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none hover:bg-[#F7FAF9]/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#16324A]">
                        {b.common_name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'high' ? 'bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8]' :
                        b.status === 'low' ? 'bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8]' :
                        b.status === 'unclear' ? 'bg-[#F7FAF9] text-[#64748B] border border-[#E5ECEA]' :
                        'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                      }`}>
                        {b.status === 'high' ? 'Above Range' : b.status === 'low' ? 'Below Range' : b.status === 'unclear' ? 'Unclear' : 'Within Range'}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-1">
                      {b.explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="font-heading font-bold text-sm sm:text-base text-[#16324A] tabular-nums font-mono">
                        {b.value} <span className="font-sans font-normal text-xs text-[#64748B]">{b.unit}</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        Ref: {b.reference_range || 'Not specified'}
                      </div>
                    </div>

                    <button className="text-[#94A3B8] hover:text-[#16324A] p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-[#F1F5F9] bg-[#F7FAF9]/60 space-y-3.5 text-xs">
                    <div>
                      <span className="font-bold text-[#16324A] uppercase text-[10px] tracking-wider block mb-1">
                        What does this test measure?
                      </span>
                      <p className="text-[#172B3A] leading-relaxed">{b.explanation}</p>
                    </div>

                    {b.notes && (
                      <div className="bg-[#FFF7E6]/40 p-3 rounded-lg border border-[#FEEBC8]">
                        <span className="font-bold text-[#92400E] uppercase text-[10px] tracking-wider block mb-0.5">
                          Clinical Context & Notes:
                        </span>
                        <p className="text-[#78350F] leading-relaxed">{b.notes}</p>
                      </div>
                    )}

                    {b.questions_to_ask?.length > 0 && (
                      <div className="bg-white p-3.5 rounded-lg border border-[#E5ECEA]">
                        <span className="font-bold text-[#0D9488] uppercase text-[10px] tracking-wider block mb-1.5">
                          Questions to ask your clinician:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-[#16324A]">
                          {b.questions_to_ask.map((q, qIdx) => (
                            <li key={qIdx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* E. Section: Interactive Report Chat */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#16324A]">
            Interactive Report Chat
          </h2>
          <p className="text-xs text-[#64748B]">
            Have questions about this specific report? Ask our educational assistant.
          </p>
        </div>
        <ReportChat report={report} />
      </section>

      {/* F. Section: Doctor Consultation Questions */}
      {report.summary?.next_steps_questions?.length > 0 && (
        <section className="bg-white rounded-card p-6 sm:p-8 border border-[#E5ECEA] shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-[#16324A] font-heading font-extrabold text-base sm:text-lg">
              <MessageSquare className="w-5 h-5 text-[#0D9488]" />
              <span>Questions to Discuss with Your Doctor</span>
            </div>

            <button
              onClick={handleCopyQuestions}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16324A] hover:text-[#0D9488] bg-[#F7FAF9] hover:bg-[#E7F5F2] px-3.5 py-2 rounded-btn border border-[#E5ECEA] shadow-subtle transition-colors self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#059669]" />
                  <span className="text-[#065F46]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#64748B]" />
                  <span>Copy Questions</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            Take these empowering questions with you to your doctor's appointment:
          </p>

          <ol className="space-y-2.5 text-xs text-[#16324A] list-decimal list-inside pl-1 font-medium">
            {report.summary.next_steps_questions.map((q, idx) => (
              <li key={idx} className="p-3.5 bg-[#F7FAF9] rounded-xl border border-[#E5ECEA] leading-relaxed shadow-subtle">
                <span className="font-normal">{q}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
