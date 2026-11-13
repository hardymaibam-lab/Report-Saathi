import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <aside aria-label="Medical disclaimer" className="bg-[#FFF7E6] border-b border-[#FEEBC8] px-4 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center sm:justify-start text-xs text-[#92400E] gap-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5 sm:mt-0" />
        <span className="leading-tight text-center sm:text-left">
          <strong className="font-semibold text-[#78350F]">Educational Tool Only:</strong>{' '}
          ReportSaathi is designed to explain medical lab reports in simple language. It does not provide medical diagnoses or treatment recommendations. Always discuss results with a qualified healthcare professional.
        </span>
      </div>
    </aside>
  );
}
