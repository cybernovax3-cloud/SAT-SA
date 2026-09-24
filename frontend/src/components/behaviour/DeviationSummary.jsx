import React from 'react';
const DeviationSummary = ({ profiles = [] }) => { const values = [...new Set(profiles.flatMap((profile) => profile.reasons || []))]; return <div><h3>DEVIATION ANALYSIS</h3><div style={{ marginTop: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>{values.length ? values.map((value) => <div key={value}>{value}</div>) : <div>No deviation reasons supplied by the backend.</div>}</div></div>; };
export default DeviationSummary;
