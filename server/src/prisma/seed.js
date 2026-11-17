import prisma from '../config/db.js';
import { ReminderService } from '../services/reminderService.js';

export async function autoSeedIfEmpty() {
  try {
    const count = await prisma.reminder.count();
    if (count > 0) return;

    console.log('[CHRONOS DB] Seeding initial horological reminders into database...');

    // 1. Next upcoming reminder in 45 minutes
    await ReminderService.createReminder({
      title: 'Winding of the Marine Chronometer',
      description: 'Carefully check escapement beat rate and wind the mainspring.',
      scheduledAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
      timezone: 'UTC',
      priority: 'high',
      category: 'horology',
      recurrence: 'daily',
    });

    // 2. Reminder in 3 hours
    await ReminderService.createReminder({
      title: 'Study Data Structures & Mechanical Systems',
      description: 'Deep dive into algorithmic trees and gear train ratios.',
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      timezone: 'UTC',
      priority: 'medium',
      category: 'study',
      recurrence: 'daily',
    });

    // 3. Past fulfilled occurrence to establish initial trophy count
    const pastRem = await ReminderService.createReminder({
      title: 'Clean Pinions and Jewels with Benzine',
      description: 'Ultrasonic cleaning of watch movement parts.',
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      timezone: 'UTC',
      priority: 'high',
      category: 'horology',
      recurrence: 'none',
    });

    // Mark past occurrence as completed
    if (pastRem.initialOccurrence) {
      await ReminderService.updateOccurrenceStatus(pastRem.initialOccurrence.id, 'completed');
    }

    console.log('[CHRONOS DB] Seed complete: Persisted initial reminders into database.');
  } catch (err) {
    console.error('[CHRONOS DB Seed Error]:', err);
  }
}
