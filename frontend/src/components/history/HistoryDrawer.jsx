import React from 'react';
import { X, FileText, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, history = [], onSelectReport }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Report History</h2>
              <p className="text-xs text-slate-500">Your previously explained reports</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-teal-600" />
                <p className="font-semibold text-slate-600">No reports saved yet</p>
                <p className="text-xs text-slate-400 mt-1">Upload a lab report or try a sample to see it saved here.</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectReport(item.id);
                    onClose();
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                      {item.report_type || item.filename}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {item.overall_summary || 'Click to view full simplified results.'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.abnormal_count > 0 ? (
                      <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {item.abnormal_count} out-of-range
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        All normal
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
