import { useCallback, useEffect, useRef, useState } from 'react';
import { getAlerts, getAttention, getBehaviour, getCorrelation, getFindings, getResilience, getRisk, getSupervisoryAssessment, isDemoModeEnabled } from '../api/api';
import { demoDataset } from '../data/mockData';

const unwrap = (response, key) => {
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.[key] ?? response?.data ?? null;
};

export const useReports = (pollingIntervalMs = 10000) => {
  const [data, setData] = useState(() => (isDemoModeEnabled() ? {
    assessment: demoDataset.assessment,
    risk: demoDataset.risk,
    attention: demoDataset.attention,
    resilience: demoDataset.resilience,
    alerts: demoDataset.alerts,
    behaviour: demoDataset.behaviour,
    correlation: demoDataset.correlation,
    findings: demoDataset.findings.findings
  } : null));
  const [loading, setLoading] = useState(isDemoModeEnabled() ? false : true);
  const [status, setStatus] = useState('LIVE');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const timerRef = useRef(null);

  const load = useCallback(async (manual = false) => {
    if (manual && !isDemoModeEnabled()) setLoading(true);
    if (!isDemoModeEnabled()) setStatus('CONNECTING');
    const results = await Promise.allSettled([
      getSupervisoryAssessment(100), getRisk(100), getAttention(100), getResilience(100),
      getAlerts(100), getBehaviour(100), getCorrelation(100), getFindings(100),
    ]);
    const primary = results[0];
    if (primary.status === 'rejected') {
      setStatus('OFFLINE'); setError(primary.reason?.message || 'Unable to retrieve current SAT-SA data.'); setLoading(false); return false;
    }
    setData({
      assessment: unwrap(primary.value), risk: results[1].status === 'fulfilled' ? unwrap(results[1].value) : null,
      attention: results[2].status === 'fulfilled' ? unwrap(results[2].value) : null,
      resilience: results[3].status === 'fulfilled' ? unwrap(results[3].value) : null,
      alerts: results[4].status === 'fulfilled' ? unwrap(results[4].value, 'alerts') || [] : [],
      behaviour: results[5].status === 'fulfilled' ? unwrap(results[5].value) : null,
      correlation: results[6].status === 'fulfilled' ? unwrap(results[6].value) : null,
      findings: results[7].status === 'fulfilled' ? unwrap(results[7].value, 'findings') || [] : [],
    });
    setStatus(results.slice(1).every((result) => result.status === 'fulfilled') ? 'LIVE' : 'DEGRADED');
    setError(null); setLastUpdated(new Date().toLocaleTimeString()); setLoading(false); return true;
  }, []);

  useEffect(() => { load(); if (autoRefresh) timerRef.current = setInterval(load, pollingIntervalMs); return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; }; }, [autoRefresh, load, pollingIntervalMs]);
  return { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh: () => load(true) };
};