importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDzc4ZVSJys1kG34fSLoCHm1nz-Kntgzlg",
  authDomain: "thdy-omechu.firebaseapp.com",
  projectId: "thdy-omechu",
  storageBucket: "thdy-omechu.firebasestorage.app",
  messagingSenderId: "905017588682",
  appId: "1:905017588682:web:4c22bf7d31154351c92d33",
  measurementId: "G-5R1Z4VZC8F"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "THDY 가족앱";
  const body = payload.notification?.body || payload.data?.body || "새 알림이 도착했습니다.";

  const options = {
    body,
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    data: payload.data || {},
    requireInteraction: false
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.link ||
    self.location.origin + self.location.pathname.replace("/firebase-messaging-sw.js", "/");

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return null;
    })
  );
});
