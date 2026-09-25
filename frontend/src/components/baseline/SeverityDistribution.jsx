import React from 'react';

const Distribution = ({ title, values = {} }) => {
  const entries = Object.entries(values);

  const maximum = Math.max(
    ...entries.map(([, count]) => Number(count) || 0),
    1
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
      }}
    >
      <span
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </span>

      {entries.length ? (
        entries.map(([label, count]) => (
          <div
            key={label}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px minmax(0, 1fr) 32px',
              gap: 12,
              alignItems: 'center',
              minHeight: 22,
              fontSize: '0.75rem',
            }}
          >
            {/* Label */}
            <span
              style={{
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={label}
            >
              {label}
            </span>

            {/* Bar */}
            <span
              style={{
                display: 'block',
                width: '100%',
                height: 7,
                background: 'var(--bg-darker)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: `${(Number(count) / maximum) * 100}%`,
                  height: '100%',
                  background: 'var(--primary)',
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </span>

            {/* Count */}
            <span
              style={{
                color: 'var(--text-primary)',
                textAlign: 'right',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              {count}
            </span>
          </div>
        ))
      ) : (
        <span style={{ color: 'var(--text-muted)' }}>N/A</span>
      )}
    </div>
  );
};

export default Distribution;
