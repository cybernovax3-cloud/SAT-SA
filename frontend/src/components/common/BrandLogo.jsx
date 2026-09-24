import React from 'react';

const BrandLogo = ({ compact = false, showText = true, textSize = '1rem' }) => {
  const svg = (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      style={{
        width: compact ? 28 : 52,
        height: compact ? 28 : 52,
        display: 'block'
      }}
    >
      <defs>
        <linearGradient id="socvisionShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="45%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path
        d="M80 14c12 8 29 13 46 14v36c0 33-19 60-46 78-27-18-46-45-46-78V28c17-1 34-6 46-14Z"
        fill="none"
        stroke="url(#socvisionShield)"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d="M53 56c7 7 15 10 27 10s20-3 27-10"
        fill="none"
        stroke="url(#socvisionShield)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M52 87c10-9 20-14 28-14 13 0 24 9 28 14 0 0-12 23-28 23-16 0-28-23-28-23Z"
        fill="none"
        stroke="url(#socvisionShield)"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="81" r="11" fill="url(#socvisionShield)" opacity="0.9" />
      <circle cx="80" cy="81" r="4" fill="#ffffff" />
      <path
        d="M80 35v9M80 125v9M35 80h9M116 80h9"
        stroke="#0ea5e9"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );

  if (!showText) {
    return svg;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 8 : 12 }}>
      {svg}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: textSize, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
          SAT-SA
        </span>
      </div>
    </div>
  );
};

export default BrandLogo;
