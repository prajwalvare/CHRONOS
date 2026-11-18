/**
 * CHRONOS Frontend API Client
 * Interfaces with the Express backend REST endpoints:
 * - /api/reminders
 * - /api/occurrences
 * - /api/stats
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const path = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`;
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMessage = errorData.error;
      if (errorData.details) {
        errorMessage += `: ${errorData.details.map((d) => d.message).join(', ')}`;
      }
    } catch {
      // Non-JSON response
    }
    throw new Error(errorMessage);
  }

  // Return parsed JSON or null for 204 No Content
  if (response.status === 204) return null;
  return await response.json();
}

export const api = {
  // Health
  getHealth: () => request('/api/health'),

  // Reminders
  getReminders: () => request('/api/reminders'),
  getReminderById: (id) => request(`/api/reminders/${id}`),
  createReminder: (data) =>
    request('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateReminder: (id, data) =>
    request(`/api/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteReminder: (id) =>
    request(`/api/reminders/${id}`, {
      method: 'DELETE',
    }),

  // Occurrences
  getOccurrences: ({ status = 'all', search = '', sort = 'desc' } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (search && search.trim()) params.set('search', search.trim());
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    return request(`/api/occurrences${qs ? `?${qs}` : ''}`);
  },
  getOccurrenceById: (id) => request(`/api/occurrences/${id}`),
  updateOccurrenceStatus: (id, status) =>
    request(`/api/occurrences/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  snoozeOccurrence: (id, minutes = 10) =>
    request(`/api/occurrences/${id}/snooze`, {
      method: 'POST',
      body: JSON.stringify({ minutes }),
    }),

  // Statistics
  getStats: () => request('/api/stats'),
};
