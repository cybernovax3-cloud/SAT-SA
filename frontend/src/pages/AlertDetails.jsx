import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlerts } from '../api/api';
import EventInformation from '../components/evidence/EventInformation';
import AlertRuleDetails from '../components/evidence/AlertRuleDetails';
import EvidenceMetadata from '../components/evidence/EvidenceMetadata';
import LogViewer from '../components/evidence/LogViewer';
import AIAlertExplanation from '../components/evidence/AIAlertExplanation';
import EvidenceTabs from '../components/evidence/EvidenceTabs';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import SeverityBadge from '../components/common/SeverityBadge';
import { ArrowLeft, RefreshCw, ShieldAlert, Copy, Check } from 'lucide-react';

const getActivityDetails = (activityType) => {
  if (!activityType) {
    return {
      title: "Security Event",
      whatHappened: "Wazuh detected a security event on the monitored system.",
      whyItMatters: "Unclassified security events should be evaluated by analysts to determine if they pose a threat.",
      isMissing: true
    };
  }

  const mapping = {
    "Nmap Network Scanning": {
      whatHappened: "Wazuh detected Nmap network scanning activity.",
      whyItMatters: "Network scanning is reconnaissance to identify active hosts and open ports for targeting."
    },
    "Network Reconnaissance / Port Scanning": {
      whatHappened: "Wazuh detected port scanning or reconnaissance activity.",
      whyItMatters: "Port scanning is used to discover active services and map the network layout."
    },
    "ICMP Probing": {
      whatHappened: "Wazuh detected ICMP echo requests / ping activity.",
      whyItMatters: "ICMP probing is used to perform host discovery and network mapping."
    },
    "SSH Brute-Force Activity": {
      whatHappened: "Wazuh detected multiple failed SSH authentication attempts, indicating brute-force activity.",
      whyItMatters: "Brute-force attempts represent active intrusion attempts to compromise credentials."
    },
    "SSH Authentication Success": {
      whatHappened: "Wazuh detected a successful SSH authentication login.",
      whyItMatters: "Successful logins should be audited to verify authorization."
    },
    "SSH Authentication Failure": {
      whatHappened: "Wazuh detected a failed SSH authentication attempt.",
      whyItMatters: "Repeated authentication failures may indicate brute-force attempts and should be monitored."
    },
    "PAM Session Opened": {
      whatHappened: "Wazuh detected a PAM login session opened.",
      whyItMatters: "Session open events help track user access and active logins."
    },
    "PAM Session Closed": {
      whatHappened: "Wazuh detected a PAM login session closed.",
      whyItMatters: "Session close events mark the end of user sessions."
    },
    "PAM Authentication Failure": {
      whatHappened: "Wazuh detected a PAM authentication failure.",
      whyItMatters: "Authentication failures could indicate unauthorized login attempts."
    },
    "Successful Sudo Execution": {
      whatHappened: "Wazuh detected a successful command execution via sudo to root privileges.",
      whyItMatters: "Sudo usage escalates privileges and should be verified as authorized administrative actions."
    },
    "Sudo Activity": {
      whatHappened: "Wazuh detected sudo execution activity.",
      whyItMatters: "Sudo execution changes privilege context and should be audited."
    },
    "System File Added": {
      whatHappened: "Wazuh detected a new system file added (syscheck).",
      whyItMatters: "Unplanned additions to system directories may indicate unauthorized software installation or system tampering."
    },
    "System File Integrity Changed": {
      whatHappened: "Wazuh detected a modification to a system file checksum (syscheck).",
      whyItMatters: "System file changes could represent tampering, Trojan installations, or unauthorized configuration edits."
    },
    "Host Anomaly Detection (Rootcheck)": {
      whatHappened: "Wazuh rootcheck detected a potential host anomaly or trojaned system file.",
      whyItMatters: "Anomaly detection alerts can reveal rootkits, malware presence, or compromised system binaries."
    },
    "New Group Created": {
      whatHappened: "Wazuh detected a new user group added to the system.",
      whyItMatters: "Creation of new groups escalates potential access vectors and should follow change control."
    },
    "New User Created": {
      whatHappened: "Wazuh detected a new user account added to the system.",
      whyItMatters: "Unauthorized user accounts are a common persistence mechanism used by adversaries."
    },
    "User/Group Deleted": {
      whatHappened: "Wazuh detected a user account or group deleted from the system.",
      whyItMatters: "Account deletion events help track user administration actions."
    },
    "Apparmor Security Restriction Event": {
      whatHappened: "Wazuh detected an Apparmor access denial restriction event.",
      whyItMatters: "Apparmor denials indicate confined processes attempting actions outside their profile, which could be exploitation attempts."
    },
    "Software Package Management Event": {
      whatHappened: "Wazuh detected package manager installation or configuration activity.",
      whyItMatters: "Auditing package installations ensures only approved packages are running in production."
    },
    "Security Event": {
      whatHappened: "Wazuh detected a general security event on the monitored system.",
      whyItMatters: "Unclassified security events should be evaluated by analysts to determine if they pose a threat."
    }
  };

  const details = mapping[activityType] || {
    whatHappened: `Wazuh detected a security event classified as ${activityType}.`,
    whyItMatters: "This event has been classified based on Wazuh rule description and available evidence."
  };

  return {
    title: activityType || "Security Event",
    whatHappened: details.whatHappened,
    whyItMatters: details.whyItMatters,
    isMissing: !activityType
  };
};

const AlertDetails = ({ setApiStatus, setLastUpdated }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('normalized');
  const [copiedId, setCopiedId] = useState(false);

  const fetchAlertDetail = useCallback(async () => {
    setLoading(true);
    if (setApiStatus) setApiStatus('CONNECTING');
    try {
      const response = await getAlerts(100);
      const allAlerts = Array.isArray(response.data)
        ? response.data
        : response.data?.alerts || [];
      const foundAlert = allAlerts.find(a => String(a.event_id) === String(eventId));
      
      if (foundAlert) {
        setAlert(foundAlert);
        setError(null);
        if (setApiStatus) setApiStatus('LIVE');
        if (setLastUpdated) setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setAlert(null);
        setError('ALERT_NOT_FOUND');
        if (setApiStatus) setApiStatus('LIVE');
      }
    } catch (err) {
      console.error('Error fetching alert details:', err);
      setError(err.message || 'Failed to reach SAT-SA backend');
      if (setApiStatus) setApiStatus('OFFLINE');
    } finally {
      setLoading(false);
    }
  }, [eventId, setApiStatus, setLastUpdated]);

  useEffect(() => {
    fetchAlertDetail();
  }, [fetchAlertDetail]);

  const handleCopyId = async () => {
    if (!eventId) return;
    try {
      await navigator.clipboard.writeText(eventId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <button
          onClick={() => navigate('/alerts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Alerts
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Alert Investigation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Loading alert evidence...
          </p>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error === 'ALERT_NOT_FOUND') {
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
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={48} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
            ALERT NOT FOUND
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
            The requested alert (ID: {eventId}) is no longer available in the active assessment window.
          </p>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
        >
          Back to Alerts
        </button>
      </div>
    );
  }

  if (error) {
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
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Unable to retrieve alert details. Please verify the backend connection.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/alerts')}
            style={{
              backgroundColor: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '10px 20px',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            Back to Alerts
          </button>
          <button
            onClick={fetchAlertDetail}
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
              gap: '8px'
            }}
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Back Navigation & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/alerts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            padding: '4px 0',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Alerts
        </button>

        <button
          onClick={fetchAlertDetail}
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
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Page Title Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            ALERT INVESTIGATION
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              Event ID: {alert.event_id || 'N/A'}
            </h1>
            <button
              onClick={handleCopyId}
              title="Copy full Event ID"
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: copiedId ? 'var(--success)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-dark)'
              }}
            >
              {copiedId ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Activity:</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              color: 'var(--primary)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: `1px solid rgba(59, 130, 246, 0.2)`
            }}>
              {alert.activity_type || 'Security Event'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</span>
            <SeverityBadge severity={alert?.rule?.severity} />
          </div>
        </div>
      </div>

      {/* Activity Type Section & Alert Explanation Card */}
      {(() => {
        const actDetails = getActivityDetails(alert.activity_type);
        return (
          <>
            {/* 1. Activity Type Section */}
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
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                ACTIVITY TYPE
              </span>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {actDetails.title}
                </span>
                {actDetails.isMissing && (
                  <p style={{ color: 'var(--warning)', fontSize: '0.85rem', marginTop: '6px', margin: 0 }}>
                    Activity type was not provided by the backend.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Alert Explanation Card */}
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
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '4px' }}>
                ALERT EXPLANATION
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Activity:
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {actDetails.title}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    What happened:
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {actDetails.whatHappened}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Why it matters:
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {actDetails.whyItMatters}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Evidence:
                  </span>
                  <ul style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    paddingLeft: '20px',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <li><strong>Rule ID:</strong> {alert.rule?.id || 'N/A'}</li>
                    <li><strong>Decoder:</strong> {alert.decoder || 'N/A'}</li>
                    <li><strong>Severity:</strong> Level {alert.rule?.severity || '0'}</li>
                    <li><strong>Description:</strong> {alert.rule?.description || 'N/A'}</li>
                    <li><strong>Agent:</strong> {alert.agent?.name || alert.agent?.id || 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Tabs Selector */}
      <EvidenceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'normalized' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <EventInformation alert={alert} />
          <AlertRuleDetails alert={alert} />
          <EvidenceMetadata alert={alert} />
        </div>
      ) : (
        <LogViewer logContent={alert?.full_log} />
      )}

      <AIAlertExplanation alertId={alert.event_id || eventId} />
    </div>
  );
};

export default AlertDetails;
