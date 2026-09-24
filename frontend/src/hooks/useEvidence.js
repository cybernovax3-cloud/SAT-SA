import { useCallback, useEffect, useRef, useState } from 'react';
import { getAlerts, isDemoModeEnabled } from '../api/api';
import { mockAlerts } from '../data/mockData';

export const useEvidence = (pollingIntervalMs = 5000) => {
  const [evidence, setEvidence] = useState(isDemoModeEnabled() ? mockAlerts : []);
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : true);
  const [status, setStatus] = useState('LIVE');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);
  const load = useCallback(async (manual = false) => {
    if (manual && !isDemoModeEnabled()) setLoading(true);
    if (!isDemoModeEnabled()) setStatus('CONNECTING');
    try {
      const response = await getAlerts(100);
      setEvidence(Array.isArray(response.data) ? response.data : response.data?.alerts || []);
      setStatus('LIVE');
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (requestError) {
      setStatus('OFFLINE');
      setError(requestError.message || 'Unable to retrieve evidence from the SAT-SA backend.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); if (autoRefresh) timerRef.current = setInterval(load, pollingIntervalMs); return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; }; }, [autoRefresh, load, pollingIntervalMs]);
  return { evidence, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh: () => load(true) };
};
