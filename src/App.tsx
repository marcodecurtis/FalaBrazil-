import { useState, useEffect } from 'react';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import VerbStudio from './VerbStudio';
import VocabStudio from './VocabStudio';
import GrammarStudio from './GrammarStudio';
import ReadingStudio from './ReadingStudio';
import PronunciationStudio from './PronunciationStudio';
import OnboardingScreen from './OnboardingScreen';
import WelcomeScreen from './WelcomeScreen';
import AuthScreen from './AuthScreen';
import { stopSpeaking } from './speak';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type View = 'loading' | 'welcome' | 'auth' | 'onboarding' | 'home' | 'verbs' | 'vocab' | 'grammar' | 'reading' | 'pronunciation';

interface UserData {
  name: string;
  email: string;
  level: Level | null;
  xp: number;
  streak: number;
}

export default function App() {
  const [view, setView]           = useState<View>('loading');
  const [userLevel, setUserLevel] = useState<Level | null>(null);
  const [userData, setUserData]   = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
            if (data.level) {
              setUserLevel(data.level);
              localStorage.setItem('userLevel', data.level);
              setView('home');
            } else {
              setView('onboarding');
            }
          } else {
            setView('onboarding');
          }
        } catch {
          setView('onboarding');
        }
      } else {
        setIsLoggedIn(false);
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        const savedLevel     = localStorage.getItem('userLevel') as Level | null;

        if (hasSeenWelcome && savedLevel) {
          setUserLevel(savedLevel);
          setView('home');
        } else if (hasSeenWelcome) {
          setView('onboarding');
        } else {
          setView('welcome');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const navigateTo = (newView: View) => {
    stopSpeaking();
    setView(newView);
  };

  const handleWelcomeFinish = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setView('auth');
  };

  const handleAuthSuccess = () => {
    // Firebase onAuthStateChanged will handle the redirect automatically
  };

  const handleContinueWithoutAccount = () => {
    const savedLevel = localStorage.getItem('userLevel') as Level | null;
    if (savedLevel) {
      setUserLevel(savedLevel);
      setView('home');
    } else {
      setView('onboarding');
    }
  };

  const handleOnboardingComplete = (level: Level) => {
    setUserLevel(level);
    setView('home');
  };

  // ── LOADING ───────────────────────────────────────
  if (view === 'loading') {
    return (
      <div className="container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="https://flagcdn.com/w80/br.png" alt="Brazil" style={{ width: '48px', borderRadius: '6px', marginBottom: '16px' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      {/* ── BACK BUTTON ── */}
      {view !== 'home' && view !== 'onboarding' && view !== 'welcome' && view !== 'auth' && (
        <button className="top-back-btn" onClick={() => navigateTo('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back
        </button>
      )}

      {view === 'welcome'    && <WelcomeScreen onFinish={handleWelcomeFinish} />}
      {view === 'auth'       && <AuthScreen onContinueWithoutAccount={handleContinueWithoutAccount} onAuthSuccess={handleAuthSuccess} />}
      {view === 'onboarding' && <OnboardingScreen onComplete={handleOnboardingComplete} />}

      {/* ── HOME ── */}
      {view === 'home' && (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="flag-circle">
              <img src="https://flagcdn.com/w160/br.png" alt="Brazil" style={{ width: '60px', height: '42px', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
            <h1 className="main-title">Fala Brazil!</h1>
            {userData?.name
              ? <p className="main-subtitle">Hey {userData.name.split(' ')[0]}! Ready to learn? 👋</p>
              : <p className="main-subtitle">Learn Portuguese the right way</p>
            }

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {userLevel && (
                <span style={{ background: 'var(--accent)', color: 'white', fontWeight: 800, fontSize: '0.78rem', padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                  Level {userLevel}
                </span>
              )}
              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    await auth.signOut();
                    localStorage.removeItem('userLevel');
                    localStorage.removeItem('hasSeenWelcome');
                    setUserData(null);
                    setUserLevel(null);
                    setView('welcome');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', fontFamily: 'inherit' }}
                >
                  Log out
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('auth')}
                  style={{ background: 'none', border: '1.5px solid var(--accent)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: '4px 12px', borderRadius: '20px', fontFamily: 'inherit' }}
                >
                  Create account
                </button>
              )}
            </div>
          </header>

          <div className="grid-nav">
            <div className="nav-card" onClick={() => navigateTo('verbs')}>
              <div className="card-icon">📚</div>
              <div className="card-content"><h3>Practise Verbs</h3><p>Master the 6 most important conjugations across 100 verbs.</p></div>
              <div className="card-arrow">→</div>
            </div>
            <div className="nav-card" onClick={() => navigateTo('vocab')}>
              <div className="card-icon">🗂️</div>
              <div className="card-content"><h3>Learn Vocabulary</h3><p>Smart flashcards across 10 themed categories.</p></div>
              <div className="card-arrow">→</div>
            </div>
            <div className="nav-card" onClick={() => navigateTo('grammar')}>
              <div className="card-icon">✍️</div>
              <div className="card-content"><h3>Master Grammar</h3><p>20 essential rules with examples from A1 to B2.</p></div>
              <div className="card-arrow">→</div>
            </div>
            <div className="nav-card" onClick={() => navigateTo('reading')}>
              <div className="card-icon">📰</div>
              <div className="card-content"><h3>Read Articles</h3><p>Real Portuguese articles with integrated translation.</p></div>
              <div className="card-arrow">→</div>
            </div>
            <div className="nav-card" onClick={() => navigateTo('pronunciation')}>
              <div className="card-icon">🔊</div>
              <div className="card-content"><h3>Perfect Pronunciation</h3><p>20 pronunciation rules with audio examples.</p></div>
              <div className="card-arrow">→</div>
            </div>
            <div className="nav-card" style={{ opacity: 0.6, cursor: 'default' }}>
              <div className="card-icon">🤖</div>
              <div className="card-content">
                <h3>
                  Chat with AI Tutor{' '}
                  <span style={{ fontSize: '0.65rem', background: '#fef9c3', color: '#854d0e', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', marginLeft: '6px', verticalAlign: 'middle' }}>
                    Coming Soon
                  </span>
                </h3>
                <p>Chat with an AI tutor in Portuguese. Get instant feedback.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'verbs'         && <VerbStudio onBack={() => navigateTo('home')} onGainXp={() => {}} />}
      {view === 'vocab'         && <VocabStudio onBack={() => navigateTo('home')} onGainXp={() => {}} />}
      {view === 'grammar'       && <GrammarStudio onBack={() => navigateTo('home')} />}
      {view === 'reading'       && <ReadingStudio onBack={() => navigateTo('home')} />}
      {view === 'pronunciation' && <PronunciationStudio onBack={() => navigateTo('home')} />}

      <footer style={{ marginTop: 'auto', paddingTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        Created by{' '}
        <a href="https://www.nocodediary.co.uk/" target="_blank" rel="noopener noreferrer" style={{ color: '#14532d', fontWeight: 800, textDecoration: 'none' }}>
          Marco De Curtis
        </a>
      </footer>
    </div>
  );
}
