import React from 'react';
import SeverityBadge from './SeverityBadge';

const RecentFindings = ({ findings = [] }) => {
  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h3 style={{
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        marginBottom: '4px'
      }}>
        Recent Findings
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {findings.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No findings currently available.
          </div>
        ) : (
          findings.map((finding) => (
            <div
              key={finding.finding_id}
              style={{
                background: 'var(--bg-darker)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {finding.title}
                </h4>
                <SeverityBadge severity={finding.severity} />
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {finding.explanation}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '8px',
                color: 'var(--text-muted)'
              }}>
                <div>
                  Entity: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{finding.affected_entity || 'unknown'}</span>
                </div>
                <div>
                  Risk Score: <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{finding.risk_score}</span>
                </div>
                <div>
                  Confidence: <span style={{ color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{Math.round(finding.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentFindings;
