import React, { useState } from 'react';
import './ImportantNotePage.css';

const FLOATING_HEARTS = ['💖', '💕', '💗', '💓', '✨', '🌸', '💖', '✨'];

export default function ImportantNotePage({ imageSrc, onBack, isActive = true, children }) {
  const [clickHearts, setClickHearts] = useState([]);
  const [loveCount, setLoveCount] = useState(0);
  const [isOpened, setIsOpened] = useState(false);

  // Spawn hearts on user click/tap
  const handleContainerClick = (e) => {
    if (e.target.closest('.inp-back-btn') || e.target.closest('.inp-interactive-btn')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      emoji: FLOATING_HEARTS[Math.floor(Math.random() * FLOATING_HEARTS.length)],
      size: Math.random() * 12 + 18,
    }));

    setClickHearts((prev) => [...prev.slice(-20), ...newHearts]);
    setLoveCount((c) => c + 1);

    // Audio sound effect feedback
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio fallback
    }
  };

  const handleSurpriseClick = (e) => {
    e.stopPropagation();
    setIsOpened(true);
    setLoveCount((c) => c + 10);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 160,
      y: y + (Math.random() - 0.5) * 100,
      emoji: FLOATING_HEARTS[i % FLOATING_HEARTS.length],
      size: Math.random() * 14 + 20,
    }));

    setClickHearts((prev) => [...prev.slice(-25), ...burst]);
  };

  return (
    <div className="inp-page" role="main" onClick={handleContainerClick}>
      {/* Background Floating Hearts */}
      <div className="inp-ambient-hearts" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="inp-floating-heart"
            style={{
              left: `${(i * 23 + 7) % 90}%`,
              animationDuration: `${6 + (i % 5)}s`,
              animationDelay: `${(i * 0.7) % 4}s`,
              fontSize: `${16 + (i % 4) * 6}px`,
            }}
          >
            {FLOATING_HEARTS[i % FLOATING_HEARTS.length]}
          </span>
        ))}
      </div>

      {/* Click Burst Hearts */}
      {clickHearts.map((h) => (
        <span
          key={h.id}
          className="inp-burst-heart"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            fontSize: `${h.size}px`,
          }}
        >
          {h.emoji}
        </span>
      ))}

      {onBack && (
        <button
          className="inp-back-btn"
          onClick={onBack}
          aria-label="Go back to birthday page"
        >
          ← Back to Greeting 💖
        </button>
      )}

      {/* Split Layout: Left Image & Right Interactive Content */}
      <main className="inp-split-container">
        {/* Left Region: Cover Image */}
        <div className="inp-left-image-region">
          {imageSrc ? (
            <div className="inp-image-frame">
              <img src={imageSrc} alt="Custom cover collage" className="inp-cover-image" />
              <div className="inp-image-shine" />
            </div>
          ) : (
            <div className="inp-image-placeholder">
              <span className="inp-placeholder-icon">🖼️</span>
              <p>Image cover area</p>
            </div>
          )}
        </div>

        {/* Right Region: Interactive Letter & Wording Card */}
        <div className="inp-right-content-region">
          {children || (
            <div className="inp-card-wrapper">
              <div className="inp-letter-card">
                {/* Decorative Top Stamp */}
                <div className="inp-letter-stamp">
                  <span className="inp-stamp-icon">💌</span>
                  <span className="inp-stamp-tag">IMPORTANT NOTE</span>
                </div>

                <h1 className="inp-letter-heading">
                  <span className="inp-script-sub">A Very</span>
                  <span className="inp-title-main">Special Note ✨</span>
                </h1>

                <div className="inp-divider" />

                <div className="inp-letter-body">
                  <p className="inp-letter-salutation">Dearest Mutta Kanni 💖,</p>
                  <p className="inp-letter-text">
                    Thank you for all the beautiful moments, endless smiles, and unforgettable memories. You bring so much joy into every day! 🌸
                  </p>

                  {isOpened && (
                    <div className="inp-secret-message">
                      <span className="inp-sparkle-star">✨</span>
                      <p>
                        "May your year ahead be filled with infinite happiness, dreams come true, and endless sweet adventures!" 🎂🥳
                      </p>
                    </div>
                  )}
                </div>

                {/* Interactive Action Controls */}
                <div className="inp-card-actions">
                  <button
                    className="inp-interactive-btn"
                    onClick={handleSurpriseClick}
                  >
                    {isOpened ? 'Sending More Love! 💖' : 'Tap for Special Wish 🎁'}
                  </button>

                  {loveCount > 0 && (
                    <div className="inp-love-counter">
                      Love Sent: <strong>{loveCount}</strong> 💖
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
