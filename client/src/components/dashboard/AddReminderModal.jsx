import React, { useState } from 'react';
import { X, Clock, Calendar, AlertCircle, Repeat, Tag, Globe } from 'lucide-react';

export default function AddReminderModal({ isOpen, onClose, onSave }) {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Default date to today, time to current hour + 1
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultHour = String((now.getHours() + 1) % 24).padStart(2, '0');
  const defaultMinute = '00';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: defaultDate,
    time: `${defaultHour}:${defaultMinute}`,
    timezone: localTz,
    priority: 'medium',
    category: 'personal',
    recurrence: 'none',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please enter a title for the reminder.');
      return;
    }
    if (!formData.date || !formData.time) {
      setError('Please choose a valid date and time.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-chronos-surface border border-antique rounded-sm shadow-2xl relative overflow-hidden text-chronos-text font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Antique Brass Header Strip */}
        <div className="px-6 py-4 border-b border-antique flex justify-between items-center bg-chronos-bgSecondary">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-chronos-gold inline-block" />
            <h3 className="text-lg font-bold tracking-wide text-gold-gradient">
              Create New Reminder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-chronos-textMuted hover:text-chronos-gold transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-sm">
          {error && (
            <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-chronos-brass mb-1 font-serif">
              Reminder Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inspect escapement beat rate"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-chronos-bg border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-chronos-textMuted mb-1 font-serif">
              Description (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Add details, notes, or specific requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-chronos-bg border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold transition-colors resize-none"
            />
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-chronos-brass mb-1 font-serif flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-chronos-gold" />
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-chronos-bg border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-chronos-brass mb-1 font-serif flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-chronos-gold" />
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 bg-chronos-bg border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold"
              />
            </div>
          </div>

          {/* Priority & Recurrence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-chronos-textMuted mb-1 font-serif flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-chronos-gold" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-chronos-bg border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold"
              >
                <option value="low">Low (Routine)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Important)</option>
                <option value="urgent">Urgent (Critical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-chronos-textMuted mb-1 font-serif flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-chronos-gold" />
                Recurrence
              </label>
              <select
                value={formData.recurrence}
                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                className="w-full px-3 py-2 bg-chronos-bg border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold"
              >
                <option value="none">No Recurrence (Once)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Timezone Note */}
          <div className="flex items-center gap-2 text-xs text-chronos-textMuted pt-1">
            <Globe className="w-3.5 h-3.5 text-chronos-brass" />
            <span>Timezone: <strong className="text-chronos-parchment">{formData.timezone}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-antique/40 font-serif">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-antique/60 hover:bg-chronos-bgSecondary rounded-sm text-xs uppercase tracking-wider text-chronos-textMuted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-chronos-gold/90 hover:bg-chronos-gold text-chronos-bg font-semibold rounded-sm text-xs uppercase tracking-widest shadow-brass-subtle transition-all duration-150 hover:scale-[1.02]"
            >
              Engrave Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
