/**
 * HappyBirthdayPage.jsx — Page 2 of Birthday Website
 * ─────────────────────────────────────────────────────────────
 * Theme : Elegant, Romantic, Soft Glow (Blush Pink to Cream)
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import './HappyBirthdayPage.css';
import ShihTzuIllustration from './ShihTzuIllustration';

// Note: Replace this placeholder path with your real photo path when ready
import defaultPhoto from '../assets/shih_tzu_puppy_cake.jpg';
import leftSideImg from '../assets/left_side_photo_navy.png';
import topLeftImg from '../assets/top_left_photo_blended.png';
import topRightImg from '../assets/image.png';

const BALLOON_COLORS = [
  '#FF4B72', // Hot Pink
  '#FFD700', // Gold
  '#9B51E0', // Royal Purple
  '#2F80ED', // Vivid Blue
  '#FF7A00', // Warm Orange
  '#E040FB', // Neon Magenta
  '#00E676', // Emerald Green
  '#FF6090', // Soft Rose
];

export default function HappyBirthdayPage({
  photoSrc = defaultPhoto,
  leftPhoto = leftSideImg,
  topLeftPhoto = topLeftImg,
  topRightPhoto = topRightImg,
  onNext,
  onOpenNote,
  onBack,
  isActive = true
}) {
  const handleNoteClick = () => {
    if (typeof onOpenNote === 'function') {
      onOpenNote();
    } else if (typeof onNext === 'function') {
      onNext();
    }
  };

  const [balloons, setBalloons] = useState(() =>
    Array.from({ length: 24 }, (_, id) => ({
      id,
      left: Math.random() * 90 + 5,
      size: Math.random() * 20 + 42,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      duration: Math.random() * 5 + 6,
      delay: Math.random() * 5,
      popped: false,
      popping: false,
    }))
  );

  const popBalloon = (id, e) => {
    e.stopPropagation();
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popping: true } : b))
    );

    // Audio pop sound using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback
    }

    setTimeout(() => {
      setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    }, 250);
  };

  return (
    <div className="hbp-page" role="main">
      {/* Top Left Navigation Back Button */}
      {onBack && (
        <button 
          className="hbp-back-btn" 
          onClick={onBack}
          aria-label="Go back to candle page"
        >
          ← Back to Cake 🎂
        </button>
      )}

      <div className="hbp-ambient-glow" />

      {/* Floating Interactive Balloons */}
      <div className="hbp-balloon-container">
        {balloons.map(
          (b) =>
            !b.popped && (
              <div
                key={b.id}
                className={`hbp-balloon ${b.popping ? 'popping' : ''}`}
                style={{
                  left: `${b.left}%`,
                  width: `${b.size}px`,
                  height: `${b.size * 1.25}px`,
                  '--balloon-color': b.color,
                  animationDuration: `${b.duration}s`,
                  animationDelay: `${b.delay}s`,
                }}
                onClick={(e) => popBalloon(b.id, e)}
              >
                <div className="hbp-balloon-body">
                  <div className="hbp-balloon-shine" />
                </div>
                <div className="hbp-balloon-knot" />
                <div className="hbp-balloon-string" />
                {b.popping && <div className="hbp-balloon-pop-burst">✨💥✨</div>}
              </div>
            )
        )}
      </div>

      {/* Bottom Right floating custom image */}
      <div className="hbp-top-left-floating">
        <img
          src={topLeftPhoto}
          alt="Bottom right accent"
          className="hbp-top-left-img"
        />
      </div>

      {/* Top Right floating custom image (Circled location) */}
      <div className="hbp-top-right-floating">
        <img
          src={topRightPhoto}
          alt="Top right accent"
          className="hbp-top-right-img"
        />
      </div>

      {/* Left side floating custom image (no bg removal) */}
      <div className="hbp-left-floating">
        <img
          src={leftPhoto}
          alt="Left side portrait"
          className="hbp-left-img"
        />
      </div>

      <main className="hbp-content">
        {/* 1. TOP: Photo Frame */}
        <div className="hbp-photo-wrapper">
          <img
            src={photoSrc}
            alt="Birthday Girl"
            className="hbp-photo"
          />
        </div>

        {/* 2. HEADING TEXT */}
        <h1 className="hbp-heading">
          <span className="hbp-greeting">Happy Birthday</span>
          <span className="hbp-name">
            <span className="hbp-sparkle-icon">✨</span>
            MUTTA KANNI
            <span className="hbp-sparkle-icon">✨</span>
          </span>
        </h1>

        {/* 3. DECORATIVE ACCENTS */}
        <div className="hbp-accents">
          <span className="hbp-sparkle">✨</span>
          <span className="hbp-heart">💖</span>
          <span className="hbp-sparkle">✨</span>
        </div>
      </main>

      {/* 4. CORNER ACCENT: SHIH TZU MASCOT WITH IMPORTANT NOTE WORDING */}
      <div
        className="hbp-corner-mascot-wrapper"
        onClick={handleNoteClick}
        role="button"
        tabIndex={0}
        aria-label="Read important note"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNoteClick(); }}
      >
        <div className="hbp-corner-mascot">
          <ShihTzuIllustration style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="hbp-note-speech-bubble">
          <span className="hbp-note-badge">NOTE 💌</span>
          <span className="hbp-note-text">
            You have an important note! <strong>Click to read the note</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
