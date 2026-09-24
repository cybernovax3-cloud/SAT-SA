import React from 'react';
import LiveEventStream from './LiveEventStream';

const HighSeverityPanel = ({ alerts }) => <div><h2 style={{ fontSize: '0.95rem', marginBottom: 12 }}>HIGH-SEVERITY ACTIVITY</h2><LiveEventStream alerts={alerts.filter((item) => Number(item.rule?.severity) >= 7).slice(0, 8)} /></div>;
export default HighSeverityPanel;
