import { useEffect, useRef } from 'react';

/**
 * usePush – requests Notification permission, registers the service worker,
 * subscribes to Web Push, and sends the subscription to the backend.
 *
 * Also shows a test notification on first grant so the user knows it works.
 */
export const usePush = () => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Guard: browser must support notifications + service workers
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('[usePush] Browser does not support notifications or service workers');
      return;
    }

    // If already denied, skip entirely
    if (Notification.permission === 'denied') {
      console.warn('[usePush] Notification permission was denied');
      return;
    }

    const setup = async () => {
      try {
        // Step 1: Request permission (this triggers the browser popup)
        console.log('[usePush] Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('[usePush] Permission result:', permission);

        if (permission !== 'granted') {
          console.warn('[usePush] Permission not granted');
          return;
        }

        // Step 2: Show a confirmation notification so user sees it working
        new Notification('CHRONOS', {
          body: '⚙️ Notifications enabled! You will be alerted before reminders.',
          icon: '/chronos-icon.png',
        });

        // Step 3: Register service worker
        console.log('[usePush] Registering service worker...');
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[usePush] Service worker registered:', registration.scope);

        // Wait for the SW to be ready
        await navigator.serviceWorker.ready;
        console.log('[usePush] Service worker is ready');

        // Step 4: Get VAPID public key from backend
        const apiBase = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiBase}/api/push/vapidPublicKey`);
        if (!res.ok) {
          console.error('[usePush] Failed to fetch VAPID key:', res.status);
          return;
        }
        const { publicKey } = await res.json();
        console.log('[usePush] Got VAPID public key');

        // Step 5: Convert VAPID key
        const urlBase64ToUint8Array = (base64String) => {
          const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
        };

        // Step 6: Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        console.log('[usePush] Push subscription created');

        // Step 7: Send subscription to backend
        await fetch(`${apiBase}/api/push/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription.toJSON()),
        });
        console.log('[usePush] Subscription sent to backend ✓');
      } catch (err) {
        console.error('[usePush] Setup error:', err);
      }
    };

    // Small delay to let the page render first, then ask for permission
    setTimeout(setup, 1500);
  }, []);
};
