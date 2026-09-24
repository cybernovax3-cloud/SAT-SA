import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Play, Pause, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import BaselineStats from '../components/baseline/BaselineStats';
import BaselineSearch from '../components/baseline/BaselineSearch';
import BaselineTable from '../components/baseline/BaselineTable';
import { useBaseline } from '../hooks/useBaseline';

const Baseline = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useBaseline();
  const [search, setSearch] = useState('');
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const entities = useMemo(() => Object.values(data?.entities || {}).filter((entity) => {
    const query = search.toLowerCase();
    return !query || [entity.agent_name, entity.agent_id, entity.agent_ip].some((value) => String(value || '').toLowerCase().includes(query));
  }), [data, search]);

  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2 style={{ margin: '16px 0 8px' }}>ENTITY BASELINE UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Unable to retrieve entity baseline information.</p><button onClick={refresh} style={{ background: 'var(--primary)', color: 'white', border: 0, padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Retry</button></div>;
  if (!Object.keys(data?.entities || {}).length) return <EmptyState title="NO ENTITIES OBSERVED" message="No normalized Wazuh entities are currently available." />;

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}><div><h1 style={{ fontSize: '1.75rem', marginBottom: 5 }}>ENTITY BASELINE</h1><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Normal activity observed across monitored entities</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}><LiveIndicator status={status} /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Last updated: {lastUpdated || '--'}</span><button onClick={() => setAutoRefresh(!autoRefresh)} title="Toggle auto refresh" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 10px', borderRadius: 5, cursor: 'pointer' }}>{autoRefresh ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={refresh} title="Refresh baseline" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 5, cursor: 'pointer' }}><RefreshCw size={14} className={loading ? 'spin-animation' : ''} /></button></div></header>
    <BaselineStats data={data} />
    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 16 }}><BaselineSearch value={search} onChange={setSearch} onClear={() => setSearch('')} /></div>
    {entities.length ? <BaselineTable entities={entities} /> : <EmptyState title="NO MATCHING ENTITIES" message="No observed entities match this search." />}
  </div>;
};
export default Baseline;
