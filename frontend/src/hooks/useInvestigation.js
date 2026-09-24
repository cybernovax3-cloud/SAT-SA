import { useCallback, useEffect, useRef, useState } from 'react';
import { getAlerts, getAttention, getBehaviour, getCorrelation, getFindings, getRisk, getSupervisoryAssessment, isDemoModeEnabled } from '../api/api';
import { demoDataset } from '../data/mockData';

const unwrap = (response, key) => {
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.[key] ?? response?.data ?? null;
};

export const useInvestigation = (pollingIntervalMs = 5000) => {
  const [data, setData] = useState(() => (isDemoModeEnabled() ? {
    alerts: demoDataset.alerts,
    behaviour: demoDataset.behaviour,
    correlation: demoDataset.correlation,
    attention: demoDataset.attention,
    risk: demoDataset.risk,
    findings: demoDataset.findings.findings,
    assessment: demoDataset.assessment
  } : { alerts: [], behaviour: null, correlation: null, attention: null, risk: null, findings: [], assessment: null }));
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
      getAlerts(100), getBehaviour(100), getCorrelation(100), getAttention(100), getRisk(100), getFindings(100), getSupervisoryAssessment(100),
    ]);
    if (results[0].status === 'rejected') {
      setStatus('OFFLINE');
      setError(results[0].reason?.message || 'Unable to retrieve investigation information.');
      setLoading(false);
      return;
    }
    setData({
      alerts: unwrap(results[0].value, 'alerts') || [],
      behaviour: unwrap(results[1]?.value), correlation: unwrap(results[2]?.value), attention: unwrap(results[3]?.value),
      risk: unwrap(results[4]?.value), findings: unwrap(results[5]?.value, 'findings') || [], assessment: unwrap(results[6]?.value),
    });
    setStatus('LIVE');
    setError(null);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    if (autoRefresh) timerRef.current = setInterval(load, pollingIntervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; };
  }, [autoRefresh, load, pollingIntervalMs]);

  return { ...data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh: () => load(true) };
};