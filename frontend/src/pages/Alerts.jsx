import React, { useState, useMemo, useEffect } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import AlertStats from '../components/alerts/AlertStats';
import AlertFilters from '../components/alerts/AlertFilters';
import AlertTable from '../components/alerts/AlertTable';
import NewAlertsIndicator from '../components/alerts/NewAlertsIndicator';
import EmptyState from '../components/common/EmptyState';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import { RefreshCw, Play, Pause, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../api/api';

const Alerts = ({ setApiStatus, setLastUpdated }) => {
  const {
    alerts,
    loading,
    status,
    lastUpdated,
    error,
    autoRefresh,
    setAutoRefresh,
    newAlertsCount,
    clearNewAlerts,
    refresh
  } = useAlerts();

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState('All');

  // Push API status up to App layout wrapper
  useEffect(() => {
    if (setApiStatus) setApiStatus(status);
    if (setLastUpdated && lastUpdated) setLastUpdated(lastUpdated);
  }, [status, lastUpdated, setApiStatus, setLastUpdated]);

  // Extract unique agents from alerts list for the filter dropdown
  const uniqueAgents = useMemo(() => {
    const names = alerts
      .map(a => a.agent?.name)
      .filter(name => name !== undefined && name !== null && name !== '');
    return Array.from(new Set(names)).sort();
  }, [alerts]);

  const uniqueSeverities = useMemo(() => {
    const values = alerts
      .map(alert => alert.rule?.severity)
      .filter(value => value !== undefined && value !== null && value !== '');
    return Array.from(new Set(values.map(String))).sort((a, b) => Number(a) - Number(b));
  }, [alerts]);

  // Handle Clear Filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedSeverity('All');
    setSelectedAgent('All');
  };

  // Convert severity rule numbers to Low/Medium/High/Critical labels
  const getSeverityLabel = (sev) => {
    const num = Number(sev);
    if (!isNaN(num)) {
      if (num >= 10) return 'critical';
      if (num >= 7) return 'high';
      if (num >= 4) return 'medium';
      return 'low';
    }
    return String(sev).toLowerCase();
  };

  // Filter logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // 1. Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = !search ||
        (alert.event_id && alert.event_id.toLowerCase().includes(searchLower)) ||
        (alert.agent?.name && alert.agent?.name.toLowerCase().includes(searchLower)) ||
        (alert.agent?.id && alert.agent?.id.toLowerCase().includes(searchLower)) ||
        (alert.agent?.ip && alert.agent?.ip.toLowerCase().includes(searchLower)) ||
        (alert.rule?.id && String(alert.rule?.id).toLowerCase().includes(searchLower)) ||
        (alert.decoder && alert.decoder.toLowerCase().includes(searchLower)) ||
        (alert.rule?.description && alert.rule?.description.toLowerCase().includes(searchLower)) ||
        (alert.location && alert.location.toLowerCase().includes(searchLower));

      // 2. Severity filter
      const label = getSeverityLabel(alert.rule?.severity);
      const rawSeverity = String(alert.rule?.severity ?? '');
      const matchesSeverity = selectedSeverity === 'All'
        || rawSeverity === selectedSeverity
        || label === selectedSeverity.toLowerCase();

      // 3. Agent filter
      const matchesAgent = selectedAgent === 'All' || alert.agent?.name === selectedAgent;

      return matchesSearch && matchesSeverity && matchesAgent;
    });
  }, [alerts, search, selectedSeverity, selectedAgent]);

  // Handle viewing latest alerts (scroll to top/refresh list and clear counts)
  const handleViewLatest = () => {
    clearNewAlerts();
    refresh();
  };

  if (loading && alerts.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Security Events
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Loading security alerts...
            </p>
          </div>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        gap: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          padding: '16px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={48} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            SAT-SA BACKEND UNAVAILABLE
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 12px auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Unable to retrieve security alerts. Please check that the backend service is running.
          </p>
          <code style={{
            display: 'block',
            backgroundColor: 'var(--bg-dark)',
            padding: '8px 12px',
            borderRadius: '4px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            marginBottom: '20px',
            border: '1px solid var(--border-color)'
          }}>
            {API_BASE_URL}
          </code>
        </div>
        <button
          onClick={refresh}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Header Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            ALERTS
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Real-time security event monitoring
          </p>
        </div>

        {/* Polling / Refresh Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '4px 10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Auto Refresh:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                backgroundColor: autoRefresh ? 'var(--success)' : 'var(--bg-darker)',
                border: '1px solid var(--border-color)',
                color: autoRefresh ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              {autoRefresh ? <Play size={10} /> : <Pause size={10} />}
              {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <div>Last updated: {lastUpdated || '--'}</div>
          </div>

          <button
            onClick={refresh}
            style={{
              backgroundColor: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background var(--transition-speed)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark)'}
          >
            <RefreshCw size={14} className={loading ? "spin-animation" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          title="NO SECURITY ALERTS"
          message="No security alerts are currently available from the SAT-SA backend."
        />
      ) : (
        <>
          {/* Section 7 — Alert Stats */}
          <AlertStats alerts={alerts} />

          {/* Section 13, 14, 15, 16 — Filters */}
          <AlertFilters
            search={search}
            setSearch={setSearch}
            selectedSeverity={selectedSeverity}
            setSelectedSeverity={setSelectedSeverity}
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            agents={uniqueAgents}
            severities={uniqueSeverities}
            onClear={handleClearFilters}
          />

          {/* Section 37 — New Alerts Detector */}
          <NewAlertsIndicator count={newAlertsCount} onClick={handleViewLatest} />

          {/* Section 8 — Alert Table */}
          {filteredAlerts.length === 0 ? (
            <EmptyState
              title="NO MATCHING ALERTS"
              message="No alerts match the selected search criteria or filters. Try clearing your filters."
            />
          ) : (
            <AlertTable alerts={filteredAlerts} />
          )}
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Alerts;
