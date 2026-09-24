import React, { useState } from 'react';
import SeverityBadge from '../common/SeverityBadge';

const CorrelationGroup = ({ cluster }) => {
  const [expanded, setExpanded] = useState(false);
  const entity = cluster.entity || {};
  return <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
    <button onClick={() => setExpanded(!expanded)} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 0, color: 'var(--text-primary)', padding: '16px 20px', cursor: 'pointer' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .7fr 1.3fr 1fr .7fr', gap: 12, alignItems: 'center' }}><strong>{entity.agent_name || 'N/A'}</strong><span>{cluster.event_count ?? 'N/A'} events</span><span>{(cluster.rule_ids || []).join(', ') || 'N/A'}</span><span>{(cluster.decoders || []).join(', ') || 'N/A'}</span><SeverityBadge severity={cluster.maximum_severity} /></div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 8 }}>{cluster.correlation_reason || 'N/A'} {expanded ? '−' : '+'}</div>
    </button>
    {expanded && <div style={{ borderTop: '1px solid var(--border-color)', padding: '14px 20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}><div>Agent ID: {entity.agent_id || 'N/A'} | IP: {entity.agent_ip || 'N/A'} | High severity events: {cluster.high_severity_count ?? 'N/A'}</div><div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>{(cluster.event_ids || []).map((eventId) => <span key={eventId} style={{ fontFamily: 'var(--font-mono)', border: '1px solid var(--border-color)', padding: '4px 6px', borderRadius: 4 }}>{eventId}</span>)}</div></div>}
  </div>;
};
export default CorrelationGroup;
