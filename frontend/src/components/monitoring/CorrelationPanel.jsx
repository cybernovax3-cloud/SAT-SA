import React from 'react';
import { Link } from 'react-router-dom';

const CorrelationPanel = ({ data }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2 style={{ fontSize: '0.9rem' }}>RECENT CORRELATIONS</h2><Link to="/correlation" style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>View Correlation →</Link></div><div style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: 700, marginTop: 12 }}>{data?.correlated_clusters ?? 'N/A'} group(s)</div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 7 }}>Events analyzed: {data?.total_events ?? 'N/A'}</p></section>;
export default CorrelationPanel;
