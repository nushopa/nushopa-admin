/* global importScripts, firebase */
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA0PjctaYaZhaN0iTx0CYa3XjqKpmE5HHk",
  authDomain: "nushopa-3e02e.firebaseapp.com",
  projectId: "nushopa-3e02e",
  storageBucket: "nushopa-3e02e.firebasestorage.app",
  messagingSenderId: "53761534400",
  appId: "1:53761534400:web:0d1c11764ed3934bed4025",
});

firebase.messaging().onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  self.registration.showNotification(notification.title || "Nushopa", {
    body: notification.body || "",
    icon: "/logo.png",
    data: payload.data || {},
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { notificationId, orderId, route } = event.notification.data || {};
  const target =
    route ||
    (notificationId
      ? `/notifications/${notificationId}`
      : orderId
        ? `/orders/${orderId}`
        : "/notifications");
  event.waitUntil(self.clients.openWindow(target));
});
