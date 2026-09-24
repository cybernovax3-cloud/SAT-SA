import React from 'react';

const CorrelationStats = ({ data }) => {
  const clusters = data?.clusters || [];
  const uniqueEntities = new Set(clusters.map((cluster) => cluster.entity?.agent_id).filter(Boolean)).size;
  const uniqueRules = new Set(clusters.flatMap((cluster) => cluster.rule_ids || [])).size;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
      {[['CORRELATED GROUPS', data?.correlated_clusters ?? 0], ['EVENTS ANALYZED', data?.total_events ?? 0], ['ENTITIES', uniqueEntities], ['UNIQUE RULES', uniqueRules]].map(([label, value]) => (
        <div key={label} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '16px 20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</div>
          <div style={{ color: 'var(--text-primary)', fontSize: '1.75rem', fontWeight: 700, marginTop: 8 }}>{value}</div>
        </div>
      ))}
    </div>
  );
};
export default CorrelationStats;
