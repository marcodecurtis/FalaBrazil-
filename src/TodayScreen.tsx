import { useState, useEffect } from 'react';
import './TodayScreen.css';

interface Props {
  userLevel: string | null;
  onNavigate: (view: string) => void;
  onStartLesson: (block: LessonBlock) => void;
}

export interface LessonBlock {
  type: 'vocabulary' | 'grammar' | 'reading' | 'isabela' | 'exercise' | 'mini_exercise';
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
};

const BLOCK_COLORS: Record<string, string> = {
  vocabulary:    '#dcfce7',
  grammar:       '#e0f2fe',
  reading:       '#f1f5f9',
  isabela:       '#fce7f3',
  exercise:      '#fef3c7',
  mini_exercise: '#fef3c7',
};

const FREE_PRACTICE = [
  { id: 'verbs',         label: 'Verbs',         icon: '📚' },
  { id: 'vocab',         label: 'Vocabulary',     icon: '🗂️' },
  { id: 'grammar',       label: 'Grammar',        icon: '✍️' },
  { id: 'reading',       label: 'Reading',        icon: '📰' },
  { id: 'pronunciation', label: 'Pronunciation',  icon: '🔊' },
  { id: 'video',         label: 'Videos',         icon: '🎬' },
  { id: 'isabela',       label: 'Isabela',        icon: '🎙️' },
];

export default function TodayScreen({ userLevel, onNavigate, onStartLesson }: Props) {
  const [lesson, setLesson]         = useState<Lesson | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [completed, setCompleted]   = useState<string[]>([]);
  const [dayNumber, setDayNumber]   = useState(1);
  const [streak, setStreak]         = useState(0);
  const [totalXp, setTotalXp]       = useState(0);

  const level        = userLevel || 'A1';
  const timePreference = localStorage.getItem('timePreference') || '30';
  const learningGoal   = localStorage.getItem('learningGoal')   || 'conversation';

  useEffect(() => {
    // Load progress from localStorage
    const savedDay       = parseInt(localStorage.getItem('currentDay') || '1');
    const savedStreak    = parseInt(localStorage.getItem('streak') || '0');
    const savedXp        = parseInt(localStorage.getItem('totalXp') || '0');
    const savedCompleted = JSON.parse(localStorage.getItem(`completed_day_${savedDay}`) || '[]');

    setDayNumber(savedDay);
    setStreak(savedStreak);
    setTotalXp(savedXp);
    setCompleted(savedCompleted);

    fetchLesson(savedDay);
  }, [level]);

  const fetchLesson = async (day: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          dayNumber: day,
          timePreference,
          learningGoal,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLesson(data);
    } catch (e) {
      setError('Could not load today\'s lesson. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const markBlockComplete = (blockType: string, xp: number) => {
    const newCompleted = [...completed, blockType];
    setCompleted(newCompleted);
    localStorage.setItem(`completed_day_${dayNumber}`, JSON.stringify(newCompleted));

    const newXp = totalXp + xp;
    setTotalXp(newXp);
    localStorage.setItem('totalXp', newXp.toString());
  };

  const handleBlockStart = (block: LessonBlock) => {
    if (block.type === 'isabela') {
      onNavigate('isabela');
    } else if (block.type === 'reading') {
      onNavigate('reading');
    } else if (block.type === 'grammar') {
      onNavigate('grammar');
    } else if (block.type === 'vocabulary' || block.type === 'mini_exercise') {
      onNavigate('vocab');
    } else if (block.type === 'exercise') {
      onStartLesson(block);
    } else {
      onStartLesson(block);
    }
    markBlockComplete(block.type, block.xp);
  };

  const completedCount  = lesson ? lesson.blocks.filter(b => completed.includes(b.type)).length : 0;
  const totalBlocks     = lesson ? lesson.blocks.length : 0;
  const progressPercent = totalBlocks > 0 ? (completedCount / totalBlocks) * 100 : 0;
  const xpEarned        = lesson ? lesson.blocks.filter(b => completed.includes(b.type)).reduce((sum, b) => sum + b.xp, 0) : 0;
  const allDone         = totalBlocks > 0 && completedCount === totalBlocks;

  const levelProgress: Record<string, number> = {
    A1: 10, A2: 25, B1: 45, B2: 62, C1: 80, C2: 95,
  };
  const nextLevel: Record<string, string> = {
    A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C2', C2: 'C2',
  };

  return (
    <div className="ts-wrapper">

      {/* ── TOP BAR ── */}
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
          <span className="ts-xp-num">{totalXp.toLocaleString()}</span>
          <span className="ts-xp-label">XP</span>
        </div>
      </div>

      {/* ── LEVEL PROGRESS ── */}
      <div className="ts-level-bar">
        <div className="ts-level-row">
          <span className="ts-level-pill">{level}</span>
          <span className="ts-level-next">
            {level !== 'C2' ? `${levelProgress[level] || 0}% to ${nextLevel[level]}` : 'Max level'}
          </span>
        </div>
        <div className="ts-level-track">
          <div className="ts-level-fill" style={{ width: `${levelProgress[level] || 0}%` }} />
        </div>
      </div>

      {/* ── TODAY'S LESSON ── */}
      {loading ? (
        <div className="ts-loading">
          <div className="ts-loading-dots">
            <div className="ts-loading-dot" />
            <div className="ts-loading-dot" />
            <div className="ts-loading-dot" />
          </div>
          <div className="ts-loading-text">Preparing today's lesson...</div>
        </div>
      ) : error ? (
        <div className="ts-error">
          <div className="ts-error-text">{error}</div>
          <button className="ts-retry-btn" onClick={() => fetchLesson(dayNumber)}>Try again</button>
        </div>
      ) : lesson ? (
        <div className="ts-lesson-card">
          <div className="ts-lesson-eyebrow">
            {allDone ? '✅ Lesson complete!' : `Day ${lesson.day} · Today's lesson`}
          </div>
          <div className="ts-lesson-title">
            {lesson.themeEmoji} {lesson.theme}
          </div>
          <div className="ts-lesson-meta">
            {lesson.totalMinutes} mins · {lesson.xpAvailable} XP available
          </div>

          {/* Progress bar */}
          <div className="ts-progress-track">
            <div className="ts-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="ts-progress-label">
            {completedCount} of {totalBlocks} blocks complete
            {xpEarned > 0 && ` · ${xpEarned} XP earned`}
          </div>

          {/* Blocks */}
          <div className="ts-blocks">
            {lesson.blocks.map((block, i) => {
              const isDone    = completed.includes(block.type);
              const isNext    = !isDone && lesson.blocks.slice(0, i).every(b => completed.includes(b.type));
              return (
                <div
                  key={i}
                  className={`ts-block ${isDone ? 'ts-block-done' : ''} ${isNext ? 'ts-block-active' : ''}`}
                >
                  <div className="ts-block-icon" style={{ background: BLOCK_COLORS[block.type] }}>
                    {BLOCK_ICONS[block.type]}
                  </div>
                  <div className="ts-block-content">
                    <div className="ts-block-title">{block.title}</div>
                    <div className="ts-block-desc">{block.description}</div>
                    <div className="ts-block-meta">{block.duration} min · {block.xp} XP</div>
                  </div>
                  <div className="ts-block-right">
                    {isDone ? (
                      <div className="ts-block-check">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ) : isNext ? (
                      <button
                        className="ts-block-btn"
                        onClick={() => handleBlockStart(block)}
                      >
                        Start
                      </button>
                    ) : (
                      <div className="ts-block-dot" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {allDone && (
            <div className="ts-all-done">
              <div className="ts-all-done-title">🎉 Day {lesson.day} complete!</div>
              <div className="ts-all-done-xp">+{xpEarned} XP earned today</div>
            </div>
          )}
        </div>
      ) : null}

      {/* ── FREE PRACTICE ── */}
      <div className="ts-divider">
        <div className="ts-divider-line" />
        <div className="ts-divider-text">free practice</div>
        <div className="ts-divider-line" />
      </div>

      <div className="ts-free-grid">
        {FREE_PRACTICE.map(item => (
          <button
            key={item.id}
            className="ts-free-card"
            onClick={() => onNavigate(item.id)}
          >
            <span className="ts-free-icon">{item.icon}</span>
            <span className="ts-free-label">{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
