import React from 'react';
import { ShieldAlert } from 'lucide-react';

const EmptyState = ({ title = 'NO DATA AVAILABLE', message = 'No entries match the selected filters.' }) => {
  return (
    <div style={{
      background: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '40px 20px',
      textAlign: 'center',
      color: 'var(--text-secondary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      margin: '20px 0',
      width: '100%'
    }}>
      <div style={{
        padding: '12px',
        borderRadius: '50%',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        color: 'var(--warning)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ShieldAlert size={36} />
      </div>
      <div>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
        <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto', lineHeight: '1.5' }}>{message}</p>
      </div>
    </div>
  );
};

export default EmptyState;
