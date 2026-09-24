import { useState, useEffect, useCallback, useRef } from 'react';
import { getAlerts, readRouteData, writeRouteData, isDemoModeEnabled } from '../api/api';
import { mockAlerts } from '../data/mockData';

export const useAlerts = (pollingIntervalMs = 5000) => {
  const cacheKey = 'alerts:data';
  const initialData = readRouteData(cacheKey, isDemoModeEnabled() ? mockAlerts : []);
  const [alerts, setAlerts] = useState(initialData);
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : initialData.length === 0);
  const [status, setStatus] = useState('LIVE');
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newAlertsCount, setNewAlertsCount] = useState(0);

  const previousAlertIdsRef = useRef(new Set());
  const isFirstFetchRef = useRef(true);
  const timerRef = useRef(null);

  const fetchAlertsData = useCallback(async (isManual = false) => {
    if (isManual && !isDemoModeEnabled()) {
      setLoading(true);
    }
    if (!isDemoModeEnabled()) {
      setStatus('CONNECTING');
    }
    try {
      const response = await getAlerts(100, { forceRefresh: isManual });
      const fetchedAlerts = Array.isArray(response.data)
        ? response.data
        : response.data?.alerts || [];

      if (isFirstFetchRef.current) {
        setAlerts(fetchedAlerts);
        writeRouteData(cacheKey, fetchedAlerts);
        previousAlertIdsRef.current = new Set(fetchedAlerts.map(a => a.event_id));
        isFirstFetchRef.current = false;
      } else {
        // Compare alert IDs to find new alerts
        const currentIds = fetchedAlerts.map(a => a.event_id);
        const newEvents = currentIds.filter(id => id && !previousAlertIdsRef.current.has(id));

        if (newEvents.length > 0) {
          setNewAlertsCount(prev => prev + newEvents.length);
          // Prepend new alerts or just update the entire list
          setAlerts(fetchedAlerts);
          writeRouteData(cacheKey, fetchedAlerts);
          // Update known IDs
          fetchedAlerts.forEach(a => {
            if (a.event_id) previousAlertIdsRef.current.add(a.event_id);
          });
        } else {
          // If no new ones, still update (in case rules/metadata updated, though rare)
          setAlerts(fetchedAlerts);
          writeRouteData(cacheKey, fetchedAlerts);
        }
      }

      setStatus('LIVE');
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err.message || 'Failed to reach SAT-SA backend');
      setStatus('OFFLINE');
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll setup
  useEffect(() => {
    fetchAlertsData();

    if (autoRefresh) {
      timerRef.current = setInterval(() => {
        fetchAlertsData();
      }, pollingIntervalMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fetchAlertsData, pollingIntervalMs, autoRefresh]);

  const refresh = () => {
    fetchAlertsData(true);
  };

  const clearNewAlerts = () => {
    setNewAlertsCount(0);
  };

  return {
    alerts,
    loading,
    status,
    lastUpdated,
    error,
    autoRefresh,
    setAutoRefresh,
    newAlertsCount,
    clearNewAlerts,
    refresh
  };
};
