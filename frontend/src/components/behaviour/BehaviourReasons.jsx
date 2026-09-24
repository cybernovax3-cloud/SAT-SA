import React from 'react';
const BehaviourReasons = ({ reasons = [] }) => reasons.length ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{reasons.map((reason) => <span key={reason} style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{reason}</span>)}</div> : <span style={{ color: 'var(--text-muted)' }}>No unusual activity reported</span>;
export default BehaviourReasons;
