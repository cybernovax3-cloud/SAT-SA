import React from 'react';

const CorrelationTimeline = ({ events = [] }) => events.length ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{events.map((event, index) => <div key={`${event}-${index}`} style={{ borderLeft: '2px solid var(--primary)', padding: '6px 0 6px 12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{event}</div>)}</div> : null;
export default CorrelationTimeline;
