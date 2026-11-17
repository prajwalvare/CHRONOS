import { z } from 'zod';

export const createReminderSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional().nullable(),
  scheduledAt: z.string().datetime({ message: 'Valid ISO-8601 scheduledAt timestamp is required' }),
  timezone: z.string().default('UTC'),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']).default('none'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['work', 'study', 'personal', 'horology', 'health']).default('personal'),
});

export const updateReminderSchema = createReminderSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const updateOccurrenceStatusSchema = z.object({
  status: z.enum(['upcoming', 'warning', 'due', 'completed', 'snoozed', 'skipped', 'missed']),
});

export const snoozeOccurrenceSchema = z.object({
  minutes: z.number().int().min(1).max(1440).default(10), // Snooze 1 min to 24 hours
});
