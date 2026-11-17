import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClockScene from './components/three/ClockScene';
import MainDashboard from './components/dashboard/MainDashboard';
import HistoryView from './components/history/HistoryView';
import { useReminders } from './hooks/useReminders';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'history'
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [clockOpacity, setClockOpacity] = useState(1);
  const scrollContainerRef = useRef(null);

  // Central reminder engine
  const {
    reminders,
    nextUpcoming,
    completedCount,
    createReminder,
    completeOccurrence,
    snoozeOccurrence,
    deleteOccurrence,
    occurrences,
  } = useReminders();

  useEffect(() => {
    if (currentView !== 'main') return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setExplosionProgress(1);
      setClockOpacity(0);
      return;
    }

    const ctx = gsap.context(() => {
      // ScrollTrigger scrub for smooth opening
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0,
        onUpdate: (self) => {
          const scrollFraction = self.progress; // 0 to 1

          // 0.0 to 0.75 -> Smoothly open the watch mechanism
          // 0.75 to 1.0 -> Fade out 3D clock and transition into dashboard
          let p = Math.min(scrollFraction / 0.75, 1.0);
          let op = 1.0;
          if (scrollFraction > 0.72) {
            op = Math.max(0, 1.0 - (scrollFraction - 0.72) / 0.18);
          }

          setExplosionProgress(p);
          setClockOpacity(op);
        },
      });
    });

    return () => ctx.revert();
  }, [currentView]);

  const handleSkipToDashboard = () => {
    const dashboardEl = document.getElementById('dashboard-section');
    if (dashboardEl) {
      dashboardEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToOpening = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full-screen History Journal View
  if (currentView === 'history') {
    return (
      <HistoryView
        occurrences={occurrences}
        onBack={() => setCurrentView('main')}
        onComplete={completeOccurrence}
        onSnooze={snoozeOccurrence}
        onDelete={deleteOccurrence}
      />
    );
  }

  return (
    <div className="relative bg-chronos-bg text-chronos-text selection:bg-chronos-brass selection:text-chronos-bg min-h-screen">
      {/* Fixed 3D Canvas Host (Active throughout the opening scroll sequence) */}
      {clockOpacity > 0.01 && (
        <ClockScene explosionProgress={explosionProgress} opacity={clockOpacity} />
      )}

      {/* Floating Skip / Navigation Control */}
      {clockOpacity > 0.2 && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={handleSkipToDashboard}
            className="text-xs font-sans uppercase tracking-widest bg-chronos-surface/85 backdrop-blur-md border border-antique hover:border-chronos-gold text-chronos-gold px-4 py-2 rounded-sm shadow-brass-subtle hover:scale-105 transition-all duration-200"
          >
            Enter Dashboard ↓
          </button>
        </div>
      )}

      {/* Clean Scroll Waypoints (Pure visual opening with zero clutter) */}
      <div ref={scrollContainerRef} className="relative z-20">
        {/* Top Hero Screen: Title & Scroll Invitation */}
        <section className="h-screen flex flex-col justify-between items-center p-8 text-center pointer-events-none select-none">
          <div className="pt-10">
            <span className="text-xs uppercase tracking-[0.4em] text-chronos-brass font-sans block mb-2">
              Horological Instrument
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-wider text-gold-gradient drop-shadow-md">
              CHRONOS
            </h1>
            <p className="text-sm font-serif italic text-chronos-textMuted mt-2 max-w-md mx-auto">
              An antique mechanical timepiece and reminder engine.
            </p>
          </div>

          <div
            className="pb-8 transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - explosionProgress * 2.5) }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-chronos-gold font-sans block mb-1">
              Scroll To Open Mechanism
            </span>
            <span className="text-xl text-chronos-brass inline-block animate-bounce">↓</span>
          </div>
        </section>

        {/* Scroll spaces for smooth mechanism opening */}
        <section className="h-screen pointer-events-none" />
        <section className="h-screen pointer-events-none" />
      </div>

      {/* SCENE 6: THE MAIN DASHBOARD (Your Hand-Drawn Blueprint) */}
      <div className="relative z-30">
        <MainDashboard
          reminders={reminders}
          nextReminder={nextUpcoming}
          completedCount={completedCount}
          onCreateReminder={createReminder}
          onCompleteOccurrence={completeOccurrence}
          onSnoozeOccurrence={snoozeOccurrence}
          onOpenHistory={() => setCurrentView('history')}
          onBackToOpening={handleBackToOpening}
        />
      </div>
    </div>
  );
}
