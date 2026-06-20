import React, { useState } from 'react';

export default function StarRating({ value = 0, onChange, readonly = false, size = '' }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={[
            'star',
            size ? `star-${size}` : '',
            display >= star ? 'filled' : '',
            readonly ? 'readonly' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
