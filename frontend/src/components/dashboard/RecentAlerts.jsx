import React from 'react';
import SeverityBadge from './SeverityBadge';

const RecentAlerts = ({ evidence = [] }) => {
  // Sort evidence by timestamp descending, limit to 8
  const sortedAlerts = [...evidence]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--:--';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%',
      overflow: 'hidden'
    }}>
      <h3 style={{
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        marginBottom: '16px'
      }}>
        Recent Alerts
      </h3>

      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 8px', fontWeight: 600 }}>Time</th>
              <th style={{ padding: '12px 8px', fontWeight: 600 }}>Agent</th>
              <th style={{ padding: '12px 8px', fontWeight: 600 }}>Rule</th>
              <th style={{ padding: '12px 8px', fontWeight: 600 }}>Decoder</th>
              <th style={{ padding: '12px 8px', fontWeight: 600 }}>Severity</th>
              <th style={{ padding: '12px 8px', fontWeight: 600 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlerts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No recent security evidence alerts detected.
                </td>
              </tr>
            ) : (
              sortedAlerts.map((alert, index) => (
                <tr
                  key={alert.event_id || index}
                  style={{
                    borderBottom: index === sortedAlerts.length - 1 ? 'none' : '1px solid var(--border-color)',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formatTime(alert.timestamp)}
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {alert.agent?.name || 'unknown'}
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {alert.rule?.id || '--'}
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--info)', fontFamily: 'var(--font-mono)' }}>
                    {alert.decoder || 'syslog'}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <SeverityBadge severity={alert.rule?.severity} />
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={alert.rule?.description}>
                    {alert.rule?.description || '--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAlerts;
