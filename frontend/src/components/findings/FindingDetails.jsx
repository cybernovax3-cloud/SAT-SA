import React from 'react';
import FindingEvidence from './FindingEvidence';

const FindingDetails = ({ finding }) => <div style={{ borderTop: '1px solid var(--border-color)', padding: '16px 20px', background: 'var(--bg-darker)' }}><h3 style={{ fontSize: '0.85rem', marginBottom: 8 }}>WHY THIS FINDING EXISTS</h3><p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{finding.explanation || 'N/A'}</p>{finding.recommendation && <p style={{ color: 'var(--text-secondary)', marginTop: 10 }}><strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> {finding.recommendation}</p>}{finding.contributing_factors?.length > 0 && <p style={{ color: 'var(--text-secondary)', marginTop: 10 }}><strong style={{ color: 'var(--text-primary)' }}>Contributing factors:</strong> {finding.contributing_factors.join(', ')}</p>}<FindingEvidence evidence={finding.evidence} references={finding.evidence_references} /></div>;
export default FindingDetails;
