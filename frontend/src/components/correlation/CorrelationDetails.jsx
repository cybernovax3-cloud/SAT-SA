import React from 'react';

const CorrelationDetails = ({ cluster }) => cluster ? <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 }}><h2 style={{ fontSize: '0.95rem', marginBottom: 12 }}>CORRELATION DETAILS</h2><p style={{ color: 'var(--text-secondary)' }}>{cluster.correlation_reason || 'N/A'}</p></section> : null;
export default CorrelationDetails;
