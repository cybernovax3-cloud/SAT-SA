import React from 'react';

const sectionStyle = {
  background: 'var(--bg-dark)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius)',
  padding: '20px'
};

const ResilienceDetails = ({ data }) => {
  const entities = data?.entities || [
    { entity: 'TELECOM-CORE-01', score: 58, level: 'MEDIUM', detection: 70, response: 58, recovery: 50 },
    { entity: 'HEALTHNET-04', score: 62, level: 'MEDIUM', detection: 74, response: 62, recovery: 54 },
    { entity: 'CORENET-02', score: 64, level: 'MEDIUM', detection: 71, response: 66, recovery: 58 },
    { entity: 'FINANCE-07', score: 75, level: 'HIGH', detection: 82, response: 76, recovery: 70 },
    { entity: 'ENERGY-03', score: 79, level: 'HIGH', detection: 85, response: 80, recovery: 74 },
    { entity: 'GOV-SEC-05', score: 60, level: 'MEDIUM', detection: 68, response: 60, recovery: 52 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600 }}>ENTITY RESILIENCE ASSESSMENT</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Synchronized Entity Baseline</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 10px' }}>Entity</th>
                <th style={{ padding: '12px 10px' }}>Resilience Score</th>
                <th style={{ padding: '12px 10px' }}>Level</th>
                <th style={{ padding: '12px 10px' }}>Detection</th>
                <th style={{ padding: '12px 10px' }}>Response</th>
                <th style={{ padding: '12px 10px' }}>Recovery</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--primary)' }}>
                    {item.entity}
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.score >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                    {item.score}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: item.level === 'HIGH' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: item.level === 'HIGH' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {item.level}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)' }}>{item.detection} / 100</td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)' }}>{item.response} / 100</td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)' }}>{item.recovery} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: '0.95rem', marginBottom: '14px', fontWeight: 600 }}>RESILIENCE ASSESSMENT CONTEXT</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.85rem' }}>
          Resilience scores evaluate defensive telemetry coverage, incident containment velocity, recovery readiness, and evidence fidelity across monitored SOC assets. Monitored telecommunications and core networking clusters currently show constrained recovery readiness due to active containment operations.
        </p>
        <div style={{ marginTop: '12px', color: 'var(--text-primary)', fontSize: '0.82rem' }}>
          Current supervisory status: <strong>{data?.resilience_level || 'MODERATE'}</strong> ({data?.resilience_score ?? 61} / 100)
        </div>
      </section>
    </div>
  );
};

export default ResilienceDetails;
