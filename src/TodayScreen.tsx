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
  day: number;
  theme: string;
  themeEmoji: string;
  totalMinutes: number;
  xpAvailable: number;
  blocks: LessonBlock[];
}

const BLOCK_ICONS: Record<string, string> = {
  vocabulary:    '📖',
  grammar:       '✍️',
  reading:       '📰',
  isabela:       '🎙️',
  exercise:      '⚡',
  mini_exercise: '⚡',
  verb:          '🔤',
};

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

// Days required to complete each level
const DAYS_PER_LEVEL: Record<string, number> = {
  A1: 30, A2: 45, B1: 60, B2: 60, C1: 60, C2: 45,
};

const NEXT_LEVEL: Record<string, string> = {
  A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C2', C2: 'C2',
};

const getCacheKey = (level: string, day: number) => `lesson_cache_${level}_day${day}`;

const getCachedLesson = (level: string, day: number): Lesson | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(level, day));
    if (!cached) return null;
    const { lesson, cachedAt } = JSON.parse(cached);
    const isValid = Date.now() - cachedAt < 24 * 60 * 60 * 1000;
    return isValid ? lesson : null;
  } catch { return null; }
};

const setCachedLesson = (level: string, day: number, lesson: Lesson) => {
  try {
    localStorage.setItem(getCacheKey(level, day), JSON.stringify({ lesson, cachedAt: Date.now() }));
  } catch { }
};

const fetchLessonFromAPI = async (level: string, day: number, timePreference: string, learningGoal: string): Promise<Lesson> => {
  const res = await fetch('/api/curriculum', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, dayNumber: day, timePreference, learningGoal }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};

export default function TodayScreen({ userLevel, onNavigate }: Props) {
  const [lesson, setLesson]           = useState<Lesson | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [completed, setCompleted]     = useState<string[]>([]);
  const [dayNumber, setDayNumber]     = useState(1);
  const [streak, setStreak]           = useState(0);
  const [totalPts, setTotalPts]       = useState(0);
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [activeBlock, setActiveBlock] = useState<LessonBlock | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const level          = userLevel || 'A1';
  const timePreference = localStorage.getItem('timePreference') || '30';
  const learningGoal   = localStorage.getItem('learningGoal')   || 'conversation';

  // ── Real level progress based on days completed ───
  const daysForLevel   = DAYS_PER_LEVEL[level] || 30;
  const levelProgress  = Math.min(100, Math.round(((dayNumber - 1) / daysForLevel) * 100));
  const nextLevel      = NEXT_LEVEL[level];

  useEffect(() => {
    const user = auth.currentUser;
    setIsLoggedIn(!!user);
    if (user) {
      loadFromFirebase(user.uid);
    } else {
      const savedDay       = parseInt(localStorage.getItem('currentDay') || '1');
      const savedStreak    = parseInt(localStorage.getItem('streak') || '0');
      const savedPts       = parseInt(localStorage.getItem('totalPts') || '0');
      const savedCompleted = JSON.parse(localStorage.getItem(`completed_day_${savedDay}`) || '[]');
      const lastActive     = localStorage.getItem('lastActive');
      
      // ── OPTION 1: Check if user missed a day (streak break) ──
      const today = new Date().toISOString().split('T')[0];
      let currentStreak = savedStreak;
      if (lastActive && lastActive !== today) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        // If more than 1 day passed without completing, streak breaks
        if (daysDiff > 1) {
          currentStreak = 0;
        }
      }
      
      setDayNumber(savedDay);
      setStreak(currentStreak);
      setTotalPts(savedPts);
      setCompleted(savedCompleted);
      loadLesson(savedDay);
      setTimeout(() => setShowSaveBanner(true), 3000);
    }
  }, [level]);

  const loadFromFirebase = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data       = userDoc.data();
        const savedDay   = data.currentDay || 1;
        const savedStreak = data.streak    || 0;
        const savedPts   = data.totalPts   || 0;
        const savedCompleted = data[`completed_day_${savedDay}`] || [];
        const lastActive = data.lastActive;
        
        // ── OPTION 1: Check if user missed a day (streak break) ──
        const today = new Date().toISOString().split('T')[0];
        let currentStreak = savedStreak;
        if (lastActive && lastActive !== today) {
          const lastDate = new Date(lastActive);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          // If more than 1 day passed without completing, streak breaks
          if (daysDiff > 1) {
            currentStreak = 0;
          }
        }
        
        setDayNumber(savedDay);
        setStreak(currentStreak);
        setTotalPts(savedPts);
        setCompleted(savedCompleted);
        localStorage.setItem('currentDay', savedDay.toString());
        localStorage.setItem('streak', currentStreak.toString());
        localStorage.setItem('totalPts', savedPts.toString());
        localStorage.setItem(`completed_day_${savedDay}`, JSON.stringify(savedCompleted));
        loadLesson(savedDay);
      } else {
        loadLesson(1);
      }
    } catch {
      const savedDay = parseInt(localStorage.getItem('currentDay') || '1');
      loadLesson(savedDay);
    }
  };

  const loadLesson = async (day: number, forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedLesson(level, day);
      if (cached) {
        setLesson(cached);
        setLoading(false);
        preGenerateNextLesson(day + 1);
        return;
      }
    }
    setLoading(true);
    setError('');
    try {
      const newLesson = await fetchLessonFromAPI(level, day, timePreference, learningGoal);
      setCachedLesson(level, day, newLesson);
      setLesson(newLesson);
      preGenerateNextLesson(day + 1);
    } catch {
      setError('Could not load today\'s lesson. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const preGenerateNextLesson = async (nextDay: number) => {
    if (getCachedLesson(level, nextDay)) return;
    try {
      const next = await fetchLessonFromAPI(level, nextDay, timePreference, learningGoal);
      setCachedLesson(level, nextDay, next);
    } catch { }
  };

  const saveProgress = async (day: number, newCompleted: string[], newPts: number, newStreak: number) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('currentDay', day.toString());
    localStorage.setItem(`completed_day_${day}`, JSON.stringify(newCompleted));
    localStorage.setItem('totalPts', newPts.toString());
    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('lastActive', today);
    
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          currentDay: day,
          [`completed_day_${day}`]: newCompleted,
          totalPts: newPts,
          streak: newStreak,
          lastActive: today,
        });
      } catch { }
    }
  };

  const markBlockComplete = async (blockType: string, pts: number) => {
    const newCompleted  = [...completed, blockType];
    const newPts        = totalPts + pts;
    // ── OPTION 1: Only increment streak if ALL blocks are completed ──
    const allBlocksDone = lesson ? lesson.blocks.every(b => newCompleted.includes(b.type)) : false;
    const newStreak     = allBlocksDone ? streak + 1 : streak;
    
    setCompleted(newCompleted);
    setTotalPts(newPts);
    
    if (allBlocksDone) {
      setStreak(newStreak);
      setShowCelebration(true);
      // ── OPTION 1: Only advance to next day when current day is fully complete ──
      const nextDay = dayNumber + 1;
      setDayNumber(nextDay);
      localStorage.setItem('currentDay', nextDay.toString());
      await saveProgress(nextDay, [], newPts, newStreak);
      preGenerateNextLesson(nextDay);
    } else {
      // Still on same day, just save progress
      await saveProgress(dayNumber, newCompleted, newPts, streak);
    }
  };

  const handleBlockStart = (block: LessonBlock) => {
    setActiveBlock(block);
  };

  const handlePlayerPass = async () => {
    if (!activeBlock) return;
    await markBlockComplete(activeBlock.type, activeBlock.xp);
    setActiveBlock(null);
  };

  const handlePlayerBack = () => setActiveBlock(null);

  if (activeBlock) {
    return (
      <LessonPlayer
        block={activeBlock}
        onPass={handlePlayerPass}
        onBack={handlePlayerBack}
      />
    );
  }

  const completedCount  = lesson ? lesson.blocks.filter(b => completed.includes(b.type)).length : 0;
  const totalBlocks     = lesson ? lesson.blocks.length : 0;
  const progressPercent = totalBlocks > 0 ? (completedCount / totalBlocks) * 100 : 0;
  const ptsEarned       = lesson ? lesson.blocks.filter(b => completed.includes(b.type)).reduce((sum, b) => sum + b.xp, 0) : 0;
  const allDone         = totalBlocks > 0 && completedCount === totalBlocks;

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

      {/* ── LEVEL PROGRESS — real, based on days done ── */}
      <div className="ts-level-bar">
        <div className="ts-level-row">
          <span className="ts-level-pill">{level}</span>
          <span className="ts-level-next">
            {level !== 'C2'
              ? `${levelProgress}% to ${nextLevel} · Day ${dayNumber} of ${daysForLevel}`
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
          <div className="ts-loading-text">Preparing today's lesson...</div>
        </div>
      ) : error ? (
        <div className="ts-error">
          <div className="ts-error-text">{error}</div>
          <button className="ts-retry-btn" onClick={() => loadLesson(dayNumber, true)}>Try again</button>
        </div>
      ) : lesson ? (
        <>
          {showCelebration && allDone && (
            <div className="ts-celebration">
              <div className="ts-celebration-emoji">🎉</div>
              <div className="ts-celebration-title">Day {lesson.day} complete!</div>
              <div className="ts-celebration-pts">+{ptsEarned} points earned</div>
              <div className="ts-celebration-streak">🔥 {streak} day streak</div>
              <div className="ts-celebration-next">
                Come back tomorrow for Day {lesson.day + 1} — it's already ready!
              </div>
              <button className="ts-celebration-btn" onClick={() => setShowCelebration(false)}>
                Keep practising ↓
              </button>
              <button className="ts-celebration-btn-sec" onClick={() => onNavigate('isabela')}>
                Talk to Isabela →
              </button>
            </div>
          )}

          <div className="ts-lesson-card">
            <div className="ts-lesson-eyebrow">
              {allDone ? '✅ Lesson complete!' : `Day ${lesson.day} · Today's lesson`}
            </div>
            <div className="ts-lesson-title">{lesson.themeEmoji} {lesson.theme}</div>
            <div className="ts-lesson-meta">{lesson.totalMinutes} mins · {lesson.xpAvailable} pts available</div>

            <div className="ts-progress-track">
              <div className="ts-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="ts-progress-label">
              {completedCount} of {totalBlocks} blocks complete
              {ptsEarned > 0 && ` · ${ptsEarned} pts earned`}
            </div>

            <div className="ts-blocks">
              {lesson.blocks.map((block, i) => {
                const isDone = completed.includes(block.type);
                const isNext = !isDone && lesson.blocks.slice(0, i).every(b => completed.includes(b.type));
                return (
                  <div key={i} className={`ts-block ${isDone ? 'ts-block-done' : ''} ${isNext ? 'ts-block-active' : ''}`}>
                    <div className="ts-block-icon" style={{ background: BLOCK_COLORS[block.type] }}>
                      {BLOCK_ICONS[block.type]}
                    </div>
                    <div className="ts-block-content">
                      <div className="ts-block-title">{block.title}</div>
                      <div className="ts-block-desc">{block.description}</div>
                      <div className="ts-block-meta">{block.duration} min · {block.xp} pts</div>
                    </div>
                    <div className="ts-block-right">
                      {isDone ? (
                        <div className="ts-block-check">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : isNext ? (
                        <button className="ts-block-btn" onClick={() => handleBlockStart(block)}>Start</button>
                      ) : (
                        <div className="ts-block-dot" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
