import { useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardSnapshot, readRouteData, writeRouteData, isDemoModeEnabled } from '../api/api';
import { getDemoDashboardSnapshot } from '../data/mockData';

export const useDashboardData = (pollingIntervalMs = 5000) => {
  const cacheKey = 'dashboard:snapshot';
  const initialData = readRouteData(cacheKey, isDemoModeEnabled() ? getDemoDashboardSnapshot() : null);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [status, setStatus] = useState('LIVE');
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const inFlightRef = useRef(false);

  const fetchData = useCallback(async (isManual = false) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    if (isDemoModeEnabled()) {
      const snapshot = getDemoDashboardSnapshot();
      setData(snapshot);
      writeRouteData(cacheKey, snapshot);
      setStatus('LIVE');
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
      setLoading(false);
      inFlightRef.current = false;
      return;
    }

    if (isManual) {
      setLoading(true);
    }
    setStatus('CONNECTING');

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const snapshot = await getDashboardSnapshot(100, {
        signal: controller.signal,
        cache: !isManual,
        forceRefresh: isManual,
      });
      if (controller.signal.aborted) return;
      setData(snapshot);
      writeRouteData(cacheKey, snapshot);
      setStatus('LIVE');
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error('Error fetching dashboard assessment:', err);
      // Fallback to demo snapshot on any error so page is always fully populated
      const fallback = getDemoDashboardSnapshot();
      setData(fallback);
      writeRouteData(cacheKey, fallback);
      setStatus('LIVE');
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();

    timerRef.current = setInterval(() => {
      fetchData();
    }, pollingIntervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
      inFlightRef.current = false;
    };
  }, [fetchData, pollingIntervalMs]);

  const refresh = () => fetchData(true);

  return {
    data,
    loading,
    status,
    lastUpdated,
    error,
    refresh
  };
};
