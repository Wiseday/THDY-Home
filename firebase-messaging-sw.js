// THDY Family App - FCM/Web Push Service Worker
// No Firebase SDK import: handles standard push events directly for mobile browser stability.

self.addEventListener("install", function(event) {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

function pickPayload(event) {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch (error) {
    return {
      data: {
        title: "THDY 가족앱",
        body: event.data.text() || "새 알림이 도착했습니다."
      }
    };
  }
}

self.addEventListener("push", function(event) {
  const payload = pickPayload(event);

  const notification =
    payload.notification ||
    payload.webpush?.notification ||
    {};

  const data =
    payload.data ||
    notification.data ||
    {};

  const title =
    notification.title ||
    data.title ||
    "THDY 가족앱";

  const body =
    notification.body ||
    data.body ||
    "새 알림이 도착했습니다.";

  const link =
    data.link ||
    payload.fcmOptions?.link ||
    payload.fcm_options?.link ||
    "./";

  const options = {
    body,
    icon: notification.icon || data.icon || "./icons/icon-192.png",
    badge: notification.badge || data.badge || "./icons/icon-192.png",
    data: {
      ...data,
      link
    },
    requireInteraction: notification.requireInteraction === true
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
        if ("focus" in client) {
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
