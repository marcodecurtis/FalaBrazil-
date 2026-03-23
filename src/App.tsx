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
import VideoStudio from './VideoStudio';
import IsabelaStudio from './IsabelaStudio';
import OnboardingScreen from './OnboardingScreen';
import WelcomeScreen from './WelcomeScreen';
import AuthScreen from './AuthScreen';
import TodayScreen from './TodayScreen';
import SandwichMenu from './SandwichMenu';
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

  const navigateTo = (newView: View | string) => {
    stopSpeaking();
    setView(newView as View);
  };

  const handleLogout = async () => {
    await auth.signOut();
    // Clear all progress keys correctly
    localStorage.removeItem('userLevel');
    localStorage.removeItem('hasSeenWelcome');
    localStorage.removeItem('timePreference');
    localStorage.removeItem('learningGoal');
    localStorage.removeItem('currentDay');
    localStorage.removeItem('streak');
    localStorage.removeItem('totalPts');
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
        <SandwichMenu
          isLoggedIn={isLoggedIn}
          userData={userData}
          userLevel={userLevel}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
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
        {view === 'pronunciation' && <PronunciationStudio onBack={() => navigateTo('home')} />}
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
