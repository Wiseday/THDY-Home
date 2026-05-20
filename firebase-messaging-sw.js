// THDY Family App - FCM/Web Push Service Worker
// This file intentionally does NOT import the Firebase SDK.
// Some mobile browsers can fail to evaluate Firebase compat scripts inside a service worker.
// The page registers this service worker and Firebase getToken() uses the registration.
// Incoming FCM Web Push payloads are handled through the standard push event.

self.addEventListener("install", function(event) {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function(event) {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = {
      notification: {
        title: "THDY 가족앱",
        body: event.data ? event.data.text() : "새 알림이 도착했습니다."
      }
    };
  }

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title =
    notification.title ||
    data.title ||
    "THDY 가족앱";

  const body =
    notification.body ||
    data.body ||
    "새 알림이 도착했습니다.";

  const options = {
    body: body,
    icon: notification.icon || data.icon || "./icons/icon-192.png",
    badge: notification.badge || data.badge || "./icons/icon-192.png",
    data: {
      ...data,
      link: data.link || payload.fcmOptions?.link || "./"
    },
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  const targetUrl =
    event.notification &&
    event.notification.data &&
    event.notification.data.link
      ? event.notification.data.link
      : "./";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }

      return null;
    })
  );
});
