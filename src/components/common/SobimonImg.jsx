import React, { useState } from 'react';

/**
 * SOBIMON 전용 스마트 이미지 컴포넌트
 * public/images/sobimon/${name}.${ext} 이미지를 로드하며,
 * 파일이 없거나 로드 실패 시 지정된 fallback 컴포넌트를 깨짐 없이 렌더링합니다.
 */
export default function SobimonImg({
  name,
  ext = 'png',
  alt = '소비몬',
  width,
  height,
  className = '',
  style = {},
  fallback = null,
  onClick
}) {
  const [hasError, setHasError] = useState(false);
  const src = `/images/sobimon/${name}.${ext}`;

  if (hasError || !name) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      onError={() => setHasError(true)}
      style={{
        display: 'inline-block',
        objectFit: 'contain',
        maxWidth: '100%',
        ...style
      }}
    />
  );
}
