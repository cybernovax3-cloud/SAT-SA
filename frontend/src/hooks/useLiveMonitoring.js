import { useCallback, useEffect, useRef, useState } from 'react';
import { getAlerts, getAttention, getCorrelation, getRisk, isDemoModeEnabled } from '../api/api';
import { demoDataset } from '../data/mockData';

const unwrap = (response, key) => {
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.[key] ?? response?.data ?? null;
};

export const useLiveMonitoring = (pollingIntervalMs = 5000) => {
  const [data, setData] = useState(() => (isDemoModeEnabled() ? {
    alerts: demoDataset.alerts,
    attention: demoDataset.attention,
    correlation: demoDataset.correlation,
    risk: demoDataset.risk
  } : { alerts: [], attention: null, correlation: null, risk: null }));
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : true);
  const [status, setStatus] = useState('LIVE');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newEventIds, setNewEventIds] = useState(new Set());
  const previousIds = useRef(new Set());
  const timerRef = useRef(null);

  const load = useCallback(async (manual = false) => {
    if (manual && !isDemoModeEnabled()) setLoading(true);
    if (!isDemoModeEnabled()) setStatus('CONNECTING');
    try {
      const [alertsResult, attentionResult, correlationResult, riskResult] = await Promise.allSettled([
        getAlerts(100), getAttention(100), getCorrelation(100), getRisk(100),
      ]);
      if (alertsResult.status === 'rejected') throw alertsResult.reason;
      const alerts = unwrap(alertsResult.value, 'alerts') || [];
      const ids = new Set(alerts.map((item) => item.event_id).filter(Boolean));
      setNewEventIds(new Set([...ids].filter((id) => previousIds.current.size && !previousIds.current.has(id))));
      previousIds.current = ids;
      setData({
        alerts,
        attention: attentionResult.status === 'fulfilled' ? unwrap(attentionResult.value) : null,
        correlation: correlationResult.status === 'fulfilled' ? unwrap(correlationResult.value) : null,
        risk: riskResult.status === 'fulfilled' ? unwrap(riskResult.value) : null,
      });
      setStatus('LIVE');
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (requestError) {
      setStatus('OFFLINE');
      setError(requestError.message || 'Unable to connect to the SAT-SA backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (autoRefresh) timerRef.current = setInterval(load, pollingIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoRefresh, load, pollingIntervalMs]);

  return { ...data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, newEventIds, refresh: () => load(true) };
};
