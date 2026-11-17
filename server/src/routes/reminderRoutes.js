import { Router } from 'express';
import {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
} from '../controllers/reminderController.js';
import { validate } from '../middleware/validate.js';
import { createReminderSchema, updateReminderSchema } from '../validators/reminderValidator.js';

const router = Router();

router.post('/', validate(createReminderSchema), createReminder);
router.get('/', getAllReminders);
router.get('/:id', getReminderById);
router.patch('/:id', validate(updateReminderSchema), updateReminder);
router.delete('/:id', deleteReminder);

export default router;
