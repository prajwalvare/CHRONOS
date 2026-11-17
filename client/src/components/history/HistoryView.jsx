import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Search, Filter, Calendar, Clock, CheckCircle2, AlertTriangle, FastForward, Bell, Trash2 } from 'lucide-react';

export default function HistoryView({ occurrences, onBack, onComplete, onSnooze, onDelete }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);

  // Filter & Search Logic
  const filteredOccurrences = useMemo(() => {
    return occurrences
      .filter((occ) => {
        if (filterStatus !== 'all' && occ.status !== filterStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = occ.title.toLowerCase().includes(q);
          const descMatch = occ.description && occ.description.toLowerCase().includes(q);
          if (!titleMatch && !descMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.scheduledAt).getTime();
        const timeB = new Date(b.scheduledAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [occurrences, filterStatus, searchQuery, sortOrder]);

  const statusIcons = {
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    upcoming: <Clock className="w-4 h-4 text-chronos-gold" />,
    snoozed: <Bell className="w-4 h-4 text-amber-400" />,
    skipped: <FastForward className="w-4 h-4 text-chronos-textMuted" />,
    missed: <AlertTriangle className="w-4 h-4 text-rose-400" />,
  };

  const statusBadges = {
    completed: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
    upcoming: 'text-chronos-gold border-chronos-gold/40 bg-chronos-bgSecondary',
    snoozed: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
    skipped: 'text-chronos-textMuted border-antique/40 bg-chronos-bg',
    missed: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
  };

  return (
    <div className="min-h-screen w-full bg-chronos-bg text-chronos-text font-serif p-6 md:p-12 animate-in fade-in duration-300">
      {/* Top Archival Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-antique/40 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 border border-antique hover:border-chronos-gold bg-chronos-surface hover:bg-chronos-bgSecondary rounded-sm text-xs uppercase tracking-widest text-chronos-gold transition-all duration-150 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Clock</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-gold-gradient">
              Archival History Journal
            </h1>
            <p className="text-xs uppercase tracking-widest text-chronos-textMuted font-sans mt-0.5">
              Record of Past & Upcoming Horological Appointments
            </p>
          </div>
        </div>

        {/* Total records count */}
        <div className="text-right font-sans text-xs text-chronos-parchment">
          <span className="text-chronos-brass font-bold font-serif text-lg">
            {occurrences.length}
          </span>{' '}
          Recorded Occurrences
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-4 font-sans text-sm">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-chronos-brass" />
          <input
            type="text"
            placeholder="Search by reminder title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-chronos-surface border border-antique/60 rounded-sm text-chronos-text focus:outline-none focus:border-chronos-gold transition-colors text-xs"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="md:col-span-5 flex flex-wrap items-center gap-1.5">
          {['all', 'completed', 'upcoming', 'snoozed', 'missed', 'skipped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider capitalize transition-all ${
                filterStatus === status
                  ? 'bg-chronos-gold text-chronos-bg font-semibold shadow-brass-subtle'
                  : 'bg-chronos-surface border border-antique/40 text-chronos-textMuted hover:text-chronos-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort Toggle */}
        <div className="md:col-span-2 flex justify-end">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-full px-3 py-2 bg-chronos-surface border border-antique/60 hover:border-chronos-gold rounded-sm text-xs text-chronos-parchment flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-chronos-brass" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Occurrences Ledger Table */}
      <div className="border border-antique/50 bg-chronos-surface/80 rounded-sm overflow-hidden shadow-2xl">
        {filteredOccurrences.length === 0 ? (
          <div className="p-12 text-center text-chronos-textMuted font-sans">
            <p className="font-serif text-lg text-chronos-parchment mb-1">
              No archival entries found.
            </p>
            <p className="text-xs">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-antique bg-chronos-bgSecondary text-chronos-brass font-serif uppercase tracking-widest text-[11px]">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reminder Title</th>
                  <th className="py-3 px-4">Scheduled Time</th>
                  <th className="py-3 px-4">Fulfilled At</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique/20">
                {filteredOccurrences.map((occ) => {
                  const sched = new Date(occ.scheduledAt);
                  const completedDate = occ.completedAt ? new Date(occ.completedAt) : null;

                  return (
                    <tr
                      key={occ.id}
                      className="hover:bg-chronos-bgSecondary/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOccurrence(occ)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border text-[10px] uppercase font-mono tracking-wider ${
                            statusBadges[occ.status] || statusBadges.upcoming
                          }`}
                        >
                          {statusIcons[occ.status]}
                          {occ.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-serif text-sm font-semibold text-chronos-text group-hover:text-chronos-goldHighlight transition-colors">
                          {occ.title}
                        </div>
                        {occ.description && (
                          <div className="text-[11px] text-chronos-textMuted line-clamp-1 mt-0.5">
                            {occ.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-chronos-parchment">
                        <div>{format(sched, 'MMM dd, yyyy')}</div>
                        <div className="text-[10px] text-chronos-textMuted">
                          {format(sched, 'h:mm a')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-chronos-parchment">
                        {completedDate ? (
                          <div>
                            <div>{format(completedDate, 'MMM dd, yyyy')}</div>
                            <div className="text-[10px] text-emerald-400">
                              {format(completedDate, 'h:mm a')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-chronos-textMuted italic">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[10px] uppercase font-mono text-chronos-brass">
                          {occ.priority || 'medium'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          {occ.status !== 'completed' && (
                            <button
                              onClick={() => onComplete(occ.id)}
                              className="px-2.5 py-1 bg-chronos-gold/80 hover:bg-chronos-gold text-chronos-bg font-serif text-[10px] font-semibold rounded-xs"
                              title="Mark as Fulfilled"
                            >
                              Fulfill
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(occ.id)}
                            className="p-1 text-chronos-textMuted hover:text-rose-400 transition-colors"
                            title="Remove occurrence"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Occurrence Detail Modal */}
      {selectedOccurrence && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => setSelectedOccurrence(null)}
        >
          <div
            className="w-full max-w-md bg-chronos-surface border border-antique p-6 rounded-sm shadow-2xl relative text-chronos-text font-serif"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-antique/40 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-chronos-brass font-sans">
                  Archival Occurrence
                </span>
                <h3 className="text-xl font-bold text-chronos-goldHighlight mt-1">
                  {selectedOccurrence.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOccurrence(null)}
                className="text-chronos-textMuted hover:text-chronos-gold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans text-chronos-parchment">
              <div>
                <span className="text-chronos-brass uppercase text-[10px] block font-serif">
                  Description
                </span>
                <p className="mt-0.5 leading-relaxed text-chronos-text">
                  {selectedOccurrence.description || 'No detailed description recorded.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-antique/30">
                <div>
                  <span className="text-chronos-brass uppercase text-[10px] block font-serif">
                    Scheduled For
                  </span>
                  <span>{format(new Date(selectedOccurrence.scheduledAt), 'PPP p')}</span>
                </div>
                <div>
                  <span className="text-chronos-brass uppercase text-[10px] block font-serif">
                    Current Status
                  </span>
                  <span className="capitalize font-mono text-chronos-gold">{selectedOccurrence.status}</span>
                </div>
              </div>

              {selectedOccurrence.completedAt && (
                <div className="pt-2 border-t border-antique/30">
                  <span className="text-emerald-400 uppercase text-[10px] block font-serif">
                    Fulfilled Timestamp
                  </span>
                  <span>{format(new Date(selectedOccurrence.completedAt), 'PPP p')}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-antique/40 flex justify-end gap-3 font-serif">
              <button
                onClick={() => setSelectedOccurrence(null)}
                className="px-4 py-1.5 border border-antique/60 rounded-sm text-xs text-chronos-textMuted hover:text-chronos-gold"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
