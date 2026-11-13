import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import Logo from './Logo';

export default function MainFooter({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-[#e5ecea] py-12 mt-20 text-[#52616b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Custom Brand Logo Mark */}
            <Logo className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-sans font-bold text-lg text-[#0a3d36] tracking-tight">
                Report<span className="font-normal text-[#084d46]">Saathi</span>
              </span>
              <span className="text-xs text-[#64748b] ml-2 font-normal">Educational Lab Report Companion</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
            <button 
              onClick={() => { onNavigate?.('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#084d46] transition-colors"
            >
              About Platform
            </button>
            <button 
              onClick={() => { onNavigate?.('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#084d46] transition-colors"
            >
              Patient Dashboard
            </button>
            <span className="inline-flex items-center gap-1 text-[#084d46] bg-[#ebf3ea] px-3 py-1 rounded-full text-[11px] font-semibold border border-[#dce8dc]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#084d46]" /> 100% Non-Diagnostic
            </span>
          </div>
        </div>

        <div className="border-t border-[#f1f5f9] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#94a3b8]">
          <p className="max-w-2xl leading-relaxed">
            ReportSaathi is intended strictly for health literacy and patient education. 
            All extracted laboratory values must be reviewed directly with your primary care physician or licensed medical professional.
          </p>
          <p className="shrink-0 text-[11px]">
            &copy; {new Date().getFullYear()} ReportSaathi. Inspired by humane healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
}
