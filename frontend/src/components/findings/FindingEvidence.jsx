import React from 'react';

const FindingEvidence = ({ evidence = [], references = [] }) => <div style={{ marginTop: 14, color: 'var(--text-secondary)', fontSize: '0.8rem' }}><strong style={{ color: 'var(--text-primary)' }}>SUPPORTING EVIDENCE</strong><div style={{ marginTop: 8 }}>Evidence records: {evidence.length || 'N/A'} | References: {references.length || 'N/A'}</div>{references.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>{references.map((reference) => <span key={reference} style={{ fontFamily: 'var(--font-mono)', border: '1px solid var(--border-color)', padding: '3px 6px', borderRadius: 4 }}>{reference}</span>)}</div>}</div>;
export default FindingEvidence;
