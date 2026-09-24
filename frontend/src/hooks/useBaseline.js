import { useCallback, useEffect, useRef, useState } from 'react';
import { getBaseline, readRouteData, writeRouteData, isDemoModeEnabled } from '../api/api';
import { mockBaseline } from '../data/mockData';

export const useBaseline = (pollingIntervalMs = 5000) => {
  const cacheKey = 'baseline:data';
  const initialData = readRouteData(cacheKey, isDemoModeEnabled() ? mockBaseline : null);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : !initialData);
  const [status, setStatus] = useState('LIVE');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);

  const refresh = useCallback(async (manual = false) => {
    if (manual && !isDemoModeEnabled()) setLoading(true);
    if (!isDemoModeEnabled()) setStatus('CONNECTING');
    try {
      const response = await getBaseline(100);
      const nextData = response.data || null;
      setData(nextData);
      writeRouteData(cacheKey, nextData);
      setStatus('LIVE');
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (requestError) {
      setStatus('OFFLINE');
      setError(requestError.message || 'Unable to retrieve entity baseline information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (autoRefresh && pollingIntervalMs > 0) timerRef.current = setInterval(refresh, pollingIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoRefresh, pollingIntervalMs, refresh]);

  return { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh: () => refresh(true) };
};
