// Minimal Web Push service using the `web-push` library.
// Generates VAPID keys if not provided and exposes helper functions.

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const webpush = require('web-push');
import prisma from '../config/db.js';

// Load or generate VAPID keys
let { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  const keys = webpush.generateVAPIDKeys();
  VAPID_PUBLIC_KEY = keys.publicKey;
  VAPID_PRIVATE_KEY = keys.privateKey;
  console.log('[PushService] Generated VAPID keys (session-only)');
}

webpush.setVapidDetails(
  'mailto:notifications@chronos.app',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
);

/** Public VAPID key for the client */
export const getPublicKey = () => VAPID_PUBLIC_KEY;

/** Send a push notification to a single subscription */
export const sendNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dh, auth: subscription.auth },
      },
      JSON.stringify(payload),
    );
  } catch (err) {
    // Clean up dead subscriptions
    if (err.statusCode === 410 || err.statusCode === 404) {
      await prisma.pushSubscription.delete({ where: { endpoint: subscription.endpoint } }).catch(() => {});
    }
    console.error('[PushService] Failed to send notification', err.statusCode || err.message);
  }
};

/** Broadcast to all stored subscriptions */
export const broadcast = async (payload) => {
  const subs = await prisma.pushSubscription.findMany();
  if (subs.length === 0) return;
  console.log(`[PushService] Broadcasting to ${subs.length} subscription(s)`);
  await Promise.allSettled(subs.map((s) => sendNotification(s, payload)));
};
