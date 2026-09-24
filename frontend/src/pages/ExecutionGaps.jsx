import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../api/api';
import GapOverviewCards from '../components/execution_gaps/GapOverviewCards';
import GapTable from '../components/execution_gaps/GapTable';
import GapWorkflowView from '../components/execution_gaps/GapWorkflowView';
import GapActionPanel from '../components/execution_gaps/GapActionPanel';
import GapAIAssessment from '../components/execution_gaps/GapAIAssessment';

const ExecutionGaps = () => {
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [gapsResp, statsResp] = await Promise.all([
        api.get('/api/execution-gaps', { params: { limit: 100 } }),
        api.get('/api/execution-gaps/statistics', { params: { limit: 100 } }),
      ]);
      setIncidents(gapsResp.data?.incidents || []);
      setStats(statsResp.data);
      setLastRefresh(new Date().toLocaleTimeString());
      // If we have a selected incident, refresh it
      if (selected) {
        const refreshed = (gapsResp.data?.incidents || []).find(i => i.incident_id === selected.incident_id);
        if (refreshed) setSelected(refreshed);
      }
    } catch (err) {
      setError(err.response?.status === 503
        ? 'Backend unavailable. Check that the SAT-SA backend is running.'
        : 'Failed to load execution gap data.');
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (action, notes) => {
    if (!selected) return;
    setActionBusy(true);
    try {
      await api.post(`/api/execution-gaps/${selected.incident_id}/actions`, {
        action,
        notes: notes || '',
        analyst: 'SOC Analyst',
      });
      // Refresh the single incident
      const resp = await api.get(`/api/execution-gaps/${selected.incident_id}`);
      setSelected(resp.data);
      // Also refresh the full list & stats
      await fetchData();
    } catch (err) {
      console.error('Failed to record action:', err);
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '4px 0' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={22} style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Execution Gap Detection
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Compare expected SOC workflows against recorded analyst actions
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastRefresh && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Updated: {lastRefresh}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid var(--border-color)', background: 'var(--glass-surface)',
              color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', backdropFilter: 'blur(10px)',
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin-animation' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger)33', borderRadius: '10px', color: 'var(--danger)', fontSize: '0.85rem' }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Overview cards */}
      <GapOverviewCards stats={stats} loading={loading} />

      {/* Disclaimer */}
      <div style={{ padding: '12px 16px', background: 'var(--info-bg)', border: '1px solid var(--info)33', borderRadius: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
        <strong style={{ color: 'var(--info)' }}>ℹ Analyst Note:</strong> Execution gaps are detected based on <em>recorded SAT-SA analyst actions only</em>.
        A missing action does not necessarily mean the action was not performed — it means it was not recorded in this session.
        If insufficient evidence exists to determine execution status, the gap is shown as "No actions recorded".
      </div>

      {/* Incidents Table */}
      <div className="glass-panel" style={{
        background: 'var(--glass-surface)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Incident Execution Gap Table
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {incidents.length} incidents
          </span>
        </div>
        <GapTable
          incidents={incidents}
          onSelect={inc => setSelected(inc === selected ? null : inc)}
          selectedId={selected?.incident_id}
        />
      </div>

      {/* Incident Detail Panel */}
      {selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Detail header */}
          <div className="glass-panel" style={{
            background: 'var(--glass-surface)', border: `1px solid ${selected.execution_gap ? 'var(--danger)' : 'var(--success)'}33`,
            borderRadius: '16px', padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  INCIDENT #{selected.incident_id.slice(-12)}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {selected.activity_type || selected.alert_type}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{selected.alert_type}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase',
                  color: selected.severity === 'critical' ? 'var(--danger)' : selected.severity === 'high' ? 'var(--warning)' : selected.severity === 'medium' ? '#f59e0b' : 'var(--success)',
                  background: selected.severity === 'critical' ? 'var(--danger-bg)' : selected.severity === 'high' ? 'var(--warning-bg)' : selected.severity === 'medium' ? 'rgba(245,158,11,0.1)' : 'var(--success-bg)',
                }}>
                  {selected.severity} severity
                </span>
                {selected.execution_gap ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', background: 'var(--danger-bg)' }}>
                    <AlertTriangle size={12} /> EXECUTION GAP
                  </span>
                ) : (
                  <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-bg)' }}>
                    ✓ WORKFLOW COMPLETE
                  </span>
                )}
              </div>
            </div>

            {/* Gap types */}
            {selected.gap_types?.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selected.gap_types.map(gt => (
                  <span key={gt} style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--warning)', background: 'var(--warning-bg)', border: '1px solid var(--warning)33' }}>
                    {gt}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Workflow comparison */}
          <GapWorkflowView incident={selected} />

          {/* Action panel */}
          <GapActionPanel
            incidentId={selected.incident_id}
            completedActions={selected.completed_actions || []}
            onAction={handleAction}
            busy={actionBusy}
          />

          {/* AI Assessment */}
          <GapAIAssessment incidentId={selected.incident_id} />
        </div>
      )}
    </div>
  );
};

export default ExecutionGaps;
