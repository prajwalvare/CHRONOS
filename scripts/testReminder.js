// scripts/testReminder.js – quick sanity check for ReminderService
import { ReminderService } from '../server/src/services/reminderService.js';

async function run() {
  console.log('--- ReminderService Recurrence Tests ---');
  const now = new Date();
  console.log('Now:', now.toISOString());
  const daily = ReminderService.calculateNextOccurrenceDate(now, 'daily');
  const weekly = ReminderService.calculateNextOccurrenceDate(now, 'weekly');
  const monthly = ReminderService.calculateNextOccurrenceDate(now, 'monthly');
  console.log('Next daily:', daily?.toISOString());
  console.log('Next weekly:', weekly?.toISOString());
  console.log('Next monthly:', monthly?.toISOString());
}
run().catch(e => console.error(e));
