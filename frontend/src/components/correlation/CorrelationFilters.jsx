import React from 'react';
import { Search, X } from 'lucide-react';

const CorrelationFilters = ({ search, setSearch, severity, setSeverity, agent, setAgent, severities, agents, onClear }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 16 }}>
    <div style={{ position: 'relative', flex: '1 1 260px' }}><Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} /><input aria-label="Search correlation" placeholder="Search correlation..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' }} /></div>
    <select aria-label="Severity" value={severity} onChange={(event) => setSeverity(event.target.value)} style={{ padding: 8, background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' }}><option value="All">Severity: All</option>{severities.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    <select aria-label="Agent" value={agent} onChange={(event) => setAgent(event.target.value)} style={{ padding: 8, background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' }}><option value="All">Agent: All</option>{agents.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    {(search || severity !== 'All' || agent !== 'All') && <button onClick={onClear} style={{ display: 'inline-flex', gap: 5, alignItems: 'center', padding: 8, color: 'var(--danger)', background: 'transparent', border: 0, cursor: 'pointer' }}><X size={14} /> Clear Filters</button>}
  </div>
);
export default CorrelationFilters;
