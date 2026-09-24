import React from 'react';
import CorrelationGroup from './CorrelationGroup';

const CorrelationTable = ({ clusters }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div style={{ display: 'grid', gridTemplateColumns: '1.2fr .7fr 1.3fr 1fr .7fr', gap: 12, padding: '0 20px', color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em' }}><span>ENTITY</span><span>EVENTS</span><span>RULES</span><span>DECODERS</span><span>MAX SEVERITY</span></div>{clusters.map((cluster, index) => <CorrelationGroup key={`${cluster.entity?.agent_id || 'cluster'}-${index}`} cluster={cluster} />)}</div>;
export default CorrelationTable;
