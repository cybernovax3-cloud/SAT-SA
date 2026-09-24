import React, { useState } from 'react';

const fields = (item) => [
  ['Event ID', item.event_id], ['Timestamp', item.timestamp], ['Agent', item.agent?.name], ['Agent ID', item.agent?.id],
  ['Agent IP', item.agent?.ip], ['Rule', item.rule?.id], ['Severity', item.rule?.severity], ['Decoder', item.decoder],
  ['Location', item.location], ['Description', item.rule?.description], ['Evidence Quality', item.evidence_quality],
].filter(([, value]) => value !== undefined && value !== null && value !== '');

const EvidenceDetails = ({ item }) => {
  const [tab, setTab] = useState(item.normalized_log ? 'normalized' : 'raw');
  const hasNormalized = Boolean(item.normalized_log);
  const hasRaw = Boolean(item.full_log || item.raw_log);
  const content = tab === 'normalized' ? item.normalized_log : (item.full_log || item.raw_log);

  return <div style={{ borderTop: '1px solid var(--border-color)', padding: 18, background: 'var(--bg-darker)', display: 'grid', gap: 12 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px 18px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
      {fields(item).map(([label, value]) => <div key={label}><span style={{ color: 'var(--text-muted)' }}>{label}</span><div style={{ color: 'var(--text-primary)', marginTop: 3, wordBreak: 'break-word' }}>{String(value)}</div></div>)}
    </div>
    {(hasNormalized || hasRaw) && <div><div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>{hasNormalized && <button onClick={() => setTab('normalized')} aria-pressed={tab === 'normalized'}>NORMALIZED</button>}{hasRaw && <button onClick={() => setTab('raw')} aria-pressed={tab === 'raw'}>RAW</button>}</div><pre style={{ margin: 0, padding: 12, whiteSpace: 'pre-wrap', overflowX: 'auto', userSelect: 'text', color: '#a7f3d0', background: 'var(--bg-dark)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{content}</pre></div>}
  </div>;
};

export default EvidenceDetails;