import React, { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import RiskStats from '../components/risk/RiskStats';
import RiskScore from '../components/risk/RiskScore';
import RiskBreakdown from '../components/risk/RiskBreakdown';
import RiskContributors from '../components/risk/RiskContributors';
import RiskEvidence from '../components/risk/RiskEvidence';
import RiskDetails from '../components/risk/RiskDetails';
import { useRisk } from '../hooks/useRisk';

const Risk = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useRisk();
  const [search, setSearch] = useState('');
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const factors = useMemo(() => (data?.contributing_factors || []).filter((factor) => `${factor.factor || ''} ${factor.explanation || ''} ${(factor.evidence_references || []).join(' ')}`.toLowerCase().includes(search.toLowerCase())), [data, search]);
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2 style={{ margin: '16px 0 8px' }}>RISK ANALYTICS UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Unable to retrieve risk analytics.</p><button onClick={refresh} style={{ background: 'var(--primary)', color: 'white', border: 0, padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Retry</button></div>;
  if (!data || (data.overall_risk_score === undefined && !data.risk_level && !data.contributing_factors?.length)) return <EmptyState title="NO RISK DATA" message="No risk analytics are currently available." />;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}><header style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'start' }}><div><h1 style={{ fontSize: '1.75rem', marginBottom: 5 }}>RISK ANALYTICS</h1><p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Supervisory view of current cybersecurity risk</p></div><div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}><LiveIndicator status={status} /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Last updated: {lastUpdated || '--'}</span><button onClick={() => setAutoRefresh(!autoRefresh)} title="Toggle auto refresh" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}>{autoRefresh ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={refresh} title="Refresh risk" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={14} className={loading ? 'spin-animation' : ''} /></button></div></header><RiskStats data={data} /><RiskScore score={data.overall_risk_score} /><label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Search risk factors <input aria-label="Search risk factors" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search risk factors..." style={{ marginLeft: 10, padding: 8, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' }} /></label>{factors.length ? <><RiskBreakdown factors={factors} /><RiskContributors factors={factors} /><RiskEvidence factors={factors} /></> : <EmptyState title="NO MATCHING RISK FACTORS" message="No backend risk factors match this search." />}<RiskDetails data={data} /></div>;
};
export default Risk;
