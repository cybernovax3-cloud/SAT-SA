import React from 'react';
import { CopyableField } from './EventInformation';
import SeverityBadge from '../common/SeverityBadge';

const AlertRuleDetails = ({ alert = {} }) => {
  const rule = alert.rule || {};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: 'var(--bg-dark)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%'
    }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '4px' }}>
        RULE INFORMATION
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        alignItems: 'start'
      }}>
        <CopyableField label="Activity Type" value={alert.activity_type} showCopy={false} />
        <CopyableField label="Rule ID" value={rule.id} />
        
        {/* Custom display for severity to include the visual badge */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-darker)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          height: '100%'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Severity
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '22px' }}>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              Level {rule.severity || '0'}
            </span>
            <SeverityBadge severity={rule.severity} />
          </div>
        </div>

        <CopyableField label="Decoder" value={alert.decoder} showCopy={false} />
      </div>

      <div style={{ marginTop: '4px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-darker)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Description
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {rule.description || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertRuleDetails;
