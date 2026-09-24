import React from 'react';
import { Link } from 'react-router-dom';

const AssessmentHeader = () => <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}><span>Decision flow:</span><Link to="/correlation" style={{ color: 'var(--primary)' }}>Correlation</Link><span>→</span><Link to="/attention" style={{ color: 'var(--primary)' }}>Attention</Link><span>→</span><Link to="/resilience" style={{ color: 'var(--primary)' }}>Resilience</Link><span>→</span><Link to="/risk" style={{ color: 'var(--primary)' }}>Risk</Link></nav>;
export default AssessmentHeader;
