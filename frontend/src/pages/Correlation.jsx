import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import CorrelationStats from '../components/correlation/CorrelationStats';
import CorrelationFilters from '../components/correlation/CorrelationFilters';
import CorrelationTable from '../components/correlation/CorrelationTable';
import { useCorrelation } from '../hooks/useCorrelation';

const Correlation = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useCorrelation();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [agent, setAgent] = useState('All');
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const clusters = data?.clusters || [];
  const agents = useMemo(() => [...new Set(clusters.map((item) => item.entity?.agent_name).filter(Boolean))].sort(), [clusters]);
  const severities = useMemo(() => [...new Set(clusters.map((item) => String(item.maximum_severity)).filter((value) => value !== 'undefined'))].sort((a, b) => Number(a) - Number(b)), [clusters]);
  const filtered = useMemo(() => clusters.filter((item) => {
    const entity = item.entity || {};
    const haystack = [entity.agent_id, entity.agent_name, entity.agent_ip, ...(item.event_ids || []), ...(item.rule_ids || []), ...(item.decoders || []), item.correlation_reason].filter(Boolean).join(' ').toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) && (severity === 'All' || String(item.maximum_severity) === severity) && (agent === 'All' || entity.agent_name === agent);
  }), [clusters, search, severity, agent]);
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2 style={{ margin: '16px 0 8px' }}>CORRELATION DATA UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Unable to retrieve cross-evidence correlation data.</p><button onClick={refresh} style={{ background: 'var(--primary)', color: 'white', border: 0, padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Retry</button></div>;
  if (!clusters.length) return <EmptyState title="NO CORRELATED EVIDENCE" message="No cross-evidence correlations are currently available." />;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}><header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}><div><h1 style={{ fontSize: '1.75rem', marginBottom: 5 }}>CROSS-EVIDENCE CORRELATION</h1><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Identify related security events and evidence</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}><LiveIndicator status={status} /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Last updated: {lastUpdated || '--'}</span><button onClick={() => setAutoRefresh(!autoRefresh)} title="Toggle auto refresh" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}>{autoRefresh ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={refresh} title="Refresh correlation" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={14} className={loading ? 'spin-animation' : ''} /></button></div></header><CorrelationStats data={data} /><CorrelationFilters search={search} setSearch={setSearch} severity={severity} setSeverity={setSeverity} agent={agent} setAgent={setAgent} severities={severities} agents={agents} onClear={() => { setSearch(''); setSeverity('All'); setAgent('All'); }} />{filtered.length ? <CorrelationTable clusters={filtered} /> : <EmptyState title="NO MATCHING CORRELATIONS" message="No backend correlation groups match these filters." />}</div>;
};
export default Correlation;
