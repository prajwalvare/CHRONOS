import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY_REMINDERS = 'chronos_reminders_v1';
const STORAGE_KEY_OCCURRENCES = 'chronos_occurrences_v1';

// Initial sample data so the dashboard is immediately rich and testable
const INITIAL_REMINDERS = [
  {
    id: 'rem-1',
    title: 'Winding of the Marine Chronometer',
    description: 'Carefully check escapement beat and wind the mainspring.',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 mins from now
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    priority: 'high',
    category: 'horology',
    recurrence: 'daily',
    isActive: true,
  },
  {
    id: 'rem-2',
    title: 'Study Data Structures & Algorithms',
    description: 'Solve dynamic programming and graph problems.',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours from now
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    priority: 'medium',
    category: 'study',
    recurrence: 'daily',
    isActive: true,
  },
];

const INITIAL_OCCURRENCES = [
  {
    id: 'occ-1',
    reminderId: 'rem-1',
    title: 'Winding of the Marine Chronometer',
    description: 'Carefully check escapement beat and wind the mainspring.',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    status: 'upcoming',
    completedAt: null,
    snoozedUntil: null,
    priority: 'high',
    category: 'horology',
  },
  {
    id: 'occ-2',
    reminderId: 'rem-2',
    title: 'Study Data Structures & Algorithms',
    description: 'Solve dynamic programming and graph problems.',
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    status: 'upcoming',
    completedAt: null,
    snoozedUntil: null,
    priority: 'medium',
    category: 'study',
  },
  {
    id: 'occ-past-1',
    reminderId: 'rem-past',
    title: 'Clean Pinions and Jewels with Benzine',
    description: 'Ultrasonic cleaning of watch movement parts.',
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'completed',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    snoozedUntil: null,
    priority: 'high',
    category: 'horology',
  },
  {
    id: 'occ-past-2',
    reminderId: 'rem-past',
    title: 'Review System Design Principles',
    description: 'Microservices, cache invalidation, and database partitioning.',
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'completed',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    snoozedUntil: null,
    priority: 'medium',
    category: 'study',
  },
];

export function useReminders() {
  const [reminders, setReminders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REMINDERS);
      return stored ? JSON.parse(stored) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [occurrences, setOccurrences] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OCCURRENCES);
      return stored ? JSON.parse(stored) : INITIAL_OCCURRENCES;
    } catch {
      return INITIAL_OCCURRENCES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Could not save reminders to localStorage', e);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OCCURRENCES, JSON.stringify(occurrences));
    } catch (e) {
      console.warn('Could not save occurrences to localStorage', e);
    }
  }, [occurrences]);

  // Derived: Strictly single earliest upcoming reminder
  const nextUpcoming = useMemo(() => {
    const upcomingList = occurrences
      .filter((o) => o.status === 'upcoming' || o.status === 'snoozed')
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    return upcomingList[0] || null;
  }, [occurrences]);

  // Derived: Completed occurrences count for the Trophy
  const completedCount = useMemo(() => {
    return occurrences.filter((o) => o.status === 'completed').length;
  }, [occurrences]);

  // Actions
  const createReminder = (data) => {
    const id = 'rem-' + Date.now();
    const scheduledIso = new Date(`${data.date}T${data.time}`).toISOString();

    const newReminder = {
      id,
      title: data.title,
      description: data.description || '',
      scheduledAt: scheduledIso,
      timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      priority: data.priority || 'medium',
      category: data.category || 'personal',
      recurrence: data.recurrence || 'none',
      isActive: true,
    };

    const newOccurrence = {
      id: 'occ-' + Date.now(),
      reminderId: id,
      title: data.title,
      description: data.description || '',
      scheduledAt: scheduledIso,
      status: 'upcoming',
      completedAt: null,
      snoozedUntil: null,
      priority: data.priority || 'medium',
      category: data.category || 'personal',
    };

    setReminders((prev) => [newReminder, ...prev]);
    setOccurrences((prev) => [newOccurrence, ...prev]);
    return newReminder;
  };

  const completeOccurrence = (occurrenceId) => {
    setOccurrences((prev) =>
      prev.map((occ) => {
        if (occ.id === occurrenceId) {
          return {
            ...occ,
            status: 'completed',
            completedAt: new Date().toISOString(),
          };
        }
        return occ;
      })
    );
  };

  const snoozeOccurrence = (occurrenceId, minutes = 10) => {
    const snoozedTime = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    setOccurrences((prev) =>
      prev.map((occ) => {
        if (occ.id === occurrenceId) {
          return {
            ...occ,
            status: 'snoozed',
            scheduledAt: snoozedTime,
            snoozedUntil: snoozedTime,
          };
        }
        return occ;
      })
    );
  };

  const skipOccurrence = (occurrenceId) => {
    setOccurrences((prev) =>
      prev.map((occ) => {
        if (occ.id === occurrenceId) {
          return { ...occ, status: 'skipped' };
        }
        return occ;
      })
    );
  };

  const deleteOccurrence = (occurrenceId) => {
    setOccurrences((prev) => prev.filter((occ) => occ.id !== occurrenceId));
  };

  return {
    reminders,
    occurrences,
    nextUpcoming,
    completedCount,
    createReminder,
    completeOccurrence,
    snoozeOccurrence,
    skipOccurrence,
    deleteOccurrence,
  };
}
