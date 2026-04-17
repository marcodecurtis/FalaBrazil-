import { useState } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type Screen = 'pick' | 'quiz' | 'result' | 'time';

interface OnboardingScreenProps {
  onComplete: (level: Level) => void;
}

const LEVELS = [
  { level: 'A1' as Level, labelEn: 'Beginner',          emoji: '🌱', descEn: 'I know a few basic words and phrases' },
  { level: 'A2' as Level, labelEn: 'Elementary',        emoji: '🌿', descEn: 'I can handle simple everyday conversations' },
  { level: 'B1' as Level, labelEn: 'Intermediate',      emoji: '🍃', descEn: 'I understand most topics and express opinions' },
  { level: 'B2' as Level, labelEn: 'Upper Intermediate', emoji: '🌳', descEn: 'I speak fluently in varied situations' },
  { level: 'C1' as Level, labelEn: 'Advanced',          emoji: '🌴', descEn: 'I express myself spontaneously and precisely' },
  { level: 'C2' as Level, labelEn: 'Proficient',        emoji: '👑', descEn: 'I speak at native level, effortlessly' },
];

interface Question {
  q: string;
  opts: string[];
  ans: number;
  phase: 1 | 2 | 3;
  phaseLabel: string;
}

const QUESTIONS: Question[] = [
  { phase: 1, phaseLabel: 'A1 · A2', q: 'Como se diz "hello" em português?', opts: ['Obrigado', 'Tchau', 'Olá', 'Por favor'], ans: 2 },
  { phase: 1, phaseLabel: 'A1 · A2', q: 'Complete: "Eu ___ brasileiro."', opts: ['és', 'é', 'sou', 'são'], ans: 2 },
  { phase: 1, phaseLabel: 'A1 · A2', q: 'O que significa "Como vai você?"', opts: ['Onde moras?', 'Como te chamas?', 'Para onde vais?', 'Como estás?'], ans: 3 },
  { phase: 1, phaseLabel: 'A1 · A2', q: 'Qual é o plural de "livro"?', opts: ['livroes', 'livras', 'livres', 'livros'], ans: 3 },
  { phase: 1, phaseLabel: 'A1 · A2', q: 'Complete: "Ela ___ no banco." (trabalhar)', opts: ['trabalham', 'trabalho', 'trabalhamos', 'trabalha'], ans: 3 },
  { phase: 1, phaseLabel: 'A1 · A2', q: 'O que significa "ontem"?', opts: ['hoje', 'amanhã', 'agora', 'o dia antes de hoje'], ans: 3 },
  { phase: 1, phaseLabel: 'A1 · A2', q: 'Escolhe o artigo correto: "___ casa é bonita."', opts: ['O', 'Os', 'As', 'A'], ans: 3 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Pretérito perfeito: "Eu ___ ao mercado ontem."', opts: ['vou', 'ia', 'irei', 'fui'], ans: 3 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Qual frase usa o subjuntivo corretamente?', opts: ['Espero que ele vem', 'Espero que ele vinha', 'Espero que ele veio', 'Espero que ele venha'], ans: 3 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Complete: "Se eu ___ rico, viajaria pelo mundo."', opts: ['sou', 'seria', 'estava', 'fosse'], ans: 3 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Qual é a voz passiva correta?', opts: ['O bolo comeu pelos convidados', 'O bolo foi comido pelos convidados', 'O bolo tem comido pelos convidados', 'O bolo ia comer pelos convidados'], ans: 1 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'O que significa "aliás"?', opts: ['embora', 'portanto', 'além disso', 'a menos que'], ans: 2 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Complete (discurso indireto): "Ela disse que ___ cansada."', opts: ['está', 'esteve', 'estará', 'estava'], ans: 3 },
  { phase: 2, phaseLabel: 'B1 · B2', q: '"___ a chuva, o jogo continuou." Qual conjunção é correta?', opts: ['Por causa de', 'Desde que', 'Apesar de', 'A fim de'], ans: 2 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Complete: "Preciso que você me ___." (ajudar)', opts: ['ajuda', 'ajudará', 'ajudava', 'ajude'], ans: 3 },
  { phase: 2, phaseLabel: 'B1 · B2', q: 'Qual frase usa "ser" e "estar" corretamente?', opts: ['Ela é cansada hoje', 'O café está quente agora', 'A casa está bonita no campo', 'Ele é doente às vezes'], ans: 1 },
  { phase: 2, phaseLabel: 'B1 · B2', q: '"Embora estivesse cansado, ele ___ trabalhar." Qual forma é correta?', opts: ['continuou a', 'continuava a', 'tinha continuado a', 'continue a'], ans: 0 },
  { phase: 3, phaseLabel: 'C1 · C2', q: 'Qual é a diferença principal entre "por" e "para"?', opts: ['"Por" indica duração; "para" indica frequência', '"Por" indica causa/motivo; "para" indica finalidade/destino', '"Para" é mais formal que "por"', 'São completamente intercambiáveis'], ans: 1 },
  { phase: 3, phaseLabel: 'C1 · C2', q: 'Qual frase usa o "futuro do pretérito" corretamente?', opts: ['Eu comerei amanhã', 'Ela comeria se pudesse', 'Nós comeremos logo', 'Eles comiam ontem'], ans: 1 },
  { phase: 3, phaseLabel: 'C1 · C2', q: 'Qual frase usa "cujo" corretamente?', opts: ['O professor cujo aluno ganhou o prémio está feliz', 'O professor que aluno ganhou o prémio', 'O professor o qual aluno ganhou', 'O professor quem aluno ganhou'], ans: 0 },
  { phase: 3, phaseLabel: 'C1 · C2', q: 'O que significa "outrossim" em linguagem formal?', opts: ['pelo contrário', 'entretanto', 'além disso / também', 'em suma'], ans: 2 },
];

function getLevel(score: number): Level {
  if (score <= 4)  return 'A1';
  if (score <= 7)  return 'A2';
  if (score <= 11) return 'B1';
  if (score <= 15) return 'B2';
  if (score <= 18) return 'C1';
  return 'C2';
}

const RESULT_MESSAGES: Record<Level, string> = {
  A1: "You're taking your first steps. Everything is ahead of you — a great place to start.",
  A2: "You already have a foundation. With consistent practice, B1 is closer than you think.",
  B1: "You can communicate in Portuguese. From here, fluency is just around the corner.",
  B2: "You have real fluency. The fine details are exactly what we'll work on together.",
  C1: "You master Portuguese with confidence. Just the final polish left.",
  C2: "Native level. Your Portuguese is a work of art.",
};

const TIME_OPTIONS = [
  { value: '5',  label: '5 min',  sublabel: 'Quick daily habit', emoji: '⚡' },
  { value: '15', label: '15 min', sublabel: 'Steady progress',   emoji: '🌿', recommended: true },
  { value: '30', label: '30 min', sublabel: 'Full immersion',    emoji: '🏆' },
];

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    background: '#f7f5f0',
    display: 'flex',
    flexDirection: 'column',
    padding: '52px 24px 48px',
    maxWidth: '420px',
    margin: '0 auto',
    fontFamily: "'Figtree', -apple-system, sans-serif",
  },
  flag: { fontSize: 28, marginBottom: 20, display: 'block' },
  h1: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 38,
    fontWeight: 300,
    lineHeight: 1.1,
    color: '#1a3a2a',
    letterSpacing: '-0.02em',
    marginBottom: 10,
  },
  em: { fontStyle: 'italic', color: '#4a8c5c' },
  subtitle: { fontSize: 13, color: '#7a9882', fontWeight: 300, marginBottom: 36 },

  // Level cards
  levelsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  levelCard: {
    background: 'white',
    border: '1.5px solid transparent',
    borderRadius: 16,
    padding: '16px 18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: '#eaf4ec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    flexDirection: 'column' as const,
    gap: 1,
  },
  badgeCode: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 15,
    fontWeight: 500,
    color: '#1a3a2a',
    lineHeight: 1,
  },
  badgeEmoji: { fontSize: 11, lineHeight: 1 },
  cardText: { flex: 1 },
  levelName: { fontSize: 14, fontWeight: 500, color: '#1a3a2a', marginBottom: 2 },
  levelDesc: { fontSize: 12, color: '#7a9882', fontWeight: 300 },
  arrow: { color: '#c5dfc9', fontSize: 16, flexShrink: 0 },

  // Divider
  divider: { display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0' },
  dividerLine: { flex: 1, height: 1, background: '#d4ead9' },
  dividerText: { fontSize: 11, color: '#7a9882', letterSpacing: '0.05em' },

  // Test card
  testCard: {
    background: '#1a3a2a',
    borderRadius: 16,
    padding: '16px 18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    border: 'none',
    width: '100%',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  testIcon: {
    width: 44, height: 44,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, flexShrink: 0,
  },
  testTitle: { fontSize: 14, fontWeight: 500, color: 'white', marginBottom: 1 },
  testSub: { fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 300 },
  testArrow: { color: 'rgba(255,255,255,0.3)', fontSize: 16, marginLeft: 'auto' },

  // Quiz
  quizHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 13, color: '#7a9882', display: 'flex', alignItems: 'center', gap: 6, padding: 0,
  },
  qCounter: { fontSize: 12, color: '#7a9882', fontFamily: 'monospace' },
  progressTrack: { height: 3, background: '#d4ead9', borderRadius: 100, marginBottom: 28, overflow: 'hidden' },
  progressBar: { height: '100%', background: '#4a8c5c', borderRadius: 100, transition: 'width 0.4s ease' },
  phaseBadge: {
    fontSize: 11, color: '#4a8c5c', fontWeight: 500,
    letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 16,
  },
  questionCard: { flex: 1 },
  questionText: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 22, fontWeight: 300, color: '#1a3a2a',
    lineHeight: 1.35, marginBottom: 24, letterSpacing: '-0.01em',
  },
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  option: {
    background: 'white', border: '1.5px solid #e8f0ea',
    borderRadius: 12, padding: '13px 16px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
    transition: 'all 0.15s ease', textAlign: 'left', width: '100%',
  },
  optLetter: {
    width: 26, height: 26, borderRadius: 8,
    background: '#eaf4ec', color: '#4a8c5c',
    fontSize: 12, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optText: { fontSize: 14, color: '#1a3a2a', fontWeight: 300 },
  feedback: {
    marginTop: 16, padding: '12px 16px',
    borderRadius: 10, fontSize: 13, fontWeight: 500,
  },
  feedbackGood: { background: '#eaf4ec', color: '#2d5a3d' },
  feedbackBad: { background: '#fff1f0', color: '#c0392b' },
  nextBtn: {
    marginTop: 20, width: '100%', padding: '15px',
    background: '#1a3a2a', border: 'none', borderRadius: 12,
    color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer',
    fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em',
    transition: 'all 0.2s ease',
  },

  // Result
  resultCard: {
    borderRadius: 20, padding: '32px 24px', textAlign: 'center',
    marginBottom: 24,
  },
  resultEmoji: { fontSize: 40, marginBottom: 12 },
  resultCode: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: 52, fontWeight: 300, lineHeight: 1,
    color: '#1a3a2a', marginBottom: 4,
  },
  resultLabel: { fontSize: 16, color: '#2d5a3d', marginBottom: 8, fontWeight: 500 },
  resultScore: { fontSize: 13, color: '#7a9882' },
  resultMessage: {
    fontSize: 15, color: '#2d5a3d', lineHeight: 1.6,
    textAlign: 'center', marginBottom: 28,
    fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300,
  },

  // Shared buttons
  confirmBtn: {
    width: '100%', padding: '15px',
    background: '#1a3a2a', border: 'none', borderRadius: 12,
    color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer',
    fontFamily: "'Fraunces', Georgia, serif", letterSpacing: '-0.01em',
    marginBottom: 10, transition: 'all 0.2s ease',
  },
  changeBtn: {
    width: '100%', padding: '13px',
    background: 'none', border: '1.5px solid #d4ead9', borderRadius: 12,
    color: '#7a9882', fontSize: 13, cursor: 'pointer',
    fontFamily: "'Figtree', sans-serif", transition: 'all 0.2s ease',
  },

  // Time
  timeGrid: { display: 'flex', gap: 10, marginBottom: 8 },
  timeCard: {
    flex: 1, background: 'white', border: '1.5px solid transparent',
    borderRadius: 14, padding: '18px 10px', cursor: 'pointer',
    textAlign: 'center', transition: 'all 0.2s ease', position: 'relative' as const,
  },
  timeEmoji: { fontSize: 22, display: 'block', marginBottom: 8 },
  timeLabel: { fontSize: 16, fontWeight: 600, color: '#1a3a2a', marginBottom: 2 },
  timeSub: { fontSize: 11, color: '#7a9882', fontWeight: 300 },
  recommendedBadge: {
    position: 'absolute' as const, top: -8, left: '50%',
    transform: 'translateX(-50%)',
    background: '#4a8c5c', color: 'white',
    fontSize: 9, fontWeight: 600, padding: '2px 8px',
    borderRadius: 100, letterSpacing: '0.05em', whiteSpace: 'nowrap' as const,
  },
};

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [screen, setScreen] = useState<Screen>('pick');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [resultLevel, setResultLevel] = useState<Level | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('15');
  const [animating, setAnimating] = useState(false);

  const currentAnswer = answers[currentQ];
  const hasAnswered = currentAnswer !== null;
  const progress = ((currentQ + (hasAnswered ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleAnswer = (idx: number) => {
    if (hasAnswered) return;
    const next = [...answers];
    next[currentQ] = idx;
    setAnswers(next);
  };

  const handleNext = () => {
    if (animating) return;
    if (currentQ + 1 >= QUESTIONS.length) {
      const score = answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].ans ? 1 : 0), 0);
      setResultLevel(getLevel(score));
      setScreen('result');
    } else {
      setAnimating(true);
      setTimeout(() => { setCurrentQ(q => q + 1); setAnimating(false); }, 200);
    }
  };

  const handleLevelChosen = (level: Level) => {
    setSelectedLevel(level);
    localStorage.setItem('userLevel', level);
    logEvent(analytics, 'level_selected', { level, method: screen === 'result' ? 'placement_test' : 'manual_pick' });
    setScreen('time');
  };

  const handleTimeChosen = () => {
    localStorage.setItem('timePreference', selectedTime);
    localStorage.setItem('learningGoal', 'conversation');
    logEvent(analytics, 'onboarding_complete', { level: selectedLevel, time_preference: selectedTime });
    onComplete(selectedLevel!);
  };

  // ── LEVEL PICKER ──────────────────────────────────────────────
  if (screen === 'pick') {
    return (
      <div style={styles.wrapper}>
        <span style={styles.flag}>🇧🇷</span>
        <h1 style={styles.h1}>
          What's your<br />
          <em style={styles.em}>Portuguese level?</em>
        </h1>
        <p style={styles.subtitle}>Pick the one that feels right</p>

        <div style={styles.levelsList}>
          {LEVELS.map(({ level, labelEn, emoji, descEn }) => (
            <button
              key={level}
              style={styles.levelCard}
              onClick={() => handleLevelChosen(level)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#d4ead9';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(26,58,42,0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <div style={styles.badge}>
                <span style={styles.badgeCode}>{level}</span>
                <span style={styles.badgeEmoji}>{emoji}</span>
              </div>
              <div style={styles.cardText}>
                <div style={styles.levelName}>{labelEn}</div>
                <div style={styles.levelDesc}>{descEn}</div>
              </div>
              <span style={styles.arrow}>→</span>
            </button>
          ))}

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <button
            style={styles.testCard}
            onClick={() => setScreen('quiz')}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#2d5a3d'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#1a3a2a'}
          >
            <div style={styles.testIcon}>✦</div>
            <div>
              <div style={styles.testTitle}>Discover your level</div>
              <div style={styles.testSub}>20-question test · 3 minutes</div>
            </div>
            <span style={styles.testArrow}>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ ──────────────────────────────────────────────────────
  if (screen === 'quiz') {
    const q = QUESTIONS[currentQ];
    return (
      <div style={{ ...styles.wrapper, paddingTop: 36 }}>
        <div style={styles.quizHeader}>
          <button
            style={styles.backBtn}
            onClick={() => { setScreen('pick'); setCurrentQ(0); setAnswers(Array(QUESTIONS.length).fill(null)); }}
          >
            ← Back
          </button>
          <span style={styles.qCounter}>{currentQ + 1} / {QUESTIONS.length}</span>
        </div>

        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>

        <div style={styles.phaseBadge}>{q.phaseLabel}</div>

        <div style={{ ...styles.questionCard, opacity: animating ? 0 : 1, transition: 'opacity 0.2s' }}>
          <p style={styles.questionText}>{q.q}</p>

          <div style={styles.options}>
            {q.opts.map((opt, i) => {
              let borderColor = '#e8f0ea';
              let bg = 'white';
              let opacity = 1;
              if (hasAnswered) {
                if (i === q.ans) { borderColor = '#4a8c5c'; bg = '#eaf4ec'; }
                else if (i === currentAnswer) { borderColor = '#f87171'; bg = '#fff1f0'; }
                else { opacity = 0.4; }
              }
              return (
                <button
                  key={i}
                  style={{ ...styles.option, borderColor, background: bg, opacity }}
                  onClick={() => handleAnswer(i)}
                  disabled={hasAnswered && i !== q.ans && i !== currentAnswer}
                >
                  <span style={{
                    ...styles.optLetter,
                    background: hasAnswered && i === q.ans ? '#4a8c5c' : hasAnswered && i === currentAnswer ? '#f87171' : '#eaf4ec',
                    color: hasAnswered && (i === q.ans || i === currentAnswer) ? 'white' : '#4a8c5c',
                  }}>
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span style={styles.optText}>{opt}</span>
                  {hasAnswered && i === q.ans && <span style={{ marginLeft: 'auto', color: '#4a8c5c' }}>✓</span>}
                  {hasAnswered && i === currentAnswer && i !== q.ans && <span style={{ marginLeft: 'auto', color: '#f87171' }}>✗</span>}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div style={{
              ...styles.feedback,
              ...(currentAnswer === q.ans ? styles.feedbackGood : styles.feedbackBad),
            }}>
              {currentAnswer === q.ans
                ? '✓ Correct!'
                : `Correct answer: ${q.opts[q.ans]}`}
            </div>
          )}
        </div>

        {hasAnswered && (
          <button style={styles.nextBtn} onClick={handleNext}>
            {currentQ + 1 === QUESTIONS.length ? 'See my result →' : 'Next →'}
          </button>
        )}
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────
  if (screen === 'result' && resultLevel) {
    const levelInfo = LEVELS.find(l => l.level === resultLevel)!;
    const score = answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].ans ? 1 : 0), 0);
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.resultCard, background: 'linear-gradient(135deg, #eaf4ec, #d4ead9)' }}>
          <div style={styles.resultEmoji}>{levelInfo.emoji}</div>
          <div style={styles.resultCode}>{resultLevel}</div>
          <div style={styles.resultLabel}>{levelInfo.labelEn}</div>
          <div style={styles.resultScore}>{score} / {QUESTIONS.length} correct</div>
        </div>

        <p style={styles.resultMessage}>{RESULT_MESSAGES[resultLevel]}</p>

        <button style={styles.confirmBtn} onClick={() => handleLevelChosen(resultLevel)}>
          Start with {resultLevel} →
        </button>
        <button style={styles.changeBtn} onClick={() => setScreen('pick')}>
          Choose a different level
        </button>
      </div>
    );
  }

  // ── TIME PREFERENCE ───────────────────────────────────────────
  if (screen === 'time') {
    return (
      <div style={styles.wrapper}>
        <span style={styles.flag}>🇧🇷</span>
        <h1 style={styles.h1}>
          How much time<br />
          <em style={styles.em}>per session?</em>
        </h1>
        <p style={{ ...styles.subtitle, marginBottom: 32 }}>
          We'll shape your lessons around this
        </p>

        <div style={styles.timeGrid}>
          {TIME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              style={{
                ...styles.timeCard,
                borderColor: selectedTime === opt.value ? '#4a8c5c' : 'transparent',
                background: selectedTime === opt.value ? '#eaf4ec' : 'white',
              }}
              onClick={() => setSelectedTime(opt.value)}
            >
              {opt.recommended && <div style={styles.recommendedBadge}>RECOMMENDED</div>}
              <span style={styles.timeEmoji}>{opt.emoji}</span>
              <div style={styles.timeLabel}>{opt.label}</div>
              <div style={styles.timeSub}>{opt.sublabel}</div>
            </button>
          ))}
        </div>

        <button style={{ ...styles.confirmBtn, marginTop: 24 }} onClick={handleTimeChosen}>
          Continue →
        </button>
        <button style={styles.changeBtn} onClick={() => setScreen('pick')}>
          ← Back
        </button>
      </div>
    );
  }

  return null;
}
