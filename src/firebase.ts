import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGIsGtqvOIatBHLbhbJjnJe7tJonUYiE8",
  authDomain: "fala-brazil.firebaseapp.com",
  projectId: "fala-brazil",
  storageBucket: "fala-brazil.firebasestorage.app",
  messagingSenderId: "761377680762",
  appId: "1:761377680762:web:79face8f0f42d227d87ac3",
  measurementId: "G-QFGPRN1XNN"
};

const app        = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
