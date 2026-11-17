import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClockScene from './components/three/ClockScene';
import DashboardSkeleton from './components/dashboard/DashboardSkeleton';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [explosionProgress, setExplosionProgress] = useState(0);
  const [clockOpacity, setClockOpacity] = useState(1);
  const scrollContainerRef = useRef(null);
  const progressObj = useRef({ progress: 0, opacity: 1 });

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setExplosionProgress(1);
      setClockOpacity(0);
      return;
    }

    const ctx = gsap.context(() => {
      // Pinning & Scrub Timeline for the 3D Opening Sequence
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const scrollFraction = self.progress; // 0 to 1

          // Phase 1 to 4: 0.0 to 0.75 -> Explode clock
          // Phase 5 to 6: 0.75 to 1.0 -> Fade out 3D clock and transition into dashboard
          let p = Math.min(scrollFraction / 0.75, 1.0);
          let op = 1.0;
          if (scrollFraction > 0.72) {
            op = Math.max(0, 1.0 - (scrollFraction - 0.72) / 0.18);
          }

          progressObj.current.progress = p;
          progressObj.current.opacity = op;

          setExplosionProgress(p);
          setClockOpacity(op);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSkipToDashboard = () => {
    const dashboardEl = document.getElementById('dashboard-section');
    if (dashboardEl) {
      dashboardEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToOpening = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-chronos-bg text-chronos-text selection:bg-chronos-brass selection:text-chronos-bg">
      {/* Fixed 3D Canvas Host (Active throughout the opening scroll sequence) */}
      {clockOpacity > 0.01 && (
        <ClockScene explosionProgress={explosionProgress} opacity={clockOpacity} />
      )}

      {/* Floating Skip / Navigation Control */}
      {clockOpacity > 0.2 && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={handleSkipToDashboard}
            className="text-xs font-sans uppercase tracking-widest bg-chronos-surface/80 backdrop-blur-md border border-antique hover:border-chronos-gold text-chronos-gold px-4 py-2 rounded-sm shadow-brass-subtle hover:scale-105 transition-all duration-200"
          >
            Enter Dashboard ↓
          </button>
        </div>
      )}

      {/* Scrollable Narrative Waypoints (Drives the ScrollTrigger scrub) */}
      <div ref={scrollContainerRef} className="relative z-20">
        {/* SCENE 1: THE CLOCK */}
        <section className="h-screen flex flex-col justify-between items-center p-8 text-center pointer-events-none select-none">
          <div className="pt-12">
            <span className="text-xs uppercase tracking-[0.4em] text-chronos-brass font-sans block mb-2">
              Horological Instrument
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-wider text-gold-gradient drop-shadow-md">
              CHRONOS
            </h1>
            <p className="text-sm font-serif italic text-chronos-textMuted mt-3 max-w-md mx-auto">
              A handcrafted reminder experience built inside an antique mechanical timepiece.
            </p>
          </div>

          <div className="pb-8 animate-bounce">
            <span className="text-[11px] uppercase tracking-[0.3em] text-chronos-gold font-sans block mb-1">
              Scroll To Deconstruct Mechanism
            </span>
            <span className="text-xl text-chronos-brass">↓</span>
          </div>
        </section>

        {/* SCENE 2: BEZEL & CRYSTAL SEPARATION */}
        <section className="h-screen flex items-center justify-start p-8 md:p-24 pointer-events-none select-none">
          <div className="max-w-md p-6 bg-chronos-bgSecondary/75 backdrop-blur-sm border-l-2 border-chronos-gold border-y border-r border-antique/30 rounded-r-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-chronos-brass">
              Phase I • Exterior Dismantling
            </span>
            <h2 className="text-2xl font-serif text-chronos-goldHighlight mt-1">
              Crystal & Bezel Separation
            </h2>
            <p className="text-sm font-sans text-chronos-parchment/80 mt-2 leading-relaxed">
              The beveled mineral crystal pulls forward along the central axis, followed by the coin-edge brass bezel and top winding crown.
            </p>
          </div>
        </section>

        {/* SCENE 3: DIAL & HANDS LIFTING */}
        <section className="h-screen flex items-center justify-end p-8 md:p-24 pointer-events-none select-none">
          <div className="max-w-md p-6 bg-chronos-bgSecondary/75 backdrop-blur-sm border-r-2 border-chronos-gold border-y border-l border-antique/30 rounded-l-sm text-right">
            <span className="text-xs font-mono uppercase tracking-widest text-chronos-brass">
              Phase II • The Chapter Ring
            </span>
            <h2 className="text-2xl font-serif text-chronos-goldHighlight mt-1">
              Lifting the Roman Dial
            </h2>
            <p className="text-sm font-sans text-chronos-parchment/80 mt-2 leading-relaxed">
              The heat-blued Breguet hands and antique dial unseat from the cannon pinion, unmasking the motion work and jewel bearings beneath.
            </p>
          </div>
        </section>

        {/* SCENE 4: AXIAL EXPLODED BLUEPRINT */}
        <section className="h-screen flex items-center justify-start p-8 md:p-24 pointer-events-none select-none">
          <div className="max-w-md p-6 bg-chronos-bgSecondary/75 backdrop-blur-sm border-l-2 border-chronos-gold border-y border-r border-antique/30 rounded-r-sm">
            <span className="text-xs font-mono uppercase tracking-widest text-chronos-brass">
              Phase III • Exploded Gear Train
            </span>
            <h2 className="text-2xl font-serif text-chronos-goldHighlight mt-1">
              Axial Horological Blueprint
            </h2>
            <p className="text-sm font-sans text-chronos-parchment/80 mt-2 leading-relaxed">
              Every wheel, pinion, bridge, and oscillating balance wheel spreads into space, transforming the physical timepiece into an open mechanical blueprint.
            </p>
          </div>
        </section>

        {/* SCENE 5: DISAPPEARANCE & DISSOLVE */}
        <section className="h-screen flex flex-col justify-center items-center p-8 text-center pointer-events-none select-none">
          <div className="max-w-lg p-6">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-chronos-brass block mb-2">
              Phase IV • Convergence
            </span>
            <h2 className="text-3xl font-serif text-chronos-goldHighlight">
              Entering the Chamber of Time
            </h2>
            <p className="text-sm font-sans text-chronos-parchment/80 mt-3 leading-relaxed">
              The deconstructed clock components dissolve into the darkness, making way for your handcrafted reminder workspace.
            </p>
          </div>
        </section>
      </div>

      {/* SCENE 6: THE DASHBOARD (The Hand-Drawn Interface) */}
      <div className="relative z-30">
        <DashboardSkeleton onBackToOpening={handleBackToOpening} />
      </div>
    </div>
  );
}
