import React from 'react';

interface BronzeMedallionProps {
  type?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BronzeMedallion: React.FC<BronzeMedallionProps> = ({
  type = 'bronze_sphere',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none shadow-md ${sizeClasses} ${className}`}
      style={{
        background: 'radial-gradient(circle at 35% 30%, #C4A988 0%, #8C7355 45%, #544432 85%, #34281E 100%)',
        boxShadow: '0 8px 16px -3px rgba(52, 47, 42, 0.35), inset 0 2px 3px rgba(255, 245, 230, 0.45), inset 0 -2px 4px rgba(30, 20, 10, 0.6)',
      }}
    >
      {/* Metallic specular ring */}
      <div className="absolute inset-[3px] rounded-full border border-[#DFCEB8]/30 pointer-events-none" />

      {/* Stylized Emblem in Center matching the reference image icons */}
      {type === 'bronze_sphere' && (
        <svg className="w-1/2 h-1/2 text-[#F5ECE0] drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a12 12 0 0 1 0 16" />
          <path d="M4 12a12 12 0 0 0 16 0" />
        </svg>
      )}

      {type === 'bronze_lattice' && (
        <svg className="w-1/2 h-1/2 text-[#F5ECE0] drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="5" width="6" height="6" rx="1.5" />
          <rect x="13" y="5" width="6" height="6" rx="1.5" />
          <rect x="5" y="13" width="6" height="6" rx="1.5" />
          <rect x="13" y="13" width="6" height="6" rx="1.5" />
          <path d="M8 11v2M16 11v2M11 8h2M11 16h2" />
        </svg>
      )}

      {type === 'bronze_curves' && (
        <svg className="w-1/2 h-1/2 text-[#F5ECE0] drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 6c3 0 5 2 5 6s2 6 5 6" />
          <path d="M17 6c-3 0-5 2-5 6s-2 6-5 6" />
        </svg>
      )}

      {type === 'bronze_beacon' && (
        <svg className="w-1/2 h-1/2 text-[#F5ECE0] drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2v20M2 12h20" />
          <circle cx="12" cy="12" r="4" />
          <path d="m4.93 4.93 14.14 14.14M19.07 4.93 4.93 19.07" opacity="0.4" />
        </svg>
      )}
    </div>
  );
};
