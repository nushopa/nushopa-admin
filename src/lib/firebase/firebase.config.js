// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPvFfmugX8mT79vBU8vT5UoJoUpjLRLMw",
  authDomain: "farm2home-1d36d.firebaseapp.com",
  projectId: "farm2home-1d36d",
  storageBucket: "farm2home-1d36d.appspot.com",
  messagingSenderId: "618026725728",
  appId: "1:618026725728:web:792e065ca2dcf38935ee05",
  measurementId: "G-E6GH98VGEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
provider.addScope('profile');
export {
    auth, 
    provider, 
    signInWithPopup
}