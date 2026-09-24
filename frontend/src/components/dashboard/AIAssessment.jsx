import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrainCircuit, CircleAlert, RefreshCw } from 'lucide-react';
import { getAIAssessment } from '../../api/api';
import SeverityBadge from './SeverityBadge';

const SourceMetric = ({ label, value }) => (
  <div className="ai-source-metric">
    <span>{label}</span>
    <strong>{value ?? 0}</strong>
  </div>
);

const formatEvidence = (item) => typeof item === 'string' ? item : JSON.stringify(item);

const AIAssessment = ({ refreshToken }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestInFlight = useRef(false);

  const fetchAssessment = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    setError(null);
    setAssessment(null);
    try {
      const response = await getAIAssessment(100);
      setAssessment(response.data);
    } catch (requestError) {
      setError(requestError.response?.status === 503
        ? 'AI Interpretation is currently unavailable. Deterministic SAT-SA analytics remain available.'
        : 'Unable to load the AI Interpretation from SAT-SA.');
    } finally {
      setLoading(false);
      requestInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment, refreshToken]);

  useEffect(() => {
    const refreshTimer = window.setInterval(fetchAssessment, 60000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchAssessment]);

  if (loading) {
    return (
      <section className="ai-panel glass-panel" aria-busy="true">
        <div className="ai-panel-heading">
          <BrainCircuit size={20} />
          <div>
            <h2>AI Assessment</h2>
            <p>AI Interpretation</p>
          </div>
        </div>
        <div className="ai-loading-line">Analyzing current SAT-SA evidence...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ai-panel glass-panel ai-error-panel">
        <div className="ai-panel-heading">
          <CircleAlert size={20} />
          <div>
            <h2>AI Assessment</h2>
            <p>AI Interpretation</p>
          </div>
        </div>
        <p className="ai-error-text">{error}</p>
        <button type="button" className="ai-secondary-button" onClick={fetchAssessment}>
          <RefreshCw size={14} /> Retry
        </button>
      </section>
    );
  }

  const ai = assessment?.ai_assessment || {};
  const source = assessment?.source || {};
  const concerns = Array.isArray(ai.detected_security_concerns) ? ai.detected_security_concerns : [];
  const evidence = Array.isArray(ai.evidence) ? ai.evidence : [];
  const actions = Array.isArray(ai.recommended_actions) ? ai.recommended_actions : [];

  return (
    <section className="ai-panel glass-panel">
      <div className="ai-panel-heading">
        <BrainCircuit size={20} />
        <div>
          <h2>AI Assessment</h2>
          <p>AI Interpretation <span>Local SAT-SA evidence</span></p>
        </div>
        <div className="ai-priority">{ai.analyst_priority || 'LOW'} PRIORITY</div>
        <button type="button" className="ai-icon-button" onClick={fetchAssessment} disabled={loading} title="Refresh AI Assessment" aria-label="Refresh AI Assessment">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="ai-source-grid">
        <SourceMetric label="Events" value={source.events_analyzed} />
        <SourceMetric label="Findings" value={source.findings} />
        <SourceMetric label="Attention" value={source.attention_score} />
        <SourceMetric label="Resilience" value={source.resilience_score} />
        <SourceMetric label="Risk" value={source.risk_score} />
      </div>

      <div className="ai-assessment-grid">
        <div className="ai-copy-block ai-assessment-summary">
          <h3>Overall Assessment</h3>
          <p>{ai.overall_assessment || 'No assessment available.'}</p>
          <h3>Risk Interpretation</h3>
          <p>{ai.risk_interpretation || 'No risk interpretation available.'}</p>
        </div>
        <div className="ai-copy-block">
          <h3>Detected Security Concerns</h3>
          {concerns.length === 0 ? <p className="ai-muted">No concerns reported by the AI layer.</p> : (
            <div className="ai-list">
              {concerns.map((concern, index) => (
                <div className="ai-concern" key={`${concern.type || 'concern'}-${index}`}>
                  <div className="ai-list-heading">
                    <strong>{concern.type || 'Security concern'}</strong>
                    <SeverityBadge severity={concern.severity} />
                  </div>
                  <p>{concern.description || 'No description supplied.'}</p>
                  <small>Confidence: {Math.round(Number(concern.confidence || 0) * 100)}%</small>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ai-copy-block">
          <h3>Evidence</h3>
          {evidence.length === 0 ? <p className="ai-muted">No supporting evidence was returned.</p> : (
            <ul className="ai-bullet-list">{evidence.map((item, index) => <li key={index}>{formatEvidence(item)}</li>)}</ul>
          )}
        </div>
        <div className="ai-copy-block">
          <h3>Recommended Actions</h3>
          {actions.length === 0 ? <p className="ai-muted">No additional actions were recommended.</p> : (
            <ol className="ai-bullet-list">{actions.map((item, index) => <li key={index}>{String(item)}</li>)}</ol>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIAssessment;