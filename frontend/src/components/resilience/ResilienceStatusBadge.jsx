import React from 'react';

const ResilienceStatusBadge = ({ level }) => <span style={{ display: 'inline-flex', padding: '4px 9px', borderRadius: 4, color: level === 'high' ? 'var(--success)' : level === 'medium' ? 'var(--warning)' : 'var(--danger)', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{level || 'N/A'}</span>;
export default ResilienceStatusBadge;
