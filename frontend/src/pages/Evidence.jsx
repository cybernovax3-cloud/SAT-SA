import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import EvidenceStats from '../components/evidence/EvidenceStats';
import EvidenceFilters from '../components/evidence/EvidenceFilters';
import EvidenceTable from '../components/evidence/EvidenceTable';
import { useEvidence } from '../hooks/useEvidence';

const Evidence = ({ setApiStatus, setLastUpdated }) => {
  const { evidence, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useEvidence();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [agent, setAgent] = useState('All');
  const [decoder, setDecoder] = useState('All');
  const [quality, setQuality] = useState('All');

  useEffect(() => {
    setApiStatus?.(status);
    if (lastUpdated) setLastUpdated?.(lastUpdated);
  }, [status, lastUpdated, setApiStatus, setLastUpdated]);

  const values = useMemo(() => ({
    severities: [...new Set(evidence.map((item) => item.rule?.severity).filter((value) => value !== undefined))].sort((a, b) => a - b),
    agents: [...new Set(evidence.map((item) => item.agent?.name).filter(Boolean))].sort(),
    decoders: [...new Set(evidence.map((item) => item.decoder).filter(Boolean))].sort(),
    qualities: [...new Set(evidence.map((item) => item.evidence_quality).filter(Boolean))].sort(),
  }), [evidence]);

  const filtered = useMemo(() => evidence.filter((item) => {
    const searchable = [item.event_id, item.timestamp, item.agent?.id, item.agent?.name, item.agent?.ip,
      item.rule?.id, item.rule?.description, item.decoder, item.location, item.evidence_quality, item.full_log]
      .filter(Boolean).join(' ').toLowerCase();
    return (!search || searchable.includes(search.toLowerCase()))
      && (severity === 'All' || String(item.rule?.severity) === severity)
      && (agent === 'All' || item.agent?.name === agent)
      && (decoder === 'All' || item.decoder === decoder)
      && (quality === 'All' || item.evidence_quality === quality);
  }), [evidence, search, severity, agent, decoder, quality]);

  const clearFilters = () => {
    setSearch(''); setSeverity('All'); setAgent('All'); setDecoder('All'); setQuality('All');
  };

  if (loading && !evidence.length) return <DashboardSkeleton />;
  if (error && !evidence.length) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}>
    <ShieldAlert size={44} color="var(--danger)" /><h2>EVIDENCE UNAVAILABLE</h2>
    <p style={{ color: 'var(--text-secondary)' }}>Unable to retrieve evidence from the SAT-SA backend.</p>
    <button onClick={refresh} style={{ marginTop: 12 }}><RefreshCw size={15} /> Retry</button>
  </div>;
  if (!evidence.length) return <EmptyState title="NO EVIDENCE AVAILABLE" message="No evidence is currently available." />;

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><h1>EVIDENCE EXPLORER</h1><LiveIndicator status={status} /></div>
        <p style={{ color: 'var(--text-secondary)' }}>Inspect evidence supporting SAT-SA analysis</p></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        <span>Last updated: {lastUpdated || '--'}</span>
        <button
  className="evidence-refresh-btn"
  onClick={refresh}
  aria-label="Refresh evidence"
>
  <RefreshCw size={15} />
  Refresh
</button>
        <label><input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} /> Auto Refresh</label>
      </div>
    </header>
    <EvidenceFilters {...{ search, setSearch, severity, setSeverity, agent, setAgent, decoder, setDecoder, quality, setQuality, ...values, onClear: clearFilters }} />
    <EvidenceStats evidence={evidence} />
    <section><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><h2>EVIDENCE</h2><span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{filtered.length} shown</span></div><EvidenceTable evidence={filtered} /></section>
  </div>;
};

export default Evidence;
