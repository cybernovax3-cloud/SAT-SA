import { useCallback, useEffect, useRef, useState } from 'react';
import { getResilience, readRouteData, writeRouteData, isDemoModeEnabled } from '../api/api';
import { mockCyberResilience } from '../data/mockData';

export const useResilience = (pollingIntervalMs = 5000) => {
  const cacheKey = 'resilience:data';
  const initialData = readRouteData(cacheKey, isDemoModeEnabled() ? mockCyberResilience : null);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : !initialData);
  const [status, setStatus] = useState('LIVE');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);
  const load = useCallback(async (manual = false) => {
    if (manual && !isDemoModeEnabled()) setLoading(true);
    if (!isDemoModeEnabled()) setStatus('CONNECTING');
    try {
      const response = await getResilience(100);
      const nextData = response.data || null;
      setData(nextData);
      writeRouteData(cacheKey, nextData);
      setStatus('LIVE'); setError(null); setLastUpdated(new Date().toLocaleTimeString());
    } catch (requestError) { setStatus('OFFLINE'); setError(requestError.message || 'Unable to retrieve resilience analytics.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); if (autoRefresh) timerRef.current = setInterval(load, pollingIntervalMs); return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; }; }, [autoRefresh, load, pollingIntervalMs]);
  return { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh: () => load(true) };
};
