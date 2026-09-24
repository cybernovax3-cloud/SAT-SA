import React from 'react';
import { Search, X } from 'lucide-react';

const AlertFilters = ({
  search,
  setSearch,
  selectedSeverity,
  setSelectedSeverity,
  selectedAgent,
  setSelectedAgent,
  agents = [],
  severities = [],
  onClear
}) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '16px 20px',
      width: '100%'
    }}>
      {/* Search Input */}
      <div style={{
        position: 'relative',
        flex: '1 1 280px',
        minWidth: '200px'
      }}>
        <span style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search alerts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-darker)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
            padding: '8px 12px 8px 36px',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>

      {/* Filters & Actions Container */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center'
      }}>
        {/* Severity Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All">Severity: All</option>
            {severities.map((sev) => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>
        </div>

        {/* Agent Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '200px'
            }}
          >
            <option value="All">Agent: All Agents</option>
            {agents.map((agentName) => (
              <option key={agentName} value={agentName}>{agentName}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {(search || selectedSeverity !== 'All' || selectedAgent !== 'All') && (
          <button
            onClick={onClear}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: 'var(--border-radius)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertFilters;
