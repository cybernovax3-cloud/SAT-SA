import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBaseline } from '../hooks/useBaseline';
import { SeverityDistribution, RuleDistribution, DecoderDistribution } from '../components/baseline';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

const BaselineDetails = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refresh } = useBaseline(0);
  const entity = data?.entities?.[decodeURIComponent(entityId || '')];
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ padding: 40, textAlign: 'center' }}><h2>ENTITY BASELINE UNAVAILABLE</h2><button onClick={refresh}>Retry</button></div>;
  if (!entity) return <EmptyState title="ENTITY NOT FOUND" message="The requested entity is not available in the current baseline." />;
  const card = { background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 };
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><button onClick={() => navigate('/baseline')} style={{ background: 'transparent', border: 0, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', gap: 7, alignItems: 'center' }}><ArrowLeft size={16} /> Back to Baseline</button><button onClick={refresh} title="Refresh baseline" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={15} /></button></div><div><h1>ENTITY: {entity.agent_name || 'N/A'}</h1><p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>{entity.agent_id || 'N/A'} · {entity.agent_ip || 'N/A'}</p></div><section style={card}><h3>BASELINE SUMMARY</h3><div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 18 }}><div><small>Total Events</small><strong style={{ display: 'block', fontSize: '1.5rem', marginTop: 5 }}>{entity.total_events ?? 0}</strong></div><div><small>Unique Rules</small><strong style={{ display: 'block', fontSize: '1.5rem', marginTop: 5 }}>{Object.keys(entity.rule_distribution || {}).length}</strong></div><div><small>Unique Decoders</small><strong style={{ display: 'block', fontSize: '1.5rem', marginTop: 5 }}>{Object.keys(entity.decoder_distribution || {}).length}</strong></div></div></section><section style={card}><SeverityDistribution title="Severity Distribution" values={entity.severity_distribution} /></section><section style={{ ...card, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}><RuleDistribution values={entity.rule_distribution} /><DecoderDistribution values={entity.decoder_distribution} /></section></div>;
};
export default BaselineDetails;
