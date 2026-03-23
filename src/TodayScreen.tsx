import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import LessonPlayer from './LessonPlayer';
import './TodayScreen.css';

interface Props {
  userLevel: string | null;
  onNavigate: (view: string) => void;
}

export interface LessonBlock {
  type: 'vocabulary' | 'grammar' | 'reading' | 'isabela' | 'exercise' | 'mini_exercise' | 'verb';
  title: string;
  description: string;
  duration: number;
  xp: number;
  content: any;
}

interface Lesson {
  id: string;
  title: string;
  themeEmoji: string;
  totalMinutes: number;
  xpAvailable: number;
  blocks: LessonBlock[];
  isRequired?: boolean;
}

interface DailyContent {
  requiredLesson: Lesson;
  availableLessons: Lesson[];
}

const BLOCK_COLORS: Record<string, string> = {
  vocabulary:    '#dcfce7',
  grammar:       '#e0f2fe',
  reading:       '#f1f5f9',
  isabela:       '#fce7f3',
  exercise:      '#fef3c7',
  mini_exercise: '#fef3c7',
  verb:          '#ede9fe',
};

const FREE_PRACTICE = [
  { id: 'verbs',         label: 'Practise Verbs',        desc: '100 verbs · 6 tenses',          icon: '📚',  isIsabela: false },
  { id: 'vocab',         label: 'Learn Vocabulary',       desc: 'Flashcards by category',         icon: '🗂️',  isIsabela: false },
  { id: 'grammar',       label: 'Master Grammar',         desc: 'Rules for your level',           icon: '✍️',  isIsabela: false },
  { id: 'reading',       label: 'Read Articles',          desc: 'Real Brazilian Portuguese',      icon: '📰',  isIsabela: false },
  { id: 'pronunciation', label: 'Pronunciation',          desc: '20 rules with audio',            icon: '🔊',  isIsabela: false },
  { id: 'video',         label: 'Watch & Learn',          desc: 'Brazilian videos + Q&A',         icon: '🎬',  isIsabela: false },
  { id: 'isabela',       label: 'Chat with Isabela',      desc: 'AI conversation partner',        icon: null,  isIsabela: true  },
];

// Lessons needed per level based on time preference
const LESSONS_PER_LEVEL: Record<string, number> = {
  '5':  100,
  '15': 60,
  '30': 30,
};

const NEXT_LEVEL: Record<string, string> = {
  A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C2', C2: 'C2',
};

const getCacheKey = (level: string) => `lessons_cache_${level}`;

const getCachedLessons = (level: string): DailyContent | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(level));
    if (!cached) return null;
    const { content, cachedAt } = JSON.parse(cached);
    const isValid = Date.now() - cachedAt < 24 * 60 * 60 * 1000;
    return isValid ? content : null;
  } catch { return null; }
};

const setCachedLessons = (level: string, content: DailyContent) => {
  try {
    localStorage.setItem(getCacheKey(level), JSON.stringify({ content, cachedAt: Date.now() }));
  } catch { }
};

const fetchLessonsFromAPI = async (level: string, timePreference: string, learningGoal: string): Promise<DailyContent> => {
  const res = await fetch('/api/curriculum', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, timePreference, learningGoal, type: 'daily' }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

export default function TodayScreen({ userLevel, onNavigate }: Props) {
  const [dailyContent, setDailyContent]     = useState<DailyContent | null>(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [streak, setStreak]                 = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalPts, setTotalPts]             = useState(0);
  const [isLoggedIn, setIsLoggedIn]         = useState(false);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [activeLesson, setActiveLesson]     = useState<Lesson | null>(null);
  const [activeLessonIsRequired, setActiveLessonIsRequired] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const level          = userLevel || 'A1';
  const timePreference = localStorage.getItem('timePreference') || '30';
  const learningGoal   = localStorage.getItem('learningGoal')   || 'conversation';
  const lessonsNeeded  = LESSONS_PER_LEVEL[timePreference] || 30;
  const levelProgress  = Math.min(100, Math.round((lessonsCompleted / lessonsNeeded) * 100));
  const nextLevel      = NEXT_LEVEL[level];

  useEffect(() => {
    const user = auth.currentUser;
    setIsLoggedIn(!!user);
    if (user) {
      loadFromFirebase(user.uid);
    } else {
      const savedLessons   = parseInt(localStorage.getItem('lessonsCompleted') || '0');
      const savedStreak    = parseInt(localStorage.getItem('streak') || '0');
      const savedPts       = parseInt(localStorage.getItem('totalPts') || '0');
      const lastLessonDate = localStorage.getItem('lastLessonDate');
      
      // Check if streak should be reset
      const today = new Date().toISOString().split('T')[0];
      let currentStreak = savedStreak;
      if (lastLessonDate && lastLessonDate !== today) {
        const lastDate = new Date(lastLessonDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) {
          currentStreak = 0;
        }
      }
      
      setLessonsCompleted(savedLessons);
      setStreak(currentStreak);
      setTotalPts(savedPts);
      loadLessons();
      setTimeout(() => setShowSaveBanner(true), 3000);
    }
  }, [level]);

  const loadFromFirebase = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const savedLessons = data.lessonsCompleted || 0;
        const savedStreak = data.streak || 0;
        const savedPts = data.totalPts || 0;
        const lastLessonDate = data.lastLessonDate;
        
        const today = new Date().toISOString().split('T')[0];
        let currentStreak = savedStreak;
        if (lastLessonDate && lastLessonDate !== today) {
          const lastDate = new Date(lastLessonDate);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff > 1) {
            currentStreak = 0;
          }
        }
        
        setLessonsCompleted(savedLessons);
        setStreak(currentStreak);
        setTotalPts(savedPts);
        localStorage.setItem('lessonsCompleted', savedLessons.toString());
        localStorage.setItem('streak', currentStreak.toString());
        localStorage.setItem('totalPts', savedPts.toString());
        loadLessons();
      } else {
        loadLessons();
      }
    } catch {
      loadLessons();
    }
  };

  const loadLessons = async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedLessons(level);
      if (cached) {
        setDailyContent(cached);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    setError('');
    try {
      const content = await fetchLessonsFromAPI(level, timePreference, learningGoal);
      setCachedLessons(level, content);
      setDailyContent(content);
    } catch {
      setError('Could not load lessons. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newLessons: number, newPts: number, newStreak: number, requiredDone: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lessonsCompleted', newLessons.toString());
    localStorage.setItem('totalPts', newPts.toString());
    if (requiredDone) {
      localStorage.setItem('streak', newStreak.toString());
      localStorage.setItem('lastLessonDate', today);
    }
    
    const user = auth.currentUser;
    if (user) {
      try {
        const updateData: any = {
          lessonsCompleted: newLessons,
          totalPts: newPts,
        };
        if (requiredDone) {
          updateData.streak = newStreak;
          updateData.lastLessonDate = today;
        }
        await updateDoc(doc(db, 'users', user.uid), updateData);
      } catch { }
    }
  };

  const handleLessonComplete = async (lesson: Lesson, xpEarned: number, isRequired: boolean) => {
    const newLessons = lessonsCompleted + 1;
    const newPts = totalPts + xpEarned;
    let newStreak = streak;
    
    if (isRequired) {
      const today = new Date().toISOString().split('T')[0];
      const lastLessonDate = localStorage.getItem('lastLessonDate');
      
      // Check if streak should continue
      if (!lastLessonDate || lastLessonDate === today) {
        // First lesson today or already have streak
        newStreak = lastLessonDate === today ? streak : streak + 1;
      } else {
        const lastDate = new Date(lastLessonDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          newStreak = streak + 1; // Consecutive day
        } else {
          newStreak = 1; // Broken streak, restart
        }
      }
      
      setStreak(newStreak);
      setShowCelebration(true);
    }
    
    setLessonsCompleted(newLessons);
    setTotalPts(newPts);
    setCompletedToday([...completedToday, lesson.id]);
    setActiveLesson(null);
    setActiveLessonIsRequired(false);
    
    await saveProgress(newLessons, newPts, newStreak, isRequired);
  };

  const handleLessonStart = (lesson: Lesson, isRequired: boolean) => {
    setActiveLesson(lesson);
    setActiveLessonIsRequired(isRequired);
  };

  const handleLessonBack = () => {
    setActiveLesson(null);
    setActiveLessonIsRequired(false);
  };

  if (activeLesson) {
    return (
      <LessonPlayer
        block={activeLesson.blocks[0]}
        onPass={async () => {
          await handleLessonComplete(activeLesson, activeLesson.xpAvailable, activeLessonIsRequired);
        }}
        onBack={handleLessonBack}
      />
    );
  }

  const requiredDone = dailyContent && completedToday.includes(dailyContent.requiredLesson.id);

  return (
    <div className="ts-wrapper">

      {showSaveBanner && !isLoggedIn && (
        <div className="ts-save-banner">
          <div className="ts-save-banner-text">💾 Create a free account to save your progress across devices</div>
          <div className="ts-save-banner-actions">
            <button className="ts-save-banner-btn" onClick={() => onNavigate('auth')}>Save progress →</button>
            <button className="ts-save-banner-dismiss" onClick={() => setShowSaveBanner(false)}>✕</button>
          </div>
        </div>
      )}

      <div className="ts-topbar">
        <div className="ts-streak">
          <div className="ts-streak-icon">🔥</div>
          <div>
            <div className="ts-streak-num">{streak}</div>
            <div className="ts-streak-label">day streak</div>
          </div>
        </div>
        <div className="ts-header-center">
          <img src="https://flagcdn.com/w40/br.png" alt="BR" className="ts-flag" />
          <span className="ts-app-name">Fala Brazil!</span>
        </div>
        <div className="ts-xp-badge">
          <span className="ts-xp-num">{totalPts.toLocaleString()}</span>
          <span className="ts-xp-label">pts</span>
        </div>
      </div>

      {/* ── LEVEL PROGRESS — based on lessons completed ── */}
      <div className="ts-level-bar">
        <div className="ts-level-row">
          <span className="ts-level-pill">{level}</span>
          <span className="ts-level-next">
            {level !== 'C2'
              ? `${levelProgress}% to ${nextLevel} · ${lessonsCompleted} of ${lessonsNeeded} lessons`
              : 'Max level reached!'}
          </span>
        </div>
        <div className="ts-level-track">
          <div className="ts-level-fill" style={{ width: `${levelProgress}%` }} />
        </div>
      </div>

      {loading ? (
        <div className="ts-loading">
          <div className="ts-loading-dots">
            <div className="ts-loading-dot" /><div className="ts-loading-dot" /><div className="ts-loading-dot" />
          </div>
          <div className="ts-loading-text">Preparing today's lessons...</div>
        </div>
      ) : error ? (
        <div className="ts-error">
          <div className="ts-error-text">{error}</div>
          <button className="ts-retry-btn" onClick={() => loadLessons(true)}>Try again</button>
        </div>
      ) : dailyContent ? (
        <>
          {showCelebration && requiredDone && (
            <div className="ts-celebration">
              <div className="ts-celebration-emoji">🎉</div>
              <div className="ts-celebration-title">Required lesson done!</div>
              <div className="ts-celebration-pts">Great work today 🌟</div>
              <div className="ts-celebration-streak">🔥 {streak} day streak</div>
              <div className="ts-celebration-next">
                You can do more lessons below or come back tomorrow for new content!
              </div>
              <button className="ts-celebration-btn" onClick={() => setShowCelebration(false)}>
                See more lessons ↓
              </button>
            </div>
          )}

          <div className="ts-lesson-card">
            <div className="ts-lesson-eyebrow">
              {requiredDone ? '✅ Required lesson done!' : '📌 Today\'s required lesson'}
            </div>
            <div className="ts-lesson-title">{dailyContent.requiredLesson.themeEmoji} {dailyContent.requiredLesson.title}</div>
            <div className="ts-lesson-meta">{dailyContent.requiredLesson.totalMinutes} mins · {dailyContent.requiredLesson.xpAvailable} pts</div>

            {!requiredDone ? (
              <button 
                className="ts-block-btn"
                onClick={() => handleLessonStart(dailyContent.requiredLesson, true)}
                style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              >
                Start Required Lesson →
              </button>
            ) : (
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', color: '#14532d', fontWeight: 700, textAlign: 'center', marginTop: '16px' }}>
                ✓ Completed - Streak unlocked!
              </div>
            )}
          </div>

          {dailyContent.availableLessons.length > 0 && (
            <>
              <div className="ts-divider">
                <div className="ts-divider-line" />
                <div className="ts-divider-text">more lessons</div>
                <div className="ts-divider-line" />
              </div>

              <div className="ts-blocks">
                {dailyContent.availableLessons.map((lesson, i) => {
                  const isDone = completedToday.includes(lesson.id);
                  return (
                    <div key={i} className={`ts-block ${isDone ? 'ts-block-done' : ''}`}>
                      <div className="ts-block-icon" style={{ background: BLOCK_COLORS['vocabulary'] }}>
                        {lesson.themeEmoji}
                      </div>
                      <div className="ts-block-content">
                        <div className="ts-block-title">{lesson.title}</div>
                        <div className="ts-block-meta">{lesson.totalMinutes} min · {lesson.xpAvailable} pts</div>
                      </div>
                      <div className="ts-block-right">
                        {isDone ? (
                          <div className="ts-block-check">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ) : (
                          <button className="ts-block-btn" onClick={() => handleLessonStart(lesson, false)}>Start</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : null}

      <div className="ts-divider">
        <div className="ts-divider-line" />
        <div className="ts-divider-text">free practice</div>
        <div className="ts-divider-line" />
      </div>

      <div className="ts-free-list">
        {FREE_PRACTICE.map(item => (
          <button key={item.id} className="ts-free-card" onClick={() => onNavigate(item.id)}>
            <div className="ts-free-icon-wrap">
              {item.isIsabela ? (
                <img
                  src="/isabela.png"
                  alt="Isabela"
                  className="ts-free-isabela-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="ts-free-icon">{item.icon}</span>
              )}
            </div>
            <div className="ts-free-content">
              <div className="ts-free-label">{item.label}</div>
              <div className="ts-free-desc">{item.desc}</div>
            </div>
            <div className="ts-free-arrow">→</div>
          </button>
        ))}
      </div>

    </div>
  );
}
