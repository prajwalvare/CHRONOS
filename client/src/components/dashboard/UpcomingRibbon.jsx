import React from 'react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Check, Clock, Bell, Sparkles } from 'lucide-react';

export default function UpcomingRibbon({ nextReminder, onComplete, onSnooze }) {
  if (!nextReminder) {
    return (
      <div className="w-full max-w-md p-5 border border-antique/60 bg-chronos-surface/90 rounded-sm shadow-brass-subtle relative overflow-hidden text-chronos-text font-serif">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-chronos-brass/40" />
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-chronos-brass" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-chronos-brass font-sans">
            Next Upcoming Appointment
          </span>
        </div>
        <h4 className="text-lg font-serif text-chronos-goldHighlight mt-1">
          The Horizon is Clear
        </h4>
        <p className="text-xs text-chronos-textMuted font-sans mt-1">
          No appointments are currently scheduled. Use the (+) button beside the clock to engrave a new reminder.
        </p>
      </div>
    );
  }

  const scheduledDate = new Date(nextReminder.scheduledAt);
  const formattedDate = format(scheduledDate, 'EEEE, MMMM do, yyyy');
  const formattedTime = format(scheduledDate, 'h:mm a');
  const timeDistance = isPast(scheduledDate)
    ? 'Overdue by ' + formatDistanceToNow(scheduledDate)
    : 'Due in ' + formatDistanceToNow(scheduledDate);

  const priorityColors = {
    low: 'text-chronos-textMuted border-antique/50',
    medium: 'text-chronos-parchment border-chronos-brass/60',
    high: 'text-chronos-gold border-chronos-gold',
    urgent: 'text-rose-400 border-rose-500/80 bg-rose-950/20',
  };

  return (
    <div className="w-full max-w-md relative group select-none">
      {/* Decorative Ribbon Tails (SVG Vintage Banner Ends) */}
      <div className="relative p-6 border-2 border-chronos-gold/70 bg-gradient-to-r from-chronos-surface via-chronos-bgSecondary to-chronos-surface rounded-sm shadow-brass-subtle">
        {/* Ribbon Left/Right Accent Clips */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-8 bg-chronos-brass rounded-sm border border-chronos-gold" />
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-8 bg-chronos-brass rounded-sm border border-chronos-gold" />

        {/* Top Header Badge */}
        <div className="flex justify-between items-center pb-2 border-b border-antique/40 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chronos-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chronos-gold"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-chronos-brass font-sans">
              Single Next Upcoming Reminder
            </span>
          </div>

          <span
            className={`text-[9px] uppercase tracking-widest font-mono px-2 py-0.5 rounded border ${
              priorityColors[nextReminder.priority] || priorityColors.medium
            }`}
          >
            {nextReminder.priority}
          </span>
        </div>

        {/* Reminder Title & Description */}
        <h3 className="text-xl font-bold font-serif text-chronos-goldHighlight tracking-wide drop-shadow-xs">
          {nextReminder.title}
        </h3>
        {nextReminder.description && (
          <p className="text-xs text-chronos-parchment/80 font-sans mt-1 line-clamp-2 leading-relaxed">
            {nextReminder.description}
          </p>
        )}

        {/* Date and Time Details */}
        <div className="mt-4 pt-3 border-t border-antique/30 flex flex-wrap justify-between items-center text-xs font-sans text-chronos-parchment">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-chronos-gold" />
            <span className="font-serif font-semibold text-chronos-gold">
              {formattedTime}
            </span>
            <span className="text-chronos-textMuted">• {formattedDate}</span>
          </div>
          <span className="text-[11px] text-chronos-goldHighlight font-mono mt-1 sm:mt-0">
            {timeDistance}
          </span>
        </div>

        {/* Quick Occurrence Actions */}
        <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-antique/20 font-serif">
          <button
            onClick={() => onSnooze(nextReminder.id, 10)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-antique/60 hover:border-chronos-gold hover:bg-chronos-bg rounded-sm text-[11px] text-chronos-parchment transition-all"
            title="Postpone 10 minutes"
          >
            <Bell className="w-3 h-3 text-chronos-brass" />
            <span>Snooze (+10m)</span>
          </button>
          <button
            onClick={() => onComplete(nextReminder.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-chronos-gold/90 hover:bg-chronos-gold text-chronos-bg font-semibold rounded-sm text-[11px] tracking-wider transition-all duration-150 shadow-brass-subtle hover:scale-105"
            title="Mark Completed"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Fulfill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
