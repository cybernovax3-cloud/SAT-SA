import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBehaviour } from '../hooks/useBehaviour';
import { groupBehaviourProfiles } from './behaviourData';
import BehaviourStatusBadge from '../components/behaviour/BehaviourStatusBadge';
import BehaviourReasons from '../components/behaviour/BehaviourReasons';
import DeviationSummary from '../components/behaviour/DeviationSummary';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

const BehaviourDetails = () => {
  const { entityId } = useParams(); const navigate = useNavigate(); const { data, loading, error, refresh } = useBehaviour(0);
  const entity = groupBehaviourProfiles(data?.profiles).find((item) => String(item.agent_id) === String(decodeURIComponent(entityId || '')));
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: 60 }}><h2>BEHAVIOUR PROFILING UNAVAILABLE</h2><button onClick={refresh}>Retry</button></div>;
  if (!entity) return <EmptyState title="ENTITY NOT FOUND" message="The requested behaviour profile is not available." />;
  const panel = { background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: 20 };
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><button onClick={() => navigate('/behaviour')} style={{ background: 'transparent', border: 0, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', gap: 7, alignItems: 'center' }}><ArrowLeft size={16} /> Back to Behaviour</button><button onClick={refresh} title="Refresh behaviour" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: 8, cursor: 'pointer' }}><RefreshCw size={15} /></button></div><div><h1>BEHAVIOUR PROFILE</h1><p style={{ color: 'var(--text-muted)', marginTop: 6 }}>{entity.agent_name || 'N/A'} · {entity.agent_id || 'N/A'} · {entity.agent_ip || 'N/A'}</p></div><section style={panel}><h3>STATUS</h3><div style={{ marginTop: 14 }}><BehaviourStatusBadge status={entity.status} /></div><div style={{ display: 'flex', gap: 35, marginTop: 22, flexWrap: 'wrap' }}><div>Total: <strong>{entity.total}</strong></div><div>Normal: <strong>{entity.normal}</strong></div><div>Unusual: <strong>{entity.unusual}</strong></div></div></section><section style={panel}><h3>WHY IS THIS UNUSUAL?</h3><div style={{ marginTop: 14 }}><BehaviourReasons reasons={entity.reasons} /></div></section><section style={panel}><DeviationSummary profiles={entity.profiles} /></section></div>;
};
export default BehaviourDetails;
