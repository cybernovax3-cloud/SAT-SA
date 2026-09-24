import React, { useState } from 'react';

const SEVERITY_COLORS = {
  Critical: '#F3A6A6',
  High: '#F6C28B',
  Medium: '#F4D58D',
  Low: '#A9DDB5'
};

const getSeverityLabel = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 'Unknown';
  if (numericValue >= 10) return 'Critical';
  if (numericValue >= 7) return 'High';
  if (numericValue >= 4) return 'Medium';
  return 'Low';
};

const describeDonut = (cx, cy, outerRadius, innerRadius, startAngle, endAngle) => {
  const outerStart = {
    x: cx + outerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180),
    y: cy + outerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180)
  };
  const outerEnd = {
    x: cx + outerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180),
    y: cy + outerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180)
  };
  const innerStart = {
    x: cx + innerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180),
    y: cy + innerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180)
  };
  const innerEnd = {
    x: cx + innerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180),
    y: cy + innerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180)
  };
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerStart.x} ${innerStart.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y} Z`;
};

const SeverityChart = ({ alerts = [], loading = false, error = null, status = 'CONNECTING', onRetry }) => {
  const [activeSegment, setActiveSegment] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

  if (Array.isArray(alerts)) {
    alerts.forEach((alert) => {
      const severity = alert?.rule?.severity ?? alert?.severity;
      const label = getSeverityLabel(severity);
      if (counts[label] !== undefined) {
        counts[label] += 1;
      }
    });
  }

  const chartData = [
    { label: 'Critical', value: counts.Critical, color: SEVERITY_COLORS.Critical },
    { label: 'High', value: counts.High, color: SEVERITY_COLORS.High },
    { label: 'Medium', value: counts.Medium, color: SEVERITY_COLORS.Medium },
    { label: 'Low', value: counts.Low, color: SEVERITY_COLORS.Low }
  ].filter((entry) => entry.value > 0);

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  const pieSegments = [];
  let angle = 0;

  chartData.forEach((entry) => {
    const sliceAngle = total === 0 ? 0 : (entry.value / total) * 360;
    const startAngle = angle;
    const endAngle = angle + sliceAngle;
    pieSegments.push({ ...entry, startAngle, endAngle });
    angle = endAngle;
  });

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Alert Severity Distribution</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading chart data...</div>
      </div>
    );
  }

  if (error || status === 'OFFLINE') {
    return (
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Alert Severity Distribution</h3>
        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Chart unavailable</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Unable to retrieve the required backend data.</div>
        {onRetry && (
          <button onClick={onRetry} style={{ alignSelf: 'flex-start', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        )}
      </div>
    );
  }

  if (!alerts || alerts.length === 0 || total === 0) {
    return (
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Alert Severity Distribution</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No chart data available</div>
      </div>
    );
  }

  const radius = 52;
  const cx = 70;
  const cy = 70;

  return (
    <div className="glass-panel" style={{ background: 'var(--glass-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: isHovered ? 'var(--shadow-floating-hover)' : 'var(--shadow-soft)', transform: isHovered ? 'perspective(900px) translateY(-4px) rotateX(1deg)' : 'perspective(900px) translateY(0) rotateX(0)', transition: 'transform 260ms ease, box-shadow 260ms ease', animation: 'severityChartFloatIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: 0 }}>Alert Severity Distribution</h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{total} alerts</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 200px) minmax(0, 1fr)', gap: '12px', alignItems: 'center' }}>
        <svg viewBox="0 0 160 160" role="img" aria-label="Alert severity distribution donut chart" style={{ width: '100%', maxWidth: '200px', display: 'block', margin: '0 auto', overflow: 'visible' }}>
          <defs>
            {chartData.map((entry) => (
              <linearGradient key={entry.label} id={`severity-${entry.label.toLowerCase()}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={entry.color} />
                <stop offset="100%" stopColor={entry.color} stopOpacity="0.58" />
              </linearGradient>
            ))}
            <filter id="severityShadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#020617" floodOpacity="0.6" />
            </filter>
          </defs>
          {pieSegments.map((segment) => (
            <path
              key={`depth-${segment.label}`}
              d={describeDonut(cx, cy, radius, 26, segment.startAngle, segment.endAngle)}
              transform="translate(0 7)"
              fill={segment.color}
              opacity="0.38"
            />
          ))}
          {pieSegments.map((segment) => (
            <path
              key={segment.label}
              d={describeDonut(cx, cy, radius, 26, segment.startAngle, segment.endAngle)}
              fill={`url(#severity-${segment.label.toLowerCase()})`}
              stroke="var(--bg-surface)"
              strokeWidth={activeSegment === segment.label ? 3 : 2}
              filter="url(#severityShadow)"
              opacity={activeSegment && activeSegment !== segment.label ? 0.58 : 1}
              transform={activeSegment === segment.label ? 'translate(0 -2)' : undefined}
              onMouseEnter={() => setActiveSegment(segment.label)}
              onMouseLeave={() => setActiveSegment(null)}
              style={{ cursor: 'pointer', transition: 'opacity 180ms ease, transform 180ms ease' }}
            >
              <title>{`${segment.label}: ${segment.value} alert${segment.value === 1 ? '' : 's'}`}</title>
            </path>
          ))}
          <ellipse cx={cx} cy={cy + 7} rx="25" ry="8" fill="#94A3B8" opacity="0.28" />
          <circle cx={cx} cy={cy} r={26} fill="var(--bg-surface)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x={cx} y={cy - 3} textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="700">{total}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fill="var(--text-muted)" fontSize="9">alerts</text>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chartData.map((entry) => {
            const percent = total === 0 ? 0 : Math.round((entry.value / total) * 100);
            return (
              <div key={entry.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: entry.color, display: 'inline-block' }} aria-hidden="true" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{entry.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  <span>{entry.value}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes severityChartFloatIn {
          from { opacity: 0; transform: perspective(900px) translateY(14px) rotateX(3deg); }
          to { opacity: 1; transform: perspective(900px) translateY(0) rotateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SeverityChart;
