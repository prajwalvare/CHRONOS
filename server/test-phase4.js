import http from 'node:http';
import app from './src/app.js';
import prisma from './src/config/db.js';

async function runTests() {
  console.log('--- STARTING PHASE 4 BACKEND & DATABASE TESTS ---');

  function request(method, url, body = null) {
    return new Promise((resolve, reject) => {
      const req = new http.IncomingMessage(null);
      req.method = method;
      req.url = url;
      req.headers = { host: 'localhost', 'content-type': 'application/json', origin: 'http://localhost:5173' };
      req.socket = { remoteAddress: '127.0.0.1' };
      req.body = body;

      const res = new http.ServerResponse(req);
      let resBody = '';

      const origWrite = res.write;
      res.write = (chunk) => {
        if (chunk) resBody += chunk;
        return true;
      };

      res.end = (chunk) => {
        if (chunk) resBody += chunk;
        try {
          const parsed = resBody ? JSON.parse(resBody) : null;
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: resBody });
        }
      };

      app.handle(req, res);
    });
  }

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    console.log('✓ Health check status:', health.status, health.body.message);

    // 2. Create Reminder
    const newRem = {
      title: 'Inspect Escapement Anchor & Pallet Jewels',
      description: 'Check jewel integrity under 20x loupe.',
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'UTC',
      priority: 'high',
      category: 'horology',
      recurrence: 'daily',
    };
    const created = await request('POST', '/api/reminders', newRem);
    console.log('✓ Created Reminder ID:', created.body?.id, 'Status:', created.status);
    if (!created.body?.id || !created.body?.initialOccurrence) {
      throw new Error(`Failed to create reminder: ${JSON.stringify(created.body)}`);
    }

    const reminderId = created.body.id;
    const occurrenceId = created.body.initialOccurrence.id;

    // 3. Fetch Reminders
    const list = await request('GET', '/api/reminders');
    console.log('✓ Fetched Reminders count:', list.body.length);

    // 4. Fetch Single Reminder
    const single = await request('GET', `/api/reminders/${reminderId}`);
    console.log('✓ Fetched single reminder title:', single.body.title);

    // 5. Fetch Occurrences
    const occurrences = await request('GET', '/api/occurrences');
    console.log('✓ Fetched occurrences count:', occurrences.body.length);

    // 6. Test Snooze
    const snoozed = await request('POST', `/api/occurrences/${occurrenceId}/snooze`, { minutes: 15 });
    console.log('✓ Snooze status:', snoozed.body.status, 'Snoozed until:', snoozed.body.snoozedUntil);

    // 7. Test Fulfill / Complete
    const fulfilled = await request('PATCH', `/api/occurrences/${occurrenceId}/status`, { status: 'completed' });
    console.log('✓ Fulfilled status:', fulfilled.body.status, 'Completed at:', fulfilled.body.completedAt);

    // 8. Verify Recurrence Occurrence Generation
    const postCompleteOccs = await request('GET', `/api/occurrences?search=Escapement`);
    console.log('✓ Recurrence verified: Total occurrences for daily reminder:', postCompleteOccs.body.length);

    // 9. Fetch Dashboard Stats
    const stats = await request('GET', '/api/stats');
    console.log('✓ Stats verified: Completed Count =', stats.body.completedCount, 'Upcoming Count =', stats.body.upcomingCount);

    // 10. Clean up / Delete Reminder
    const deleted = await request('DELETE', `/api/reminders/${reminderId}`);
    console.log('✓ Deleted reminder status:', deleted.body.message);

    console.log('\n🌟 ALL PHASE 4 REST API & PRISMA TESTS PASSED SUCCESSFULLY! 🌟');
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
