import React from 'react';
import LiveIndicator from '../common/LiveIndicator';

const ConnectionStatus = ({ status, lastUpdated, paused }) => <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><LiveIndicator status={paused ? 'OFFLINE' : status} /><span style={{ color: paused ? 'var(--warning)' : 'var(--text-muted)', fontSize: '0.75rem' }}>{paused ? 'LIVE STREAM PAUSED' : `Last updated: ${lastUpdated || '--'}`}</span></div>;
export default ConnectionStatus;
