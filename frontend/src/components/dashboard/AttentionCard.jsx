import React from 'react';
import { Eye } from 'lucide-react';

const AttentionCard = ({ score }) => {
  const roundedScore = Math.round(score || 0);

  const getSeverityStyle = (val) => {
    if (val >= 70) return { label: 'HIGH', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.05)' };
    if (val >= 40) return { label: 'MEDIUM', color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)' };
    return { label: 'LOW', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.05)' };
  };

  const style = getSeverityStyle(roundedScore);

  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: `1px solid ${style.color}22`,
      borderRadius: '16px',
      padding: '20px',
      flex: 1,
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          SUPERVISORY ATTENTION
        </span>
        <Eye size={16} style={{ color: style.color }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {roundedScore}
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: style.color, backgroundColor: style.bg, padding: '2px 8px', borderRadius: '4px' }}>
          {style.label}
        </span>
      </div>
    </div>
  );
};

export default AttentionCard;
