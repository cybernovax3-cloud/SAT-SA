import React, { useState } from 'react';

const TelemetryVolumeCard = ({ evidence = [], loading = false, error = null }) => {
  const [activePoint, setActivePoint] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <div className="glass-panel" style={{
        background: 'var(--glass-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '20px',
        width: '100%',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing telemetry volume...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{
        background: 'var(--glass-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '20px',
        width: '100%',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 'bold' }}>Unable to load telemetry volume</div>
      </div>
    );
  }

  if (!evidence || evidence.length === 0) {
    return (
      <div className="glass-panel" style={{
        background: 'var(--glass-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '20px',
        width: '100%',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', margin: 0 }}>
              TELEMETRY VOLUME
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alert activity</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, gap: '8px', padding: '20px 0' }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>No telemetry available</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center' }}>
            No alert activity was detected in the available assessment window.
          </div>
        </div>
      </div>
    );
  }

  // Define 6 four-hour buckets
  const buckets = [
    { label: '00:00–04:00', count: 0 },
    { label: '04:00–08:00', count: 0 },
    { label: '08:00–12:00', count: 0 },
    { label: '12:00–16:00', count: 0 },
    { label: '16:00–20:00', count: 0 },
    { label: '20:00–24:00', count: 0 },
  ];

  evidence.forEach(item => {
    if (!item.timestamp) return;
    try {
      const date = new Date(item.timestamp);
      const hour = date.getHours(); // 0 to 23 in local time
      if (hour >= 0 && hour < 4) buckets[0].count++;
      else if (hour >= 4 && hour < 8) buckets[1].count++;
      else if (hour >= 8 && hour < 12) buckets[2].count++;
      else if (hour >= 12 && hour < 16) buckets[3].count++;
      else if (hour >= 16 && hour < 20) buckets[4].count++;
      else if (hour >= 20 && hour < 24) buckets[5].count++;
    } catch (e) {
      // Ignored for safety
    }
  });

  const totalAlerts = evidence.length;
  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  // SVG dimensions
  const width = 500;
  const height = 150;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 25;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = buckets.map((b, index) => {
    const x = paddingLeft + (index / (buckets.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (b.count / maxCount) * chartHeight;
    return { x, y, count: b.count, label: b.label };
  });

  const pointsStr = points.map(p => p.x + ',' + p.y).join(' ');
  const areaPath = 'M ' + points[0].x + ',' + (height - paddingBottom) + ' L ' + pointsStr + ' L ' + points[points.length - 1].x + ',' + (height - paddingBottom) + ' Z';
  const linePath = 'M ' + pointsStr;

  return (
    <div className="glass-panel" style={{
      background: 'var(--glass-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transform: isHovered ? 'perspective(900px) translateY(-4px) rotateX(1deg)' : 'perspective(900px) translateY(0) rotateX(0)',
      boxShadow: isHovered ? 'var(--shadow-floating-hover)' : 'var(--shadow-soft)',
      transition: 'transform 260ms ease, box-shadow 260ms ease',
      animation: 'telemetryVolumeFloatIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both'
    }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            TELEMETRY VOLUME
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alert activity</span>
        </div>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 'bold',
          color: 'var(--primary)',
          backgroundColor: 'var(--primary-soft)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono)'
        }}>
          24 HOURS
        </span>
      </div>

      <div style={{ margin: '4px 0' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alerts</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {totalAlerts}
        </div>
      </div>

      <div style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={'0 0 ' + width + ' ' + height} role="img" aria-label="Telemetry volume chart" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="telemetryAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="telemetryLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <line
                key={i}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Y Axis counts */}
          <text x={paddingLeft - 8} y={paddingTop + 4} textAnchor="end" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
            {Math.round(maxCount)}
          </text>
          <text x={paddingLeft - 8} y={paddingTop + chartHeight / 2 + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
            {Math.round(maxCount / 2)}
          </text>
          <text x={paddingLeft - 8} y={paddingTop + chartHeight + 3} textAnchor="end" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
            0
          </text>

          {/* Fill and Line */}
          <path d={areaPath} fill="url(#telemetryAreaGradient)" />
          <path d={linePath} fill="none" stroke="url(#telemetryLineGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Points */}
          {points.map((p, index) => (
            <g
              key={index}
              onMouseEnter={() => setActivePoint(index)}
              onMouseLeave={() => setActivePoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={p.x} cy={p.y} r={activePoint === index ? 7 : 4} fill="var(--bg-surface)" stroke="var(--primary)" strokeWidth="2" />
              {activePoint === index && (
                <circle cx={p.x} cy={p.y} r="11" fill="var(--primary)" fillOpacity="0.15" />
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip Overlay */}
        {activePoint !== null && (
          <div style={{
            position: 'absolute',
            left: (points[activePoint].x / width) * 100 + '%',
            top: (points[activePoint].y / height) * 100 - 25 + '%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            boxShadow: 'var(--shadow-floating)',
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{points[activePoint].label}</span>
            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Alerts: {points[activePoint].count}</span>
          </div>
        )}

        {/* X-Axis labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          paddingLeft: (paddingLeft / width) * 100 + '%',
          paddingRight: (paddingRight / width) * 100 + '%',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          {buckets.map((b, i) => (
            <span key={i} style={{ width: '40px', textAlign: 'center', marginLeft: i === 0 ? '-20px' : '0px', marginRight: i === buckets.length - 1 ? '-20px' : '0px' }}>
              {b.label.split('–')[0]}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes telemetryVolumeFloatIn {
          from { opacity: 0; transform: perspective(900px) translateY(14px) rotateX(3deg); }
          to { opacity: 1; transform: perspective(900px) translateY(0) rotateX(0); }
        }
      `}</style>
    </div>
  );
};

export default TelemetryVolumeCard;
