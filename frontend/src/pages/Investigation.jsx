import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RefreshCw, Search, ShieldAlert } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import LiveIndicator from '../components/common/LiveIndicator';
import SeverityBadge from '../components/common/SeverityBadge';
import { useInvestigation } from '../hooks/useInvestigation';

const time = (value) => { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString(); };
const Card = ({ title, children }) => <section style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 18 }}><h2 style={{ fontSize: '0.9rem', marginBottom: 14 }}>{title}</h2>{children}</section>;
const Detail = ({ label, value }) => value !== undefined && value !== null && value !== '' ? <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{label}</span><div style={{ color: 'var(--text-primary)', marginTop: 3, wordBreak: 'break-word' }}>{String(value)}</div></div> : null;

const Investigation = ({ setApiStatus, setLastUpdated }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { alerts, behaviour, correlation, attention, risk, findings, assessment, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useInvestigation();
  const [search, setSearch] = useState('');
  useEffect(() => { setApiStatus?.(status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const matches = useMemo(() => alerts.filter((item) => [item.event_id, item.agent?.name, item.agent?.ip, item.rule?.id, item.rule?.severity, item.decoder, item.rule?.description].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase())), [alerts, search]);
  const selected = alerts.find((item) => String(item.event_id) === String(eventId));
  const selectedId = selected?.event_id;
  const profile = (behaviour?.profiles || []).find((item) => String(item.event_id) === String(selectedId) || item.agent_id === selected?.agent?.id);
  const cluster = (correlation?.clusters || []).find((item) => (item.event_ids || []).some((id) => String(id) === String(selectedId)));
  const relatedFindings = findings.filter((item) => (item.evidence_references || []).some((id) => String(id) === String(selectedId)) || (item.evidence || []).some((evidence) => String(evidence.event_id) === String(selectedId)));
  const selectedRisk = risk && (!risk.evidence_references?.length || risk.evidence_references.some((id) => String(id) === String(selectedId))) ? risk : null;
  const timeline = selected ? [
    { label: 'Alert detected', timestamp: selected.timestamp, available: true },
    { label: 'Evidence observed', timestamp: selected.timestamp, available: Boolean(selected.full_log || selected.evidence_quality) },
    { label: 'Behaviour classified', timestamp: profile?.timestamp, available: Boolean(profile) },
    { label: 'Correlation identified', available: Boolean(cluster) },
    { label: 'Supervisory attention available', available: Boolean(attention) },
    { label: 'Risk assessment available', available: Boolean(selectedRisk) },
    { label: 'Finding identified', available: relatedFindings.length > 0 },
  ].filter((item) => item.available) : [];

  if (loading && !alerts.length) return <DashboardSkeleton />;
  if (error && !alerts.length) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2>INVESTIGATION DATA UNAVAILABLE</h2><p style={{ color: 'var(--text-secondary)' }}>Unable to retrieve investigation information.</p><button onClick={refresh} style={{ marginTop: 12 }}><RefreshCw size={15} /> Retry</button></div>;

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}><div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><h1>INCIDENT INVESTIGATION</h1><LiveIndicator status={status} /></div><p style={{ color: 'var(--text-secondary)' }}>Investigate events and supporting SAT-SA intelligence</p></div><div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}><span>Last updated: {lastUpdated || '--'}</span><button onClick={refresh}><RefreshCw size={15} /> Refresh</button><label><input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} /> Auto Refresh</label></div></header>
    <div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} /><input aria-label="Search investigation events" placeholder="Search event, agent, IP, rule..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 5, color: 'var(--text-primary)' }} /></div>
    {!selected && <Card title="INVESTIGATION TARGETS"><div style={{ display: 'grid', gap: 8 }}>{matches.slice(0, 15).map((item) => <button key={item.event_id} onClick={() => navigate(`/investigation/${encodeURIComponent(item.event_id)}`)} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 80px 1fr', gap: 10, textAlign: 'left', padding: 10, background: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer' }}><span>{item.event_id}</span><span>{item.agent?.name || ''}</span><span><SeverityBadge severity={item.rule?.severity} /></span><span>Rule {item.rule?.id || ''}</span></button>)}</div>{!matches.length && <p style={{ color: 'var(--text-muted)' }}>No events match the current search.</p>}</Card>}
    {!selected && !search && !alerts.length && <EmptyState title="NO INVESTIGATION TARGET" message="Search for an event, agent, IP or rule to begin investigation." />}
    {selected && <>
      <Card title="INVESTIGATION SUMMARY"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}><Detail label="Event ID" value={selected.event_id} /><Detail label="Agent" value={selected.agent?.name} /><Detail label="Severity" value={selected.rule?.severity} /><Detail label="Assessment Priority" value={assessment?.assessment?.priority} /></div></Card>
      <Card title="EVENT"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}><Detail label="Event ID" value={selected.event_id} /><Detail label="Timestamp" value={time(selected.timestamp)} /><Detail label="Agent IP" value={selected.agent?.ip} /><Detail label="Rule" value={selected.rule?.id} /><Detail label="Decoder" value={selected.decoder} /><Detail label="Description" value={selected.rule?.description} /></div></Card>
      <Card title="INVESTIGATION TIMELINE"><div style={{ display: 'grid', gap: 10 }}>{timeline.map((item) => <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'center', borderLeft: '2px solid var(--primary)', padding: '8px 0 8px 14px' }}><span style={{ minWidth: 155, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item.timestamp ? time(item.timestamp) : 'Available'}</span><span style={{ color: 'var(--text-primary)' }}>{item.label}</span></div>)}</div></Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}><Card title="SELECTED EVIDENCE"><Detail label="Evidence Quality" value={selected.evidence_quality} />{selected.full_log && <pre style={{ whiteSpace: 'pre-wrap', color: '#a7f3d0', fontSize: '0.74rem', maxHeight: 220, overflow: 'auto' }}>{selected.full_log}</pre>}</Card><Card title="BEHAVIOUR"><Detail label="Status" value={profile?.behaviour} /><Detail label="Event ID" value={profile?.event_id} /><Detail label="Reason" value={profile?.reasons?.join('; ')} />{profile && <Link to="/behaviour">View Behaviour →</Link>}</Card><Card title="CORRELATED ACTIVITY"><Detail label="Entity" value={cluster?.entity?.agent_name} /><Detail label="Events" value={cluster?.event_count} /><Detail label="Reason" value={cluster?.correlation_reason} />{cluster && <Link to="/correlation">View Correlation →</Link>}</Card><Card title="SUPERVISORY ATTENTION"><Detail label="Priority" value={attention?.attention_level} /><Detail label="Reason" value={attention?.reasons?.join('; ')} />{attention && <Link to="/attention">View Attention →</Link>}</Card><Card title="CURRENT RISK"><Detail label="Risk score" value={selectedRisk?.overall_risk_score} /><Detail label="Level" value={selectedRisk?.risk_level} />{selectedRisk && <Link to="/risk">View Risk →</Link>}</Card><Card title="RELATED FINDINGS">{relatedFindings.map((item) => <div key={item.finding_id}><Detail label="Finding" value={item.title} /><Detail label="Severity" value={item.severity} /><Detail label="Reason" value={item.explanation} /></div>)}{relatedFindings.length > 0 && <Link to="/findings">View Findings →</Link>}</Card></div>
      <Card title="INVESTIGATION ACTIONS"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}><Link to={`/alerts/${encodeURIComponent(selected.event_id)}`}>View Alert</Link><Link to="/evidence">View Evidence</Link><Link to="/behaviour">View Behaviour</Link><Link to="/correlation">View Correlation</Link><Link to="/attention">View Attention</Link><Link to="/risk">View Risk</Link><Link to="/findings">View Findings</Link><Link to="/assessment">View Assessment</Link></div></Card>
    </>}
  </div>;
};

export default Investigation;