import prisma from '../config/db.js';
import { addDays, addWeeks, addMonths } from 'date-fns';

export class ReminderService {
  /**
   * Creates a Reminder and its initial ReminderOccurrence atomically
   */
  static async createReminder(data) {
    const scheduledDate = new Date(data.scheduledAt);
    // WarningAt is exactly 10 seconds prior to scheduledAt (Phase 6 Countdown Engine)
    const warningDate = new Date(scheduledDate.getTime() - 10000);

    return await prisma.$transaction(async (tx) => {
      const reminder = await tx.reminder.create({
        data: {
          title: data.title,
          description: data.description || null,
          scheduledAt: scheduledDate,
          timezone: data.timezone || 'UTC',
          recurrence: data.recurrence || 'none',
          priority: data.priority || 'medium',
          category: data.category || 'personal',
          isActive: true,
        },
      });

      const initialOccurrence = await tx.reminderOccurrence.create({
        data: {
          reminderId: reminder.id,
          title: reminder.title,
          description: reminder.description,
          scheduledAt: scheduledDate,
          warningAt: warningDate,
          status: 'upcoming',
        },
      });

      return { ...reminder, initialOccurrence };
    });
  }

  static async getAllReminders() {
    return await prisma.reminder.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: {
        occurrences: {
          orderBy: { scheduledAt: 'asc' },
          take: 5,
        },
      },
    });
  }

  static async getReminderById(id) {
    return await prisma.reminder.findUnique({
      where: { id },
      include: { occurrences: { orderBy: { scheduledAt: 'desc' } } },
    });
  }

  static async updateReminder(id, data) {
    const updateData = { ...data };
    if (data.scheduledAt) {
      updateData.scheduledAt = new Date(data.scheduledAt);
    }
    return await prisma.reminder.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteReminder(id) {
    return await prisma.reminder.delete({
      where: { id },
    });
  }

  /**
   * Occurrence History with search, status filtering, and sorting
   */
  static async getOccurrences({ status, search, sort = 'desc' }) {
    const where = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    return await prisma.reminderOccurrence.findMany({
      where,
      orderBy: { scheduledAt: sort === 'asc' ? 'asc' : 'desc' },
      include: {
        reminder: {
          select: { priority: true, category: true, recurrence: true },
        },
      },
    });
  }

  static async getOccurrenceById(id) {
    return await prisma.reminderOccurrence.findUnique({
      where: { id },
      include: { reminder: true },
    });
  }

  /**
   * Updates occurrence status. If marked 'completed' and reminder is recurring, generates next occurrence!
   */
  static async updateOccurrenceStatus(id, newStatus) {
    return await prisma.$transaction(async (tx) => {
      const occurrence = await tx.reminderOccurrence.findUnique({
        where: { id },
        include: { reminder: true },
      });

      if (!occurrence) {
        throw new Error('Occurrence not found');
      }

      const isCompleted = newStatus === 'completed';
      const updated = await tx.reminderOccurrence.update({
        where: { id },
        data: {
          status: newStatus,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      // Recurrence generation upon fulfillment
      if (isCompleted && occurrence.reminder && occurrence.reminder.recurrence !== 'none') {
        const nextDate = ReminderService.calculateNextOccurrenceDate(
          occurrence.scheduledAt,
          occurrence.reminder.recurrence
        );

        if (nextDate) {
          const nextWarning = new Date(nextDate.getTime() - 10000);
          await tx.reminderOccurrence.create({
            data: {
              reminderId: occurrence.reminderId,
              title: occurrence.reminder.title,
              description: occurrence.reminder.description,
              scheduledAt: nextDate,
              warningAt: nextWarning,
              status: 'upcoming',
            },
          });
        }
      }

      return updated;
    });
  }

  /**
   * Snooze an occurrence
   */
  static async snoozeOccurrence(id, minutes = 10) {
    const snoozedDate = new Date(Date.now() + minutes * 60 * 1000);
    const newWarning = new Date(snoozedDate.getTime() - 10000);

    return await prisma.reminderOccurrence.update({
      where: { id },
      data: {
        status: 'snoozed',
        scheduledAt: snoozedDate,
        warningAt: newWarning,
        snoozedUntil: snoozedDate,
      },
    });
  }

  /**
   * Dashboard Statistics
   */
  static async getDashboardStats() {
    const [completedCount, upcomingCount, totalReminders, nextUpcoming] = await Promise.all([
      prisma.reminderOccurrence.count({ where: { status: 'completed' } }),
      prisma.reminderOccurrence.count({ where: { status: { in: ['upcoming', 'snoozed'] } } }),
      prisma.reminder.count({ where: { isActive: true } }),
      prisma.reminderOccurrence.findFirst({
        where: { status: { in: ['upcoming', 'snoozed'] } },
        orderBy: { scheduledAt: 'asc' },
        include: { reminder: true },
      }),
    ]);

    return {
      completedCount,
      upcomingCount,
      totalReminders,
      nextUpcoming,
    };
  }

  static calculateNextOccurrenceDate(currentDate, recurrence) {
    const date = new Date(currentDate);
    switch (recurrence) {
      case 'daily':
        return addDays(date, 1);
      case 'weekly':
        return addWeeks(date, 1);
      case 'monthly':
        return addMonths(date, 1);
      default:
        return null;
    }
  }
}
