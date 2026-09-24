import React from 'react';
import { Search, X } from 'lucide-react';

const selectStyle = { padding: '9px 10px', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' };

const EvidenceFilters = ({ search, setSearch, severity, setSeverity, agent, setAgent, decoder, setDecoder, quality, setQuality, severities, agents, decoders, qualities, onClear }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 14 }}>
    <div style={{ position: 'relative', flex: '1 1 260px' }}><Search size={16} style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-muted)' }} /><input aria-label="Search evidence" placeholder="Search evidence..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: '100%', padding: '9px 10px 9px 34px', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' }} /></div>
    <select aria-label="Evidence severity" value={severity} onChange={(event) => setSeverity(event.target.value)} style={selectStyle}><option value="All">Severity: All</option>{severities.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    <select aria-label="Evidence agent" value={agent} onChange={(event) => setAgent(event.target.value)} style={selectStyle}><option value="All">Agent: All</option>{agents.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    <select aria-label="Evidence decoder" value={decoder} onChange={(event) => setDecoder(event.target.value)} style={selectStyle}><option value="All">Decoder: All</option>{decoders.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    <select aria-label="Evidence quality" value={quality} onChange={(event) => setQuality(event.target.value)} style={selectStyle}><option value="All">Quality: All</option>{qualities.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    {(search || severity !== 'All' || agent !== 'All' || decoder !== 'All' || quality !== 'All') && <button onClick={onClear} style={{ display: 'inline-flex', gap: 5, alignItems: 'center', padding: 8, color: 'var(--danger)', background: 'transparent', border: 0, cursor: 'pointer' }}><X size={14} /> Clear Filters</button>}
  </div>
);

export default EvidenceFilters;