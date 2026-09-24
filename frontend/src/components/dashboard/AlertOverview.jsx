import React from 'react';
import { Bell, ShieldAlert, Zap, Layers } from 'lucide-react';

const AlertOverview = ({ evidence = [], behaviour = {}, correlation = {} }) => {
  // 1. Total Alerts (normalized evidence records)
  const totalAlerts = evidence.length;

  // 2. High Severity Alerts (rule.severity >= 7)
  const highSeverityAlerts = evidence.filter(item => {
    const sev = Number(item.rule?.severity);
    return !isNaN(sev) && sev >= 7;
  }).length;

  // The backend calculates unusual events from the observed entity baseline.
  const unusualEvents = Number(behaviour.unusual_events || 0);

  // 4. Correlated Events (events tied to correlation findings / clusters)
  const correlatedEvents = (correlation.clusters || []).reduce(
    (count, cluster) => count + Number(cluster.event_count || 0),
    0
  );

  const stats = [
    { name: 'TOTAL ALERTS', value: totalAlerts, icon: Bell, color: 'var(--primary)' },
    { name: 'HIGH SEVERITY ALERTS', value: highSeverityAlerts, icon: ShieldAlert, color: 'var(--danger)' },
    { name: 'UNUSUAL EVENTS', value: unusualEvents, icon: Zap, color: 'var(--warning)' },
    { name: 'CORRELATED EVENTS', value: correlatedEvents, icon: Layers, color: 'var(--info)' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      width: '100%'
    }}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="glass-panel"
            style={{
              background: 'var(--glass-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                {stat.name}
              </span>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {stat.value}
              </span>
            </div>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertOverview;
