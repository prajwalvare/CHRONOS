// App.jsx – restored layout: watch centered, Chronos name visible at top
import React, { useState, useEffect, useRef } from 'react';
import ClockScene from './components/three/ClockScene';
import MainDashboard from './components/dashboard/MainDashboard';
import HistoryView from './components/history/HistoryView';
import { useReminders } from './hooks/useReminders';
import { usePush } from './hooks/usePush';

export default function App() {
  // ---- view state -------------------------------------------------------
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'history'
  const [showHero, setShowHero] = useState(true);
  const heroRef = useRef(null);
  const dashboardRef = useRef(null);

  // ---- request push permission on mount (Phase 7) -----------------------
  usePush();

  // ---- API hooks --------------------------------------------------------
  const {
    nextUpcoming,
    completedCount,
    occurrences,
    loading,
    error,
    createReminder,
    completeOccurrence,
    snoozeOccurrence,
    deleteOccurrence,
    fetchFilteredOccurrences,
    refreshDashboard,
  } = useReminders();

  // ---- hero visibility – fades out when scrolled out of view ------------
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowHero(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ---- scroll‑driven animation for the 3‑D Clock (mirrors old GSAP) -----
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [clockOpacity, setClockOpacity] = useState(1);
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / viewportHeight));

      const p = Math.min(progress / 0.75, 1);
      let op = 1;
      if (progress > 0.72) {
        op = Math.max(0, 1 - (progress - 0.72) / 0.18);
      }
      setExplosionProgress(p);
      setClockOpacity(op);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- navigation helpers ------------------------------------------------
  const handleSkipToDashboard = () => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToOpening = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---- full‑screen history view -----------------------------------------
  if (currentView === 'history') {
    return (
      <HistoryView
        occurrences={occurrences}
        onBack={() => setCurrentView('main')}
        onComplete={completeOccurrence}
        onSnooze={snoozeOccurrence}
        onDelete={deleteOccurrence}
        onFilterSearch={fetchFilteredOccurrences}
      />
    );
  }

  // ---- main UI ----------------------------------------------------------
  return (
    <div className="relative bg-chronos-bg text-chronos-text selection:bg-chronos-brass selection:text-chronos-bg min-h-screen">

      {/* Watch – centred, visible only while hero is on screen */}
      {showHero && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <ClockScene explosionProgress={explosionProgress} opacity={clockOpacity} />
        </div>
      )}

      {/* Skip button – appears while hero is visible */}
      {showHero && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={handleSkipToDashboard}
            className="text-xs font-sans uppercase tracking-widest bg-chronos-surface/85 backdrop-blur-md border border-antique hover:border-chronos-gold text-chronos-gold px-4 py-2 rounded-sm shadow-brass-subtle hover:scale-105 transition-all duration-200"
          >
            Enter Dashboard ↓
          </button>
        </div>
      )}

      {/* Hero overlay – contains title and scroll cue */}
      <section
        ref={heroRef}
        className="h-screen relative pointer-events-none select-none transition-opacity duration-500"
        style={{ opacity: showHero ? 1 : 0 }}
      >
        {/* Title – fixed at top of viewport */}
        <div className="absolute top-0 left-0 w-full text-center p-8">
          <span className="text-xs uppercase tracking-[0.4em] text-chronos-brass font-sans block mb-2">Horological Instrument</span>
          <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-wider text-gold-gradient drop-shadow-md">CHRONOS</h1>
          <p className="text-sm font-serif italic text-chronos-textMuted mt-2 max-w-md mx-auto">
            An antique mechanical timepiece and reminder engine.
          </p>
        </div>
        {/* Scroll cue – fixed at bottom */}
        <div className="absolute bottom-8 w-full text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-chronos-gold font-sans block mb-1">Scroll To Open Mechanism</span>
          <span className="text-xl text-chronos-brass inline-block animate-bounce">↓</span>
        </div>
      </section>

      {/* Filler to allow scrolling */}
      <section className="h-screen pointer-events-none" />

      {/* Dashboard – target for skip button */}
      <div ref={dashboardRef} id="dashboard-section" className="relative z-30">
        <MainDashboard
          nextReminder={nextUpcoming}
          completedCount={completedCount}
          loading={loading}
          error={error}
          onCreateReminder={createReminder}
          onCompleteOccurrence={completeOccurrence}
          onSnoozeOccurrence={snoozeOccurrence}
          onOpenHistory={() => setCurrentView('history')}
          onBackToOpening={handleBackToOpening}
          onRefresh={refreshDashboard}
        />
      </div>
    </div>
  );
}
