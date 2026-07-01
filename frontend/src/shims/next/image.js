import React from 'react';

export default function Image({ src, alt, width, height, className, fill, style, ...props }) {
  const imgStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : style;

  return (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      style={imgStyle}
      {...props}
    />
  );
}
