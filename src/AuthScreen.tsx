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
      await saveUserToFirestore(user.uid, user.displayName || 'Utilizador', user.email || '');
      onAuthSuccess();
    } catch (err: any) {
      setError('Erro ao entrar com Google. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim())     return setError('Introduz o teu nome.');
    if (!email.trim())    return setError('Introduz o teu email.');
    if (password.length < 8) return setError('A password deve ter pelo menos 8 caracteres.');
    setLoading(true);
    clearError();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await saveUserToFirestore(result.user.uid, name, email);
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Este email já está registado. Faz login.');
      else if (err.code === 'auth/invalid-email')   setError('Email inválido.');
      else setError('Erro ao criar conta. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim())  return setError('Introduz o teu email.');
    if (!password)      return setError('Introduz a tua password.');
    setLoading(true);
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email ou password incorretos.');
      } else {
        setError('Erro ao entrar. Tenta novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) return setError('Introduz o teu email primeiro.');
    setLoading(true);
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError('Erro ao enviar email. Verifica o endereço.');
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

        <h1 className="auth-title">Bem-vindo ao<br /><em>Fala Brazil!</em></h1>
        <p className="auth-subtitle">Escolhe como queres começar.</p>

        <div className="auth-cards">
          <button className="auth-card auth-card-primary" onClick={() => { clearError(); setView('signup'); }}>
            <div className="auth-card-icon">✨</div>
            <div className="auth-card-body">
              <div className="auth-card-title">Criar conta gratuita</div>
              <div className="auth-card-desc">Guarda o teu progresso em qualquer dispositivo.</div>
            </div>
            <div className="auth-card-arrow">→</div>
          </button>

          <button className="auth-card auth-card-secondary" onClick={() => { clearError(); setView('login'); }}>
            <div className="auth-card-icon">👤</div>
            <div className="auth-card-body">
              <div className="auth-card-title">Já tenho conta</div>
              <div className="auth-card-desc">Entra para continuar de onde paraste.</div>
            </div>
            <div className="auth-card-arrow">→</div>
          </button>
        </div>

        <div className="auth-benefits">
          <div className="auth-benefits-title">Com conta tens acesso a:</div>
          <div className="auth-benefits-list">
            <div className="auth-benefit-item">📊 Progresso guardado em todos os dispositivos</div>
            <div className="auth-benefit-item">🏆 Histórico de XP e conquistas</div>
            <div className="auth-benefit-item">🎯 Nível CEFR personalizado</div>
            <div className="auth-benefit-item">🔔 Lembretes de estudo diários</div>
          </div>
        </div>

        <div className="auth-guest-section">
          <div className="auth-guest-divider"><span>ou</span></div>
          <button className="auth-guest-btn" onClick={onContinueWithoutAccount}>
            Continuar sem conta
          </button>
          <p className="auth-guest-note">O teu progresso ficará guardado só neste dispositivo.</p>
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
          Voltar
        </button>

        <div className="auth-form-header">
          <div className="auth-form-emoji">🔑</div>
          <h2 className="auth-form-title">Recuperar password</h2>
          <p className="auth-form-sub">Enviamos um link para o teu email.</p>
        </div>

        {resetSent ? (
          <div className="auth-success-box">
            ✅ Email enviado! Verifica a tua caixa de entrada e segue o link para redefinir a password.
          </div>
        ) : (
          <div className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input className="auth-input" type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button className="auth-submit-btn" onClick={handleForgotPassword} disabled={loading}>
              {loading ? 'A enviar...' : 'Enviar link de recuperação →'}
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
          Voltar
        </button>

        <div className="auth-form-header">
          <div className="auth-form-emoji">✨</div>
          <h2 className="auth-form-title">Criar conta</h2>
          <p className="auth-form-sub">É grátis. Sempre.</p>
        </div>

        <div className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label className="auth-label">Nome</label>
            <input className="auth-input" type="text" placeholder="O teu nome" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="auth-submit-btn" onClick={handleSignup} disabled={loading}>
            {loading ? 'A criar conta...' : 'Criar conta gratuita →'}
          </button>

          <div className="auth-divider"><span>ou</span></div>

          <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar com Google
          </button>
        </div>

        <p className="auth-switch">Já tens conta? <button className="auth-switch-btn" onClick={() => { setView('login'); clearError(); }}>Entrar</button></p>
      </div>
    );
  }

  // ── LOGIN SCREEN ─────────────────────────────────
  return (
    <div className="auth-wrapper">
      <button className="auth-back-btn" onClick={() => { setView('choice'); clearError(); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Voltar
      </button>

      <div className="auth-form-header">
        <div className="auth-form-emoji">👤</div>
        <h2 className="auth-form-title">Entrar</h2>
        <p className="auth-form-sub">Bem-vindo de volta!</p>
      </div>

      <div className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" placeholder="A tua password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="auth-forgot-link" onClick={() => { setView('forgot'); clearError(); }}>
          Esqueceste a password?
        </button>
        <button className="auth-submit-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar →'}
        </button>

        <div className="auth-divider"><span>ou</span></div>

        <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continuar com Google
        </button>
      </div>

      <p className="auth-switch">Não tens conta? <button className="auth-switch-btn" onClick={() => { setView('signup'); clearError(); }}>Criar conta</button></p>
    </div>
  );
}
