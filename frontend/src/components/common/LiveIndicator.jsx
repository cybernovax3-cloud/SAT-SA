import React from 'react';

/**
 * LiveIndicator - Displays a pulse circle representing API or operational state.
 * @param {'LIVE'|'CONNECTING'|'OFFLINE'} status
 */
const LiveIndicator = ({ status = 'LIVE' }) => {
  const currentStatus = status.toUpperCase();

  const getStatusClass = () => {
    switch (currentStatus) {
      case 'LIVE':
        return 'live';
      case 'CONNECTING':
        return 'connecting';
      case 'OFFLINE':
      default:
        return 'offline';
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'LIVE':
        return 'var(--success)';
      case 'CONNECTING':
        return 'var(--warning)';
      case 'OFFLINE':
      default:
        return 'var(--danger)';
    }
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      color: getStatusColor()
    }}>
      <span className={`pulse-dot ${getStatusClass()}`}></span>
      <span>{currentStatus}</span>
    </div>
  );
};

export default LiveIndicator;
