import React from 'react';

/**
 * DashboardSkeleton — Scene 6 Target representing the Hand-Drawn Layout.
 * In Phase 3, this will be enriched into the live functional components:
 * 1. Top Left: Working SVG Analog Clock
 * 2. Top Left (Beside Clock): Clickable Brass (+) Reminder Creator
 * 3. Right Side: Antique Horological Ribbon (Next Reminder Only)
 * 4. Bottom Left: Engraved Trophy & Occurrence Counter
 * 5. Bottom Right: Antique Parchment Note (Clickable gateway to History)
 */
export default function DashboardSkeleton({ onBackToOpening }) {
  return (
    <section
      id="dashboard-section"
      className="relative min-h-screen w-full bg-chronos-bg text-chronos-text p-6 md:p-12 flex flex-col justify-between select-none"
    >
      {/* Subtle Top Navigation / System Bar */}
      <div className="flex justify-between items-center border-b border-antique/40 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-widest text-gold-gradient font-serif">
            CHRONOS
          </span>
          <span className="text-xs uppercase tracking-widest text-chronos-textMuted font-sans">
            | Horological Dashboard
          </span>
        </div>
        <button
          onClick={onBackToOpening}
          className="text-xs font-sans uppercase tracking-widest text-chronos-brass hover:text-chronos-goldHighlight transition-colors duration-200 border border-antique/50 px-3 py-1.5 rounded-sm hover:border-chronos-gold"
        >
          ▲ Re-assemble Clock
        </button>
      </div>

      {/* Main Dashboard Canvas (Faithful to Hand-Drawn Blueprint) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto py-8 relative">
        {/* TOP LEFT: Small Analog Clock + Add (+) Button */}
        <div className="md:col-span-6 flex items-center gap-5">
          <div className="w-32 h-32 rounded-full border-2 border-chronos-gold/60 bg-chronos-surface shadow-brass-subtle flex items-center justify-center relative">
            <span className="text-xs text-chronos-gold font-serif">Live Clock</span>
            <div className="absolute inset-0 rounded-full border border-antique/30 pointer-events-none" />
          </div>
          <div className="flex flex-col gap-2">
            <button className="w-10 h-10 rounded-full border border-chronos-gold/80 bg-chronos-bgSecondary hover:bg-chronos-surface text-chronos-gold flex items-center justify-center text-xl font-serif shadow-brass-subtle hover:scale-105 transition-all">
              +
            </button>
            <span className="text-[11px] text-chronos-textMuted tracking-wider font-sans">
              Add Reminder
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Upcoming Reminder Ribbon (Strictly Next Reminder) */}
        <div className="md:col-span-6 flex justify-end items-center">
          <div className="w-full max-w-sm p-4 border border-antique bg-surface-vintage shadow-brass-subtle rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-chronos-gold/40" />
            <span className="text-[10px] uppercase tracking-widest text-chronos-brass font-sans block mb-1">
              Next Upcoming Appointment
            </span>
            <h4 className="text-base font-serif text-chronos-goldHighlight">
              No Pending Reminders
            </h4>
            <p className="text-xs text-chronos-textMuted font-sans mt-1">
              Click (+) beside the clock to schedule an occurrence.
            </p>
          </div>
        </div>

        {/* BOTTOM LEFT: Trophy & Completed Count */}
        <div className="md:col-span-6 mt-12 flex items-center gap-4">
          <div className="w-16 h-16 border border-antique/60 bg-chronos-surface flex items-center justify-center rounded-sm text-2xl text-chronos-gold">
            🏆
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-chronos-goldHighlight">
              0
            </div>
            <span className="text-xs text-chronos-textMuted uppercase tracking-wider font-sans">
              Completed Tasks
            </span>
          </div>
        </div>

        {/* BOTTOM RIGHT: Rectangular Note & Random Quote (Gateway to History) */}
        <div className="md:col-span-6 mt-12 flex justify-end">
          <div className="w-full max-w-xs p-5 bg-[#D8C7A5] text-[#1C1914] shadow-xl rotate-1 border border-[#BFA67A] cursor-pointer hover:rotate-0 hover:scale-[1.02] transition-transform duration-200 rounded-sm">
            <div className="text-[10px] uppercase tracking-widest text-[#5A4D3B] font-mono border-b border-[#BFA67A]/40 pb-1 mb-2">
              📜 Notes on Time • Click for History
            </div>
            <p className="text-xs italic font-serif leading-relaxed text-[#2C2416]">
              "Dost thou love life? Then do not squander time, for that's the stuff life is made of."
            </p>
            <div className="text-right text-[10px] text-[#5A4D3B] mt-2 font-serif font-bold">
              — Benjamin Franklin
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-antique/30 pt-3 text-center text-xs text-chronos-textMuted/60 font-sans">
        CHRONOS • Phase 2 Visual Transition Active
      </div>
    </section>
  );
}
