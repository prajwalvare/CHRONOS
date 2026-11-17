import React, { useState } from 'react';
import SmallAnalogClock from '../clock/SmallAnalogClock';
import AddReminderModal from './AddReminderModal';
import UpcomingRibbon from './UpcomingRibbon';
import TrophyCounter from './TrophyCounter';
import ParchmentNote from './ParchmentNote';
import { Plus } from 'lucide-react';

/**
 * MainDashboard — Pure Implementation of the Hand-Drawn Notebook Layout
 * - Top Left: Working 2D Analog Clock + Adjacent (+) Add Button
 * - Right Side: Upcoming Ribbon (Only single next reminder)
 * - Bottom Left: Trophy & Completed Count
 * - Bottom Right: Parchment Note & Random Quote (Gateway to History)
 */
export default function MainDashboard({
  reminders,
  nextReminder,
  completedCount,
  onCreateReminder,
  onCompleteOccurrence,
  onSnoozeOccurrence,
  onOpenHistory,
  onBackToOpening,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      id="dashboard-section"
      className="relative min-h-screen w-full bg-chronos-bg text-chronos-text p-6 md:p-12 flex flex-col justify-between select-none"
    >
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center pb-4 border-b border-antique/40">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-widest text-gold-gradient font-serif">
            CHRONOS
          </span>
          <span className="text-xs uppercase tracking-widest text-chronos-textMuted font-sans hidden sm:inline">
            | Mechanical Timepiece Dashboard
          </span>
        </div>

        <button
          onClick={onBackToOpening}
          className="text-xs font-sans uppercase tracking-widest text-chronos-brass hover:text-chronos-goldHighlight transition-colors duration-200 border border-antique/50 px-3.5 py-1.5 rounded-sm hover:border-chronos-gold"
          title="Scroll back up to the 3D clock"
        >
          ▲ Re-assemble Mechanism
        </button>
      </header>

      {/* Main 4-Corner Layout Canvas */}
      <main className="my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* TOP LEFT: Small Analog Clock + Add (+) Button */}
          <div className="md:col-span-6 flex items-center gap-6">
            {/* The Working SVG Analog Clock */}
            <div className="relative group">
              <SmallAnalogClock size={168} />
              {/* Subtle ambient brass glow underneath */}
              <div className="absolute inset-0 rounded-full bg-chronos-gold/5 blur-xl pointer-events-none" />
            </div>

            {/* Clickable Plus (+) Button with tooltip */}
            <div className="flex flex-col items-start gap-1.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 rounded-full border-2 border-chronos-gold/80 bg-chronos-surface hover:bg-chronos-bgSecondary text-chronos-gold flex items-center justify-center text-2xl font-serif shadow-brass-subtle hover:scale-110 active:scale-95 transition-all duration-200 group relative"
                aria-label="Add New Reminder"
                title="Add New Reminder"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-chronos-goldHighlight animate-pulse" />
              </button>
              <span className="text-[11px] uppercase tracking-widest text-chronos-brass font-sans">
                Add Reminder
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Upcoming Reminder Ribbon (Strictly Single Next Reminder) */}
          <div className="md:col-span-6 flex justify-start md:justify-end">
            <UpcomingRibbon
              nextReminder={nextReminder}
              onComplete={onCompleteOccurrence}
              onSnooze={onSnoozeOccurrence}
            />
          </div>

          {/* BOTTOM LEFT: Trophy & Completed Count */}
          <div className="md:col-span-6 mt-8 md:mt-16 flex items-center">
            <TrophyCounter completedCount={completedCount} />
          </div>

          {/* BOTTOM RIGHT: Rectangular Note & Random Quote (Gateway to History) */}
          <div className="md:col-span-6 mt-8 md:mt-16 flex justify-start md:justify-end">
            <ParchmentNote onOpenHistory={onOpenHistory} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-4 border-t border-antique/30 flex flex-col sm:flex-row justify-between items-center text-xs text-chronos-textMuted font-sans gap-2">
        <span>CHRONOS • Horological Timepiece v1.0</span>
        <span className="italic font-serif text-chronos-parchment/60">
          "Every second is a gear in the engine of destiny."
        </span>
      </footer>

      {/* Adjacent Add Reminder Modal */}
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onCreateReminder}
      />
    </div>
  );
}
