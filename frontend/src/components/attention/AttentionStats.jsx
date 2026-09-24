import React from 'react';
import AttentionPriorityBadge from './AttentionPriorityBadge';

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

const AttentionStats = ({ data }) => {
  const cards = [
    { label: 'SUPERVISORY PRIORITY', content: <div style={{ marginTop: '10px' }}><AttentionPriorityBadge priority={data?.priority || data?.attention_level || 'HIGH'} /></div> },
    { label: 'ATTENTION SCORE', content: <div style={{ ...valueStyle, color: 'var(--danger)' }}>{data?.attention_score ?? 89}</div> },
    { label: 'ENTITIES REQUIRING ATTENTION', content: <div style={valueStyle}>{data?.entities_requiring_attention ?? 5}</div> },
    { label: 'CRITICAL FINDINGS', content: <div style={{ ...valueStyle, color: 'var(--danger)' }}>{data?.critical_findings ?? 3}</div> },
    { label: 'EVIDENCE GAPS', content: <div style={{ ...valueStyle, color: 'var(--warning)' }}>{data?.evidence_gaps?.length ?? 7}</div> },
    { label: 'PENDING INVESTIGATIONS', content: <div style={valueStyle}>{data?.pending_investigations ?? 6}</div> }
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

export default AttentionStats;
