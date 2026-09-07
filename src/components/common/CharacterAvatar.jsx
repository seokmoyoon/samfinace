import React from 'react';

export default function CharacterAvatar({ 
  avatarIcon = '👾', 
  speechText = '이번 달 소비 잘 관리하고 있어요!',
  subText = '예산의 11% 사용 중',
  onClick 
}) {
  return (
    <div className="character-hero-area" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="character-hero-avatar">
        {avatarIcon}
      </div>
      <div className="character-speech-bubble">
        <div className="character-speech-text">
          {speechText}
        </div>
        {subText && (
          <div className="character-subtext">
            {subText}
          </div>
        )}
      </div>
    </div>
  );
}
