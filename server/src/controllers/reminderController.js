import { ReminderService } from '../services/reminderService.js';

export async function createReminder(req, res, next) {
  try {
    const reminder = await ReminderService.createReminder(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
}

export async function getAllReminders(req, res, next) {
  try {
    const reminders = await ReminderService.getAllReminders();
    res.json(reminders);
  } catch (err) {
    next(err);
  }
}

export async function getReminderById(req, res, next) {
  try {
    const reminder = await ReminderService.getReminderById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (err) {
    next(err);
  }
}

export async function updateReminder(req, res, next) {
  try {
    const reminder = await ReminderService.updateReminder(req.params.id, req.body);
    res.json(reminder);
  } catch (err) {
    next(err);
  }
}

export async function deleteReminder(req, res, next) {
  try {
    await ReminderService.deleteReminder(req.params.id);
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    next(err);
  }
}
