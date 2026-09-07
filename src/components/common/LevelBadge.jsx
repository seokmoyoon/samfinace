import React from 'react';

export default function LevelBadge({ level, size = 'md' }) {
  const isLg = size === 'lg';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
      color: '#FFFFFF',
      fontWeight: 900,
      fontSize: isLg ? '12px' : '10px',
      padding: isLg ? '3px 8px' : '2px 6px',
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
      letterSpacing: '0.2px'
    }}>
      Lv.{level}
    </span>
  );
}
