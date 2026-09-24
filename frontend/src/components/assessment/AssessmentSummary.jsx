import React from 'react';

const AssessmentSummary = ({ summary }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 }}><h2 style={{ fontSize: '0.95rem', marginBottom: 12 }}>OVERALL ASSESSMENT</h2><p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{summary || 'N/A'}</p></section>;
export default AssessmentSummary;
