import React from 'react';

/**
 * StatusBadge - Severity indicator badge.
 * @param {'success'|'warning'|'danger'|'info'} variant
 */
const StatusBadge = ({ variant = 'info', children }) => {
  const getStyle = () => {
    switch (variant) {
      case 'success':
        return { color: 'var(--success)', bg: 'var(--success-bg)' };
      case 'warning':
        return { color: 'var(--warning)', bg: 'var(--warning-bg)' };
      case 'danger':
        return { color: 'var(--danger)', bg: 'var(--danger-bg)' };
      case 'info':
      default:
        return { color: 'var(--info)', bg: 'var(--info-bg)' };
    }
  };

  const colors = getStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: colors.color,
      backgroundColor: colors.bg,
      border: `1px solid rgba(${colors.color === 'var(--success)' ? '16, 185, 129' : colors.color === 'var(--warning)' ? '245, 158, 11' : '239, 68, 68'}, 0.2)`
    }}>
      {children}
    </span>
  );
};

export default StatusBadge;
