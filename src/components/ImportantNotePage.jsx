import React, { useState, useRef } from 'react';
import './ImportantNotePage.css';

const FLOATING_HEARTS = ['💖', '💕', '💗', '💓', '✨', '🌸', '💖', '✨'];

export default function ImportantNotePage({
  imageSrc,
  audioSrc = '/audio.mp3',
  onBack,
  isActive = true,
  children
}) {
  const [clickHearts, setClickHearts] = useState([]);
  const [loveCount, setLoveCount] = useState(0);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Spawn hearts on user click/tap
  const handleContainerClick = (e) => {
    if (e.target.closest('.inp-back-btn') || e.target.closest('.inp-audio-player-card')) return;

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

  const playFallbackMelody = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.18 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.18);
        osc.stop(ctx.currentTime + index * 0.18 + 0.35);
      });
    } catch {
      // ignore
    }
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Play fallback melody if file is not found yet
          playFallbackMelody();
          setIsPlaying(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || !seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
                </div>

                {/* Interactive Audio Player replacing "Tap for Special Wish" */}
                <div className="inp-audio-player-card">
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                    preload="auto"
                  />

                  <div className="inp-audio-header">
                    <span className="inp-audio-icon">🎵</span>
                    <span className="inp-audio-title">Special Audio Wish</span>
                    {isPlaying && (
                      <div className="inp-equalizer">
                        <span className="inp-eq-bar bar1" />
                        <span className="inp-eq-bar bar2" />
                        <span className="inp-eq-bar bar3" />
                        <span className="inp-eq-bar bar4" />
                      </div>
                    )}
                  </div>

                  <div className="inp-audio-controls">
                    <button
                      className={`inp-play-btn ${isPlaying ? 'playing' : ''}`}
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>

                    <div className="inp-audio-progress-group">
                      <input
                        type="range"
                        className="inp-audio-slider"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                      />
                      <div className="inp-audio-time">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <button
                      className="inp-mute-btn"
                      onClick={toggleMute}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                </div>

                {loveCount > 0 && (
                  <div className="inp-love-counter" style={{ marginTop: '10px' }}>
                    Love Sent: <strong>{loveCount}</strong> 💖
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

