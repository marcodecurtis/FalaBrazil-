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

        {/* ── New premium card ── */}
        <div className="auth-profile-card">
          <div className="auth-profile-accent" />
          <div className="auth-profile-eyebrow">Your profile is ready</div>
          <h2 className="auth-profile-headline">Save your progress &amp; personalised plan</h2>
          <p className="auth-profile-sub">Free account — keeps your journey across all devices.</p>

          {/* Benefits grid */}
          <div className="auth-benefits-grid">
            <div className="auth-benefit-card">
              <div className="auth-benefit-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <polyline points="2,13 6,8 10,10 16,4" stroke="#3a9e6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="13,4 16,4 16,7" stroke="#3a9e6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="auth-benefit-label">Track your growth</span>
            </div>
            <div className="auth-benefit-card">
              <div className="auth-benefit-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="#3a9e6a" strokeWidth="1.8" fill="none"/>
                  <path d="M6 9.5 L8 11.5 L12 7" stroke="#3a9e6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="auth-benefit-label">Your speaking level</span>
            </div>
            <div className="auth-benefit-card">
              <div className="auth-benefit-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="4" width="10" height="7" rx="1.5" stroke="#3a9e6a" strokeWidth="1.8" fill="none"/>
                  <rect x="13" y="6" width="3.5" height="5" rx="1" stroke="#3a9e6a" strokeWidth="1.5" fill="none"/>
                  <line x1="5" y1="13" x2="9" y2="13" stroke="#3a9e6a" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="auth-benefit-label">Any device</span>
            </div>
          </div>

          {/* Primary CTA */}
          <button className="auth-save-btn" onClick={() => { clearError(); setView('signup'); }}>
            Save my progress
          </button>

          {/* Social options */}
          <div className="auth-social-divider"><span>or continue with</span></div>
          <button className="auth-social-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <button className="auth-social-btn" onClick={() => { clearError(); setView('signup'); }}>
            @ Continue with email
          </button>

          <button className="auth-explore-link" onClick={onContinueWithoutAccount}>
            Explore first →
          </button>
          <p className="auth-member-link">
            Already a member? <button onClick={() => { clearError(); setView('login'); }}>Log in</button>
          </p>
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
