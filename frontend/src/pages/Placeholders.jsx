import React from 'react';

const placeholderFactory = (pageName) => {
  const Component = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {pageName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Analytical Module Placeholder</p>
        </div>

        <div style={{
          background: 'var(--bg-dark)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '24px',
          maxWidth: '600px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '8px' }}>
            Module Coming Soon
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.9rem' }}>
            The <strong>{pageName}</strong> analytics and reporting controls will be fully integrated during Phase 2 of the SAT-SA implementation. Backend endpoint references have already been wired into the API config.
          </p>
        </div>
      </div>
    );
  };
  Component.displayName = pageName;
  return Component;
};

export const Alerts = placeholderFactory('Alerts');
export const Behaviour = placeholderFactory('Behaviour');
export const Correlation = placeholderFactory('Correlation');
export const Risk = placeholderFactory('Risk');
export const Attention = placeholderFactory('Attention');
export const Resilience = placeholderFactory('Resilience');
export const Findings = placeholderFactory('Findings');
export const Evidence = placeholderFactory('Evidence');
export const Assessment = placeholderFactory('Assessment');
