import axios from 'axios';
import { getMockResponseForPath, getDemoDashboardSnapshot, demoDataset } from '../data/mockData';

const REQUEST_CACHE_TTL_MS = 30000;
const requestCache = new Map();
export const routeDataCache = new Map();

export const readRouteData = (key, fallback = null) => {
  const value = routeDataCache.get(key);
  return value === undefined ? fallback : value;
};

export const writeRouteData = (key, value) => {
  if (value == null) {
    routeDataCache.delete(key);
    return;
  }
  routeDataCache.set(key, value);
};

// Use FastAPI directly in development; production deployments can override this.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
export const DEMO_MODE_ENV = String(import.meta.env.VITE_DEMO_MODE || '').toLowerCase() !== 'false';

/**
 * Checks if prototype is in DEMO MODE.
 * Demo mode is permanently active for this prototype demonstration to ensure
 * all pages display complete, deterministic simulated SOC evidence.
 */
export const isDemoModeEnabled = () => true;

if (typeof window !== 'undefined') {
  try {
    window.localStorage.setItem('sat-sa-demo-mode', 'true');
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
}

export const hasExplicitDemoModeChoice = () => true;

export const setDemoModeEnabled = (enabled = true) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('sat-sa-demo-mode', 'true');
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('sat-sa-demo-mode-updated', { detail: true }));
  }
};

const hasMeaningfulPayload = (payload) => {
  if (payload == null) return false;
  if (Array.isArray(payload)) return payload.length > 0;
  if (typeof payload !== 'object') return Boolean(payload);

  const structuredKeys = new Set([
    'total', 'count', 'alerts', 'items', 'results', 'findings', 'evidence',
    'assessment', 'baseline', 'behaviour', 'correlation', 'attention', 'risk',
    'resilience', 'summary', 'status', 'data', 'meta'
  ]);

  const nestedValues = Object.entries(payload);
  if (nestedValues.length === 0) return false;

  const hasStructuredEnvelope = nestedValues.some(([key, value]) => {
    if (structuredKeys.has(key)) {
      if (typeof value === 'number') return Number.isFinite(value);
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
    }
    return false;
  });

  if (hasStructuredEnvelope) return true;

  return nestedValues.some(([ , value ]) => {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) return false;
      return hasMeaningfulPayload(value);
    }
    return Boolean(value);
  });
};

const shouldUseDemoFallback = (error, responseData = null) => {
  if (isDemoModeEnabled()) return true;
  if (error) {
    const networkError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message?.includes('Network Error') || error.message?.includes('ERR_CONNECTION_REFUSED') || error.message?.includes('Failed to fetch');
    return networkError;
  }

  if (responseData == null) return false;

  if (typeof responseData === 'object' && !Array.isArray(responseData)) {
    const entries = Object.entries(responseData);
    const hasNumericZeroEnvelope = entries.some(([key, value]) => ['total', 'count'].includes(key) && Number(value) === 0);
    const hasConcretePayload = entries.some(([key, value]) => {
      if (['total', 'count', 'status', 'message', 'meta'].includes(key)) {
        return false;
      }
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return Boolean(value);
    });

    if (hasNumericZeroEnvelope && !hasConcretePayload) {
      return true;
    }
  }

  return !hasMeaningfulPayload(responseData);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const method = error.config?.method?.toUpperCase() || 'REQUEST';
    const endpoint = error.config?.url || 'unknown endpoint';
    const status = error.response?.status;
    const reason = status
      ? `HTTP ${status}`
      : error.code === 'ECONNABORTED'
        ? 'timeout'
        : 'network/CORS error';
    console.error(`${method} ${endpoint} failed (${reason})`);
    return Promise.reject(error);
  }
);

// Intercept direct api.get / api.post calls so DEMO MODE always serves deterministic mock responses immediately
const originalGet = api.get.bind(api);
const originalPost = api.post.bind(api);

api.get = (url, config = {}) => {
  if (isDemoModeEnabled()) {
    const mock = getMockResponseForPath(url, config?.params?.limit, config?.params);
    return Promise.resolve({
      data: mock.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }
  return originalGet(url, config);
};

api.post = (url, data, config = {}) => {
  if (isDemoModeEnabled()) {
    const mock = getMockResponseForPath(url, config?.params?.limit, data);
    return Promise.resolve({
      data: mock.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    });
  }
  return originalPost(url, data, config);
};

/**
 * Common data access method.
 * Architecture:
 *   dataService
 *     ↓
 *   if DEMO_MODE -> mockData (instant, deterministic)
 *   else -> API (real FastAPI / Wazuh backend)
 */
const get = async (path, limit = 100, options = {}) => {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getMockResponseForPath(path, limit));
  }

  const { signal, cache = true, forceRefresh = false } = options;
  const cacheKey = `${path}:${limit}`;

  if (cache && !forceRefresh && !signal) {
    const cachedEntry = requestCache.get(cacheKey);
    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      return cachedEntry.promise;
    }
  }

  const request = (async () => {
    try {
      const response = await originalGet(path, { params: { limit }, signal, timeout: 10000 });
      if (shouldUseDemoFallback(null, response?.data)) {
        console.warn(`[SAT-SA] ${path} returned empty or unusable data. Serving simulated SOC evidence in demo mode.`);
        return getMockResponseForPath(path, limit);
      }
      return response;
    } catch (error) {
      if (shouldUseDemoFallback(error)) {
        console.warn(`[SAT-SA] ${path} unavailable. Serving simulated SOC evidence in demo mode.`);
        return getMockResponseForPath(path, limit);
      }
      throw error;
    }
  })();

  if (cache && !signal && !forceRefresh) {
    requestCache.set(cacheKey, {
      promise: request,
      expiresAt: Date.now() + REQUEST_CACHE_TTL_MS,
    });
  }

  return request;
};

export const getAlerts = (limit = 100, options = {}) => get('/api/alerts', limit, options);
export const getBaseline = (limit = 100, options = {}) => get('/api/baseline', limit, options);
export const getBehaviour = (limit = 100, options = {}) => get('/api/behaviour', limit, options);
export const getCorrelation = (limit = 100, options = {}) => get('/api/correlation', limit, options);
export const getAttention = (limit = 100, options = {}) => get('/api/analytics/attention', limit, options);
export const getResilience = (limit = 100, options = {}) => get('/api/analytics/resilience', limit, options);
export const getRisk = (limit = 100, options = {}) => get('/api/analytics/risk', limit, options);
export const getNegativeSpace = (limit = 100, options = {}) => get('/api/analytics/negative-space', limit, options);
export const getExecutionGaps = (limit = 100, options = {}) => get('/api/execution-gaps', limit, options);
export const getExecutionGapStatistics = (limit = 100, options = {}) => get('/api/execution-gaps/statistics', limit, options);

export const getExecutionGapDetail = async (incidentId, options = {}) => {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getMockResponseForPath(`/api/execution-gaps/${incidentId}`));
  }
  try {
    return await api.get(`/api/execution-gaps/${incidentId}`, { signal: options.signal });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      return getMockResponseForPath(`/api/execution-gaps/${incidentId}`);
    }
    throw error;
  }
};

export const getFindings = (limit = 100, options = {}) => get('/api/findings', limit, options);
export const getSupervisoryAssessment = (limit = 100, options = {}) => get('/api/supervisory/assessment', limit, options);

export const getAIAssessment = async (limit = 100, options = {}) => {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getMockResponseForPath('/api/supervisory/ai-assessment', limit));
  }
  try {
    return await originalGet('/api/supervisory/ai-assessment', { params: { limit }, timeout: 120000, signal: options.signal });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      return getMockResponseForPath('/api/supervisory/ai-assessment', limit);
    }
    throw error;
  }
};

export const postAIChat = async (message, options = {}) => {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getMockResponseForPath('/api/ai/chat', 100, { message }));
  }
  try {
    return await originalPost('/api/ai/chat', { message }, { timeout: 120000, signal: options.signal });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      return getMockResponseForPath('/api/ai/chat', 100, { message });
    }
    throw error;
  }
};

export const postAIAlertExplanation = async (alertId, options = {}) => {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getMockResponseForPath('/api/ai/alert-explanation', 100, { alert_id: alertId }));
  }
  try {
    return await originalPost('/api/ai/alert-explanation', { alert_id: alertId }, { timeout: 120000, signal: options.signal });
  } catch (error) {
    if (shouldUseDemoFallback(error)) {
      return getMockResponseForPath('/api/ai/alert-explanation', 100, { alert_id: alertId });
    }
    throw error;
  }
};

export const getDashboardSnapshot = async (limit = 100, options = {}) => {
  if (isDemoModeEnabled()) {
    return Promise.resolve(getDemoDashboardSnapshot());
  }

  const [alerts, assessment, attention, resilience, risk, findings, baseline, behaviour, correlation] = await Promise.all([
    getAlerts(limit, { ...options, cache: true }),
    getSupervisoryAssessment(limit, { ...options, cache: true }),
    getAttention(limit, { ...options, cache: true }),
    getResilience(limit, { ...options, cache: true }),
    getRisk(limit, { ...options, cache: true }),
    getFindings(limit, { ...options, cache: true }),
    getBaseline(limit, { ...options, cache: true }),
    getBehaviour(limit, { ...options, cache: true }),
    getCorrelation(limit, { ...options, cache: true }),
  ]);

  return {
    alerts: alerts.data,
    assessment: assessment.data,
    attention: attention.data,
    resilience: resilience.data,
    risk: risk.data,
    findings: findings.data,
    baseline: baseline.data,
    behaviour: behaviour.data,
    correlation: correlation.data,
  };
};

export default api;
