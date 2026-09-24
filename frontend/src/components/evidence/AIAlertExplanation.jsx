import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrainCircuit, CircleAlert, RefreshCw } from 'lucide-react';
import { postAIAlertExplanation } from '../../api/api';

const AIAlertExplanation = ({ alertId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestInFlight = useRef(false);

  const fetchExplanation = useCallback(async () => {
    if (!alertId || requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await postAIAlertExplanation(alertId);
      setData(response.data);
    } catch (requestError) {
      setError(requestError.response?.status === 503
        ? 'AI explanation is temporarily unavailable. The original SAT-SA alert evidence is still available.'
        : requestError.response?.status === 404
          ? 'Alert evidence could not be retrieved.'
          : 'Unable to generate an explanation for this alert.');
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }, [alertId]);

  useEffect(() => {
    fetchExplanation();
  }, [fetchExplanation]);

  return (
    <section className="ai-alert-explanation glass-panel" aria-busy={loading}>
      <div className="ai-alert-heading">
        <div className="ai-panel-heading">
          <BrainCircuit size={20} />
          <div>
            <h2>AI Alert Explanation</h2>
          </div>
        </div>
        <button type="button" className="ai-icon-button" onClick={fetchExplanation} disabled={loading} title="Regenerate explanation" aria-label="Regenerate explanation">
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
        </button>
      </div>

      {loading && <p className="ai-alert-loading">Analyzing alert evidence...</p>}
      {!loading && error && (
        <div className="ai-alert-error" role="alert">
          <CircleAlert size={16} />
          <span>{error}</span>
        </div>
      )}
      {!loading && data && (
        <div className="ai-alert-content">
          <div className="ai-alert-source">
            Rule {data.source?.rule_id ?? 'N/A'} | Severity {data.source?.severity ?? 'N/A'} | Decoder {data.source?.decoder ?? 'N/A'} | Agent {data.source?.agent ?? 'N/A'}
          </div>
          <div className="ai-alert-grid">
            <div><h3>What Happened?</h3><p>{data.explanation?.what_happened}</p></div>
            <div><h3>Why It Matters</h3><p>{data.explanation?.why_it_matters}</p></div>
            <div><h3>Evidence</h3><ul>{(data.explanation?.evidence || []).map((item, index) => <li key={index}>{item}</li>)}</ul></div>
            <div><h3>Risk Interpretation</h3><p>{data.explanation?.risk_interpretation}</p></div>
            <div><h3>Recommended SOC Actions</h3><ol>{(data.explanation?.recommended_actions || []).map((item, index) => <li key={index}>{item}</li>)}</ol></div>
            <div><h3>Analyst Note</h3><p>{data.explanation?.analyst_note}</p></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AIAlertExplanation;