import React, { useState } from 'react';
import { BrainCircuit, RefreshCw, CircleAlert } from 'lucide-react';
import api from '../../api/api';

const GapAIAssessment = ({ incidentId }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssessment = async () => {
    if (!incidentId || loading) return;
    setLoading(true);
    setError(null);
    setAssessment(null);
    try {
      const resp = await api.post(
        `/api/execution-gaps/${incidentId}/ai-assessment`,
        {},
        { timeout: 120000 }
      );
      setAssessment(resp.data);
    } catch (err) {
      setError(
        err.response?.status === 503
          ? 'AI is currently unavailable. Check that Ollama is running.'
          : 'Unable to generate AI assessment for this gap.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
          <BrainCircuit size={18} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>AI Gap Assessment</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Evidence-grounded analysis</div>
          </div>
        </div>
        <button
          onClick={fetchAssessment}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '8px',
            border: '1px solid var(--primary)', background: 'var(--primary-soft)',
            color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}
        >
          <RefreshCw size={13} className={loading ? 'spin-animation' : ''} />
          {loading ? 'Analyzing...' : assessment ? 'Re-analyze' : 'Analyze Gap'}
        </button>
      </div>

      {!assessment && !loading && !error && (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '12px 0' }}>
          Click "Analyze Gap" to request an AI assessment of this execution gap.
          The AI will only use the structured gap data — it will not invent events or conclusions.
        </div>
      )}

      {loading && <div style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>Analyzing gap evidence...</div>}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '0.82rem' }}>
          <CircleAlert size={15} /> {error}
        </div>
      )}

      {assessment && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--warning-bg)', border: '1px solid var(--warning)33', fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 600 }}>
            ⚠ AI ASSESSMENT — Not authoritative evidence. For analyst guidance only.
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {assessment.analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default GapAIAssessment;
