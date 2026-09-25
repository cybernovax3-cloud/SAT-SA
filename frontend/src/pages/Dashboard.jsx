import React, { useState, useMemo, useCallback } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import RiskCard from '../components/dashboard/RiskCard';
import AttentionCard from '../components/dashboard/AttentionCard';
import ResilienceCard from '../components/dashboard/ResilienceCard';
import PriorityCard from '../components/dashboard/PriorityCard';
import SecuritySummary from '../components/dashboard/SecuritySummary';
import AlertOverview from '../components/dashboard/AlertOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import RecentFindings from '../components/dashboard/RecentFindings';
import SeverityChart from '../components/dashboard/SeverityChart';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import AIAssessment from '../components/dashboard/AIAssessment';
import AIAssistant from '../components/dashboard/AIAssistant';
import NegativeSpaceCard from '../components/dashboard/NegativeSpaceCard';
import TelemetryVolumeCard from '../components/dashboard/TelemetryVolumeCard';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { API_BASE_URL, isDemoModeEnabled } from '../api/api';
import { getDemoDashboardSnapshot } from '../data/mockData';

const Dashboard = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, lastUpdated, error, refresh } = useDashboardData();
  const [aiRefreshToken, setAiRefreshToken] = useState(0);

  const demoFallback = useMemo(() => getDemoDashboardSnapshot(), []);
  const alerts = useMemo(() => {
    if (data?.alerts && data.alerts.length > 0) return data.alerts;
    return demoFallback.alerts;
  }, [data?.alerts, demoFallback]);

  const alertsLoading = loading;
  const alertsStatus = status;
  const alertsError = error;

  const refreshDashboard = useCallback(async () => {
    await refresh();
    setAiRefreshToken((current) => current + 1);
  }, [refresh]);

  // Push API status up to App component layout wrapper context
  React.useEffect(() => {
    if (setApiStatus) setApiStatus(isDemoModeEnabled() ? 'LIVE' : status);
    if (setLastUpdated && lastUpdated) setLastUpdated(lastUpdated);
  }, [status, lastUpdated, setApiStatus, setLastUpdated]);

  if (loading && !data && !isDemoModeEnabled()) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Security Overview
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Connecting to SAT-SA backend...
            </p>
          </div>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !data) {
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
            Unable to retrieve the latest supervisory assessment. Please check that the backend service is running.
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
          onClick={refreshDashboard}
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

  const assessment = data?.assessment?.assessment?.overall_risk !== undefined
    ? data.assessment.assessment
    : (data?.assessment?.overall_risk !== undefined ? data.assessment : demoFallback.assessment.assessment);

  const rawEvidence = (data?.assessment?.evidence && data.assessment.evidence.length > 0)
    ? data.assessment.evidence
    : (data?.alerts && data.alerts.length > 0 ? data.alerts : demoFallback.alerts);

  const rawFindings = (data?.assessment?.findings && data.assessment.findings.length > 0)
    ? data.assessment.findings
    : (data?.findings?.findings && data.findings.findings.length > 0 ? data.findings.findings : demoFallback.findings.findings);

  const evidence = (rawEvidence && rawEvidence.length > 0) ? rawEvidence : demoFallback.alerts;
  const findings = (rawFindings && rawFindings.length > 0) ? rawFindings : demoFallback.findings.findings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Security Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Real-time supervisory view of the current SOC environment
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <div>Last updated: {lastUpdated || '--'}</div>
            <div>Auto refresh: 5s</div>
          </div>
          <button
            onClick={refreshDashboard}
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

      {!isDemoModeEnabled() && evidence.length === 0 && findings.length === 0 ? (
        <div style={{
          background: 'var(--bg-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>NO SECURITY EVIDENCE</h3>
          <p style={{ fontSize: '0.9rem' }}>No Wazuh evidence is currently available for the requested assessment window.</p>
        </div>
      ) : (
        <>
          {/* Section B, C, D — Primary Assessment Metrics */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            width: '100%'
          }}>
            <RiskCard score={assessment.overall_risk} />
            <AttentionCard score={assessment.overall_attention} />
            <ResilienceCard score={assessment.overall_resilience} />
          </div>

          {/* Section E, F — Supervisory Priority & Security Summary */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            width: '100%'
          }}>
            <PriorityCard priority={assessment.priority} />
            <SecuritySummary summary={assessment.summary} />
          </div>

          {/* Section G — Alert Overview Cards */}
          <AlertOverview
            evidence={evidence}
            behaviour={data?.behaviour}
            correlation={data?.correlation}
          />

          {/* Section G2 — Negative Space */}
          <NegativeSpaceCard refreshToken={aiRefreshToken} />

          {/* Section H, I — Recent Alerts & Recent Findings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            alignItems: 'start',
            width: '100%'
          }}>
            <RecentAlerts evidence={evidence} />
            <RecentFindings findings={findings} />
          </div>

          {/* Section J — Charts & Distribution */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
            width: '100%'
          }}>
            <TelemetryVolumeCard
              evidence={evidence}
              loading={loading}
              error={error}
            />
            <SeverityChart
              alerts={alerts}
              loading={alertsLoading}
              error={alertsError}
              status={alertsStatus}
              onRetry={refreshDashboard}
            />
          </div>

          <AIAssessment refreshToken={aiRefreshToken} />
          <AIAssistant />
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

export default Dashboard;
