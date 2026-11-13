import React from 'react';
import { Activity, History, ShieldAlert, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ onOpenHistory, onReset, historyCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Logo className="w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Report<span className="text-teal-600">Saathi</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                Beta
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Simple Explanations for Medical Lab Reports</p>
          </div>
        </div>

        {/* Actions & Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI + Tesseract OCR</span>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors border border-slate-200"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
