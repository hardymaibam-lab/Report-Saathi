import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';

export default function BiomarkerCard({ biomarker }) {
  const [expanded, setExpanded] = useState(false);

  // Status Styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Higher than normal',
          icon: ArrowUpRight,
        };
      case 'low':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Lower than normal',
          icon: ArrowDownRight,
        };
      case 'borderline':
        return {
          bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          dot: 'bg-yellow-500',
          label: 'Borderline range',
          icon: AlertCircle,
        };
      case 'normal':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Normal / Expected',
          icon: CheckCircle,
        };
    }
  };

  const badge = getStatusBadge(biomarker.status);
  const StatusIcon = badge.icon;

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
      biomarker.status === 'high' ? 'border-rose-200/80' :
      biomarker.status === 'low' ? 'border-amber-200/80' :
      'border-slate-200'
    }`}>
      {/* Top Header Card */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">
              {biomarker.standard_name || biomarker.name}
            </h3>
            {biomarker.standard_name && biomarker.standard_name !== biomarker.name && (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {biomarker.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">
            {biomarker.layman_definition}
          </p>
        </div>

        {/* Value + Status Pill */}
        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                {biomarker.value}
              </span>
              {biomarker.unit && (
                <span className="text-xs font-semibold text-slate-500">
                  {biomarker.unit}
                </span>
              )}
            </div>
            {biomarker.reference_range && (
              <p className="text-[11px] text-slate-400">
                Ref: {biomarker.reference_range}
              </p>
            )}
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            <span>{badge.label}</span>
          </div>

          <button className="text-slate-400 hover:text-slate-600 p-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs text-slate-700">
          <div>
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
              What does this test measure?
            </span>
            <p className="leading-relaxed text-slate-600">{biomarker.layman_definition}</p>
          </div>

          <div>
            <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
              What does this number mean?
            </span>
            <p className="leading-relaxed text-slate-800 font-medium">{biomarker.meaning_of_result}</p>
          </div>

          {biomarker.questions_to_ask?.length > 0 && (
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-800 uppercase text-[10px] tracking-wider block mb-1">
                Suggested questions for doctor:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {biomarker.questions_to_ask.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
