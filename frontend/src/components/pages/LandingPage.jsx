import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HeartPulse,
  MessageSquare,
  FileText,
  UploadCloud,
  Check,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function LandingPage({ onGoToDashboard, onQuickUploadDemo, onOpenUpload }) {
  const supportedTests = [
    { 
      title: "Complete Blood Count (CBC)", 
      desc: "Hemoglobin, White Blood Cells, Platelets, RBC, MCV & Hematocrit",
      tag: "Blood Wellness"
    },
    { 
      title: "Lipid Profile (Cholesterol)", 
      desc: "Total Cholesterol, HDL ('Good'), LDL ('Bad') & Triglycerides",
      tag: "Heart Health"
    },
    { 
      title: "Liver Function Test (LFT)", 
      desc: "SGOT (AST), SGPT (ALT), Bilirubin & Alkaline Phosphatase",
      tag: "Hepatic"
    },
    { 
      title: "Metabolic & Blood Glucose", 
      desc: "Fasting Blood Sugar, Post-Prandial, HbA1c & Electrolytes",
      tag: "Metabolism"
    },
    { 
      title: "Thyroid Profile", 
      desc: "TSH, Free T3 & Free T4 hormonal balance indicators",
      tag: "Endocrine"
    },
    { 
      title: "Kidney Function (KFT)", 
      desc: "Serum Creatinine, Blood Urea Nitrogen (BUN) & eGFR filtration",
      tag: "Renal"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Upload Your Report",
      desc: "Upload a digital PDF or take a photograph of your laboratory report. Supports PDF, JPG and PNG slips up to 10 MB.",
      icon: UploadCloud
    },
    {
      num: "02",
      title: "Understand Your Results",
      desc: "Complex laboratory terminology is translated into accessible, everyday explanations grounded strictly in your test numbers.",
      icon: Activity
    },
    {
      num: "03",
      title: "Prepare for Your Doctor Visit",
      desc: "Receive thoughtful questions to discuss with your healthcare professional so you feel confident and informed.",
      icon: MessageSquare
    }
  ];

  return (
    <div className="space-y-20 py-4 animate-fadeIn">
      {/* A. Hero Section — 2 Column Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 sm:pt-6">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#E7F5F2] text-[#0F766E] border border-[#CCFBEF]">
            <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Educational Companion for Patients & Families</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#16324A] leading-[1.12] tracking-tight">
            Medical lab reports, explained in{' '}
            <span className="text-[#0D9488]">plain language</span>.
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl font-normal">
            Laboratory reports can be confusing. ReportSaathi helps translate complex medical terminology into clear, everyday explanations so you can better understand your results and prepare informed questions for your doctor.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onOpenUpload || onGoToDashboard}
              className="px-6 py-3.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-btn shadow-teal-glow transition-all flex items-center justify-center gap-2 text-sm group active:scale-[0.98]"
            >
              <span>Upload Your Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onQuickUploadDemo("rep-cbc-001")}
              className="px-5 py-3.5 bg-white hover:bg-[#EFF6F5] text-[#16324A] font-semibold rounded-btn border border-[#E5ECEA] transition-all flex items-center justify-center gap-2 text-sm shadow-subtle"
            >
              <Activity className="w-4 h-4 text-[#0D9488]" />
              <span>Try Sample CBC Report</span>
            </button>
          </div>

          {/* B. Compact Trust Indicators */}
          <div className="pt-4 border-t border-[#E5ECEA] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D9488] shrink-0" />
              <span>100% Non-Diagnostic</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0D9488] shrink-0" />
              <span>PDF, JPG & PNG Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
              <span>Prepares Doctor Questions</span>
            </div>
          </div>
        </div>

        {/* Right Column: Fictional Sample Lab Report Preview Composition */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md bg-white rounded-card border border-[#E5ECEA] shadow-card overflow-hidden">
            {/* Header of preview card */}
            <div className="p-4 sm:p-5 border-b border-[#E5ECEA] bg-[#F7FAF9] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                    Sample Laboratory Report
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#16324A] mt-0.5">
                  Complete Blood Count (CBC)
                </h4>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8] rounded-md">
                Fictional Preview
              </span>
            </div>

            {/* Test value rows */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Row 1: Hemoglobin (Mild low) */}
              <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E5ECEA] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#16324A]">Hemoglobin</span>
                    <span className="text-[10px] text-[#64748B] ml-1.5">(Oxygen carrier)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF7E6] text-[#92400E] border border-[#FEEBC8]">
                    <ArrowDownRight className="w-3 h-3 text-[#D97706]" /> Below Range
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-sm text-[#16324A] tabular-nums">
                    11.2 <span className="font-sans font-normal text-xs text-[#64748B]">g/dL</span>
                  </span>
                  <span className="text-[11px] text-[#64748B]">Ref: 13.0 - 17.0 g/dL</span>
                </div>
                {/* Horizontal Range Meter */}
                <div className="h-1.5 w-full bg-[#E5ECEA] rounded-full overflow-hidden flex">
                  <div className="w-[20%] bg-[#F59E0B]/70" />
                  <div className="w-[60%] bg-[#10B981]/30" />
                  <div className="w-[20%] bg-[#EF4444]/30" />
                </div>
              </div>

              {/* Row 2: WBC Count (Normal) */}
              <div className="p-3 rounded-xl bg-[#F7FAF9] border border-[#E5ECEA] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#16324A]">Total WBC Count</span>
                    <span className="text-[10px] text-[#64748B] ml-1.5">(Immune cells)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    <Check className="w-3 h-3 text-[#059669]" /> Within Range
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-sm text-[#16324A] tabular-nums">
                    6,800 <span className="font-sans font-normal text-xs text-[#64748B]">cells/mcL</span>
                  </span>
                  <span className="text-[11px] text-[#64748B]">Ref: 4,000 - 11,000</span>
                </div>
                {/* Horizontal Range Meter */}
                <div className="h-1.5 w-full bg-[#E5ECEA] rounded-full overflow-hidden flex">
                  <div className="w-[20%] bg-[#F59E0B]/30" />
                  <div className="w-[60%] bg-[#10B981]/70" />
                  <div className="w-[20%] bg-[#EF4444]/30" />
                </div>
              </div>

              {/* Callout: Plain-Language Translation Badge */}
              <div className="p-3.5 rounded-xl bg-[#E7F5F2] border border-[#CCFBEF] text-[#16324A] text-xs space-y-1 shadow-subtle">
                <div className="flex items-center gap-1.5 text-[#0F766E] font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Plain-Language Translation</span>
                </div>
                <p className="text-xs text-[#172B3A] leading-relaxed">
                  <strong>Hemoglobin</strong> carries oxygen to all your tissues. When it is slightly low, doctors often explore dietary iron levels or hydration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* C. How ReportSaathi Works */}
      <section className="bg-white rounded-card p-8 sm:p-12 border border-[#E5ECEA] shadow-card space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] bg-[#E7F5F2] px-3 py-1 rounded-md">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16324A]">
            Understanding your reports, made simpler.
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            From confusing medical papers to clear, supportive explanations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#F7FAF9] hover:bg-[#EFF6F5] rounded-card p-6 border border-[#E5ECEA] transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#0D9488] border border-[#E5ECEA] flex items-center justify-center font-bold text-sm shadow-subtle group-hover:border-[#0D9488] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-black text-2xl text-[#CBD5E1] group-hover:text-[#0D9488]/40 transition-colors">
                    {s.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#16324A] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* D. Supported Tests Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] bg-[#E7F5F2] px-3 py-1 rounded-md">
            Common Tests
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16324A]">
            Laboratory Panels You Can Analyze
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            ReportSaathi focuses on routine outpatient laboratory reports with explicit reference intervals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {supportedTests.map((test, idx) => (
            <div 
              key={idx} 
              className="bg-white hover:border-[#0D9488] rounded-card p-5 border border-[#E5ECEA] transition-all shadow-subtle flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#64748B] bg-[#F7FAF9] px-2 py-0.5 rounded border border-[#E5ECEA]">
                    {test.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#16324A] group-hover:text-[#0D9488] transition-colors">
                  {test.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {test.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E. Educational Philosophy Callout */}
      <section className="bg-[#FFF7E6] border border-[#FEEBC8] rounded-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FEF3C7] rounded-xl text-[#D97706] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-[#78350F]">
            <h3 className="font-heading font-bold text-base text-[#92400E]">
              Understanding your reports is the first step. Your doctor remains your best guide.
            </h3>
            <p className="leading-relaxed">
              ReportSaathi was created to bridge health literacy gaps. Reference intervals differ across testing laboratories, equipment, age groups, and physiological conditions. 
              <strong> ReportSaathi is not a diagnostic device, clinical decision system, or medical doctor.</strong> Always share your laboratory results with your primary healthcare provider.
            </p>
          </div>
        </div>
      </section>

      {/* F. Final CTA */}
      <section className="bg-gradient-to-tr from-[#16324A] to-[#0F766E] rounded-card p-8 sm:p-12 text-white text-center space-y-6 shadow-card">
        <div className="max-w-xl mx-auto space-y-2.5">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to understand your lab report?
          </h2>
          <p className="text-xs sm:text-sm text-[#E7F5F2] leading-relaxed font-normal">
            Upload your report and explore a simpler way to understand laboratory terminology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenUpload || onGoToDashboard}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#0D9488] hover:bg-[#14B8A6] text-white font-semibold rounded-btn shadow-teal-glow transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Upload Your Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onQuickUploadDemo("rep-cbc-001")}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-btn border border-white/20 transition-all text-sm"
          >
            Explore Sample Report
          </button>
        </div>
      </section>
    </div>
  );
}
