import React from 'react';

const EvidenceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'normalized', label: 'Normalized' },
    { id: 'raw', label: 'Raw Log' }
  ];

  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border-color)',
      width: '100%',
      marginBottom: '16px'
    }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default EvidenceTabs;
