import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyableField = ({ label, value, showCopy = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '12px 16px',
      backgroundColor: 'var(--bg-darker)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      position: 'relative'
    }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          fontFamily: label.includes('ID') || label.includes('IP') || label.includes('TIME') ? 'var(--font-mono)' : 'inherit',
          wordBreak: 'break-all'
        }}>
          {value || 'N/A'}
        </span>
        {showCopy && value && (
          <button
            onClick={handleCopy}
            title={`Copy ${label}`}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 0.2s, color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

const EventInformation = ({ alert = {} }) => {
  const formatTimestampFull = (timestampStr) => {
    if (!timestampStr) return 'N/A';
    try {
      const date = new Date(timestampStr);
      if (isNaN(date.getTime())) return timestampStr;
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return timestampStr;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%'
    }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '4px' }}>
        EVENT INFORMATION
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        <CopyableField label="Event ID" value={alert.event_id} />
        <CopyableField label="Timestamp" value={formatTimestampFull(alert.timestamp)} showCopy={false} />
        <CopyableField label="Source" value={alert.source} showCopy={false} />
        <CopyableField label="Agent ID" value={alert.agent?.id} showCopy={false} />
        <CopyableField label="Agent Name" value={alert.agent?.name} showCopy={false} />
        <CopyableField label="Agent IP" value={alert.agent?.ip} />
      </div>
    </div>
  );
};

export { CopyableField };
export default EventInformation;
