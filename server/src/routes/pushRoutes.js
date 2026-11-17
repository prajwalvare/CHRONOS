import { Router } from 'express';
import prisma from '../config/db.js';
import { getPublicKey } from '../services/pushService.js';

const router = Router();

// GET /api/push/vapidPublicKey — returns the VAPID public key for the client
router.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: getPublicKey() });
});

// POST /api/push/subscribe — save a PushSubscription
router.post('/subscribe', async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ error: 'Invalid subscription payload' });
    }

    // Upsert to avoid duplicates
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth },
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('[PushRoutes] Subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// DELETE /api/push/unsubscribe — remove a subscription
router.delete('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

    await prisma.pushSubscription.deleteMany({ where: { endpoint } });
    res.json({ message: 'Unsubscribed' });
  } catch (err) {
    console.error('[PushRoutes] Unsubscribe error:', err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

export default router;
