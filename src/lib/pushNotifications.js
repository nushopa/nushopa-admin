import { getToken, onMessage } from "firebase/messaging";
import { getMessagingIfSupported } from "./firebase/firebase.config";

const DEVICE_ID_KEY = "nushopa_device_id";
let foregroundListener;

function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export async function registerWebPush() {
  if (typeof Notification === "undefined") {
    throw new Error("This browser does not support push notifications.");
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error("Push is not configured. Set VITE_FIREBASE_VAPID_KEY.");
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Browser notification permission was not granted.");
  }

  const messaging = await getMessagingIfSupported();
  if (!messaging) {
    throw new Error("Firebase messaging is not supported in this browser.");
  }
  if (!foregroundListener) {
    foregroundListener = onMessage(messaging, (payload) => {
      if (Notification.permission !== "granted") return;
      const notification = payload.notification || {};
      new Notification(notification.title || "Nushopa", {
        body: notification.body || "",
        icon: "/logo.png",
      });
    });
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );
  const webPushToken = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
  if (!webPushToken) {
    throw new Error("Firebase did not return a web push token.");
  }

  const apiBase = import.meta.env.VITE_BASE_URL;
  if (!apiBase) throw new Error("VITE_BASE_URL is not configured.");
  const response = await fetch(
    `${apiBase.replace(/\/?$/, "/")}device/devices/register`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        webPushToken,
        platform: "web",
      }),
    },
  );

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Could not register this device.");
  }
}
