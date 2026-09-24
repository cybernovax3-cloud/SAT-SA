import React from 'react';

const Distribution = ({ title, values = {} }) => {
  const entries = Object.entries(values);
  const maximum = Math.max(...entries.map(([, count]) => Number(count) || 0), 1);
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>{title}</span>{entries.length ? entries.map(([label, count]) => <div key={label} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 28px', gap: 8, alignItems: 'center', fontSize: '0.75rem' }}><span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{label}</span><span style={{ height: 6, background: 'var(--bg-darker)', borderRadius: 3, overflow: 'hidden' }}><span style={{ display: 'block', width: `${(Number(count) / maximum) * 100}%`, height: '100%', background: 'var(--primary)' }} /></span><span style={{ color: 'var(--text-primary)', textAlign: 'right' }}>{count}</span></div>) : <span style={{ color: 'var(--text-muted)' }}>N/A</span>}</div>;
};
export default Distribution;
