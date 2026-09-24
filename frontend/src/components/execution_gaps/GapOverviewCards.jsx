import React from 'react';
import { ShieldAlert, AlertTriangle, Search, ArrowUpCircle, Wrench, Activity } from 'lucide-react';

const MetricCard = ({ icon: Icon, title, value, color, subtitle }) => (
  <div className="glass-panel" style={{
    background: 'var(--glass-surface)',
    border: `1px solid ${color}22`,
    borderRadius: '16px',
    padding: '20px',
    flex: 1,
    minWidth: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <Icon size={16} style={{ color }} />
    </div>
    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
      {value}
    </div>
    {subtitle && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
  </div>
);

const GapOverviewCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="glass-panel" style={{ flex: 1, minWidth: '160px', height: '110px', borderRadius: '16px', background: 'var(--glass-surface)', opacity: 0.6 }} />
        ))}
      </div>
    );
  }

  const s = stats || {};
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <MetricCard icon={Activity}       title="Incidents Assessed"    value={s.total_incidents_assessed ?? '--'}  color="var(--primary)"  subtitle="From live Wazuh alerts" />
      <MetricCard icon={ShieldAlert}    title="Execution Gaps"        value={s.execution_gaps_detected ?? '--'}   color="var(--warning)"  subtitle="Workflow incomplete" />
      <MetricCard icon={AlertTriangle}  title="Critical Gaps"         value={s.critical_gaps ?? '--'}             color="var(--danger)"   subtitle="Critical severity only" />
      <MetricCard icon={Search}         title="Missing Investigations" value={s.missing_investigations ?? '--'}    color="var(--warning)"  subtitle="Not investigated" />
      <MetricCard icon={ArrowUpCircle}  title="Missing Escalations"   value={s.missing_escalations ?? '--'}       color="var(--danger)"   subtitle="Not escalated" />
      <MetricCard icon={Wrench}         title="Missing Remediations"   value={s.missing_remediations ?? '--'}      color="var(--info)"     subtitle="Not remediated" />
    </div>
  );
};

export default GapOverviewCards;
