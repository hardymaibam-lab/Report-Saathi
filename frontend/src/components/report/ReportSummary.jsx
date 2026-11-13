import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Copy, Check, MessageSquare } from 'lucide-react';

export default function ReportSummary({ summary }) {
  const [copied, setCopied] = useState(false);

  const handleCopyQuestions = () => {
    if (!summary?.next_steps_questions?.length) return;
    const text = summary.next_steps_questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(`Questions for my Doctor:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            {summary.report_type || 'Lab Report Summary'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Overview & Takeaways
          </h2>
          {summary.patient_context && (
            <p className="text-xs text-slate-500 mt-0.5">{summary.patient_context}</p>
          )}
        </div>
      </div>

      {/* Empathetic High Level Summary */}
      <div className="bg-teal-50/50 rounded-2xl p-5 border border-teal-100 text-slate-700 leading-relaxed text-sm">
        <p className="font-medium">{summary.overall_summary}</p>
      </div>

      {/* Grid: Key Normal Findings vs Areas to Discuss */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Normal Findings */}
        <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Looking Good & Stable</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {summary.key_findings?.length > 0 ? (
              summary.key_findings.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400">All standard baseline tests reviewed.</li>
            )}
          </ul>
        </div>

        {/* Areas of Concern */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Items to Discuss With Doctor</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {summary.areas_of_concern?.length > 0 ? (
              summary.areas_of_concern.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500">No significant out-of-range biomarkers detected.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Doctor Conversation Starter Questions */}
      {summary.next_steps_questions?.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Questions You Can Ask Your Doctor</span>
            </div>
            <button
              onClick={handleCopyQuestions}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-sm"
              title="Copy questions to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Questions</span>
                </>
              )}
            </button>
          </div>
          <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside pl-1">
            {summary.next_steps_questions.map((q, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-medium text-slate-800">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
