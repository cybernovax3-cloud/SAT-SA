import React from 'react';
import { AlertTriangle } from 'lucide-react';

const PriorityCard = ({ priority }) => {
  const displayPriority = (priority || 'medium').toUpperCase();

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'HIGH':
        return { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.05)' };
      case 'MEDIUM':
        return { color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.05)' };
      case 'LOW':
      default:
        return { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.05)' };
    }
  };

  const style = getPriorityStyle(displayPriority);

  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '20px',
      flex: 1,
      minWidth: '220px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          SUPERVISORY PRIORITY
        </span>
        <AlertTriangle size={16} style={{ color: style.color }} />
      </div>
      <div style={{
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: style.color,
        letterSpacing: '0.02em',
        padding: '8px 0'
      }}>
        {displayPriority}
      </div>
    </div>
  );
};

export default PriorityCard;
