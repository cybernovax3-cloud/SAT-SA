import React from 'react';
import { Search, X } from 'lucide-react';

const BaselineSearch = ({ value, onChange, onClear }) => <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
  <div style={{ position: 'relative', flex: '1 1 280px' }}>
    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search entities..." style={{ width: '100%', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', color: 'var(--text-primary)', padding: '10px 12px 10px 36px', outline: 'none' }} />
  </div>
  {value && <button onClick={onClear} style={{ background: 'transparent', border: 0, color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><X size={14} /> Clear</button>}
</div>;
export default BaselineSearch;
