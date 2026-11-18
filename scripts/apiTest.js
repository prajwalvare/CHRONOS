// scripts/apiTest.js – basic API sanity checks for Chronos backend
// Using built‑in fetch (Node ≥18)

const api = 'http://localhost:5050/api';

async function createReminder() {
  const payload = {
    title: 'Test Reminder',
    description: 'Phase 8 test',
    scheduledAt: new Date(Date.now() + 60 * 1000).toISOString(), // 1 min later
    timezone: 'UTC',
    recurrence: 'daily',
    priority: 'high',
    category: 'personal',
  };
  const res = await fetch(`${api}/reminders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json();
  console.log('Create reminder:', res.status, data);
  return data.id;
}

async function getReminders() {
  const res = await fetch(`${api}/reminders`);
  const data = await res.json();
  console.log('List reminders:', data.length);
}

async function updateReminder(id) {
  const res = await fetch(`${api}/reminders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Updated Test Reminder' }) });
  const data = await res.json();
  console.log('Update reminder:', res.status, data);
}

async function deleteReminder(id) {
  const res = await fetch(`${api}/reminders/${id}`, { method: 'DELETE' });
  const data = await res.json();
  console.log('Delete reminder:', res.status, data);
}

async function test() {
  try {
    const id = await createReminder();
    await getReminders();
    await updateReminder(id);
    // Trigger occurrence status change to completed to test recurrence generation
    const occRes = await fetch(`${api}/occurrences?status=upcoming`);
    const occs = await occRes.json();
    const firstOcc = occs.find(o => o.reminderId === id);
    if (firstOcc) {
      const upd = await fetch(`${api}/occurrences/${firstOcc.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      console.log('Mark occurrence completed:', await upd.json());
    }
    // Wait a moment then fetch occurrences again to see new one
    await new Promise(r => setTimeout(r, 1000));
    const occRes2 = await fetch(`${api}/occurrences?status=upcoming`);
    const occs2 = await occRes2.json();
    console.log('Occurrences after completion:', occs2.filter(o => o.reminderId === id).length);
    await deleteReminder(id);
  } catch (e) {
    console.error('API test error:', e);
  }
}

test();
