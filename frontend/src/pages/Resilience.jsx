import React, { useEffect } from 'react';
import { Pause, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import ResilienceStats from '../components/resilience/ResilienceStats';
import ResilienceScore from '../components/resilience/ResilienceScore';
import ResilienceIndicators from '../components/resilience/ResilienceIndicators';
import ResilienceDetails from '../components/resilience/ResilienceDetails';
import { useResilience } from '../hooks/useResilience';

const Resilience = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useResilience();
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2 style={{ margin: '16px 0 8px' }}>CYBER RESILIENCE UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Unable to retrieve resilience analytics.</p><button onClick={refresh} style={{ background: 'var(--primary)', color: 'white', border: 0, padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Retry</button></div>;
  if (!data || (data.resilience_score === undefined && !data.resilience_level && !data.reasons?.length)) return <EmptyState title="NO RESILIENCE DATA" message="No cyber resilience analytics are currently available." />;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}><header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}><div><h1 style={{ fontSize: '1.75rem', marginBottom: 5 }}>CYBER RESILIENCE</h1><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor resilience indicators across observed activity</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}><LiveIndicator status={status} /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Last updated: {lastUpdated || '--'}</span><button onClick={() => setAutoRefresh(!autoRefresh)} title="Toggle auto refresh" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}>{autoRefresh ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={refresh} title="Refresh resilience" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={14} className={loading ? 'spin-animation' : ''} /></button></div></header><ResilienceStats data={data} /><ResilienceScore score={data.resilience_score} /><ResilienceIndicators reasons={data.reasons || []} /><ResilienceDetails data={data} /></div>;
};
export default Resilience;
