import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fala-brazil.firebaseapp.com",
  projectId: "fala-brazil",
  storageBucket: "fala-brazil.firebasestorage.app",
  messagingSenderId: "761377680762",
  appId: "1:761377680762:web:79face8f0f42d227d87ac3",
  measurementId: "G-QFGPRN1XNN"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();