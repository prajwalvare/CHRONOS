import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useReminders() {
  const [stats, setStats] = useState({
    completedCount: 0,
    upcomingCount: 0,
    totalReminders: 0,
    nextUpcoming: null,
  });
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Dashboard Stats & Recent Occurrences from REST API
  const refreshDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, occsData] = await Promise.all([
        api.getStats(),
        api.getOccurrences({ sort: 'desc' }),
      ]);
      setStats(statsData);
      setOccurrences(occsData);
    } catch (err) {
      console.error('[useReminders Error]:', err);
      setError(err.message || 'Failed to connect to backend engine');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Create a Reminder via POST /api/reminders
  const createReminder = async (formData) => {
    try {
      setError(null);
      // Construct UTC ISO timestamp from date and time strings
      const scheduledIso = new Date(`${formData.date}T${formData.time}`).toISOString();

      const payload = {
        title: formData.title,
        description: formData.description || null,
        scheduledAt: scheduledIso,
        timezone: formData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        priority: formData.priority || 'medium',
        category: formData.category || 'personal',
        recurrence: formData.recurrence || 'none',
      };

      const result = await api.createReminder(payload);
      await refreshDashboard();
      return result;
    } catch (err) {
      console.error('[createReminder Error]:', err);
      setError(err.message);
      throw err;
    }
  };

  // Complete an Occurrence via PATCH /api/occurrences/:id/status
  const completeOccurrence = async (occurrenceId) => {
    try {
      setError(null);
      await api.updateOccurrenceStatus(occurrenceId, 'completed');
      await refreshDashboard();
    } catch (err) {
      console.error('[completeOccurrence Error]:', err);
      setError(err.message);
      throw err;
    }
  };

  // Snooze an Occurrence via POST /api/occurrences/:id/snooze
  const snoozeOccurrence = async (occurrenceId, minutes = 10) => {
    try {
      setError(null);
      await api.snoozeOccurrence(occurrenceId, minutes);
      await refreshDashboard();
    } catch (err) {
      console.error('[snoozeOccurrence Error]:', err);
      setError(err.message);
      throw err;
    }
  };

  // Skip an Occurrence
  const skipOccurrence = async (occurrenceId) => {
    try {
      setError(null);
      await api.updateOccurrenceStatus(occurrenceId, 'skipped');
      await refreshDashboard();
    } catch (err) {
      console.error('[skipOccurrence Error]:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete an Occurrence / Reminder
  const deleteOccurrence = async (occurrenceId) => {
    try {
      setError(null);
      // Find occurrence to get reminderId
      const occ = occurrences.find((o) => o.id === occurrenceId);
      if (occ && occ.reminderId) {
        await api.deleteReminder(occ.reminderId);
      }
      await refreshDashboard();
    } catch (err) {
      console.error('[deleteOccurrence Error]:', err);
      setError(err.message);
      throw err;
    }
  };

  // Query Occurrences with filters for History View
  const fetchFilteredOccurrences = async ({ status = 'all', search = '', sort = 'desc' }) => {
    try {
      setLoading(true);
      const data = await api.getOccurrences({ status, search, sort });
      setOccurrences(data);
      return data;
    } catch (err) {
      console.error('[fetchFilteredOccurrences Error]:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    nextUpcoming: stats.nextUpcoming,
    completedCount: stats.completedCount,
    upcomingCount: stats.upcomingCount,
    totalReminders: stats.totalReminders,
    occurrences,
    loading,
    error,
    createReminder,
    completeOccurrence,
    snoozeOccurrence,
    skipOccurrence,
    deleteOccurrence,
    fetchFilteredOccurrences,
    refreshDashboard,
  };
}
