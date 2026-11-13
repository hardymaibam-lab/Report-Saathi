import React, { useState, useEffect } from 'react';
import LandingPage from './components/pages/LandingPage';
import DashboardPage from './components/pages/DashboardPage';
import ResultsPage from './components/pages/ResultsPage';
import UploadArea from './components/common/UploadArea';
import DisclaimerBanner from './components/common/DisclaimerBanner';
import MainNavbar from './components/common/MainNavbar';
import MainFooter from './components/common/MainFooter';
import { MOCK_REPORTS } from './data/mockReports';
import { analyzeReportFile, checkHealth, fetchSavedReports } from './lib/api';
import { 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [reportsList, setReportsList] = useState(MOCK_REPORTS);
  const [activeReport, setActiveReport] = useState(MOCK_REPORTS[0]);
  const [loadingStep, setLoadingStep] = useState('Preparing your report...');
  const [backendHealth, setBackendHealth] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Check backend health on initial load
    checkHealth().then(setBackendHealth);
    fetchSavedReports().then(saved => {
      if (saved && saved.length > 0) {
        setReportsList(prev => [...saved, ...prev]);
      }
    }).catch(() => {});
  }, []);

  const handleNavigate = (view) => {
    if (view === 'dashboard' && reportsList.length === 0) {
      setReportsList(MOCK_REPORTS);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToDashboard = () => {
    handleNavigate('dashboard');
  };

  const handleOpenUpload = () => {
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (id) => {
    const found = reportsList.find(r => r.id === id) || MOCK_REPORTS.find(r => r.id === id);
    if (found) {
      setActiveReport(found);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Connected real backend upload flow with OCR & Gemini
  const handleValidFileReady = async (file) => {
    setCurrentView('loading');
    setLoadingStep('Reading laboratory document information...');

    try {
      setTimeout(() => setLoadingStep('Extracting text and reference ranges with OCR...'), 800);
      setTimeout(() => setLoadingStep('Preparing plain-language educational explanations...'), 1800);

      const response = await analyzeReportFile(file);

      setReportsList(prev => [response, ...prev]);
      setActiveReport(response);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during report processing. Please verify the document clarity.');
      setCurrentView('error');
    }
  };

  const handleSelectDemoReport = (id) => {
    const sample = MOCK_REPORTS.find(r => r.id === id) || MOCK_REPORTS[0];
    setCurrentView('loading');
    setLoadingStep(`Organising results for ${sample.summary?.report_type || 'sample report'}...`);

    setTimeout(() => {
      setActiveReport(sample);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1000);
  };

  const handleTriggerDemoState = (stateType) => {
    switch (stateType) {
      case 'empty':
        setReportsList([]);
        setCurrentView('dashboard');
        break;
      case 'loading':
        setCurrentView('loading');
        setLoadingStep('Organising your results and plain-language notes...');
        break;
      case 'error':
        setErrorMessage('Unable to extract data: File resolution too low or unreadable text.');
        setCurrentView('error');
        break;
      case 'success':
      default:
        setActiveReport(MOCK_REPORTS[0]);
        setCurrentView('results');
        window.scrollTo({ top: 0, behavior: 'instant' });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#172B3A] selection:bg-[#ebf3ea] selection:text-[#084d46]">
      {/* 1. Global Announcement / Medical Disclaimer */}
      <DisclaimerBanner />

      {/* 2. One Medical Style Navigation Bar */}
      <MainNavbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenUpload={handleOpenUpload}
        backendHealth={backendHealth}
      />

      {/* 3. Main Dynamic Content Area */}
      <main className={`flex-1 w-full mx-auto ${
        currentView === 'landing' ? 'max-w-7xl px-4 sm:px-8 py-6' : 'max-w-6xl px-4 sm:px-6 py-6 sm:py-8'
      }`}>
        {/* Landing Page */}
        {currentView === 'landing' && (
          <LandingPage
            onGoToDashboard={handleGoToDashboard}
            onQuickUploadDemo={handleSelectDemoReport}
            onOpenUpload={handleOpenUpload}
          />
        )}

        {/* Dashboard Page */}
        {currentView === 'dashboard' && (
          <DashboardPage
            onOpenUpload={handleOpenUpload}
            reports={reportsList}
            onSelectReport={handleSelectReport}
            onTriggerDemoState={handleTriggerDemoState}
          />
        )}

        {/* Upload Page */}
        {currentView === 'upload' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#16324A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="text-center space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16324A]">
                Upload Laboratory Document
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Upload your pathology slip, blood test, or health checkup summary (PDF, JPG, or PNG).
              </p>
            </div>

            <UploadArea
              onValidFileReady={handleValidFileReady}
              onSelectDemoReport={handleSelectDemoReport}
            />
          </div>
        )}

        {/* Loading State */}
        {currentView === 'loading' && (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-5 max-w-md mx-auto animate-fadeIn">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center shadow-subtle border border-[#CCFBEF]">
                <Activity className="w-8 h-8 animate-pulse text-[#0D9488]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-subtle">
                <Loader2 className="w-4 h-4 animate-spin text-[#0D9488]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] bg-[#E7F5F2] px-2.5 py-0.5 rounded-md border border-[#CCFBEF]">
                Processing Report
              </span>
              <h2 className="font-heading text-xl font-bold text-[#16324A]">
                Translating with Educational Care
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-xs mx-auto">
                {loadingStep}
              </p>
            </div>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs text-[#94A3B8] hover:text-[#64748B] underline pt-4 transition-colors"
            >
              Cancel and return to Dashboard
            </button>
          </div>
        )}

        {/* Error State */}
        {currentView === 'error' && (
          <div className="py-16 max-w-lg mx-auto text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#FECACA] shadow-subtle">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] bg-[#FEF2F2] px-2.5 py-0.5 rounded-md border border-[#FECACA]">
                Upload Notice
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#16324A]">
                Document Could Not Be Processed
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-sm mx-auto">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleOpenUpload}
                className="w-full sm:w-auto px-6 py-3 bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold rounded-btn transition-all shadow-teal-glow"
              >
                Upload a Clearer Document
              </button>

              <button
                onClick={() => handleSelectDemoReport('rep-cbc-001')}
                className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#F7FAF9] text-[#16324A] text-xs font-semibold rounded-btn border border-[#E5ECEA] transition-all shadow-subtle"
              >
                View Sample CBC Report Instead
              </button>
            </div>
          </div>
        )}

        {/* Results Page */}
        {currentView === 'results' && (
          <ResultsPage
            report={activeReport}
            onBackToDashboard={handleGoToDashboard}
            onUploadNew={handleOpenUpload}
          />
        )}
      </main>

      {/* 4. Global Minimal Footer */}
      <MainFooter onNavigate={handleNavigate} />
    </div>
  );
}
