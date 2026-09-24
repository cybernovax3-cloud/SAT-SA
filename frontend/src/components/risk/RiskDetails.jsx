import React from 'react';

const RiskDetails = ({ data }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 }}><h2 style={{ fontSize: '0.95rem', marginBottom: 14 }}>RISK CONTEXT</h2><p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Risk contributors and evidence references below are supplied by the SAT-SA risk analytics endpoint. Entity-level risk items are not present in the current response.</p><div style={{ marginTop: 12, color: 'var(--text-primary)' }}>Current backend level: <strong>{data?.risk_level || 'N/A'}</strong></div></section>;
export default RiskDetails;
