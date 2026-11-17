/* CHRONOS Service Worker — handles push notifications */

self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  let data = { title: 'CHRONOS', body: 'You have a reminder!' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error('[SW] Failed to parse push data', e);
  }

  const options = {
    body: data.body || 'Reminder approaching!',
    icon: '/chronos-icon.png',
    badge: '/chronos-icon.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'chronos-reminder',
    data: { url: '/' },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'CHRONOS', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});
