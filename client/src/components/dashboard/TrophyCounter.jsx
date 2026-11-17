import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck } from 'lucide-react';

export default function TrophyCounter({ completedCount = 0 }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 600);
    return () => clearTimeout(t);
  }, [completedCount]);

  return (
    <div className="flex items-center gap-5 p-4 border border-antique/50 bg-chronos-surface/80 rounded-sm shadow-brass-subtle select-none max-w-xs group hover:border-chronos-gold transition-colors duration-200">
      {/* Engraved Trophy Icon Container */}
      <div className="relative w-16 h-16 shrink-0 rounded-sm border border-chronos-gold/60 bg-gradient-to-b from-chronos-bgSecondary to-chronos-bg flex items-center justify-center shadow-inner">
        <svg
          viewBox="0 0 24 24"
          className="w-9 h-9 text-chronos-gold group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(201,164,92,0.4)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Ornate Antique Trophy Silhouette */}
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 4h16v6a7 7 0 0 1-14 0V4z" />
          <path d="M12 15v4" />
          <path d="M8 21h8" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        </svg>

        {/* Small corner screws */}
        <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-chronos-brass/60" />
        <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-chronos-brass/60" />
        <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-chronos-brass/60" />
        <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-chronos-brass/60" />
      </div>

      {/* Completion Counter Details */}
      <div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-3xl font-bold font-serif text-chronos-goldHighlight tracking-tight transition-transform duration-300 ${
              animate ? 'scale-125 text-amber-300' : 'scale-100'
            }`}
          >
            {completedCount}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-chronos-brass font-sans">
            Accomplished
          </span>
        </div>
        <p className="text-xs text-chronos-textMuted font-sans mt-0.5">
          Fulfillments Engraved in History
        </p>
      </div>
    </div>
  );
}
