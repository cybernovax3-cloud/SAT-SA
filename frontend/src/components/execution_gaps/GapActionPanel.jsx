import React, { useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';

const ACTIONS = [
  { id: 'acknowledge', label: 'Acknowledge', color: 'var(--info)' },
  { id: 'investigate', label: 'Investigate', color: 'var(--primary)' },
  { id: 'escalate',   label: 'Escalate',   color: 'var(--warning)' },
  { id: 'remediate',  label: 'Remediate',  color: 'var(--success)' },
  { id: 'close',      label: 'Close',      color: 'var(--text-muted)' },
];

const GapActionPanel = ({ incidentId, completedActions = [], onAction, busy = false }) => {
  const [notes, setNotes] = useState('');
  const completedSet = new Set(completedActions);

  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Analyst Actions
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {ACTIONS.map(({ id, label, color }) => {
          const done = completedSet.has(id);
          return (
            <button
              key={id}
              disabled={done || busy}
              onClick={() => { onAction(id, notes); setNotes(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${done ? 'var(--border-color)' : color}`,
                background: done ? 'var(--bg-elevated)' : 'transparent',
                color: done ? 'var(--text-muted)' : color,
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: done || busy ? 'not-allowed' : 'pointer',
                opacity: done || busy ? 0.65 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {done ? <CheckCircle size={14} /> : busy ? <Loader size={14} /> : null}
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Optional notes for this action..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        Actions are recorded for this session only. Each action can be performed once per incident.
      </div>
    </div>
  );
};

export default GapActionPanel;
