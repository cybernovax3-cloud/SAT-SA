import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import EvidenceDetails from './EvidenceDetails';

const formatTime = (value) => { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString(); };

const EvidenceTable = ({ evidence = [] }) => {
  const [sort, setSort] = useState('timestamp');
  const [ascending, setAscending] = useState(false);
  const [selected, setSelected] = useState(null);
  const sorted = useMemo(() => [...evidence].sort((left, right) => {
    const getValue = (item) => sort === 'severity' ? Number(item.rule?.severity || 0) : sort === 'agent' ? item.agent?.name || '' : sort === 'rule' ? String(item.rule?.id || '') : new Date(item.timestamp || 0).getTime();
    const a = getValue(left); const b = getValue(right);
    return (a < b ? -1 : a > b ? 1 : 0) * (ascending ? 1 : -1);
  }), [evidence, sort, ascending]);
  const toggle = (field) => { if (sort === field) setAscending((value) => !value); else { setSort(field); setAscending(false); } };
  const header = (label, field) => <th onClick={() => toggle(field)} style={{ textAlign: 'left', padding: '10px 8px', cursor: 'pointer' }}>{label} {sort === field && (ascending ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}</th>;

  return <div style={{ overflowX: 'auto', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 }}><table style={{ width: '100%', minWidth: 780, borderCollapse: 'collapse', fontSize: '0.82rem' }}><thead><tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>{header('Timestamp', 'timestamp')}{header('Agent', 'agent')}{header('Rule', 'rule')}<th style={{ textAlign: 'left', padding: '10px 8px' }}>Severity</th><th style={{ textAlign: 'left', padding: '10px 8px' }}>Decoder</th><th style={{ textAlign: 'left', padding: '10px 8px' }}>Quality</th></tr></thead><tbody>{sorted.map((item) => <React.Fragment key={item.event_id}><tr onClick={() => setSelected(selected === item.event_id ? null : item.event_id)} style={{ borderBottom: '1px solid rgba(255,255,255,.05)', cursor: 'pointer', color: 'var(--text-primary)' }}><td style={{ padding: '11px 8px', whiteSpace: 'nowrap' }}>{formatTime(item.timestamp)}</td><td style={{ padding: '11px 8px' }}>{item.agent?.name || ''}</td><td style={{ padding: '11px 8px' }}>{item.rule?.id || ''}</td><td style={{ padding: '11px 8px' }}><SeverityBadge severity={item.rule?.severity} /></td><td style={{ padding: '11px 8px' }}>{item.decoder || ''}</td><td style={{ padding: '11px 8px' }}>{item.evidence_quality || ''}</td></tr>{selected === item.event_id && <tr><td colSpan="6"><EvidenceDetails item={item} /></td></tr>}</React.Fragment>)}</tbody></table>{!sorted.length && <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>No evidence matches the current filters.</div>}</div>;
};

export default EvidenceTable;