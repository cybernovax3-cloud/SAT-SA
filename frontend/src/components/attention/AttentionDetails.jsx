import React from 'react';
import AttentionPriorityBadge from './AttentionPriorityBadge';

const sectionStyle = {
  background: 'var(--bg-dark)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius)',
  padding: '20px'
};

const AttentionDetails = ({ data }) => {
  const reasons = data?.reasons || [];
  const entities = data?.entities || [];
  const gaps = data?.evidence_gaps || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Entities Requiring Supervisory Review Table */}
      {entities.length > 0 && (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600 }}>ENTITIES REQUIRING SUPERVISORY REVIEW</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulated Demo Entities</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Entity</th>
                  <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Attention Score</th>
                  <th style={{ padding: '12px 10px' }}>Reason</th>
                  <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Evidence Quality</th>
                  <th style={{ padding: '12px 10px', whiteSpace: 'nowrap' }}>Priority</th>
                  <th style={{ padding: '12px 10px' }}>Recommended Review</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((ent, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                      {ent.entity}
                    </td>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--danger)' }}>
                      {ent.attention_score}
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                      {ent.reason}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        backgroundColor: ent.evidence_quality === 'High' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: ent.evidence_quality === 'High' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {ent.evidence_quality}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <AttentionPriorityBadge priority={ent.priority} />
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                      {ent.recommended_review}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Why Attention is Required */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: '0.95rem', marginBottom: '16px', fontWeight: 600 }}>WHY SUPERVISORY ATTENTION IS REQUIRED</h2>
        {reasons.length ? (
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {reasons.map((reason, index) => (
              <li key={`${reason}-${index}`} style={{ marginBottom: '6px' }}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No backend-provided attention reasons are currently available.</p>
        )}
      </section>

      {/* Evidence Gaps */}
      {gaps.length > 0 && (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 600 }}>SUPERVISORY EVIDENCE GAPS ({gaps.length})</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
            Identified procedural, chain-of-custody, or containment documentation deficits requiring resolution before incident closure.
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {gaps.map((gap, index) => (
              <li key={index} style={{ marginBottom: '6px' }}>{gap}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AttentionDetails;
