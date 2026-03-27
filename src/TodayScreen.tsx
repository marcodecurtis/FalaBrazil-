import { useState, useEffect, useRef } from 'react';
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

const LESSONS_PER_LEVEL: Record<string, number> = {
  '5':  100,
  '15': 60,
  '30': 30,
};

const NEXT_LEVEL: Record<string, string> = {
  A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C2', C2: 'C2',
};

// ── Quotes per level ──────────────────────────────────────────────
// Simple and encouraging for beginners, richer and more literary for advanced
const QUOTES_BY_LEVEL: Record<string, { pt: string; en: string; source: string }[]> = {
  A1: [
    { pt: "Devagar se vai ao longe.", en: "Slowly but surely you go far.", source: "Brazilian proverb" },
    { pt: "Cada dia é uma nova chance.", en: "Every day is a new chance.", source: "Brazilian saying" },
    { pt: "Quem tenta, aprende.", en: "Those who try, learn.", source: "Brazilian proverb" },
    { pt: "Um passo de cada vez.", en: "One step at a time.", source: "Brazilian saying" },
    { pt: "A prática leva à perfeição.", en: "Practice makes perfect.", source: "Brazilian proverb" },
  ],
  A2: [
    { pt: "Água mole em pedra dura tanto bate até que fura.", en: "Constant dripping wears away the stone.", source: "Brazilian proverb" },
    { pt: "Quem não arrisca, não petisca.", en: "Nothing ventured, nothing gained.", source: "Brazilian proverb" },
    { pt: "O segredo é não correr.", en: "The secret is not to rush.", source: "Brazilian saying" },
    { pt: "Depois da tempestade, vem a bonança.", en: "After the storm comes the calm.", source: "Brazilian proverb" },
    { pt: "Ninguém nasce sabendo.", en: "Nobody is born knowing everything.", source: "Brazilian saying" },
  ],
  B1: [
    { pt: "A língua é a alma de um povo.", en: "Language is the soul of a people.", source: "Brazilian saying" },
    { pt: "Cada cabeça, uma sentença.", en: "Every mind has its own story.", source: "Brazilian proverb" },
    { pt: "O mundo é dos corajosos.", en: "The world belongs to the brave.", source: "Brazilian saying" },
    { pt: "Com paciência e perseverança, tudo se alcança.", en: "With patience and perseverance, everything is achievable.", source: "Brazilian proverb" },
    { pt: "Quem fala uma língua, vive uma vida. Quem fala duas, vive duas.", en: "Who speaks one language lives one life. Who speaks two, lives two.", source: "Brazilian saying" },
  ],
  B2: [
    { pt: "É preciso sonhar, mas com a condição de crer em nosso sonho.", en: "One must dream, but with the belief in one's dream.", source: "Clarice Lispector" },
    { pt: "Sou feita de retalhos. Pedacinhos coloridos de cada vida que passa pela minha.", en: "I am made of scraps. Small colourful pieces of each life that passes through mine.", source: "Cora Coralina" },
    { pt: "A coragem é a única virtude que torna todas as outras virtudes possíveis.", en: "Courage is the only virtue that makes all other virtues possible.", source: "Paulo Coelho" },
    { pt: "Existir é tão surpreendente que engole qualquer outro espanto.", en: "To exist is so surprising that it swallows any other astonishment.", source: "Clarice Lispector" },
    { pt: "Não existe distância demasiada para quem ama.", en: "There is no distance too great for those who love.", source: "Paulo Coelho" },
  ],
  C1: [
    { pt: "A vida é a arte do encontro, embora haja tanto desencontro pela vida.", en: "Life is the art of encounter, although there is so much missed connection throughout life.", source: "Vinícius de Moraes" },
    { pt: "Escrever é uma forma de não morrer.", en: "Writing is a way of not dying.", source: "Clarice Lispector" },
    { pt: "O tempo não para. E nós, enquanto ele não para, também não devemos parar.", en: "Time does not stop. And we, while it does not stop, must not stop either.", source: "Caetano Veloso" },
    { pt: "Não sou nada. Nunca serei nada. Não posso querer ser nada. À parte isso, tenho em mim todos os sonhos do mundo.", en: "I am nothing. I shall never be anything. I cannot wish to be anything. Aside from that, I have in me all the dreams of the world.", source: "Fernando Pessoa" },
    { pt: "Cada homem é uma raça.", en: "Each man is a race unto himself.", source: "João Guimarães Rosa" },
  ],
  C2: [
    { pt: "No meio do caminho tinha uma pedra / tinha uma pedra no meio do caminho.", en: "In the middle of the road there was a stone / there was a stone in the middle of the road.", source: "Carlos Drummond de Andrade" },
    { pt: "O amor é eterno enquanto dura.", en: "Love is eternal for as long as it lasts.", source: "Vinicius de Moraes" },
    { pt: "Tão bem. Tão bem. Tão longe da mim mesma.", en: "So well. So well. So far away from myself.", source: "Clarice Lispector" },
    { pt: "Sertão é o penal, o criminal. Mas sertão é o deleite, a exaltação do ser.", en: "The sertão is the penal, the criminal. But the sertão is delight, the exaltation of being.", source: "João Guimarães Rosa" },
    { pt: "A memória é o único paraíso do qual não podemos ser expulsos.", en: "Memory is the only paradise from which we cannot be expelled.", source: "Jean Paul Richter, beloved in Brazil" },
  ],
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
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedToday, setCompletedToday] = useState<string[]>([]);

  const level          = userLevel || 'A1';
  const timePreference = localStorage.getItem('timePreference') || '30';
  const learningGoal   = localStorage.getItem('learningGoal')   || 'conversation';
  const lessonsNeeded  = LESSONS_PER_LEVEL[timePreference] || 30;
  const levelProgress  = Math.min(100, Math.round((lessonsCompleted / lessonsNeeded) * 100));
  const nextLevel      = NEXT_LEVEL[level];

  // Pick 3 quotes for the loading state — rotate every 6 seconds
  const [quotes] = useState(() => {
    const allQuotes = QUOTES_BY_LEVEL[level] || QUOTES_BY_LEVEL['B1'];
    const shuffled = [...allQuotes].sort(() => Math.random() - 0.5);
    // Pick 3 distinct quotes
    return [shuffled[0], shuffled[1 % shuffled.length], shuffled[2 % shuffled.length]];
  });
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);
  const quoteTimerRef = useRef<number | null>(null);

  // Rotate quotes every 6 seconds during loading
  useEffect(() => {
    if (!loading) {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
      return;
    }
    quoteTimerRef.current = window.setInterval(() => {
      setQuoteFading(true);
      setTimeout(() => {
        setQuoteIndex(i => (i + 1) % 3);
        setQuoteFading(false);
      }, 400);
    }, 6000);
    return () => {
      if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);
    };
  }, [loading]);

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
      const today = new Date().toISOString().split('T')[0];
      let currentStreak = savedStreak;
      if (lastLessonDate && lastLessonDate !== today) {
        const lastDate = new Date(lastLessonDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 1) currentStreak = 0;
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
          if (daysDiff > 1) currentStreak = 0;
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
        const updateData: any = { lessonsCompleted: newLessons, totalPts: newPts };
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
      if (!lastLessonDate || lastLessonDate === today) {
        newStreak = lastLessonDate === today ? streak : streak + 1;
      } else {
        const lastDate = new Date(lastLessonDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        newStreak = daysDiff === 1 ? streak + 1 : 1;
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

  const handleLessonStart = (lesson: Lesson, isRequired: boolean, blockIndex = 0) => {
    setActiveLesson(lesson);
    setActiveLessonIsRequired(isRequired);
    setActiveBlockIndex(blockIndex);
  };

  const handleLessonBack = () => {
    setActiveLesson(null);
    setActiveLessonIsRequired(false);
  };

  if (activeLesson) {
    const currentBlock = activeLesson.blocks[activeBlockIndex];
    const isLastBlock = activeBlockIndex >= activeLesson.blocks.length - 1;
    const totalBlocks = activeLesson.blocks.length;

    return (
      <LessonPlayer
        block={currentBlock}
        onPass={async () => {
          if (isLastBlock) {
            // All blocks done — complete the lesson
            await handleLessonComplete(activeLesson, activeLesson.xpAvailable, activeLessonIsRequired);
          } else {
            // Move to next block
            setActiveBlockIndex(i => i + 1);
          }
        }}
        onBack={() => {
          if (activeBlockIndex > 0) {
            // Go back to previous block — keeps progress
            setActiveBlockIndex(i => i - 1);
          } else {
            // First block — exit lesson
            handleLessonBack();
          }
        }}
        blockIndex={activeBlockIndex}
        totalBlocks={totalBlocks}
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
        <div className="ts-loading-card">
          <div className="ts-loading-brain">🧠</div>
          <div className="ts-loading-title">Building your personalised plan</div>
          <div className="ts-loading-subtitle">
            Analysing your {level} level and learning goals.<br />
            This takes a few seconds — worth the wait.
          </div>
          <div className="ts-loading-dots">
            <div className="ts-loading-dot" />
            <div className="ts-loading-dot" />
            <div className="ts-loading-dot" />
          </div>
          <div className="ts-quote-box" style={{ opacity: quoteFading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
            <div className="ts-quote-label">Quote {quoteIndex + 1} of 3</div>
            <div className="ts-quote-pt">"{quotes[quoteIndex].pt}"</div>
            <div className="ts-quote-en">"{quotes[quoteIndex].en}" — {quotes[quoteIndex].source}</div>
          </div>

          {/* Ghost cards while loading */}
          <div className="ts-ghost-card">
            <div className="ts-skeleton" style={{ height: '12px', width: '110px', marginBottom: '10px' }} />
            <div className="ts-skeleton" style={{ height: '18px', width: '200px', marginBottom: '8px' }} />
            <div className="ts-skeleton" style={{ height: '11px', width: '70px', marginBottom: '14px' }} />
            <div className="ts-skeleton" style={{ height: '42px', borderRadius: '10px' }} />
          </div>
          <div className="ts-ghost-card" style={{ opacity: 0.3 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="ts-skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="ts-skeleton" style={{ height: '13px', width: '130px', marginBottom: '6px' }} />
                <div className="ts-skeleton" style={{ height: '11px', width: '75px' }} />
              </div>
            </div>
          </div>
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
              <div className="ts-celebration-title">Today's lesson done!</div>
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
              {requiredDone ? '✅ Today\'s lesson done!' : '📌 Today\'s lesson'}
            </div>
            <div className="ts-lesson-title">{dailyContent.requiredLesson.themeEmoji} {dailyContent.requiredLesson.title}</div>
            <div className="ts-lesson-meta">{dailyContent.requiredLesson.totalMinutes} mins · {dailyContent.requiredLesson.xpAvailable} pts</div>

            {!requiredDone ? (
              <button
                className="ts-block-btn"
                onClick={() => handleLessonStart(dailyContent.requiredLesson, true)}
                style={{ width: '100%', marginTop: '16px', padding: '12px' }}
              >
                Start Today's Lesson →
              </button>
            ) : (
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', color: '#14532d', fontWeight: 700, textAlign: 'center', marginTop: '16px' }}>
                ✓ Completed — Streak unlocked!
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



    </div>
  );
}
