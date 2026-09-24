import React from 'react';

const AlertStats = ({ alerts = [] }) => {
  // Compute severity counts
  const total = alerts.length;
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  alerts.forEach(alert => {
    const sev = alert.rule?.severity;
    const num = Number(sev);
    if (!isNaN(num)) {
      if (num >= 10) critical++;
      else if (num >= 7) high++;
      else if (num >= 4) medium++;
      else low++;
    } else {
      const str = String(sev).toUpperCase();
      if (str === 'CRITICAL') critical++;
      else if (str === 'HIGH') high++;
      else if (str === 'MEDIUM' || str === 'WARNING') medium++;
      else low++;
    }
  });

  const cards = [
    { title: 'TOTAL ALERTS', value: total, border: 'var(--border-color)', color: 'var(--text-primary)' },
    { title: 'CRITICAL SEVERITY', value: critical, border: 'rgba(239, 68, 68, 0.45)', color: 'var(--danger)' },
    { title: 'HIGH SEVERITY', value: high, border: 'rgba(239, 68, 68, 0.3)', color: 'var(--danger)' },
    { title: 'MEDIUM SEVERITY', value: medium, border: 'rgba(245, 158, 11, 0.3)', color: 'var(--warning)' },
    { title: 'LOW SEVERITY', value: low, border: 'rgba(16, 185, 129, 0.3)', color: 'var(--success)' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      width: '100%'
    }}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--bg-dark)',
            border: `1px solid ${card.border}`,
            borderRadius: 'var(--border-radius)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.05em'
          }}>
            {card.title}
          </span>
          <span style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: card.color
          }}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AlertStats;
