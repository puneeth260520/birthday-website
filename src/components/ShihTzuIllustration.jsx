import React from 'react';
import shihTzuImg from '../assets/shih_tzu_puppy_nobg.png?v=2';

export default function ShihTzuIllustration({ className = '', style = {} }) {
  return (
    <img
      src={shihTzuImg}
      alt="Cute Shih Tzu Mascot"
      className={className}
      style={{
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  );
}
