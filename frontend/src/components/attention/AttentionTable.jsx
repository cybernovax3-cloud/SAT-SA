import React from 'react';

const AttentionTable = ({ reasons = [] }) => <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)' }}>{reasons.map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}</ul>;
export default AttentionTable;
