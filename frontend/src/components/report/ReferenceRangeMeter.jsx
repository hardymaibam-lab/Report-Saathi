import React from 'react';

/**
 * Renders a restrained, accessible horizontal reference range indicator.
 * Strictly uses provided ranges; never invents intervals.
 */
export default function ReferenceRangeMeter({ metrics, status, value, unit, referenceRange }) {
  if (!metrics || !referenceRange) {
    return (
      <span className="text-[11px] text-[#94A3B8] italic">
        No reference range stated on report
      </span>
    );
  }

  const isLow = status === 'low';
  const isHigh = status === 'high';
  const isNormal = status === 'normal';

  return (
    <div className="w-full max-w-xs space-y-1">
      {/* Visual meter bar */}
      <div className="relative h-2 w-full bg-[#E5ECEA] rounded-full overflow-hidden flex">
        {/* Low segment */}
        <div className={`w-[25%] ${isLow ? 'bg-[#F59E0B]' : 'bg-[#F59E0B]/25'}`} />
        {/* Normal segment */}
        <div className={`w-[50%] ${isNormal ? 'bg-[#10B981]' : 'bg-[#10B981]/30'}`} />
        {/* High segment */}
        <div className={`w-[25%] ${isHigh ? 'bg-[#EF4444]' : 'bg-[#EF4444]/25'}`} />

        {/* Pin indicator for current value */}
        {metrics.isValValid && (
          <div 
            className="absolute top-0 bottom-0 w-1.5 bg-[#16324A] rounded-full shadow-sm"
            style={{ left: `calc(${metrics.percent}% - 3px)` }}
            title={`Observed value: ${value} ${unit}`}
          />
        )}
      </div>

      {/* Numerical Range Labels */}
      <div className="flex items-center justify-between text-[10px] text-[#64748B] tabular-nums font-mono">
        <span>{metrics.min !== undefined ? `${metrics.min}` : 'Min'}</span>
        <span className="text-[#065F46] font-semibold">{referenceRange} {unit}</span>
        <span>{metrics.max !== undefined ? `${metrics.max}` : 'Max'}</span>
      </div>
    </div>
  );
}
