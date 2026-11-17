import React, { useEffect, useRef, useState } from 'react';

/**
 * SmallAnalogClock — Pure SVG Working Timepiece
 * - Reads actual system time via requestAnimationFrame.
 * - Smooth continuous second hand motion with sub-second accuracy.
 * - Minute and hour hands interpolate based on fractional elapsed time.
 * - Antique dial details: Roman numerals, railroad chapter ring, Breguet hands, brass bezel.
 */
export default function SmallAnalogClock({ size = 160 }) {
  const [angles, setAngles] = useState({ hour: 0, minute: 0, second: 0 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;

      // Calculate degrees (0 deg = 12 o'clock)
      const secondAngle = s * 6; // 360 / 60
      const minuteAngle = m * 6; // 360 / 60
      const hourAngle = h * 30; // 360 / 12

      setAngles({ hour: hourAngle, minute: minuteAngle, second: secondAngle });
      animFrameRef.current = requestAnimationFrame(updateClock);
    };

    animFrameRef.current = requestAnimationFrame(updateClock);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const center = 100;
  const radius = 90;
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      title="Current System Time"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
      >
        <defs>
          {/* Bezel Metallic Gradient */}
          <radialGradient id="bezelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="#A98143" />
            <stop offset="94%" stopColor="#E5C78A" />
            <stop offset="100%" stopColor="#5A421C" />
          </radialGradient>

          {/* Dial Face Texture Gradient */}
          <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1C1813" />
            <stop offset="70%" stopColor="#12100D" />
            <stop offset="100%" stopColor="#080807" />
          </radialGradient>
        </defs>

        {/* Outer Stepped Brass Bezel */}
        <circle cx={center} cy={center} r={radius + 4} fill="url(#bezelGrad)" stroke="#5A421C" strokeWidth="1.5" />
        <circle cx={center} cy={center} r={radius} fill="url(#dialGrad)" stroke="#C9A45C" strokeWidth="1" />

        {/* Outer Minute Track (Railroad track) */}
        <circle cx={center} cy={center} r={radius - 8} fill="none" stroke="#A98143" strokeWidth="0.8" opacity="0.6" />
        <circle cx={center} cy={center} r={radius - 14} fill="none" stroke="#A98143" strokeWidth="0.8" opacity="0.6" />

        {/* 60 Minute / Second Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const isHour = i % 5 === 0;
          const r1 = radius - 8;
          const r2 = isHour ? radius - 15 : radius - 12;
          const x1 = center + r1 * Math.sin(angle);
          const y1 = center - r1 * Math.cos(angle);
          const x2 = center + r2 * Math.sin(angle);
          const y2 = center - r2 * Math.cos(angle);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isHour ? '#E5C78A' : '#A98143'}
              strokeWidth={isHour ? 1.5 : 0.8}
              opacity={isHour ? 0.9 : 0.5}
            />
          );
        })}

        {/* Roman Numerals */}
        {romanNumerals.map((num, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const numRadius = radius - 24;
          const x = center + numRadius * Math.sin(angle);
          const y = center - numRadius * Math.cos(angle);

          return (
            <text
              key={num}
              x={x}
              y={y}
              fill="#E5C78A"
              fontSize="9"
              fontFamily="Cinzel, serif"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
              opacity="0.85"
            >
              {num}
            </text>
          );
        })}

        {/* Antique Center Inscription */}
        <text
          x={center}
          y={center - 36}
          fill="#C9A45C"
          fontSize="6.5"
          fontFamily="Cinzel, serif"
          fontWeight="700"
          letterSpacing="1.5"
          textAnchor="middle"
          opacity="0.75"
        >
          CHRONOS
        </text>

        {/* Hour Hand (Pierced Breguet Moon Style) */}
        <g transform={`rotate(${angles.hour}, ${center}, ${center})`}>
          <line x1={center} y1={center + 10} x2={center} y2={center - 48} stroke="#2C4251" strokeWidth="3" strokeLinecap="round" />
          <circle cx={center} cy={center - 36} r="4" fill="none" stroke="#2C4251" strokeWidth="2" />
          <line x1={center} y1={center - 40} x2={center} y2={center - 48} stroke="#2C4251" strokeWidth="1.8" />
        </g>

        {/* Minute Hand (Slender blued-steel) */}
        <g transform={`rotate(${angles.minute}, ${center}, ${center})`}>
          <line x1={center} y1={center + 12} x2={center} y2={center - 68} stroke="#2C4251" strokeWidth="2" strokeLinecap="round" />
          <circle cx={center} cy={center - 54} r="3" fill="none" stroke="#2C4251" strokeWidth="1.5" />
          <line x1={center} y1={center - 57} x2={center} y2={center - 68} stroke="#2C4251" strokeWidth="1.2" />
        </g>

        {/* Second Hand (Gold Needle with Counterweight) */}
        <g transform={`rotate(${angles.second}, ${center}, ${center})`}>
          <line x1={center} y1={center + 16} x2={center} y2={center - 74} stroke="#E5C78A" strokeWidth="0.9" />
          <circle cx={center} cy={center + 12} r="2.5" fill="#E5C78A" />
        </g>

        {/* Center Cap Nut */}
        <circle cx={center} cy={center} r="4" fill="#C9A45C" stroke="#5A421C" strokeWidth="1" />
        <circle cx={center} cy={center} r="1.5" fill="#1C1813" />
      </svg>
    </div>
  );
}
