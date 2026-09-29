import React from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  helperText?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  helperText,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl border border-[#B8A48D]/50 bg-[#E8DED2] transition-all duration-300 shadow-sm ${
        onClick
          ? 'cursor-pointer hover:border-[#5B5045] hover:-translate-y-1 hover:shadow-md hover:bg-[#E2D6C8]'
          : ''
      }`}
    >
      <div className="text-[11px] font-mono uppercase tracking-widest text-[#5B5045] font-semibold">
        {label}
      </div>
      <div className="mt-2 text-3xl sm:text-4xl font-mono tabular-nums font-bold tracking-tight text-[#342F2A]">
        {value}
      </div>
      {helperText && (
        <div className="mt-1.5 text-xs text-[#7E7266] leading-snug">
          {helperText}
        </div>
      )}
    </div>
  );
};
