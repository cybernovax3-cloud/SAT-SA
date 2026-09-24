import React from 'react';
import { Link } from 'react-router-dom';

const AttentionPanel = ({ data }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2 style={{ fontSize: '0.9rem' }}>SUPERVISORY ATTENTION</h2><Link to="/attention" style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>View Attention →</Link></div><div style={{ color: 'var(--warning)', fontSize: '1.3rem', fontWeight: 700, marginTop: 12 }}>{data?.attention_level || 'N/A'}</div><p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 7 }}>{data?.reasons?.[0] || 'N/A'}</p></section>;
export default AttentionPanel;
