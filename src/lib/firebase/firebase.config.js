// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0PjctaYaZhaN0iTx0CYa3XjqKpmE5HHk",
  authDomain: "nushopa-3e02e.firebaseapp.com",
  projectId: "nushopa-3e02e",
  storageBucket: "nushopa-3e02e.firebasestorage.app",
  messagingSenderId: "53761534400",
  appId: "1:53761534400:web:0d1c11764ed3934bed4025",
  measurementId: "G-D8P9RZEPLK",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("profile");
let messagingPromise;
export function getMessagingIfSupported() {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) =>
      supported ? getMessaging(app) : null,
    );
  }
  return messagingPromise;
}

export { app, auth, provider, signInWithPopup };
