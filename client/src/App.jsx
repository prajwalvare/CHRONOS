import React, { useState, useEffect } from 'react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', message: 'Connecting to chronos-server...' });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setBackendStatus({ status: 'connected', message: data.message, time: data.timestamp });
      })
      .catch((err) => {
        setBackendStatus({ status: 'disconnected', message: `Could not connect to backend: ${err.message}` });
      });
  }, []);

  return (
    <div className="min-h-screen bg-chronos-bg text-chronos-text font-serif flex flex-col justify-between p-8">
      {/* Header with Horological Identity */}
      <header className="border-b border-antique pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-gold-gradient">
            CHRONOS
          </h1>
          <p className="text-xs tracking-widest uppercase text-chronos-secondary mt-1 font-sans">
            Mechanical Horology & Reminder Engine
          </p>
        </div>
        <div className="text-right font-sans text-xs">
          <span className="text-chronos-secondary">PHASE 1 SKELETON</span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                backendStatus.status === 'connected'
                  ? 'bg-emerald-500'
                  : backendStatus.status === 'checking'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-chronos-parchment capitalize">
              {backendStatus.status}
            </span>
          </div>
        </div>
      </header>

      {/* Main Skeleton Verification Panel */}
      <main className="max-w-xl mx-auto my-12 p-8 border border-antique bg-surface-vintage rounded-sm shadow-brass-subtle">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest text-chronos-brass font-sans">
            System Initialization
          </span>
          <h2 className="text-xl font-semibold mt-1 text-chronos-goldHighlight">
            Foundation & Design Tokens Ready
          </h2>
        </div>

        <div className="space-y-4 text-sm font-sans text-chronos-parchment/90">
          <div className="flex justify-between items-center p-3 bg-chronos-bgSecondary border border-antique/40 rounded">
            <span>Frontend Engine</span>
            <span className="font-mono text-xs text-chronos-gold">Vite + React 18</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-chronos-bgSecondary border border-antique/40 rounded">
            <span>Styling & Design System</span>
            <span className="font-mono text-xs text-chronos-gold">Tailwind (Antique Tokens)</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-chronos-bgSecondary border border-antique/40 rounded">
            <span>Backend Link (`/api/health`)</span>
            <span className="font-mono text-xs text-chronos-gold">
              {backendStatus.message}
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs text-center text-chronos-secondary italic font-serif">
          "Tempus Fugit" — Awaiting Phase 2: 3D Mechanical Clock Opening Sequence
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-chronos-secondary/60 font-sans tracking-wide">
        CHRONOS © 2026 — Master Specification 1.0
      </footer>
    </div>
  );
}
