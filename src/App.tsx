import { useState, useEffect, useRef } from 'react';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import VerbStudio from './VerbStudio';
import VocabStudio from './VocabStudio';
import GrammarStudio from './GrammarStudio';
import ReadingStudio from './ReadingStudio';
import PronunciationStudio from './PronunciationStudio';
import VideoStudio from './VideoStudio';
import IsabelaStudio from './IsabelaStudio';
import OnboardingScreen from './OnboardingScreen';
import WelcomeScreen from './WelcomeScreen';
import AuthScreen from './AuthScreen';
import TodayScreen from './TodayScreen';
import { stopSpeaking } from './speak';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type View = 'loading' | 'welcome' | 'auth' | 'onboarding' | 'home' | 'verbs' | 'vocab' | 'grammar' | 'reading' | 'pronunciation' | 'video' | 'isabela';

interface UserData {
  name: string;
  email: string;
  level: Level | null;
  xp: number;
  streak: number;
}

export default function App() {
  const [view, setView]             = useState<View>('loading');
  const [userLevel, setUserLevel]   = useState<Level | null>(null);
  const [userData, setUserData]     = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const menuRef                     = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (newView: View) => {
    stopSpeaking();
    setMenuOpen(false);
    setView(newView);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await auth.signOut();
    // Clear all progress keys correctly
    localStorage.removeItem('userLevel');
    localStorage.removeItem('hasSeenWelcome');
    localStorage.removeItem('timePreference');
    localStorage.removeItem('learningGoal');
    localStorage.removeItem('currentDay');
    localStorage.removeItem('streak');
    localStorage.removeItem('totalPts');  // fixed: was totalXp
    setUserData(null);
    setUserLevel(null);
    setView('welcome');
  };

  const handleWelcomeFinish = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setView('auth');
  };

  const handleAuthSuccess = () => {};

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
    if (!localStorage.getItem('currentDay')) {
      localStorage.setItem('currentDay', '1');
    }
    setView('home');
  };

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
    <>
      {/* ── SANDWICH MENU ── */}
      {view === 'home' && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 99999,
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'white', border: '1.5px solid #e2e8f0',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '5px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', display: 'block' }} />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              minWidth: '220px',
              overflow: 'hidden',
              zIndex: 99999,
            }}>
              {isLoggedIn && userData && (
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Account</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{userData.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{userData.email}</div>
                </div>
              )}

              {!isLoggedIn && (
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>Not logged in</div>
                  <button
                    onClick={() => navigateTo('auth')}
                    style={{ width: '100%', background: '#14532d', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Create account / Log in
                  </button>
                </div>
              )}

              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Level</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ background: '#14532d', color: 'white', fontWeight: 800, fontSize: '0.82rem', padding: '3px 12px', borderRadius: '20px' }}>
                    {userLevel || 'Not set'}
                  </span>
                  <button
                    onClick={() => navigateTo('onboarding')}
                    style={{ background: 'none', border: '1px solid #e2e8f0', color: '#14532d', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '3px 10px', borderRadius: '8px', fontFamily: 'inherit' }}
                  >
                    Change →
                  </button>
                </div>
              </div>

              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', padding: '12px 16px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
                onClick={() => setMenuOpen(false)}
              >
                📄 Privacy Policy & Terms
              </a>

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  🚪 Log out
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="container">

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

        {view === 'home' && (
          <TodayScreen
            userLevel={userLevel}
            onNavigate={(v) => navigateTo(v as View)}
          />
        )}

        {view === 'verbs'         && <VerbStudio onBack={() => navigateTo('home')} onGainXp={() => {}} />}
        {view === 'vocab'         && <VocabStudio onBack={() => navigateTo('home')} userLevel={userLevel} />}
        {view === 'grammar'       && <GrammarStudio onBack={() => navigateTo('home')} userLevel={userLevel} />}
        {view === 'reading'       && <ReadingStudio onBack={() => navigateTo('home')} userLevel={userLevel} />}
        {view === 'pronunciation' && <PronunciationStudio onBack={() => navigateTo('home')} onGainXp={() => {}} />}
        {view === 'video'         && <VideoStudio onBack={() => navigateTo('home')} userLevel={userLevel} />}
        {view === 'isabela'       && <IsabelaStudio 
          block={{ type: 'vocabulary', title: 'Isabela\'s Lessons', content: { words: [] } } as any}
          onPass={() => navigateTo('home')} 
          onBack={() => navigateTo('home')} 
        />}

        <footer style={{ marginTop: 'auto', paddingTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          Created by{' '}
          <a href="https://www.nocodediary.co.uk/" target="_blank" rel="noopener noreferrer" style={{ color: '#14532d', fontWeight: 800, textDecoration: 'none' }}>
            Marco De Curtis
          </a>
        </footer>

      </div>
    </>
  );
}
