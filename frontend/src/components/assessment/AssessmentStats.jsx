import React from 'react';

const AssessmentStats = ({ assessment }) => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>{[['OVERALL RISK', assessment?.overall_risk], ['ATTENTION', assessment?.overall_attention], ['RESILIENCE', assessment?.overall_resilience]].map(([label, value]) => <div key={label} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '18px 20px' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 700 }}>{label}</div><div style={{ color: 'var(--text-primary)', fontSize: '1.9rem', fontWeight: 700, marginTop: 8 }}>{value ?? 'N/A'}</div></div>)}</div>;
export default AssessmentStats;
