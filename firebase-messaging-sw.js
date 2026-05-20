importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDzc4ZVSJys1kG34fSLoCHm1nz-Kntgzlg",
  authDomain: "thdy-omechu.firebaseapp.com",
  projectId: "thdy-omechu",
  storageBucket: "thdy-omechu.firebasestorage.app",
  messagingSenderId: "905017588682",
  appId: "1:905017588682:web:4c22bf7d31154351c92d33"
});

let messaging = null;

try {
  messaging = firebase.messaging();

  messaging.onBackgroundMessage(function(payload) {
    const title =
      payload.notification && payload.notification.title
        ? payload.notification.title
        : "THDY 가족앱";

    const body =
      payload.notification && payload.notification.body
        ? payload.notification.body
        : "새 알림이 도착했습니다.";

    self.registration.showNotification(title, {
      body: body,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      data: payload.data || {}
    });
  });
} catch (error) {
  console.error("Firebase messaging service worker init failed:", error);
}

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("./")
  );
});
