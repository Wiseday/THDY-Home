/*
 * THDY Family App - Firebase Cloud Messaging service worker
 * Place this file at the same GitHub Pages level as index.html.
 * Example: https://<user>.github.io/<repo>/firebase-messaging-sw.js
 */

importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCKs7FVil1kDXvaWQ1e9_wnAUO5a3WAqb8',
  authDomain: 'thdy-omechu.firebaseapp.com',
  databaseURL: 'https://thdy-omechu-default-rtdb.firebaseio.com/',
  projectId: 'thdy-omechu',
  storageBucket: 'thdy-omechu.firebasestorage.app',
  messagingSenderId: '905017588682',
  appId: '1:905017588682:web:4c22bf7d31154351c92d33',
  measurementId: 'G-MVP2F45PK4'
});

const messaging = firebase.messaging();

function appUrl(path) {
  return new URL(path, self.registration.scope).toString();
}

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || 'THDY 가족앱';
  const body = notification.body || data.body || '새 알림이 도착했습니다.';
  const link = data.link || payload.fcmOptions?.link || self.registration.scope;

  const options = {
    body,
    icon: notification.icon || appUrl('./icons/icon-192.png'),
    badge: appUrl('./icons/icon-192.png'),
    tag: data.tag || 'thdy-fcm',
    renotify: false,
    requireInteraction: false,
    data: {
      ...data,
      link
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.link || self.registration.scope;

  event.waitUntil((async () => {
    const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });

    for (const client of allClients) {
      if ('focus' in client && client.url.startsWith(self.registration.scope)) {
        return client.focus();
      }
    }

    if (clients.openWindow) {
      return clients.openWindow(targetUrl);
    }
  })());
});
