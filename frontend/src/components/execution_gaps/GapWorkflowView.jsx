import React from 'react';
import { CheckCircle, XCircle, Circle } from 'lucide-react';

const ACTION_LABELS = {
  acknowledge: 'Acknowledge',
  investigate: 'Investigate',
  escalate: 'Escalate',
  remediate: 'Remediate',
  close: 'Close',
};

const ActionRow = ({ action, completed, missing }) => {
  const label = ACTION_LABELS[action] || action;
  if (completed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
        <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
      </div>
    );
  }
  if (missing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
        <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--danger)', background: 'var(--danger-bg)', padding: '1px 6px', borderRadius: '4px' }}>MISSING</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
      <Circle size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
};

const GapWorkflowView = ({ incident }) => {
  if (!incident) return null;

  const { expected_actions = [], completed_actions = [], missing_actions = [], recorded_actions = [] } = incident;
  const completedSet = new Set(completed_actions);
  const missingSet = new Set(missing_actions);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Expected */}
      <div className="glass-panel" style={{
        background: 'var(--glass-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
          Expected Workflow
        </div>
        {expected_actions.map(action => (
          <ActionRow key={action} action={action} completed={true} />
        ))}
      </div>

      {/* Actual */}
      <div className="glass-panel" style={{
        background: 'var(--glass-surface)',
        border: `1px solid ${incident.execution_gap ? 'var(--danger)' : 'var(--success)'}33`,
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
          Actual (Recorded)
        </div>
        {expected_actions.map(action => (
          <ActionRow
            key={action}
            action={action}
            completed={completedSet.has(action)}
            missing={missingSet.has(action)}
          />
        ))}
      </div>

      {/* Action History / Notes */}
      {recorded_actions && recorded_actions.length > 0 && (
        <div className="glass-panel" style={{
          gridColumn: '1 / -1',
          background: 'var(--glass-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '12px'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
            Action History & Analyst Notes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recorded_actions.map((act, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px', 
                paddingBottom: index < recorded_actions.length - 1 ? '10px' : '0', 
                borderBottom: index < recorded_actions.length - 1 ? '1px solid var(--border-color)' : 'none' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {ACTION_LABELS[act.action] || act.action}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>Analyst:</strong> {act.analyst}
                </div>
                {act.notes && (
                  <div style={{ 
                    fontSize: '0.78rem', 
                    color: 'var(--text-secondary)', 
                    padding: '6px 10px', 
                    background: 'var(--bg-elevated)', 
                    borderRadius: '6px', 
                    marginTop: '2px', 
                    fontStyle: 'italic',
                    borderLeft: '2px solid var(--primary)'
                  }}>
                    "{act.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GapWorkflowView;
