import React from 'react';

/**
 * SystemStatus - Renders status details for backend resources.
 */
const SystemStatus = () => {
  // Mocked connection status configuration (readily bound to API indicators later)
  const systemNodes = [
    { name: 'FastAPI', status: 'Connected', badge: 'success' },
    { name: 'Wazuh', status: 'Connected', badge: 'success' },
    { name: 'Analytics', status: 'Operational', badge: 'success' },
    { name: 'Frontend', status: 'Operational', badge: 'success' }
  ];

  return (
    <div style={{
      background: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%',
      maxWidth: '360px'
    }}>
      <h3 style={{
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '8px'
      }}>
        System Status
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {systemNodes.map((node) => (
          <div
            key={node.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{node.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)'
              }}></span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{node.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;
