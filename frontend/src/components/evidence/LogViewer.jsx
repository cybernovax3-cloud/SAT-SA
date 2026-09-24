import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const LogViewer = ({ logContent }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!logContent) return;
    try {
      await navigator.clipboard.writeText(logContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy log:', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          FULL LOG
        </h3>
        
        {logContent && (
          <button
            onClick={handleCopy}
            style={{
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border-color)',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-darker)'}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Log</span>
              </>
            )}
          </button>
        )}
      </div>

      <pre style={{
        margin: 0,
        padding: '16px',
        backgroundColor: 'var(--bg-darker)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        color: '#34d399', // Greenish code/log color for high legibility
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        lineHeight: '1.6',
        overflowX: 'auto',
        whiteSpace: 'pre-wrap', // Wrap long log lines
        wordBreak: 'break-all',
        userSelect: 'text'
      }}>
        {logContent || 'No raw log evidence available.'}
      </pre>
    </div>
  );
};

export default LogViewer;
