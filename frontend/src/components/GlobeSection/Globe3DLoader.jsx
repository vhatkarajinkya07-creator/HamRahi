// Globe3DLoader.jsx — Cinematic loading screen for 3D globe experience
import { useEffect, useState, useMemo } from "react";
import "./Globe3DLoader.css";

// Generate random stars once
function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    dur: `${Math.random() * 4 + 2}s`,
    delay: `${Math.random() * 4}s`,
    maxOp: (Math.random() * 0.6 + 0.2).toFixed(2),
  }));
}

const LOADING_HINTS = [
  "Initialising Cesium renderer…",
  "Loading terrain tiles…",
  "Calibrating camera orbit…",
  "Mapping destination markers…",
  "Engaging 3D experience…",
];

export default function Globe3DLoader({ duration = 4500, onDone }) {
  const stars = useMemo(() => generateStars(90), []);
  const [hint, setHint] = useState(LOADING_HINTS[0]);
  const [fadingOut, setFadingOut] = useState(false);

  // Cycle hint text
  useEffect(() => {
    const interval = duration / LOADING_HINTS.length;
    const timers = LOADING_HINTS.map((h, i) =>
      setTimeout(() => setHint(h), i * interval)
    );
    return () => timers.forEach(clearTimeout);
  }, [duration]);

  // Fade out → call onDone
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), duration - 700);
    const doneTimer = setTimeout(() => onDone?.(), duration + 100);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onDone]);

  return (
    <div className={`globe-loader-overlay${fadingOut ? " fade-out" : ""}`}>

      {/* HUD corners */}
      <div className="corner-hud tl" />
      <div className="corner-hud tr" />
      <div className="corner-hud bl" />
      <div className="corner-hud br" />

      {/* Stars */}
      <div className="stars-layer" aria-hidden="true">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--dur": s.dur,
              "--delay": s.delay,
              "--max-op": s.maxOp,
            }}
          />
        ))}
      </div>

      {/* Globe + orbit */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Outer pulse rings */}
        <div className="planet-ring-outer" />
        <div className="planet-ring-mid" />

        {/* Orbit ring */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "600px",
          }}
        >
          <div className="orbit-ring">
            <div className="orbit-dot" />
          </div>
        </div>

        {/* Globe sphere */}
        <div className="globe-sphere">
          <div className="globe-bands" />
          <div className="scan-line" />
        </div>
      </div>

      {/* Labels */}
      <p className="loader-title">HamRahi</p>
      <p className="loader-subtitle">3D Experience</p>
      <p className="loader-hint">{hint}</p>

      {/* Progress bar */}
      <div className="loader-progress-track">
        <div
          className="loader-progress-fill"
          style={{ "--duration": `${duration / 1000}s` }}
        />
      </div>

    </div>
  );
}
