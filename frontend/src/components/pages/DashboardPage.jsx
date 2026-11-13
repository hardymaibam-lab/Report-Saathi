import React from 'react';
import { 
  Plus, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Layers, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function DashboardPage({ 
  onOpenUpload, 
  reports = [], 
  onSelectReport, 
  onTriggerDemoState 
}) {
  // Compute real metrics from reports
  const totalReports = reports.length;
  
  const totalOutOfRange = reports.reduce((acc, rep) => {
    const abnormal = rep.biomarkers?.filter(b => 
      ['high', 'low', 'borderline', 'unclear'].includes((b.status || '').toLowerCase())
    ).length || 0;
    return acc + abnormal;
  }, 0);

  const latestUploadDate = reports.length > 0 
    ? (reports[0]?.uploadedAt || reports[0]?.created_at?.split('T')?.[0] || 'Recent')
    : null;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* A. Dashboard Welcome Section */}
      <div className="bg-white rounded-card p-6 sm:p-8 border border-[#E5ECEA] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0D9488] bg-[#E7F5F2] px-2.5 py-0.5 rounded-md">
            <span>Patient Portal</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16324A]">
            Your health reports, all in one place.
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Keep track of your laboratory reports and explore clear, educational explanations of your results.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenUpload}
          className="px-5 py-3 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-btn shadow-teal-glow transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* B. Real Overview Metrics (Only shown when reports exist) */}
      {totalReports > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1 */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-[#E5ECEA] shadow-subtle flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Total Reports</p>
              <h3 className="font-heading font-extrabold text-2xl text-[#16324A] tabular-nums mt-0.5">
                {totalReports}
              </h3>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-[#E5ECEA] shadow-subtle flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Latest Upload</p>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#16324A] mt-0.5 truncate">
                {latestUploadDate || 'None'}
              </h3>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-[#E5ECEA] shadow-subtle flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              totalOutOfRange > 0 ? 'bg-[#FFF7E6] text-[#D97706]' : 'bg-[#ECFDF5] text-[#059669]'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-medium">Out of Stated Range</p>
              <h3 className="font-heading font-extrabold text-2xl text-[#16324A] tabular-nums mt-0.5">
                {totalOutOfRange} <span className="text-xs font-normal text-[#64748B]">(Items to discuss)</span>
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* C. Recent Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#16324A]">
              Your Recent Reports
            </h2>
            <p className="text-xs text-[#64748B]">
              Select any report to review biomarker values and plain-language summaries.
            </p>
          </div>
          {reports.length > 0 && (
            <button
              onClick={onOpenUpload}
              className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 transition-colors"
            >
              <span>+ Add Report</span>
            </button>
          )}
        </div>

        {reports.length === 0 ? (
          /* D. Friendly Empty State */
          <div className="bg-white rounded-card p-10 sm:p-14 text-center border border-[#E5ECEA] shadow-card max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center mx-auto shadow-subtle">
              <FileCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-[#16324A]">
                Your report library starts here.
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
                Upload your first laboratory report to receive an easy-to-understand educational explanation.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenUpload}
                className="px-5 py-2.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-btn transition-all shadow-teal-glow inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Report</span>
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Supported formats: PDF, JPG, and PNG (up to 10 MB)
            </p>
          </div>
        ) : (
          /* Reports Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((rep) => {
              const abnormalCount = rep.biomarkers?.filter(b => 
                ['high', 'low', 'borderline', 'unclear'].includes((b.status || '').toLowerCase())
              ).length || 0;

              return (
                <div
                  key={rep.id}
                  onClick={() => onSelectReport(rep.id)}
                  className="bg-white rounded-card p-5 sm:p-6 border border-[#E5ECEA] hover:border-[#0D9488] hover:shadow-card-hover transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#0F766E] bg-[#E7F5F2] px-2.5 py-1 rounded-md border border-[#CCFBEF]">
                        {rep.summary?.report_type || "Lab Report"}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#F7FAF9] group-hover:bg-[#E7F5F2] flex items-center justify-center transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-[#0D9488] transition-colors" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#16324A] group-hover:text-[#0D9488] transition-colors truncate">
                        {rep.filename || "Laboratory Document"}
                      </h3>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mt-1">
                        {rep.summary?.overall_summary || "Plain-language summary of clinical indicators and reference intervals."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-4 mt-4 border-t border-[#F1F5F9] text-[#94A3B8]">
                    <span className="flex items-center gap-1.5 font-medium text-[11px] text-[#64748B]">
                      <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {rep.uploadedAt || rep.created_at?.split('T')?.[0] || "Recent"}
                    </span>

                    {abnormalCount > 0 ? (
                      <span className="font-bold text-[#92400E] bg-[#FFF7E6] px-2.5 py-0.5 rounded-full border border-[#FEEBC8] text-[11px]">
                        {abnormalCount} Outside Range
                      </span>
                    ) : (
                      <span className="font-bold text-[#065F46] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0] text-[11px]">
                        All Normal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* E. Preserved Demo State Switcher (Clean, subtle presentation for testers) */}
      <div className="mt-8 pt-6 border-t border-[#E5ECEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#F7FAF9] p-4 rounded-xl border border-[#E5ECEA]">
        <div className="flex items-center gap-2 text-[#64748B]">
          <Layers className="w-4 h-4 text-[#0D9488]" />
          <span className="font-semibold text-[#16324A]">Evaluator State Switcher:</span>
          <span className="text-[11px] hidden md:inline text-[#94A3B8]">(Quick preview of app states)</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onTriggerDemoState('empty')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-[#16324A] border border-[#E5ECEA] shadow-subtle transition-all"
          >
            Empty State
          </button>
          <button
            onClick={() => onTriggerDemoState('loading')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-[#16324A] border border-[#E5ECEA] shadow-subtle transition-all"
          >
            Loading State
          </button>
          <button
            onClick={() => onTriggerDemoState('error')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-subtle transition-all"
          >
            Error State
          </button>
          <button
            onClick={() => onTriggerDemoState('success')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-subtle transition-all"
          >
            Success State
          </button>
        </div>
      </div>
    </div>
  );
}
