import React from 'react';
import { API_BASE_URL, isDemoModeEnabled } from '../../api/api';

const StatusBar = () => {
  const demoMode = isDemoModeEnabled();

  return (
    <footer style={{
      height: 'var(--statusbar-height)',
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: '0.7rem',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
      zIndex: 15
    }}>
      <div>
        <span>SAT-SA v0.1.0</span>
      </div>
      <div>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: demoMode ? '#fbbf24' : 'var(--success)' }}></span>
          {demoMode ? 'SIMULATED SOC EVIDENCE — DEMO MODE' : 'System Operational'}
        </span>
      </div>
      <div>
          <span>API: <span style={{ color: 'var(--text-secondary)' }}>{API_BASE_URL}</span></span>
      </div>
    </footer>
  );
};

export default StatusBar;
