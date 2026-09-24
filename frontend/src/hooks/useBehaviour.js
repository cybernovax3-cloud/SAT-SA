import { useCallback, useEffect, useRef, useState } from 'react';
import { getBehaviour, readRouteData, writeRouteData, isDemoModeEnabled } from '../api/api';
import { mockBehaviour } from '../data/mockData';

export const useBehaviour = (pollingIntervalMs = 5000) => {
  const cacheKey = 'behaviour:data';
  const initialData = readRouteData(cacheKey, isDemoModeEnabled() ? mockBehaviour : null);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : !initialData);
  const [status, setStatus] = useState('LIVE');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [changeDetected, setChangeDetected] = useState(false);
  const previousStatusRef = useRef(new Map());
  const timerRef = useRef(null);

  const refresh = useCallback(async (manual = false) => {
    if (manual && !isDemoModeEnabled()) setLoading(true);
    if (!isDemoModeEnabled()) setStatus('CONNECTING');
    try {
      const response = await getBehaviour(100);
      const nextData = response.data || null;
      const nextStatuses = new Map();
      (nextData?.profiles || []).forEach((profile) => {
        const current = nextStatuses.get(profile.agent_id) || profile.behaviour;
        nextStatuses.set(profile.agent_id, current === 'unusual' || profile.behaviour === 'unusual' ? 'unusual' : current);
      });
      const changed = Array.from(nextStatuses).some(([entityId, nextStatus]) => {
        return previousStatusRef.current.has(entityId) && previousStatusRef.current.get(entityId) !== nextStatus;
      });
      if (!previousStatusRef.current.size) setChangeDetected(false);
      else if (changed) setChangeDetected(true);
      previousStatusRef.current = nextStatuses;
      setData(nextData);
      writeRouteData(cacheKey, nextData);
      setStatus('LIVE');
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (requestError) {
      setStatus('OFFLINE');
      setError(requestError.message || 'Unable to retrieve behaviour information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (autoRefresh) timerRef.current = setInterval(refresh, pollingIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoRefresh, pollingIntervalMs, refresh]);

  return { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, changeDetected, clearChange: () => setChangeDetected(false), refresh: () => refresh(true) };
};
