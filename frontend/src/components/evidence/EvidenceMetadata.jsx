import React from 'react';
import { CopyableField } from './EventInformation';

const EvidenceMetadata = ({ alert = {} }) => {
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
        EVIDENCE METADATA
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        {/* Evidence Quality */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-darker)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Evidence Quality
          </span>
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: 'var(--primary)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textTransform: 'uppercase'
            }}>
              {alert.evidence_quality || 'N/A'}
            </span>
          </div>
        </div>

        <CopyableField label="Location / Log Path" value={alert.location} />
      </div>
    </div>
  );
};

export default EvidenceMetadata;
