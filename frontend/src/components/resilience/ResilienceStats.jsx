import React from 'react';
import ResilienceStatusBadge from './ResilienceStatusBadge';

const cardStyle = {
  background: 'var(--bg-dark)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius)',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const labelStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.05em'
};

const valueStyle = {
  color: 'var(--text-primary)',
  fontSize: '1.75rem',
  fontWeight: 700,
  marginTop: '8px'
};

const ResilienceStats = ({ data }) => {
  const cards = [
    { label: 'OVERALL RESILIENCE', content: <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}><span style={{ ...valueStyle, marginTop: 0, color: 'var(--warning)' }}>{data?.resilience_score ?? 61}</span><ResilienceStatusBadge level={data?.resilience_level || 'MODERATE'} /></div> },
    { label: 'DETECTION CAPABILITY', content: <div style={{ ...valueStyle, color: 'var(--primary)' }}>{data?.detection_capability ?? 72}</div> },
    { label: 'RESPONSE CAPABILITY', content: <div style={{ ...valueStyle, color: 'var(--primary)' }}>{data?.response_capability ?? 64}</div> },
    { label: 'RECOVERY CAPABILITY', content: <div style={{ ...valueStyle, color: 'var(--warning)' }}>{data?.recovery_capability ?? 55}</div> },
    { label: 'EVIDENCE QUALITY', content: <div style={{ ...valueStyle, color: 'var(--success)' }}>{data?.evidence_quality ?? 61}</div> },
    { label: 'OPERATIONAL RESILIENCE', content: <div style={valueStyle}>{data?.operational_resilience ?? 63}</div> }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px'
    }}>
      {cards.map((card, idx) => (
        <div key={idx} style={cardStyle}>
          <div style={labelStyle}>{card.label}</div>
          {card.content}
        </div>
      ))}
    </div>
  );
};

export default ResilienceStats;
