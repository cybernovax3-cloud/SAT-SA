import React from 'react';

/**
 * SeverityBadge - Standardized severity level renderer.
 * @param {string|number} severity
 */
const SeverityBadge = ({ severity }) => {
  const getBadgeStyle = (sev) => {
    // Standardize to numeric or string representation
    const num = Number(sev);
    if (!isNaN(num)) {
      if (num >= 10) return { label: 'CRITICAL', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' };
      if (num >= 7) return { label: 'HIGH', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.05)' };
      if (num >= 4) return { label: 'MEDIUM', color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)' };
      return { label: 'LOW', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.05)' };
    }

    const str = String(sev).toUpperCase();
    if (str === 'CRITICAL' || str === 'HIGH') {
      return { label: str, color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' };
    }
    if (str === 'MEDIUM' || str === 'WARNING') {
      return { label: str, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)' };
    }
    return { label: str || 'LOW', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.05)' };
  };

  const style = getBadgeStyle(severity);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      color: style.color,
      backgroundColor: style.bg,
      border: `1px solid rgba(255,255,255,0.02)`
    }}>
      {style.label}
    </span>
  );
};

export default SeverityBadge;
