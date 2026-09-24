import React from 'react';

const RiskLevelBadge = ({ level }) => <span style={{ display: 'inline-flex', padding: '4px 9px', borderRadius: 4, color: level === 'high' || level === 'critical' ? 'var(--danger)' : level === 'medium' ? 'var(--warning)' : 'var(--success)', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{level || 'N/A'}</span>;
export default RiskLevelBadge;
