import React, { useState } from 'react';

const ActivityChart = ({ evidence = [] }) => {
  const [activePoint, setActivePoint] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  // Extract and sort timestamps
  const timestamps = evidence
    .map(item => item.timestamp)
    .filter(Boolean)
    .map(t => new Date(t))
    .sort((a, b) => a - b);

  // Group timestamps into 6 chronological buckets
  const totalPoints = 6;
  let chartData = [];

  if (timestamps.length > 0) {
    const minTime = timestamps[0].getTime();
    const maxTime = timestamps[timestamps.length - 1].getTime();
    const duration = maxTime - minTime;
    const bucketSize = duration > 0 ? duration / (totalPoints - 1) : 1000 * 60; // default 1 min buckets

    // Initialize buckets
    const buckets = Array.from({ length: totalPoints }, (_, i) => {
      const time = minTime + i * bucketSize;
      return {
        label: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: 0
      };
    });

    // Populate buckets
    timestamps.forEach(t => {
      const timeMs = t.getTime();
      let bucketIdx = 0;
      if (duration > 0) {
        bucketIdx = Math.min(totalPoints - 1, Math.floor((timeMs - minTime) / bucketSize));
      }
      buckets[bucketIdx].count++;
    });

    chartData = buckets;
  } else {
    chartData = Array.from({ length: totalPoints }, () => ({
      label: `--:--`,
      count: 0
    }));
  }

  // Find max count to scale SVG chart heights
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  const width = 500;
  const height = 150;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = chartData.map((d, index) => {
    const x = padding + (index / (totalPoints - 1)) * chartWidth;
    const y = padding + chartHeight - (d.count / maxCount) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPath = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`;

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
      boxShadow: isHovered ? '0 18px 34px rgba(2, 6, 23, 0.28)' : '0 10px 24px rgba(2, 6, 23, 0.16)',
      transition: 'transform 260ms ease, box-shadow 260ms ease',
      animation: 'activityChartFloatIn 700ms cubic-bezier(0.22, 1, 0.36, 1) both'
    }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <h3 style={{
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)'
      }}>
        Alert Activity
      </h3>

      <div style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Alert activity over time" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id="activityAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B9B2F5" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#A8DADC" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="activityLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#73C6D4" />
              <stop offset="50%" stopColor="#4FAFC2" />
              <stop offset="100%" stopColor="#82D0D7" />
            </linearGradient>
          </defs>

          <rect x={padding} y={padding} width={chartWidth} height={chartHeight} rx="8" fill="rgba(2, 6, 23, 0.16)" />
          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = padding + ratio * chartHeight;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {timestamps.length > 0 && (
            <>
              <path d={areaPath} fill="url(#activityAreaGradient)" transform="translate(0 5)" opacity="0.45" />
              <path d={areaPath} fill="url(#activityAreaGradient)" />
              <polyline
                fill="none"
                stroke="url(#activityLineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {chartData.map((d, index) => {
                const x = padding + (index / (totalPoints - 1)) * chartWidth;
                const y = padding + chartHeight - (d.count / maxCount) * chartHeight;
                return (
                  <g
                    key={index}
                    onMouseEnter={() => setActivePoint(index)}
                    onMouseLeave={() => setActivePoint(null)}
                    style={{ cursor: 'crosshair' }}
                  >
                    <circle cx={x} cy={y + 3} r={activePoint === index ? 8 : 6} fill="rgba(2, 6, 23, 0.65)" />
                    <circle cx={x} cy={y} r={activePoint === index ? 6 : 4} fill="var(--bg-dark)" stroke="#4FAFC2" strokeWidth="2" />
                    <text
                      x={x}
                      y={Math.max(12, y - 10)}
                      textAnchor="middle"
                      fill="#4FAFC2"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="var(--font-mono)"
                    >
                      {d.count}
                    </text>
                    <title>{`${d.label}: ${d.count} alert${d.count === 1 ? '' : 's'}`}</title>
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {/* X-Axis labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          padding: '0 8px',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          {chartData.map((d, i) => (
            <span key={i}>{d.label}</span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes activityChartFloatIn {
          from { opacity: 0; transform: perspective(900px) translateY(14px) rotateX(3deg); }
          to { opacity: 1; transform: perspective(900px) translateY(0) rotateX(0); }
        }
      `}</style>
    </div>
  );
};

export default ActivityChart;
