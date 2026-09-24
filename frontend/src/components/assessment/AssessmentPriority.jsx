import React from 'react';

const AssessmentPriority = ({ priority }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--warning)', borderRadius: 'var(--border-radius)', padding: 22 }}><div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' }}>SUPERVISORY PRIORITY</div><div style={{ color: 'var(--warning)', fontSize: '1.8rem', fontWeight: 700, marginTop: 8, textTransform: 'uppercase' }}>{priority || 'N/A'}</div></section>;
export default AssessmentPriority;
