import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import MonitoringStats from '../components/monitoring/MonitoringStats';
import MonitoringFilters from '../components/monitoring/MonitoringFilters';
import LiveEventStream from '../components/monitoring/LiveEventStream';
import HighSeverityPanel from '../components/monitoring/HighSeverityPanel';
import AttentionPanel from '../components/monitoring/AttentionPanel';
import CorrelationPanel from '../components/monitoring/CorrelationPanel';
import RiskStatusPanel from '../components/monitoring/RiskStatusPanel';
import { useLiveMonitoring } from '../hooks/useLiveMonitoring';

const LiveMonitoring = ({ setApiStatus, setLastUpdated }) => {
  const { alerts, attention, correlation, risk, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, newEventIds, refresh } = useLiveMonitoring();
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [agent, setAgent] = useState('All');
  const [decoder, setDecoder] = useState('All');

  useEffect(() => { if (!paused) setVisibleAlerts(alerts); }, [alerts, paused]);
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);

  const values = useMemo(() => ({
    severities: [...new Set(visibleAlerts.map((item) => item.rule?.severity).filter((value) => value !== undefined))].sort((a, b) => a - b),
    agents: [...new Set(visibleAlerts.map((item) => item.agent?.name).filter(Boolean))].sort(),
    decoders: [...new Set(visibleAlerts.map((item) => item.decoder).filter(Boolean))].sort(),
  }), [visibleAlerts]);
  const filtered = useMemo(() => visibleAlerts.filter((item) => {
    const searchable = [item.event_id, item.timestamp, item.agent?.id, item.agent?.name, item.agent?.ip, item.rule?.id, item.rule?.description, item.decoder].filter(Boolean).join(' ').toLowerCase();
    return (!search || searchable.includes(search.toLowerCase()))
      && (severity === 'All' || String(item.rule?.severity) === severity)
      && (agent === 'All' || item.agent?.name === agent)
      && (decoder === 'All' || item.decoder === decoder);
  }), [visibleAlerts, search, severity, agent, decoder]);
  const clearFilters = () => { setSearch(''); setSeverity('All'); setAgent('All'); setDecoder('All'); };
  const togglePause = () => { setPaused((value) => !value); if (paused) refresh(); };

  if (loading && !alerts.length) return <DashboardSkeleton />;
  if (error && !alerts.length) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2>LIVE MONITORING UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)' }}>Unable to connect to the SAT-SA backend.</p><button onClick={refresh} style={{ marginTop: 12 }}><RefreshCw size={15} /> Retry</button></div>;
  if (!alerts.length) return <EmptyState title="NO LIVE ACTIVITY" message="No current security activity is available." />;

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><h1>LIVE SOC MONITOR</h1><LiveIndicator status={paused ? 'OFFLINE' : status} /></div><p style={{ color: 'var(--text-secondary)' }}>Real-time SAT-SA security activity</p></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        <span>{paused ? 'LIVE STREAM PAUSED' : `Last updated: ${lastUpdated || '--'}`}</span>
        {status === 'OFFLINE' && <strong style={{ color: 'var(--danger)' }}>BACKEND OFFLINE</strong>}
        <button onClick={togglePause}>{paused ? <Play size={15} /> : <Pause size={15} />} {paused ? 'Resume' : 'Pause'}</button>
        <button onClick={refresh} aria-label="Refresh monitoring"><RefreshCw size={15} /> Refresh</button>
        <label><input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} /> Auto Refresh</label>
      </div>
    </header>
    {status === 'OFFLINE' && <div style={{ padding: '10px 14px', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'rgba(239,68,68,.08)', fontSize: '0.8rem' }}>BACKEND OFFLINE. Last successful update: {lastUpdated || '--'}. Showing stale activity.</div>}
    <MonitoringFilters {...{ search, setSearch, severity, setSeverity, agent, setAgent, decoder, setDecoder, ...values, onClear: clearFilters }} />
    <MonitoringStats alerts={visibleAlerts} correlation={correlation} />
    <LiveEventStream alerts={filtered} newEventIds={newEventIds} paused={paused} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}><HighSeverityPanel alerts={filtered} /><AttentionPanel data={attention} /><CorrelationPanel data={correlation} /><RiskStatusPanel data={risk} /></div>
  </div>;
};

export default LiveMonitoring;