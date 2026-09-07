import React from 'react';
import { Coins } from 'lucide-react';

export default function CoinBadge({ coins }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'var(--gold-pastel)',
      border: '1px solid #FDE68A',
      color: '#B45309',
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 800
    }}>
      <Coins size={13} color="#D97706" />
      <span>{coins?.toLocaleString() || 0}</span>
    </div>
  );
}
