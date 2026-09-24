import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import AttentionStats from '../components/attention/AttentionStats';
import AttentionFilters from '../components/attention/AttentionFilters';
import AttentionDetails from '../components/attention/AttentionDetails';
import { useAttention } from '../hooks/useAttention';

const Attention = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useAttention();
  const [search, setSearch] = useState('');
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const reasons = useMemo(() => (data?.reasons || []).filter((reason) => String(reason).toLowerCase().includes(search.toLowerCase())), [data, search]);
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2 style={{ margin: '16px 0 8px' }}>SUPERVISORY ATTENTION UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Unable to retrieve attention analytics.</p><button onClick={refresh} style={{ background: 'var(--primary)', color: 'white', border: 0, padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Retry</button></div>;
  if (!data || (!data.reasons?.length && data.attention_score === undefined && !data.attention_level)) return <EmptyState title="NO SUPERVISORY ATTENTION REQUIRED" message="No current attention items are available." />;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}><header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}><div><h1 style={{ fontSize: '1.75rem', marginBottom: 5 }}>SUPERVISORY ATTENTION</h1><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Prioritize entities and security activity requiring review</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}><LiveIndicator status={status} /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Last updated: {lastUpdated || '--'}</span><button onClick={() => setAutoRefresh(!autoRefresh)} title="Toggle auto refresh" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}>{autoRefresh ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={refresh} title="Refresh attention" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={14} className={loading ? 'spin-animation' : ''} /></button></div></header><AttentionStats data={data} /><AttentionFilters search={search} setSearch={setSearch} onClear={() => setSearch('')} />{reasons.length ? <AttentionDetails data={{ ...data, reasons }} /> : <EmptyState title="NO MATCHING ATTENTION ITEMS" message="No backend-provided attention reasons match this search." />}</div>;
};
export default Attention;
