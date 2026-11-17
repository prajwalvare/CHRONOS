import { Router } from 'express';
import {
  getOccurrences,
  getOccurrenceById,
  updateOccurrenceStatus,
  snoozeOccurrence,
} from '../controllers/occurrenceController.js';
import { validate } from '../middleware/validate.js';
import {
  updateOccurrenceStatusSchema,
  snoozeOccurrenceSchema,
} from '../validators/reminderValidator.js';

const router = Router();

router.get('/', getOccurrences);
router.get('/:id', getOccurrenceById);
router.patch('/:id/status', validate(updateOccurrenceStatusSchema), updateOccurrenceStatus);
router.post('/:id/snooze', validate(snoozeOccurrenceSchema), snoozeOccurrence);

export default router;
