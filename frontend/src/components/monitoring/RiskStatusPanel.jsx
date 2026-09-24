import React from 'react';
import { Link } from 'react-router-dom';

const RiskStatusPanel = ({ data }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2 style={{ fontSize: '0.9rem' }}>CURRENT RISK</h2><Link to="/risk" style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>View Risk →</Link></div><div style={{ color: 'var(--danger)', fontSize: '1.3rem', fontWeight: 700, marginTop: 12 }}>{data?.overall_risk_score ?? 'N/A'}</div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 7 }}>Level: {data?.risk_level || 'N/A'}</p></section>;
export default RiskStatusPanel;
