import { useState } from 'react';
import './AuthScreen.css';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

interface Props {
  onContinueWithoutAccount: () => void;
  onAuthSuccess: () => void;
}

type AuthView = 'choice' | 'signup' | 'login' | 'forgot';

export default function AuthScreen({ onContinueWithoutAccount, onAuthSuccess }: Props) {
  const [view, setView]           = useState<AuthView>('choice');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [resetSent, setResetSent] = useState(false);

  const clearError = () => setError('');

  const saveUserToFirestore = async (uid: string, displayName: string, email: string) => {
    const userRef = doc(db, 'users', uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      const savedLevel = localStorage.getItem('userLevel') || null;
      await setDoc(userRef, {
        name:      displayName,
        email:     email,
        level:     savedLevel,
        xp:        0,
        streak:    0,
        joinedAt:  new Date().toISOString(),
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearError();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user   = result.user;
      await saveUserToFirestore(user.uid, user.displayName || 'User', user.email || '');
      onAuthSuccess();
    } catch (err: any) {
      setError('Error signing in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim())        return setError('Please enter your name.');
    if (!email.trim())       return setError('Please enter your email.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    setLoading(true);
    clearError();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await saveUserToFirestore(result.user.uid, name, email);
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('This email is already registered. Please log in.');
      else if (err.code === 'auth/invalid-email')   setError('Invalid email address.');
      else setError('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) return setError('Please enter your email.');
    if (!password)     return setError('Please enter your password.');
    setLoading(true);
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password.');
      } else {
        setError('Error signing in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) return setError('Please enter your email first.');
    setLoading(true);
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError('Error sending email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  // ── CHOICE SCREEN ────────────────────────────────
  if (view === 'choice') {
    return (
      <div className="auth-wrapper">
        <div className="auth-flag-row">
          <img src="https://flagcdn.com/w80/br.png" alt="Brazil" className="auth-flag" />
        </div>

        <h1 className="auth-title">Welcome to<br /><em>Fala Brazil!</em></h1>
        <p className="auth-subtitle">Choose how you want to get started.</p>

        <div className="auth-cards">
          <button className="auth-card auth-card-primary" onClick={() => { clearError(); setView('signup'); }}>
            <div className="auth-card-icon">✨</div>
            <div className="auth-card-body">
              <div className="auth-card-title">Create a free account</div>
              <div className="auth-card-desc">Save your progress across all your devices.</div>
            </div>
            <div className="auth-card-arrow">→</div>
          </button>

          <button className="auth-card auth-card-secondary" onClick={() => { clearError(); setView('login'); }}>
            <div className="auth-card-icon">👤</div>
            <div className="auth-card-body">
              <div className="auth-card-title">I already have an account</div>
              <div className="auth-card-desc">Log in to pick up where you left off.</div>
            </div>
            <div className="auth-card-arrow">→</div>
          </button>
        </div>

        <div className="auth-benefits">
          <div className="auth-benefits-title">With an account you get:</div>
          <div className="auth-benefits-list">
            <div className="auth-benefit-item">📊 Progress saved across all devices</div>
            <div className="auth-benefit-item">🏆 XP history and achievements</div>
            <div className="auth-benefit-item">🎯 Personalised CEFR level</div>
            <div className="auth-benefit-item">🔔 Daily study reminders</div>
          </div>
        </div>

        <div className="auth-guest-section">
          <div className="auth-guest-divider"><span>or</span></div>
          <button className="auth-guest-btn" onClick={onContinueWithoutAccount}>
            Continue without an account
          </button>
          <p className="auth-guest-note">Your progress will only be saved on this device.</p>
        </div>
      </div>
    );
  }

  // ── FORGOT PASSWORD ──────────────────────────────
  if (view === 'forgot') {
    return (
      <div className="auth-wrapper">
        <button className="auth-back-btn" onClick={() => { setView('login'); clearError(); setResetSent(false); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>

        <div className="auth-form-header">
          <div className="auth-form-emoji">🔑</div>
          <h2 className="auth-form-title">Reset your password</h2>
          <p className="auth-form-sub">We'll send a reset link to your email.</p>
        </div>

        {resetSent ? (
          <div className="auth-success-box">
            ✅ Email sent! Check your inbox and follow the link to reset your password.
          </div>
        ) : (
          <div className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input className="auth-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button className="auth-submit-btn" onClick={handleForgotPassword} disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link →'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── SIGNUP SCREEN ────────────────────────────────
  if (view === 'signup') {
    return (
      <div className="auth-wrapper">
        <button className="auth-back-btn" onClick={() => { setView('choice'); clearError(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>

        <div className="auth-form-header">
          <div className="auth-form-emoji">✨</div>
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-sub">Free. Always.</p>
        </div>

        <div className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label className="auth-label">Name</label>
            <input className="auth-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="auth-submit-btn" onClick={handleSignup} disabled={loading}>
            {loading ? 'Creating account...' : 'Create free account →'}
          </button>

          <div className="auth-divider"><span>or</span></div>

          <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <p className="auth-switch">Already have an account? <button className="auth-switch-btn" onClick={() => { setView('login'); clearError(); }}>Log in</button></p>
      </div>
    );
  }

  // ── LOGIN SCREEN ─────────────────────────────────
  return (
    <div className="auth-wrapper">
      <button className="auth-back-btn" onClick={() => { setView('choice'); clearError(); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>

      <div className="auth-form-header">
        <div className="auth-form-emoji">👤</div>
        <h2 className="auth-form-title">Log in</h2>
        <p className="auth-form-sub">Welcome back!</p>
      </div>

      <div className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="auth-forgot-link" onClick={() => { setView('forgot'); clearError(); }}>
          Forgot your password?
        </button>
        <button className="auth-submit-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Log in →'}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
      </div>

      <p className="auth-switch">Don't have an account? <button className="auth-switch-btn" onClick={() => { setView('signup'); clearError(); }}>Sign up</button></p>
    </div>
  );
}
