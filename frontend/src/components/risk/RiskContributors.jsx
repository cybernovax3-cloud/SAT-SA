import React from 'react';

const RiskContributors = ({ factors = [] }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 }}><h2 style={{ fontSize: '0.95rem', marginBottom: 14 }}>CONTRIBUTING FACTORS</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{factors.map((factor, index) => <span key={`${factor.factor || 'factor'}-${index}`} style={{ padding: '6px 9px', border: '1px solid var(--border-color)', borderRadius: 4, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{factor.factor || 'N/A'}</span>)}</div></section>;
export default RiskContributors;
