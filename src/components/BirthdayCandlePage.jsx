/**
 * BirthdayCandlePage.jsx
 * ─────────────────────────────────────────────────────────────
 * Page 1 of a birthday website.
 * Theme  : Royal Midnight Princess — dark purple, gold sparkles.
 * Center : Beautiful Standalone 3D-Style Birthday Cake with
 *          interactive candle flame.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback } from 'react';
import './BirthdayCandlePage.css';
import shihTzuImg from '../assets/shih_tzu_puppy_nobg.png';
import princessJasmineImg from '../assets/jasmine_custom_clean.png';
import princess2Img from '../assets/princess2_custom_clean.png';
import princess3Img from '../assets/princess3_custom_clean.png';

// ─── Constants ────────────────────────────────────────────────
const PARTICLE_POOL   = ['💖', '✨', '⭐', '💜', '💫', '🌟', '🩷', '🌸'];
const CONFETTI_COLORS = [
  '#e91e8c', '#9c27b0', '#f0c040', '#4fc3f7',
  '#ffffff', '#ff80ab', '#b388ff', '#40e0d0',
];

// ─── Beautiful Standalone Birthday Cake SVG ──────────────────
function StandaloneBirthdayCake({ isBlown }) {
  return (
    <svg
      viewBox="0 0 240 260"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Beautiful birthday cake with lit candle"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="cakeTier1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8bbd0" />
          <stop offset="50%" stopColor="#f48fb1" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>

        <linearGradient id="cakeTier2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e1bee7" />
          <stop offset="50%" stopColor="#ce93d8" />
          <stop offset="100%" stopColor="#7b1fa2" />
        </linearGradient>

        <linearGradient id="frostingTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff0f5" />
        </linearGradient>

        <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="50%" stopColor="#f0c040" />
          <stop offset="100%" stopColor="#b78103" />
        </linearGradient>

        {/* Filters */}
        <filter id="glowCake" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="flameGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Plate Shadow */}
      <ellipse cx="120" cy="245" rx="90" ry="12" fill="rgba(0,0,30,0.4)" />

      {/* Gold Pedestal / Plate Base */}
      <ellipse cx="120" cy="235" rx="85" ry="15" fill="url(#goldPlate)" />
      <ellipse cx="120" cy="232" rx="78" ry="11" fill="#fffde0" opacity="0.6" />

      {/* ═══ TIER 1 (Bottom Tier) ═══ */}
      <rect x="50" y="165" width="140" height="65" rx="15" fill="url(#cakeTier1)" filter="url(#glowCake)" />
      {/* 3D Curved Top of Tier 1 */}
      <ellipse cx="120" cy="165" rx="70" ry="12" fill="#f8bbd0" />

      {/* Bottom Frosting Drips */}
      <path d="M50,170 Q60,195 70,170 Q80,200 90,170 Q100,190 110,170 Q120,205 130,170 Q140,195 150,170 Q160,200 170,170 Q180,185 190,170" 
            fill="url(#frostingTop)" opacity="0.95" />

      {/* Pearls around Tier 1 Base */}
      {[58, 70, 84, 98, 112, 126, 140, 154, 168, 182].map((x, i) => (
        <circle key={i} cx={x} cy={225} r="3.5" fill="#ffffff" />
      ))}

      {/* ═══ TIER 2 (Top Tier) ═══ */}
      <rect x="70" y="110" width="100" height="60" rx="12" fill="url(#cakeTier2)" />
      {/* 3D Curved Top of Tier 2 */}
      <ellipse cx="120" cy="110" rx="50" ry="10" fill="#e1bee7" />

      {/* Top Frosting Drips */}
      <path d="M70,115 Q80,135 90,115 Q100,140 110,115 Q120,135 130,115 Q140,140 150,115 Q160,130 170,115" 
            fill="url(#frostingTop)" opacity="0.95" />

      {/* Decorative Gold Swirls on Top Tier */}
      <path d="M78,145 Q120,160 162,145" stroke="#f0c040" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />

      {/* Sprinkles / Jewels on Cake */}
      {[
        [75, 185, '#e91e8c', 7, 2], [95, 195, '#f0c040', 6, 2], [115, 180, '#4fc3f7', 8, 2],
        [135, 198, '#ffffff', 6, 2], [155, 185, '#e91e8c', 7, 2], [170, 192, '#f0c040', 6, 2],
        [85, 135, '#f0c040', 6, 2], [105, 145, '#e91e8c', 7, 2], [130, 138, '#4fc3f7', 6, 2], [150, 142, '#ffffff', 7, 2]
      ].map(([x, y, col, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={col} transform={`rotate(${i * 25} ${x} ${y})`} />
      ))}

      {/* ═══ CANDLE ═══ */}
      {/* Base Holder */}
      <ellipse cx="120" cy="108" rx="8" ry="3" fill="#f0c040" />

      {/* Candle Body */}
      <rect x="114" y="65" width="12" height="43" rx="4" fill="url(#frostingTop)" stroke="#f8bbd0" strokeWidth="1" />
      {/* Pink Spiral Stripe */}
      <path d="M114,75 Q120,78 126,73 M114,88 Q120,91 126,86 M114,101 Q120,104 126,99" 
            stroke="#e91e8c" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Wick */}
      <line x1="120" y1="65" x2="120" y2="57" stroke="#333" strokeWidth="2" strokeLinecap="round" />

      {/* ═══ FLAME ═══ */}
      {!isBlown && (
        <g className="bcp-flame" filter="url(#flameGlow)" style={{ transformOrigin: '120px 57px' }}>
          {/* Outer Glow Flame */}
          <path d="M120,25 C108,38 106,48 110,54 C114,60 126,60 130,54 C134,48 132,38 120,25 Z" fill="#ffcc00" />
          {/* Middle Orange Flame */}
          <path d="M120,33 C113,41 112,48 115,52 C118,56 122,56 125,52 C128,48 127,41 120,33 Z" fill="#ff7700" />
          {/* Inner Bright Core */}
          <path d="M120,42 C117,46 117,50 119,53 C120,54 120,54 121,53 C123,50 123,46 120,42 Z" fill="#ffffff" />
        </g>
      )}

      {/* Blown state wisp */}
      {isBlown && (
        <g className="bcp-flame bcp-flame--blown" style={{ transformOrigin: '120px 57px' }}>
          <path d="M120,25 C108,38 106,48 110,54 C114,60 126,60 130,54 C134,48 132,38 120,25 Z" fill="#ffcc00" opacity="0.3" />
        </g>
      )}
    </svg>
  );
}

// ─── SmokeWisps ──────────────────────────────────────────────
function SmokeWisps() {
  return (
    <div
      className="bcp-smoke-container"
      style={{ left: '50%', top: '22%', transform: 'translateX(-50%)' }}
    >
      <div className="bcp-smoke" />
      <div className="bcp-smoke" />
      <div className="bcp-smoke" />
    </div>
  );
}

// ─── Background & Deco Components ───────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: PARTICLE_POOL[i % PARTICLE_POOL.length],
    x: `${4 + (i * 37 + 11) % 92}%`,
    dur: `${5 + (i * 1.2) % 5}s`,
    delay: `${(i * 0.65) % 5}s`,
    size: `${11 + (i * 4) % 13}px`,
  }));
  return (
    <div className="bcp-particles" aria-hidden="true">
      {particles.map(p => (
        <span key={p.id} className="bcp-particle" style={{ '--x': p.x, '--dur': p.dur, '--delay': p.delay, '--size': p.size }}>
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function FairyDust() {
  const dots = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: `${6 + (i * 41 + 9) % 88}%`,
    dur: `${6 + (i * 0.8) % 6}s`,
    delay: `${(i * 0.9) % 7}s`,
  }));
  return (
    <div className="bcp-fairy-dust" aria-hidden="true">
      {dots.map(d => (
        <div key={d.id} className="bcp-dust" style={{ '--x': d.x, '--dur': d.dur, '--delay': d.delay }} />
      ))}
    </div>
  );
}

function Starfield() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: `${(i * 47 + 13) % 100}%`,
    y: `${(i * 31 + 7) % 100}%`,
    sz: `${1 + (i % 3)}px`,
    dur: `${2 + (i * 0.4) % 4}s`,
    delay: `${(i * 0.3) % 4}s`,
  }));
  return (
    <div className="bcp-stars" aria-hidden="true">
      {stars.map(s => (
        <div key={s.id} className="bcp-star" style={{ '--x': s.x, '--y': s.y, '--sz': s.sz, '--dur': s.dur, '--delay': s.delay }} />
      ))}
    </div>
  );
}



function ConfettiBurst({ pieces }) {
  return (
    <div className="bcp-confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div key={p.id} className="bcp-confetti-piece"
             style={{
               '--col': p.col, '--w': `${p.w}px`, '--h': `${p.h}px`, '--br': p.br,
               '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
               '--rot': `${p.rot}deg`, '--dur': `${p.dur}s`, '--delay': `${p.delay}s`,
             }} />
      ))}
    </div>
  );
}

function generateConfetti(count = 80) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    col: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    w: 6 + Math.random() * 12,
    h: 6 + Math.random() * 12,
    br: Math.random() > 0.5 ? '50%' : `${Math.random() * 4}px`,
    tx: (Math.random() - 0.5) * 400,
    ty: -(60 + Math.random() * 300),
    rot: (Math.random() - 0.5) * 720,
    dur: 1.2 + Math.random() * 0.8,
    delay: Math.random() * 0.5,
  }));
}

// ─── Main Component ──────────────────────────────────────────
export default function BirthdayCandlePage({ onComplete, isActive = true }) {
  const [isBlown, setIsBlown] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleBlow = useCallback(() => {
    if (isBlown) return;
    setIsBlown(true);
    setHasCompleted(false);
    setConfetti(generateConfetti(80));
  }, [isBlown]);

  useEffect(() => {
    if (!isBlown || hasCompleted || !isActive) return;
    const t1 = setTimeout(() => setConfetti([]), 2300);
    const t2 = setTimeout(() => {
      setHasCompleted(true);
      if (typeof onComplete === 'function') onComplete();
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isBlown, hasCompleted, isActive, onComplete]);

  return (
    <div className="bcp-page" role="main">
      <div className="bcp-vignette" />
      <Starfield />
      <FloatingParticles />
      <FairyDust />

      {/* Floating Princess Jasmine (Top Left corner) */}
      <div className="bcp-floating-princess">
        <img 
          src={princessJasmineImg} 
          alt="Princess Jasmine" 
          className="bcp-princess-img"
        />
      </div>

      {/* Floating Third Princess (Top Center) */}
      <div className="bcp-floating-princess-center">
        <img 
          src={princess3Img} 
          alt="Third Princess" 
          className="bcp-princess-img"
        />
      </div>

      {/* Floating Second Princess (Top Right corner) */}
      <div className="bcp-floating-princess-right">
        <img 
          src={princess2Img} 
          alt="Second Princess" 
          className="bcp-princess-img"
        />
      </div>

      <article className="bcp-card">
        {/* Cake + Shih Tzu Puppy side by side */}
        <div className="bcp-scene">
          <div className="bcp-dog-wrapper">
            <img 
              src={shihTzuImg} 
              alt="Cute Shih Tzu puppy" 
              className="bcp-shih-tzu-img"
            />
          </div>

          <div className="bcp-cake-scene" style={{ position: 'relative', width: '200px', height: '230px' }}>
            <StandaloneBirthdayCake isBlown={isBlown} />
            {isBlown && <SmokeWisps />}
          </div>
        </div>

        <button
          id="bcp-blow-btn"
          className="bcp-btn"
          onClick={handleBlow}
          disabled={isBlown}
          aria-label="Blow the birthday candle"
        >
          {isBlown ? 'Wish made! 🌟' : 'Click to Blow the Candle 🎂'}
        </button>
      </article>

      {confetti.length > 0 && <ConfettiBurst pieces={confetti} />}
    </div>
  );
}
