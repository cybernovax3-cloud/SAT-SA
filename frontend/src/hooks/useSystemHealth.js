import { useCallback, useEffect, useRef, useState } from 'react';
import api, { API_BASE_URL, isDemoModeEnabled } from '../api/api';

const endpoints = [
  { path: '/api/alerts', params: { limit: 1 } }, { path: '/api/baseline', params: { limit: 1 } },
  { path: '/api/behaviour', params: { limit: 1 } }, { path: '/api/correlation', params: { limit: 1 } },
  { path: '/api/findings', params: { limit: 1 } }, { path: '/api/supervisory/assessment', params: { limit: 1 } },
];

const getDemoServices = () => {
  const timeStr = new Date().toLocaleTimeString();
  return endpoints.map((endpoint) => ({
    ...endpoint,
    status: 'OK',
    httpStatus: 200,
    responseTime: 8,
    checkedAt: timeStr
  }));
};

export const useSystemHealth = (pollingIntervalMs = 10000) => {
  const [services, setServices] = useState(() => (isDemoModeEnabled() ? getDemoServices() : []));
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : true);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(() => new Date().toLocaleTimeString());
  const [lastSuccess, setLastSuccess] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);

  const check = useCallback(async (manual = false) => {
    if (manual) setChecking(true);
    const checkedAt = new Date().toLocaleTimeString();
    const results = await Promise.all(endpoints.map(async (endpoint) => {
      const started = performance.now();
      try {
        const response = await api.get(endpoint.path, { params: endpoint.params });
        return { ...endpoint, status: 'OK', httpStatus: response.status, responseTime: Math.round(performance.now() - started), checkedAt };
      } catch (error) {
        return { ...endpoint, status: 'FAIL', httpStatus: error.response?.status || null, responseTime: Math.round(performance.now() - started), checkedAt, error: error.message };
      }
    }));
    setServices(results);
    setLastChecked(checkedAt);
    if (results.some((result) => result.status === 'OK')) setLastSuccess(checkedAt);
    setLoading(false);
    setChecking(false);
  }, []);

  useEffect(() => {
    check();
    if (autoRefresh) timerRef.current = setInterval(check, pollingIntervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; };
  }, [autoRefresh, check, pollingIntervalMs]);

  const successful = services.filter((service) => service.status === 'OK').length;
  const healthStatus = !services.length ? 'CONNECTING' : successful === services.length ? 'CONNECTED' : successful ? 'DEGRADED' : 'OFFLINE';
  return { services, loading, checking, lastChecked, lastSuccess, autoRefresh, setAutoRefresh, healthStatus, apiBaseUrl: API_BASE_URL, checkNow: () => check(true) };
};