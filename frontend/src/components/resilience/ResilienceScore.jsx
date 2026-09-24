import React from 'react';

const ResilienceScore = ({ score }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 24, textAlign: 'center' }}><h2 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.08em' }}>RESILIENCE SCORE</h2><div style={{ color: 'var(--success)', fontSize: '3rem', fontWeight: 700, marginTop: 10 }}>{score ?? 'N/A'}</div></section>;
export default ResilienceScore;
