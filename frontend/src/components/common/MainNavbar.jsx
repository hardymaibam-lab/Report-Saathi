import React, { useState } from 'react';
import { Activity, Plus, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5ECEA] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-xl tracking-tight text-[#16324A]">
              Report<span className="text-[#0D9488]">Saathi</span>
            </span>
            {isLive ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded-md border border-[#A7F3D0]">
                Live API
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#FFF7E6] text-[#92400E] rounded-md border border-[#FEEBC8]">
                Demo Mode
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleNavClick('landing')}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${
              currentView === 'landing'
                ? 'text-[#0D9488] bg-[#E7F5F2]'
                : 'text-[#64748B] hover:text-[#16324A] hover:bg-[#F7FAF9]'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${
              currentView === 'dashboard'
                ? 'text-[#0D9488] bg-[#E7F5F2]'
                : 'text-[#64748B] hover:text-[#16324A] hover:bg-[#F7FAF9]'
            }`}
          >
            Dashboard
          </button>

          <div className="h-4 w-[1px] bg-[#E5ECEA] mx-1" />

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-btn text-xs shadow-teal-glow transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Report</span>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0D9488] text-white font-semibold rounded-btn text-xs shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#64748B] hover:text-[#16324A] hover:bg-[#F7FAF9] rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5ECEA] bg-white px-4 py-3 space-y-1.5 animate-fadeIn shadow-card">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
              currentView === 'landing' ? 'bg-[#E7F5F2] text-[#0D9488]' : 'text-[#64748B] hover:bg-[#F7FAF9]'
            }`}
          >
            <span>About ReportSaathi</span>
            {currentView === 'landing' && <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />}
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
              currentView === 'dashboard' ? 'bg-[#E7F5F2] text-[#0D9488]' : 'text-[#64748B] hover:bg-[#F7FAF9]'
            }`}
          >
            <span>Patient Dashboard</span>
            {currentView === 'dashboard' && <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />}
          </button>
          <button
            onClick={() => {
              onOpenUpload();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg bg-[#0D9488] text-white transition-colors flex items-center justify-between"
          >
            <span>Upload New Report</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
