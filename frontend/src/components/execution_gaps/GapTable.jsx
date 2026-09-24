import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

const SEVERITY_COLORS = {
  critical: 'var(--danger)',
  high:     'var(--warning)',
  medium:   '#f59e0b',
  low:      'var(--success)',
};

const GapTable = ({ incidents = [], onSelect, selectedId }) => {
  const [sortField, setSortField] = useState('severity_level');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = [...incidents].sort((a, b) => {
    const av = a[sortField] ?? 0;
    const bv = b[sortField] ?? 0;
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });

  if (!incidents.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        No incidents assessed yet. Incidents are generated from live Wazuh alert data.
      </div>
    );
  }

  const SortHeader = ({ field, children }) => (
    <th
      onClick={() => { setSortField(field); setSortDir(s => s === 'asc' ? 'desc' : 'asc'); }}
      style={{ cursor: 'pointer', padding: '10px 14px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', userSelect: 'none', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}
    >
      {children} {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ background: 'var(--bg-elevated)' }}>
            <SortHeader field="incident_id">Incident</SortHeader>
            <SortHeader field="alert_type">Alert / Activity</SortHeader>
            <SortHeader field="severity_level">Severity</SortHeader>
            <th style={{ padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>Expected</th>
            <th style={{ padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>Completed</th>
            <th style={{ padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>Missing</th>
            <th style={{ padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>Gap Status</th>
            <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)' }}></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((inc, idx) => {
            const color = SEVERITY_COLORS[inc.severity] || 'var(--text-muted)';
            const isSelected = selectedId === inc.incident_id;
            return (
              <tr
                key={inc.incident_id}
                onClick={() => onSelect(inc)}
                style={{
                  cursor: 'pointer',
                  background: isSelected ? 'var(--primary-soft)' : idx % 2 === 0 ? 'var(--glass-surface)' : 'transparent',
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-dark-hover)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = idx % 2 === 0 ? 'var(--glass-surface)' : 'transparent'; }}
              >
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  #{inc.incident_id.slice(-8)}
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-primary)', maxWidth: '200px' }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.activity_type || inc.alert_type}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.alert_type}</div>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}33`, textTransform: 'uppercase' }}>
                    {inc.severity}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {inc.expected_actions?.length ?? 0}
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
                  {inc.completed_actions?.length ?? 0}
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: inc.missing_actions?.length ? 'var(--danger)' : 'var(--success)' }}>
                  {inc.missing_actions?.length ?? 0}
                  {inc.missing_actions?.length > 0 && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--danger)', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
                      {inc.missing_actions.join(', ')}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  {inc.execution_gap ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--danger)' }}>
                      <AlertTriangle size={12} /> GAP
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)' }}>
                      <CheckCircle size={12} /> COMPLETE
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                  {isSelected ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GapTable;
