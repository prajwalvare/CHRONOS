import { ReminderService } from '../services/reminderService.js';

export async function getOccurrences(req, res, next) {
  try {
    const { status, search, sort } = req.query;
    const occurrences = await ReminderService.getOccurrences({ status, search, sort });
    res.json(occurrences);
  } catch (err) {
    next(err);
  }
}

export async function getOccurrenceById(req, res, next) {
  try {
    const occurrence = await ReminderService.getOccurrenceById(req.params.id);
    if (!occurrence) {
      return res.status(404).json({ error: 'Occurrence not found' });
    }
    res.json(occurrence);
  } catch (err) {
    next(err);
  }
}

export async function updateOccurrenceStatus(req, res, next) {
  try {
    const { status } = req.body;
    const occurrence = await ReminderService.updateOccurrenceStatus(req.params.id, status);
    res.json(occurrence);
  } catch (err) {
    next(err);
  }
}

export async function snoozeOccurrence(req, res, next) {
  try {
    const { minutes } = req.body;
    const occurrence = await ReminderService.snoozeOccurrence(req.params.id, minutes);
    res.json(occurrence);
  } catch (err) {
    next(err);
  }
}
