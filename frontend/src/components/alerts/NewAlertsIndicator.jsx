import React from 'react';
import { ArrowUp } from 'lucide-react';

const NewAlertsIndicator = ({ count = 0, onClick }) => {
  if (count <= 0) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      margin: '8px 0'
    }}>
      <button
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          transition: 'transform 0.2s, background-color 0.2s',
          animation: 'bounce 2s infinite'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <ArrowUp size={14} />
        <span>+{count} new alerts. View latest</span>
        
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-4px);
            }
            60% {
              transform: translateY(-2px);
            }
          }
        `}</style>
      </button>
    </div>
  );
};

export default NewAlertsIndicator;
