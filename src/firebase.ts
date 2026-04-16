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

// getAnalytics throws in some environments (ad blockers, iOS privacy settings, etc.)
// Wrap it so a blocked analytics call never crashes the whole app.
export const analytics = (() => {
  try {
    const a = getAnalytics(app);
    if (import.meta.env.DEV) {
      (window as any).firebase_analytics_debug_mode = true;
    }
    return a;
  } catch {
    console.warn('Firebase Analytics unavailable in this environment.');
    return null as unknown as ReturnType<typeof getAnalytics>;
  }
})();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();