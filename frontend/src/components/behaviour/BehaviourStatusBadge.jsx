import React from 'react';
const BehaviourStatusBadge = ({ status }) => { const value = String(status || 'N/A').toUpperCase(); const color = value === 'NORMAL' ? 'var(--success)' : value === 'UNUSUAL' ? 'var(--warning)' : 'var(--text-secondary)'; return <span style={{ color, background: `${color}1a`, border: `1px solid ${color}55`, borderRadius: 4, padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700 }}>{value}</span>; };
export default BehaviourStatusBadge;
