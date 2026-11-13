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
  ArrowDownRight,
  ChevronRight,
  PhoneCall,
  Clock,
  Sparkle
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
      desc: "Upload a digital PDF or snap a photograph of your laboratory slip. PDF, JPG, and PNG files up to 10 MB are supported.",
      icon: UploadCloud
    },
    {
      num: "02",
      title: "Understand Your Results",
      desc: "Complex medical terminology is translated into clear, everyday explanations grounded strictly in your test's reference ranges.",
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
    <div className="space-y-24 animate-fadeIn">
      {/* ============================================================
          ONE MEDICAL REFERENCE HERO SECTION
          Split layout: Left white, Right soft sage green (#ebf3ea)
         ============================================================ */}
      <section className="relative overflow-hidden -mx-4 sm:-mx-6 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
          {/* Left Column: Pure White, Editorial Serif Heading, Clean CTAs */}
          <div className="lg:col-span-7 bg-white px-6 sm:px-12 lg:pl-16 lg:pr-10 py-12 lg:py-20 flex flex-col justify-center text-left">
            <div className="max-w-xl space-y-6 sm:space-y-8">
              {/* Main Heading in One Medical Editorial Serif Style */}
              <h1 className="font-serif text-[38px] sm:text-[50px] lg:text-[58px] xl:text-[62px] text-[#0a3d36] leading-[1.1] tracking-tight font-normal">
                Your lab reports, <br className="hidden sm:inline" />
                explained in plain language.
              </h1>

              {/* Supporting Copy */}
              <p className="text-[#4a5568] text-base sm:text-lg leading-relaxed font-normal max-w-lg">
                Understand your blood tests, make sense of laboratory terminology and prepare thoughtful questions for your next doctor&apos;s appointment.
              </p>

              {/* Pill Button CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                {/* Primary Pill Button */}
                <button
                  onClick={onOpenUpload || onGoToDashboard}
                  className="px-8 py-3.5 bg-[#084d46] hover:bg-[#063f39] text-white font-semibold rounded-full text-sm sm:text-base transition-all shadow-sm active:scale-[0.98] text-center"
                >
                  Upload your report
                </button>

                {/* Secondary Pill Button */}
                <button
                  onClick={() => onQuickUploadDemo("rep-cbc-001")}
                  className="px-7 py-3.5 bg-white hover:bg-[#ebf3ea] text-[#084d46] font-semibold rounded-full border border-[#cbd5e1] text-sm sm:text-base transition-all text-center"
                >
                  Try sample report
                </button>
              </div>

              {/* Tertiary One Medical Style Link */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('educational-philosophy');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#084d46] hover:text-[#063f39] transition-colors group"
                >
                  <span>Have questions about our educational purpose? Click here</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#e5ecea] flex flex-wrap items-center gap-6 text-xs text-[#52616b]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#084d46]" /> 100% Non-Diagnostic
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <FileText className="w-4 h-4 text-[#084d46]" /> PDF, JPG & PNG
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-4 h-4 text-[#084d46]" /> Doctor Discussion Guide
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Soft Sage-Green Background (#ebf3ea) with Layered Visual Composition */}
          <div className="lg:col-span-5 bg-[#ebf3ea] p-6 sm:p-10 lg:p-12 flex items-center justify-center relative overflow-hidden">
            <div className="relative w-full max-w-md space-y-4">
              {/* Primary Top Image: Warm, welcoming healthcare consultation */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#dce8dc] bg-white">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
                    alt="Welcoming clinician discussing laboratory results with a patient"
                    className="w-full h-full object-cover object-[center_18%]"
                    loading="eager"
                  />
                  {/* Subtle caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
                    <p className="text-xs font-semibold">Empowered conversations with your clinician</p>
                    <p className="text-[10px] text-white/80">Understand your lab numbers before your visit</p>
                  </div>
                </div>
              </div>

              {/* Overlapping Inset Card: Real ReportSaathi Translated Results Preview */}
              <div className="relative sm:-mt-12 sm:ml-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#dce8dc] shadow-xl space-y-3 z-10">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#084d46]" />
                    <span className="font-sans font-bold text-xs text-[#0a3d36]">
                      Complete Blood Count (CBC)
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ebf3ea] text-[#084d46] border border-[#dce8dc]">
                    Translated View
                  </span>
                </div>

                {/* Sample Biomarker Row */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#16324a]">Hemoglobin</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fff7e6] text-[#92400e] border border-[#feebc8]">
                      Below Range
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono font-bold text-sm text-[#0a3d36] tabular-nums">
                      11.2 <span className="font-sans font-normal text-xs text-[#64748b]">g/dL</span>
                    </span>
                    <span className="text-[11px] text-[#64748b]">Ref: 13.0 – 17.0 g/dL</span>
                  </div>
                  {/* Visual Range Meter */}
                  <div className="h-1.5 w-full bg-[#e5ecea] rounded-full overflow-hidden flex">
                    <div className="w-[20%] bg-[#f59e0b]" />
                    <div className="w-[60%] bg-[#10b981]/30" />
                    <div className="w-[20%] bg-[#ef4444]/30" />
                  </div>
                </div>

                {/* Plain-Language Callout */}
                <div className="bg-[#ebf3ea] rounded-xl p-2.5 text-[11px] text-[#0a3d36] leading-relaxed border border-[#dce8dc]">
                  <strong>What this means:</strong> Hemoglobin carries oxygen to your muscles and brain. Slightly below average is commonly discussed regarding iron intake or hydration.
                </div>

                {/* Doctor Questions Chip */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-[#084d46] font-medium">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> 3 questions generated for your doctor
                  </span>
                  <span className="text-[10px] font-bold text-[#084d46] underline cursor-pointer" onClick={() => onQuickUploadDemo("rep-cbc-001")}>
                    View &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW REPORTSAATHI WORKS — 3 STEP PROCESS
         ============================================================ */}
      <section className="bg-white rounded-3xl p-8 sm:p-14 border border-[#e5ecea] shadow-sm space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#084d46] bg-[#ebf3ea] px-3 py-1 rounded-full border border-[#dce8dc]">
            Simple 3-Step Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#0a3d36]">
            From upload to understanding in three simple steps.
          </h2>
          <p className="text-sm text-[#52616b] leading-relaxed">
            From confusing clinical slips to clear, supportive explanations you can take to your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#fafaf7] hover:bg-[#ebf3ea]/50 rounded-2xl p-7 border border-[#e5ecea] transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white text-[#084d46] border border-[#e5ecea] flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-[#084d46] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-3xl text-[#cbd5e1] group-hover:text-[#084d46]/40 transition-colors font-normal">
                    {s.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-[#0a3d36] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52616b] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          SUPPORTED TESTS GRID
         ============================================================ */}
      <section id="supported-panels" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#084d46] bg-[#ebf3ea] px-3 py-1 rounded-full border border-[#dce8dc]">
            Coverage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#0a3d36]">
            Common lab tests, explained clearly.
          </h2>
          <p className="text-sm text-[#52616b] leading-relaxed">
            ReportSaathi specializes in routine outpatient laboratory panels with printed reference intervals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportedTests.map((test, idx) => (
            <div 
              key={idx} 
              className="bg-white hover:border-[#084d46] rounded-2xl p-6 border border-[#e5ecea] transition-all shadow-sm flex flex-col justify-between group hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#ebf3ea] text-[#084d46] flex items-center justify-center">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-[#52616b] bg-[#fafaf7] px-2.5 py-0.5 rounded-full border border-[#e5ecea]">
                    {test.tag}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-base text-[#0a3d36] group-hover:text-[#084d46] transition-colors">
                  {test.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#52616b] leading-relaxed">
                  {test.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          OUR EDUCATIONAL PHILOSOPHY
         ============================================================ */}
      <section id="educational-philosophy" className="bg-[#fff7e6] border border-[#feebc8] rounded-3xl p-8 sm:p-12 scroll-mt-24">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="p-3.5 bg-[#fef3c7] rounded-2xl text-[#d97706] shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#78350F]">
            <h3 className="font-serif text-2xl font-normal text-[#92400e]">
              Understanding your reports is the first step. Your doctor remains your best guide.
            </h3>
            <p className="leading-relaxed text-[#92400e]/90 text-sm">
              ReportSaathi was created solely to bridge health literacy gaps. Reference intervals differ across testing laboratories, equipment, age groups, and physiological conditions. 
              <strong> ReportSaathi is not a diagnostic device, clinical decision system, or medical doctor.</strong> Always share your laboratory results with your primary healthcare provider.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL PREMIUM HEALTH-TECH CTA SECTION
         ============================================================ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3D38] via-[#0E4741] to-[#0B5149] border border-white/10 shadow-2xl p-8 sm:p-12 lg:p-14 text-white">
        {/* Subtle Ambient Mint Lighting */}
        <div 
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5EEAD4]/10 blur-3xl" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#0D9488]/15 blur-3xl" 
          aria-hidden="true" 
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Copy, Buttons, Reassurance */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#A7F3D0] text-xs font-medium border border-white/15 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5EEAD4]" />
              <span>Instant, Educational Lab Insights</span>
            </div>

            {/* High-Contrast Pure White Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] !text-white font-normal leading-[1.12] tracking-tight">
              Ready to understand your lab report?
            </h2>

            {/* Mint-Tinted Soft Description */}
            <p className="text-sm sm:text-base text-[#E7F5F2]/90 leading-relaxed font-normal max-w-xl">
              Upload your document and explore a simpler, clearer way to understand laboratory terminology — grounded strictly in your results and completely non-diagnostic.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={onOpenUpload || onGoToDashboard}
                className="px-7 py-3.5 bg-white hover:bg-[#F0FDF9] text-[#0B5149] font-semibold rounded-full text-sm sm:text-base transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>Upload your report</span>
                <ArrowRight className="w-4 h-4 text-[#0B5149] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onQuickUploadDemo("rep-cbc-001")}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-full border border-white/20 text-sm sm:text-base transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <span>Explore sample CBC report</span>
              </button>
            </div>

            {/* Reassurance Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#A7F3D0]/80">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#5EEAD4]" /> PDF, JPG & PNG supported
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#5EEAD4]" /> 100% Non-diagnostic
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#5EEAD4]" /> No account required to start
              </span>
            </div>
          </div>

          {/* Right Column: Refined Medical Report Simplification Visual */}
          <div className="lg:col-span-5 w-full">
            <div className="relative mx-auto max-w-sm rounded-2xl bg-white/[0.08] backdrop-blur-md p-5 border border-white/15 shadow-xl text-left space-y-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse" />
                  <span className="font-sans font-bold text-xs text-white tracking-wide">
                    Plain-Language Summary
                  </span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-[#CCFBEF] border border-white/15">
                  Sample View
                </span>
              </div>

              {/* Biomarker Row 1: Hemoglobin */}
              <div className="p-3 rounded-xl bg-black/15 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Hemoglobin (Oxygen Transport)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    Below Range
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-sm text-[#5EEAD4] tabular-nums">
                    11.2 <span className="font-sans font-normal text-xs text-white/70">g/dL</span>
                  </span>
                  <span className="text-[11px] text-white/70">Ref: 13.0 – 17.0</span>
                </div>
                {/* Horizontal Range Meter */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div className="w-[20%] bg-amber-400" />
                  <div className="w-[60%] bg-[#5EEAD4]/30" />
                  <div className="w-[20%] bg-rose-400/30" />
                </div>
              </div>

              {/* Biomarker Row 2: Platelet Count */}
              <div className="p-3 rounded-xl bg-black/15 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Platelet Count (Clotting)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    Within Range
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-mono font-bold text-sm text-white tabular-nums">
                    245,000 <span className="font-sans font-normal text-xs text-white/70">cells/mcL</span>
                  </span>
                  <span className="text-[11px] text-white/70">Ref: 150k – 450k</span>
                </div>
                {/* Horizontal Range Meter */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div className="w-[20%] bg-amber-400/30" />
                  <div className="w-[60%] bg-emerald-400" />
                  <div className="w-[20%] bg-rose-400/30" />
                </div>
              </div>

              {/* Bottom Feature Pill */}
              <div className="p-2.5 rounded-xl bg-[#5EEAD4]/10 border border-[#5EEAD4]/20 text-[11px] text-[#E7F5F2] flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#5EEAD4] shrink-0" />
                <span>Doctor discussion checklist generated automatically</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
