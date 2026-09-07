import React from 'react';

export default function ExpBar({ current, max, showLabel = true }) {
  const percent = Math.min(100, Math.round((current / max) * 100));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-muted)',
          marginBottom: '4px'
        }}>
          <span>EXP</span>
          <span style={{ color: 'var(--accent)' }}>
            {current} / {max} ({percent}%)
          </span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: '8px',
        background: '#E2E8F0',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #8B5CF6, #C084FC)',
          borderRadius: '9999px',
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
}
