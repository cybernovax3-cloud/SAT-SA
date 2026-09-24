import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', opacity: 0.6 }}>
      {/* 3 top big analytics cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              height: '120px',
              flex: 1,
              minWidth: '200px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: '40%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
            <div style={{ width: '60%', height: '32px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>

      {/* priority / summary row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', height: '120px', flex: 1, minWidth: '220px' }}></div>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', height: '120px', flex: 3, minWidth: '300px' }}></div>
      </div>

      {/* alert statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)', height: '80px' }}></div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
