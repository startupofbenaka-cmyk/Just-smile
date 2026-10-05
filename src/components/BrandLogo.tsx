import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  hideText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  hideText = false
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13'
  };

  const titleSizes = {
    sm: 'text-base font-black',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black'
  };

  const badgeSizes = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] tracking-wider px-1.5 py-0.5',
    lg: 'text-xs tracking-widest px-2 py-0.5'
  };

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none">
      {/* Modern Dental Smile Emblem Icon */}
      <div
        className={`${iconSizes[size]} rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 p-0.5 shadow-md flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-slate-950/20 backdrop-blur-xs flex items-center justify-center p-1.5">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white"
          >
            {/* Elegant stylized curved enamel tooth shape */}
            <path
              d="M16 4C11.5 4 8 7 8 11.5C8 14.5 9.5 17 10.5 20C11.5 23 12 28 14 28C15.5 28 15.5 24.5 16 23C16.5 24.5 16.5 28 18 28C20 28 20.5 23 21.5 20C22.5 17 24 14.5 24 11.5C24 7 20.5 4 16 4Z"
              fill="url(#toothGrad)"
              opacity="0.9"
            />
            {/* Radiant smile arc */}
            <path
              d="M10 13.5C11.5 17 14 18.5 16 18.5C18 18.5 20.5 17 22 13.5"
              stroke="#38BDF8"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Aesthetic micro-sparkle */}
            <path
              d="M21 7L21.8 9.2L24 10L21.8 10.8L21 13L20.2 10.8L18 10L20.2 9.2L21 7Z"
              fill="#FDE047"
            />
            <defs>
              <linearGradient id="toothGrad" x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.7" stopColor="#E0F2FE" />
                <stop offset="1" stopColor="#BAE6FD" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Name & Dental Clinic designation ONLY - NO location detail */}
      {!hideText && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
            <span
              className={`${titleSizes[size]} tracking-tight font-heading ${
                isDark ? 'text-slate-900' : 'text-white'
              }`}
            >
              JUST SMILE
            </span>
            <span
              className={`${badgeSizes[size]} font-extrabold uppercase rounded font-heading ${
                isDark
                  ? 'bg-blue-100 text-blue-900 border border-blue-200/60'
                  : 'bg-sky-400/20 text-sky-200 border border-sky-300/30'
              }`}
            >
              Dental Clinic
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
