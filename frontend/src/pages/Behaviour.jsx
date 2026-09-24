import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import { useBehaviour } from '../hooks/useBehaviour';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import BehaviourStats from '../components/behaviour/BehaviourStats';
import BehaviourFilters from '../components/behaviour/BehaviourFilters';
import BehaviourTable from '../components/behaviour/BehaviourTable';
import { groupBehaviourProfiles } from './behaviourData';

const Behaviour = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, changeDetected, clearChange, refresh } = useBehaviour();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const entities = useMemo(() => groupBehaviourProfiles(data?.profiles).filter((entity) => { const query = search.toLowerCase(); const matchesSearch = !query || [entity.agent_name, entity.agent_id, entity.agent_ip].some((value) => String(value || '').toLowerCase().includes(query)); return matchesSearch && (selectedStatus === 'All' || entity.status === selectedStatus); }), [data, search, selectedStatus]);
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2 style={{ margin: '16px 0 8px' }}>BEHAVIOUR PROFILING UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Unable to retrieve behaviour information.</p><button onClick={refresh} style={{ background: 'var(--primary)', color: 'white', border: 0, padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Retry</button></div>;
  if (!data?.profiles?.length) return <EmptyState title="NO BEHAVIOUR DATA" message="No entity behaviour profiles are currently available." />;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}><header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}><div><h1 style={{ fontSize: '1.75rem', marginBottom: 5 }}>BEHAVIOUR PROFILING</h1><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Detect unusual activity relative to observed entity behaviour</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}><LiveIndicator status={status} /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Last updated: {lastUpdated || '--'}</span><button onClick={() => setAutoRefresh(!autoRefresh)} title="Toggle auto refresh" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}>{autoRefresh ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={refresh} title="Refresh behaviour" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={14} className={loading ? 'spin-animation' : ''} /></button></div></header>{changeDetected && <button onClick={clearChange} style={{ textAlign: 'left', color: 'var(--warning)', background: 'var(--warning-bg)', border: '1px solid var(--warning)', padding: '10px 14px', cursor: 'pointer', borderRadius: 5 }}>Behaviour change detected</button>}<BehaviourStats profiles={data.profiles} /><div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 16 }}><BehaviourFilters search={search} setSearch={setSearch} status={selectedStatus} setStatus={setSelectedStatus} statuses={['normal', 'unusual']} onClear={() => { setSearch(''); setSelectedStatus('All'); }} /></div>{entities.length ? <BehaviourTable entities={entities} /> : <EmptyState title="NO MATCHING ENTITIES" message="No behaviour profiles match the selected filters." />}</div>;
};
export default Behaviour;
