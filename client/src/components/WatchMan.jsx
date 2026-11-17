import React from 'react';

/**
 * WatchMan – a simple animated element that responds to scroll progress.
 * The parent component should call <WatchMan progress={value} /> where
 * `progress` is a number from 0 (top of page) to 1 (bottom of the hero scroll area).
 *
 * The animation mimics the reference site: the watch‑man slides up,
 * slightly scales, and rotates as the user scrolls.
 */
export default function WatchMan({ progress = 0 }) {
  // Clamp progress
  const p = Math.min(Math.max(progress, 0), 1);

  // Translate upward as we scroll, starting a little off‑screen
  const translateY = 50 - p * 200; // from 50px down to -150px up
  // Scale up a bit
  const scale = 0.8 + p * 0.5; // 0.8 → 1.3
  // Small rotation for effect
  const rotate = p * 15; // 0 → 15deg

  const style = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '200px',
    height: 'auto',
    transform: `translate(-50%, -50%) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
    transition: 'transform 0.1s linear',
    pointerEvents: 'none',
  };

  return (
    <img
      src="/watch-man.png"
      alt="Watch Man"
      style={style}
    />
  );
}
