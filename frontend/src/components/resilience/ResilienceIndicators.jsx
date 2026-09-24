import React from 'react';

const ResilienceIndicators = ({ reasons = [] }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 }}><h2 style={{ fontSize: '0.95rem', marginBottom: 14 }}>RESILIENCE INDICATORS</h2>{reasons.length ? <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{reasons.map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}</ul> : <p style={{ color: 'var(--text-secondary)' }}>No backend-provided resilience indicators are currently available.</p>}</section>;
export default ResilienceIndicators;
