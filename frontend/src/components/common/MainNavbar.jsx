import React, { useState } from 'react';
import { 
  Plus, 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Sparkles,
  FileText
} from 'lucide-react';
import Logo from './Logo';

export default function MainNavbar({ 
  currentView, 
  onNavigate, 
  onOpenUpload,
  backendHealth 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLive = backendHealth?.status === 'healthy';

  const handleNavClick = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e5ecea] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Left: One Medical Style Dot-Cluster Logo + Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            {/* Custom Brand Logo Mark */}
            <Logo className="w-8 h-8 shrink-0 transition-transform group-hover:scale-105" />

            <span className="font-sans font-bold text-[22px] tracking-tight text-[#0a3d36]">
              Report<span className="font-normal text-[#084d46]">Saathi</span>
            </span>
          </div>

          {/* Announcement / Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#ebf3ea] text-[#084d46] border border-[#dce8dc]">
            <Sparkles className="w-3.5 h-3.5 text-[#084d46]" />
            <span>AI + OCR Companion</span>
          </div>
        </div>

        {/* Center: Clean One Medical Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#2d3748]">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`transition-colors hover:text-[#084d46] ${
              currentView === 'dashboard' ? 'text-[#084d46] font-semibold' : ''
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => handleNavClick('landing')}
            className={`flex items-center gap-1 transition-colors hover:text-[#084d46] ${
              currentView === 'landing' ? 'text-[#084d46] font-semibold' : ''
            }`}
          >
            <span>How It Works</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                const el = document.getElementById('supported-panels');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-[#084d46]"
          >
            Supported Panels
          </button>

          <button
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                const el = document.getElementById('educational-philosophy');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="flex items-center gap-1 transition-colors hover:text-[#084d46]"
          >
            <span>Our Philosophy</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        </nav>

        {/* Right: Actions, Pill Button & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="hidden sm:inline-block text-xs font-semibold text-[#0a3d36] hover:text-[#084d46] transition-colors"
          >
            Patient Portal
          </button>

          {/* One Medical Style Forest Green Pill Button */}
          <button
            onClick={onOpenUpload}
            className="px-6 py-2.5 bg-[#084d46] hover:bg-[#063f39] text-white font-semibold rounded-full text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload report</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2d3748] hover:text-[#084d46] rounded-lg md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5ecea] bg-white px-5 py-4 space-y-2 animate-fadeIn shadow-lg">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full text-left text-sm font-medium py-2 text-[#2d3748] hover:text-[#084d46]"
          >
            Home & How It Works
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full text-left text-sm font-medium py-2 text-[#2d3748] hover:text-[#084d46]"
          >
            Patient Dashboard
          </button>
          <button
            onClick={() => {
              onOpenUpload();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center text-sm font-semibold py-3 rounded-full bg-[#084d46] text-white transition-all shadow-sm mt-2"
          >
            Upload Report
          </button>
        </div>
      )}
    </header>
  );
}
