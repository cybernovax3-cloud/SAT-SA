import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SeverityBadge from '../common/SeverityBadge';
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';

const AlertTable = ({ alerts = [] }) => {
  const navigate = useNavigate();

  // Sorting state
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Helper to format timestamp
  const formatTimestamp = (timestampStr) => {
    if (!timestampStr) return 'N/A';
    try {
      const date = new Date(timestampStr);
      if (isNaN(date.getTime())) return timestampStr;
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds}`;

      // Check if it's today
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return timeStr;
      }

      // Older event
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${timeStr}`;
    } catch {
      return timestampStr;
    }
  };

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to newest/highest severity first
    }
    setCurrentPage(1);
  };

  // Map severity string/number to comparative value for sorting
  const getSeverityScore = (sev) => {
    const num = Number(sev);
    if (!isNaN(num)) return num;
    const str = String(sev).toUpperCase();
    if (str === 'CRITICAL') return 10;
    if (str === 'HIGH') return 7;
    if (str === 'MEDIUM') return 4;
    return 1;
  };

  // Sort & Paginate Alerts
  const sortedAlerts = useMemo(() => {
    const data = [...alerts];
    return data.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Custom resolution for nested properties or special fields
      if (sortField === 'agent') {
        valA = a.agent?.name || '';
        valB = b.agent?.name || '';
      } else if (sortField === 'rule') {
        valA = a.rule?.id || 0;
        valB = b.rule?.id || 0;
      } else if (sortField === 'severity') {
        valA = getSeverityScore(a.rule?.severity);
        valB = getSeverityScore(b.rule?.severity);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [alerts, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedAlerts.length / pageSize) || 1;
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedAlerts.slice(startIndex, startIndex + pageSize);
  }, [sortedAlerts, currentPage, pageSize]);

  // Adjust page number if it goes out of bounds (e.g. after filtering)
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>ALERTS</h3>
        
        {/* Page Size Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {[10, 25, 50, 100].map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontWeight: 600
            }}>
              <th onClick={() => handleSort('timestamp')} style={{ padding: '12px 8px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Timestamp {renderSortIcon('timestamp')}
                </span>
              </th>
              <th style={{ padding: '12px 8px' }}>Event ID</th>
              <th onClick={() => handleSort('agent')} style={{ padding: '12px 8px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Agent {renderSortIcon('agent')}
                </span>
              </th>
              <th style={{ padding: '12px 8px' }}>Agent IP</th>
              <th onClick={() => handleSort('rule')} style={{ padding: '12px 8px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Rule ID {renderSortIcon('rule')}
                </span>
              </th>
              <th onClick={() => handleSort('severity')} style={{ padding: '12px 8px', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Severity {renderSortIcon('severity')}
                </span>
              </th>
              <th style={{ padding: '12px 8px' }}>Decoder</th>
              <th style={{ padding: '12px 8px' }}>Description</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '24px 0', textTransform: 'uppercase', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No Alerts Found
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alert, index) => (
                <tr
                  key={alert.event_id || `${alert.timestamp || 'alert'}-${index}`}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    transition: 'background-color 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/alerts/${alert.event_id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatTimestamp(alert.timestamp)}
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {alert.event_id ? alert.event_id.substring(0, 8) + '...' : 'N/A'}
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                    {alert.agent?.name || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {alert.agent?.ip || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    {alert.rule?.id || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <SeverityBadge severity={alert.rule?.severity} />
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--info)' }}>
                    {alert.decoder || 'N/A'}
                  </td>
                  <td style={{
                    padding: '12px 8px',
                    maxWidth: '240px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'var(--text-secondary)'
                  }}>
                    {alert.rule?.description || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/alerts/${alert.event_id}`)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            Showing {Math.min(sortedAlerts.length, (currentPage - 1) * pageSize + 1)} to {Math.min(sortedAlerts.length, currentPage * pageSize)} of {sortedAlerts.length} alerts
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '6px 12px',
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              Previous
            </button>
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '6px 12px',
                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertTable;
