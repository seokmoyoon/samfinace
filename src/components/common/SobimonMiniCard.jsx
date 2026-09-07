import React from 'react';

export default function SobimonMiniCard({ monster, onClick }) {
  if (!monster) return null;

  return (
    <div 
      className="monster-mini-card"
      onClick={onClick}
    >
      <div className="mon-icon">{monster.badge}</div>
      <div className="mon-name">{monster.name}</div>
      <div className="mon-status">
        {monster.discovered ? `Lv.${monster.level}` : '미발견'}
      </div>
    </div>
  );
}
