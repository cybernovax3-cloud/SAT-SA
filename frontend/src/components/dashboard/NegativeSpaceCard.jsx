import React, { useState, useEffect, useCallback } from 'react';
import { getNegativeSpace } from '../../api/api';
import { EyeOff, RefreshCw, AlertTriangle, Wifi } from 'lucide-react';

const SEVERITY_COLOR = {
  critical: 'var(--danger)',
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--text-muted)',
};

const SEVERITY_BG = {
  critical: 'rgba(239,68,68,0.10)',
  high: 'rgba(239,68,68,0.08)',
  medium: 'rgba(245,158,11,0.10)',
  low: 'rgba(148,163,184,0.10)',
};

const SEVERITY_LABEL = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };

const STATUS_COLOR = {
  critical: 'var(--danger)',
  attention_required: 'var(--warning)',
  normal: 'var(--success)',
};

const POLL_INTERVAL_MS = 30000;

const NegativeSpaceCard = ({ refreshToken }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await getNegativeSpace(100);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError('Unable to calculate negative-space indicators.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshToken]);
  useEffect(() => {
    const timer = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchData]);

  const normalizedData = data || {
    status: 'normal',
    negative_space_score: 0,
    indicator_count: 0,
    message: 'No significant negative-space indicators identified.',
    indicators: []
  };

  const statusColor = STATUS_COLOR[normalizedData.status] || 'var(--text-muted)';
  const score = normalizedData.negative_space_score || 0;

  return (
    <div
      className='glass-panel'
      style={{
        background: 'var(--glass-surface)',
        border: statusColor ? '1px solid ' + statusColor + '22' : '1px solid ' + 'var(--border-color)',
        borderRadius: '16px',
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOff size={16} style={{ color: statusColor }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            NEGATIVE SPACE
          </span>
        </div>
        <button onClick={fetchData} aria-label='Refresh Negative Space'
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}>
          <RefreshCw size={13} />
        </button>
      </div>

      {loading && !data ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing telemetry gaps...</div>
      ) : error ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.82rem' }}>
          <AlertTriangle size={14} /> {error}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {score}
            </span>
            {normalizedData.status !== 'normal' && (
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 'bold',
                color: statusColor,
                background: statusColor + '18',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.06em',
              }}>
                {normalizedData.status === 'critical' ? 'CRITICAL' : 'REVIEW'}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
            Negative-space indicators
          </p>
          {normalizedData.indicator_count === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.82rem', padding: '10px 12px', background: 'rgba(16,185,129,0.06)', borderRadius: '8px' }}>
              <Wifi size={14} />
              {normalizedData.message || 'No significant negative-space indicators identified.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(normalizedData.indicators || []).map((ind, idx) => {
                const sev = (ind.severity || 'low').toLowerCase();
                const dotColor = SEVERITY_COLOR[sev] || 'var(--text-muted)';
                const bgColor = SEVERITY_BG[sev] || 'rgba(148,163,184,0.08)';
                return (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: bgColor, borderRadius: '8px', borderLeft: '3px solid ' + dotColor }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor, flexShrink: 0, marginTop: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: dotColor, letterSpacing: '0.05em' }}>
                          {SEVERITY_LABEL[sev] || sev.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {ind.title}
                        </span>
                      </div>
                      {ind.description && (
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 4px 0', lineHeight: 1.5 }}>
                          {ind.description}
                        </p>
                      )}
                      {ind.evidence && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.4 }}>
                          {ind.evidence}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NegativeSpaceCard;
