// src/App.tsx
// Bottom nav replaces sandwich menu
// 5 tabs: Today, Learn, Isabela, Progress, Account

import { useState, useEffect } from 'react';
import './App.css';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { syncAuthUserToFirestore } from './dataService';
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
import LearnScreen from './LearnScreen';
import ProgressScreen from './ProgressScreen';
import AccountScreen from './AccountScreen';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import { stopSpeaking } from './speak';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

type Tab = 'today' | 'learn' | 'isabela' | 'progress' | 'account';
type Studio = 'verbs' | 'vocab' | 'grammar' | 'reading' | 'pronunciation' | 'video' | 'isabela-studio';
type SetupView = 'loading' | 'welcome' | 'auth' | 'onboarding';
type AppView = SetupView | Tab | Studio;

interface UserData {
  name:            string;
  email:           string;
  level:           Level | null;
  xp:              number;
  streak:          number;
  totalPts:        number;
  currentDay:      number;
  timePreference:  string | null;
  learningGoal:    string | null;
  lastActiveAt:    string;
  lessonsCompleted?: number;
}

export default function App() {
  const [view, setView]             = useState<AppView>('loading');
  const [userLevel, setUserLevel]   = useState<Level | null>(null);
  const [userData, setUserData]     = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [streak, setStreak]                     = useState(0);
  const [totalPts, setTotalPts]                 = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);

  const updateUserProgress = async (fields: Partial<UserData>) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        ...fields,
        lastActiveAt: new Date().toISOString(),
      });
      setUserData(prev => prev ? { ...prev, ...fields } : prev);
    } catch (err) {
      console.error('Failed to update user progress:', err);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      // Finish Google redirect sign-in and sync Firestore *before* auth listener runs,
      // so the user document exists when we first read it.
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          await syncAuthUserToFirestore(redirectResult.user);
        }
      } catch (err: any) {
        console.error('Google redirect sign-in:', err);
        // Surface domain authorization errors so the user knows what went wrong
        if (err?.code === 'auth/unauthorized-domain') {
          alert('Google sign-in failed: this domain is not authorised in Firebase. Please contact support.');
        }
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // ── Signed-in user: always go to today ────────────────────
          setIsLoggedIn(true);
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data() as UserData;
              setUserData(data);

              if (data.level)          localStorage.setItem('userLevel',      data.level);
              if (data.streak)         localStorage.setItem('streak',         String(data.streak));
              if (data.totalPts)       localStorage.setItem('totalPts',       String(data.totalPts));
              if (data.currentDay)     localStorage.setItem('currentDay',     String(data.currentDay));
              if (data.timePreference) localStorage.setItem('timePreference', data.timePreference);
              if (data.learningGoal)   localStorage.setItem('learningGoal',   data.learningGoal);

              setStreak(data.streak || 0);
              setTotalPts(data.totalPts || 0);
              setLessonsCompleted(data.lessonsCompleted || 0);

              if (data.level) {
                setUserLevel(data.level);
                localStorage.setItem('hasCompletedAuth', 'true');
                setView('today');
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
          // ── Anonymous visitor ─────────────────────────────────────
          setIsLoggedIn(false);
          const hasSeenWelcome   = localStorage.getItem('hasSeenWelcome');
          const savedLevel       = localStorage.getItem('userLevel') as Level | null;
          const hasCompletedAuth = localStorage.getItem('hasCompletedAuth');

          setStreak(parseInt(localStorage.getItem('streak') || '0'));
          setTotalPts(parseInt(localStorage.getItem('totalPts') || '0'));
          setLessonsCompleted(parseInt(localStorage.getItem('lessonsCompleted') || '0'));

          if (hasSeenWelcome && savedLevel && hasCompletedAuth) {
            // Returning anonymous user who already dismissed auth — go to app
            setUserLevel(savedLevel);
            setView('today');
          } else if (hasSeenWelcome && savedLevel && !hasCompletedAuth) {
            // Completed onboarding but hasn't seen auth yet — show auth
            setUserLevel(savedLevel);
            setView('auth');
          } else if (hasSeenWelcome) {
            // Seen welcome but no level yet — go to onboarding
            setView('onboarding');
          } else {
            // Brand new user — show welcome slides first
            setView('welcome');
          }
        }
      });
    })();

    return () => unsubscribe?.();
  }, []);

  const navigateTo = (newView: AppView) => {
    stopSpeaking();
    setView(newView);
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('userLevel');
    localStorage.removeItem('hasSeenWelcome');
    localStorage.removeItem('hasCompletedAuth');
    localStorage.removeItem('timePreference');
    localStorage.removeItem('learningGoal');
    localStorage.removeItem('currentDay');
    localStorage.removeItem('streak');
    localStorage.removeItem('totalPts');
    localStorage.removeItem('lessonsCompleted');
    setUserData(null);
    setUserLevel(null);
    setView('welcome');
  };

  const handleWelcomeFinish = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setView('onboarding');
  };

  const handleOnboardingComplete = (level: Level) => {
    setUserLevel(level);
    if (!localStorage.getItem('currentDay')) {
      localStorage.setItem('currentDay', '1');
    }
    updateUserProgress({ level });
    setView('auth');
  };

  // ── Loading ────────────────────────────────────────────────────
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

  // ── Setup screens — no bottom nav ──────────────────────────────
  if (view === 'welcome') {
    return <WelcomeScreen onFinish={handleWelcomeFinish} />;
  }

  if (view === 'auth') {
    return (
      <AuthScreen
        onContinueWithoutAccount={() => {
          const savedLevel = localStorage.getItem('userLevel') as Level | null;
          if (savedLevel) { setUserLevel(savedLevel); }
          localStorage.setItem('hasCompletedAuth', 'true');
          setView('today');
        }}
        onAuthSuccess={() => {
          localStorage.setItem('hasCompletedAuth', 'true');
          setView('today');
        }}
      />
    );
  }

  if (view === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // ── Studio overlays — full screen, WITH bottom nav ────────────
  const studioBack = () => navigateTo('learn');

  const studioViews = {
    verbs: (
      <VerbStudio
        onBack={studioBack}
        onGainXp={(pts: number) => updateUserProgress({ xp: (userData?.xp || 0) + pts, totalPts: (userData?.totalPts || 0) + pts })}
      />
    ),
    vocab:         <VocabStudio onBack={studioBack} userLevel={userLevel} />,
    grammar:       <GrammarStudio onBack={studioBack} userLevel={userLevel} />,
    reading:       <ReadingStudio onBack={studioBack} userLevel={userLevel} />,
    pronunciation: <PronunciationStudio onBack={studioBack} />,
    video:         <VideoStudio onBack={studioBack} userLevel={userLevel} />,
  };

  if (view in studioViews) {
    return (
      <>
        <TopBar streak={streak} totalPts={totalPts} />
        <div className="container" style={{ paddingTop: '52px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))' }}>
          {studioViews[view as keyof typeof studioViews]}
        </div>
        <BottomNav active={'learn'} onNavigate={(tab) => navigateTo(tab)} />
      </>
    );
  }

  if (view === 'isabela' || view === 'isabela-studio') {
    return (
      <>
        <TopBar streak={streak} totalPts={totalPts} />
        <div className="container" style={{ paddingTop: '52px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))' }}>
          <IsabelaStudio
            onBack={() => navigateTo('today')}
            userLevel={userLevel}
          />
        </div>
        <BottomNav active={'isabela'} onNavigate={(tab) => navigateTo(tab)} />
      </>
    );
  }

  // ── Main app with bottom nav ───────────────────────────────────
  const activeTab = view as Tab;

  return (
    <>
      <TopBar streak={streak} totalPts={totalPts} />
      <div className="container" style={{ paddingTop: '52px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 16px))' }}>

        {activeTab === 'today' && (
          <TodayScreen
            userLevel={userLevel}
            onNavigate={(v) => navigateTo(v as AppView)}
          />
        )}

        {activeTab === 'learn' && (
          <LearnScreen
            userLevel={userLevel}
            onNavigate={(v) => navigateTo(v as AppView)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            userLevel={userLevel}
            streak={streak}
            totalPts={totalPts}
            lessonsCompleted={lessonsCompleted}
          />
        )}

        {activeTab === 'account' && (
          <AccountScreen
            isLoggedIn={isLoggedIn}
            userData={userData}
            userLevel={userLevel}
            onNavigate={(v) => navigateTo(v as AppView)}
            onLogout={handleLogout}
          />
        )}

        <footer style={{ paddingBottom: '90px' }} />

      </div>

      <BottomNav
        active={activeTab}
        onNavigate={(tab) => navigateTo(tab)}
      />
    </>
  );
}
