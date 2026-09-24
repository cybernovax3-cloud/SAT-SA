import React from 'react';
import SeverityDistribution from './SeverityDistribution';
import RuleDistribution from './RuleDistribution';
import DecoderDistribution from './DecoderDistribution';

const EntityBaselineCard = ({ entity, onClick }) => <button onClick={onClick} style={{ textAlign: 'left', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', color: 'var(--text-primary)', padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16 }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}><div><strong>{entity.agent_name || 'N/A'}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>{entity.agent_id || 'N/A'} · {entity.agent_ip || 'N/A'}</div></div><strong style={{ fontFamily: 'var(--font-mono)' }}>{entity.total_events ?? 0} events</strong></div>
  <SeverityDistribution title="Severity Distribution" values={entity.severity_distribution} />
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}><RuleDistribution values={entity.rule_distribution} /><DecoderDistribution values={entity.decoder_distribution} /></div>
</button>;
export default EntityBaselineCard;
