import React from 'react';

const cardStyle = { background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '16px 20px' };

const BaselineStats = ({ data }) => {
  const entities = Object.values(data?.entities || {});
  const rules = new Set(entities.flatMap((entity) => Object.keys(entity.rule_distribution || {})));
  const decoders = new Set(entities.flatMap((entity) => Object.keys(entity.decoder_distribution || {})));
  const cards = [
    ['MONITORED AGENTS', entities.length],
    ['TOTAL EVENTS', data?.total_events ?? 0],
    ['UNIQUE RULES', rules.size],
    ['UNIQUE DECODERS', decoders.size]
  ];
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
    {cards.map(([label, value]) => <div key={label} style={cardStyle}><div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</div><div style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 700, marginTop: 8 }}>{value}</div></div>)}
  </div>;
};
export default BaselineStats;
