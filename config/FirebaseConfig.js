// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBU_ZKSgJdKJAtZSlCSVvBL01EFrX0N1fk",
  authDomain: "e-wallet-6f4c7.firebaseapp.com",
  projectId: "e-wallet-6f4c7",
  storageBucket: "e-wallet-6f4c7.firebasestorage.app",
  messagingSenderId: "521573930631",
  appId: "1:521573930631:web:69db1a72bea1be70874a22",
  measurementId: "G-1LWZW463DR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_DATABASE = getFirestore(app);
