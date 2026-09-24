import React from 'react';

const FindingSeverityBadge = ({ severity }) => <span style={{ display: 'inline-flex', padding: '4px 9px', borderRadius: 4, color: ['critical', 'high'].includes(String(severity).toLowerCase()) ? 'var(--danger)' : String(severity).toLowerCase() === 'medium' ? 'var(--warning)' : 'var(--success)', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{severity || 'N/A'}</span>;
export default FindingSeverityBadge;
