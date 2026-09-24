import React from 'react';

const LoadingState = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '12px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading node statistics...</span>
    </div>
  );
};

export default LoadingState;
