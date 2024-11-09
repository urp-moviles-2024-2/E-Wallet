// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDVGj2nSj-YuGgs5fxa-n9lxIIscSZIpc4",
  authDomain: "e-wallet-aca3b.firebaseapp.com",
  projectId: "e-wallet-aca3b",
  storageBucket: "e-wallet-aca3b.firebasestorage.app",
  messagingSenderId: "715289967541",
  appId: "1:715289967541:web:af7ff378640010c7f437fc",
  measurementId: "G-6VJ0MYPPFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DATABASE = getFirestore(app);
const analytics = getAnalytics(app);