import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export default function MainFooter({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-[#E5ECEA] py-10 mt-16 text-[#64748B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base text-[#16324A] tracking-tight">
                Report<span className="text-[#0D9488]">Saathi</span>
              </span>
              <span className="text-xs text-[#94A3B8] ml-2">Educational Lab Report Companion</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium">
            <button 
              onClick={() => { onNavigate?.('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#0D9488] transition-colors"
            >
              About Platform
            </button>
            <button 
              onClick={() => { onNavigate?.('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#0D9488] transition-colors"
            >
              Dashboard
            </button>
            <span className="inline-flex items-center gap-1 text-[#0D9488] bg-[#E7F5F2] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Non-Diagnostic
            </span>
          </div>
        </div>

        <div className="border-t border-[#F1F5F9] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <p className="max-w-2xl leading-relaxed">
            ReportSaathi is intended strictly for patient education and health literacy enhancement. 
            All extracted laboratory values must be reviewed with your primary physician or licensed clinician.
          </p>
          <p className="shrink-0 text-[11px]">
            &copy; {new Date().getFullYear()} ReportSaathi. Built for patient empowerment.
          </p>
        </div>
      </div>
    </footer>
  );
}
