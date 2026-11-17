import { ReminderService } from '../services/reminderService.js';

export async function getStats(req, res, next) {
  try {
    const stats = await ReminderService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
