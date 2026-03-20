import { useState } from 'react';
import './OnboardingScreen.css';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type Screen = 'pick' | 'quiz' | 'result';

interface OnboardingScreenProps {
  onComplete: (level: Level) => void;
}

const LEVELS: { level: Level; label: string; emoji: string; desc: string; color: string; bg: string }[] = [
  { level: 'A1', label: 'Iniciante',        emoji: '🌱', desc: 'Conheço palavras básicas como "olá", números e cores.',             color: '#166534', bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
  { level: 'A2', label: 'Elementar',        emoji: '🌿', desc: 'Consigo apresentar-me e falar sobre coisas simples do dia-a-dia.',  color: '#15803d', bg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' },
  { level: 'B1', label: 'Intermédio',       emoji: '🌳', desc: 'Entendo conversas sobre temas comuns e expresso opiniões básicas.', color: '#16a34a', bg: 'linear-gradient(135deg, #bbf7d0, #86efac)' },
  { level: 'B2', label: 'Intermédio Alto',  emoji: '🎋', desc: 'Comunico com fluência em situações variadas e leio textos elaborados.', color: '#14532d', bg: 'linear-gradient(135deg, #86efac, #4ade80)' },
  { level: 'C1', label: 'Avançado',         emoji: '🌴', desc: 'Expresso-me com espontaneidade e domino estruturas complexas.',    color: '#052e16', bg: 'linear-gradient(135deg, #4ade80, #22c55e)' },
  { level: 'C2', label: 'Proficiente',      emoji: '👑', desc: 'Domino o português ao nível de um nativo. Sem esforço.',            color: '#fff',    bg: 'linear-gradient(135deg, #14532d, #052e16)' },
];

interface Question {
  q: string;
  opts: string[];
  ans: number;
  phase: 1 | 2 | 3;
  phaseLabel: string;
}

const QUESTIONS: Question[] = [
  // ── Phase 1: A1 / A2 ──────────────────────────────────────────────
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'Como se diz "hello" em português?',                                         opts: ['Obrigado', 'Tchau', 'Olá', 'Por favor'],                                                                             ans: 2 },
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'Complete: "Eu ___ brasileiro."',                                            opts: ['és', 'é', 'sou', 'são'],                                                                                             ans: 2 },
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'O que significa "Como vai você?"',                                          opts: ['Onde moras?', 'Como te chamas?', 'Para onde vais?', 'Como estás?'],                                                  ans: 3 },
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'Qual é o plural de "livro"?',                                               opts: ['livroes', 'livras', 'livres', 'livros'],                                                                              ans: 3 },
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'Complete: "Ela ___ no banco." (trabalhar)',                                  opts: ['trabalham', 'trabalho', 'trabalhamos', 'trabalha'],                                                                   ans: 3 },
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'O que significa "ontem"?',                                                  opts: ['hoje', 'amanhã', 'agora', 'o dia antes de hoje'],                                                                     ans: 3 },
  { phase: 1, phaseLabel: 'Nível A1 · A2', q: 'Escolhe o artigo correto: "___ casa é bonita."',                            opts: ['O', 'Os', 'As', 'A'],                                                                                                ans: 3 },
  // ── Phase 2: B1 / B2 ──────────────────────────────────────────────
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Pretérito perfeito: "Eu ___ ao mercado ontem."',                            opts: ['vou', 'ia', 'irei', 'fui'],                                                                                          ans: 3 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Qual frase usa o subjuntivo corretamente?',                                 opts: ['Espero que ele vem', 'Espero que ele vinha', 'Espero que ele veio', 'Espero que ele venha'],                          ans: 3 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Complete: "Se eu ___ rico, viajaria pelo mundo."',                          opts: ['sou', 'seria', 'estava', 'fosse'],                                                                                    ans: 3 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Qual é a voz passiva correta?',                                             opts: ['O bolo comeu pelos convidados', 'O bolo foi comido pelos convidados', 'O bolo tem comido pelos convidados', 'O bolo ia comer pelos convidados'], ans: 1 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'O que significa "aliás"?',                                                  opts: ['embora', 'portanto', 'além disso', 'a menos que'],                                                                    ans: 2 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Complete (discurso indireto): "Ela disse que ___ cansada."',                opts: ['está', 'esteve', 'estará', 'estava'],                                                                                 ans: 3 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: '"___ a chuva, o jogo continuou." Qual conjunção é correta?',                opts: ['Por causa de', 'Desde que', 'Apesar de', 'A fim de'],                                                                 ans: 2 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Complete: "Preciso que você me ___." (ajudar)',                             opts: ['ajuda', 'ajudará', 'ajudava', 'ajude'],                                                                               ans: 3 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: 'Qual frase usa "ser" e "estar" corretamente?',                              opts: ['Ela é cansada hoje', 'O café está quente agora', 'A casa está bonita no campo', 'Ele é doente às vezes'],              ans: 1 },
  { phase: 2, phaseLabel: 'Nível B1 · B2', q: '"Embora estivesse cansado, ele ___ trabalhar." Qual forma é correta?',     opts: ['continuou a', 'continuava a', 'tinha continuado a', 'continue a'],                                                     ans: 0 },
  // ── Phase 3: C1 / C2 ──────────────────────────────────────────────
  { phase: 3, phaseLabel: 'Nível C1 · C2', q: 'Qual é a diferença principal entre "por" e "para"?',                       opts: ['"Por" indica duração; "para" indica frequência', '"Por" indica causa/motivo; "para" indica finalidade/destino', '"Para" é mais formal que "por"', 'São completamente intercambiáveis'], ans: 1 },
  { phase: 3, phaseLabel: 'Nível C1 · C2', q: 'Qual frase usa o "futuro do pretérito" corretamente?',                      opts: ['Eu comerei amanhã', 'Ela comeria se pudesse', 'Nós comeremos logo', 'Eles comiam ontem'],                              ans: 1 },
  { phase: 3, phaseLabel: 'Nível C1 · C2', q: 'Qual frase usa "cujo" corretamente?',                                       opts: ['O professor cujo aluno ganhou o prémio está feliz', 'O professor que aluno ganhou o prémio', 'O professor o qual aluno ganhou', 'O professor quem aluno ganhou'], ans: 0 },
  { phase: 3, phaseLabel: 'Nível C1 · C2', q: 'O que significa "outrossim" em linguagem formal?',                          opts: ['pelo contrário', 'entretanto', 'além disso / também', 'em suma'],                                                      ans: 2 },
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
  A1: 'Estás a dar os primeiros passos. Tens tudo à tua frente — e é uma boa posição para começar.',
  A2: 'Já tens uma base. Com prática consistente, chegas ao B1 mais depressa do que pensas.',
  B1: 'Já consegues comunicar em português. A partir daqui, a fluência está ao virar da esquina.',
  B2: 'Tens uma fluência real. Os detalhes que faltam são exatamente o que vamos trabalhar.',
  C1: 'Dominas o português com confiança. Falta só o brilho final.',
  C2: 'Nível nativo. O teu português é uma obra de arte — e o Fala Brazil! vai mantê-la assim.',
};

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [screen, setScreen]       = useState<Screen>('pick');
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [resultLevel, setResultLevel] = useState<Level | null>(null);
  const [animating, setAnimating] = useState(false);

  const currentAnswer = answers[currentQ];
  const hasAnswered   = currentAnswer !== null;
  const isCorrect     = (idx: number) => idx === QUESTIONS[currentQ].ans;
  const progress      = ((currentQ + (hasAnswered ? 1 : 0)) / QUESTIONS.length) * 100;

  const handleAnswer = (idx: number) => {
    if (hasAnswered) return;
    const next = [...answers];
    next[currentQ] = idx;
    setAnswers(next);
  };

  const handleNext = () => {
    if (animating) return;
    if (currentQ + 1 >= QUESTIONS.length) {
      const score = answers.reduce<number>(
        (acc, a, i) => acc + (a === QUESTIONS[i].ans ? 1 : 0), 0
      );
      setResultLevel(getLevel(score));
      setScreen('result');
    } else {
      setAnimating(true);
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setAnimating(false);
      }, 220);
    }
  };

  const handleConfirm = (level: Level) => {
    localStorage.setItem('userLevel', level);
    onComplete(level);
  };

  const score = answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].ans ? 1 : 0), 0);

  // ── LEVEL PICKER ───────────────────────────────────────────────────
  if (screen === 'pick') {
    return (
      <div className="ob-wrapper">
        <div className="ob-flag-row">
          <img src="https://flagcdn.com/w80/br.png" alt="Brazil" className="ob-flag" />
        </div>
        <h1 className="ob-title">Qual é o teu<br /><em>nível de português?</em></h1>
        <p className="ob-subtitle">Escolhe o teu nível ou descobre-o com um teste de 20 perguntas.</p>

        <div className="ob-levels-grid">
          {LEVELS.map(({ level, label, emoji, desc, color, bg }) => (
            <button
              key={level}
              className="ob-level-card"
              style={{ background: bg }}
              onClick={() => handleConfirm(level)}
            >
              <div className="ob-level-top">
                <span className="ob-level-code" style={{ color }}>{level}</span>
                <span className="ob-level-emoji">{emoji}</span>
              </div>
              <div className="ob-level-label" style={{ color }}>{label}</div>
              <div className="ob-level-desc" style={{ color: level === 'C2' ? 'rgba(255,255,255,0.75)' : '#374151' }}>{desc}</div>
              <div className="ob-level-cta" style={{ color }}>Começar com {level} →</div>
            </button>
          ))}
        </div>

        <div className="ob-quiz-cta">
          <span className="ob-quiz-cta-label">Não tens a certeza?</span>
          <button className="ob-quiz-btn" onClick={() => setScreen('quiz')}>
            Faz o teste de nivelamento
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────────────
  if (screen === 'quiz') {
    const q = QUESTIONS[currentQ];
    return (
      <div className="ob-wrapper">
        {/* Header */}
        <div className="ob-quiz-header">
          <button className="ob-back-link" onClick={() => { setScreen('pick'); setCurrentQ(0); setAnswers(Array(QUESTIONS.length).fill(null)); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar
          </button>
          <span className="ob-q-counter">{currentQ + 1} / {QUESTIONS.length}</span>
        </div>

        {/* Progress bar */}
        <div className="ob-progress-track">
          <div className="ob-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Phase label */}
        <div className="ob-phase-badge">{q.phaseLabel}</div>

        {/* Question */}
        <div className={`ob-question-card ${animating ? 'ob-fade-out' : 'ob-fade-in'}`}>
          <p className="ob-question-text">{q.q}</p>

          <div className="ob-options">
            {q.opts.map((opt, i) => {
              let cls = 'ob-option';
              if (hasAnswered) {
                if (i === q.ans)          cls += ' ob-option-correct';
                else if (i === currentAnswer) cls += ' ob-option-wrong';
                else                      cls += ' ob-option-dim';
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={hasAnswered && i !== q.ans && i !== currentAnswer}>
                  <span className="ob-opt-letter">{['A', 'B', 'C', 'D'][i]}</span>
                  <span className="ob-opt-text">{opt}</span>
                  {hasAnswered && i === q.ans      && <span className="ob-opt-icon">✓</span>}
                  {hasAnswered && i === currentAnswer && i !== q.ans && <span className="ob-opt-icon ob-opt-x">✗</span>}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className={`ob-feedback ${isCorrect(currentAnswer!) ? 'ob-feedback-good' : 'ob-feedback-bad'}`}>
              {isCorrect(currentAnswer!)
                ? '✓ Correto!'
                : `Resposta certa: ${q.opts[q.ans]}`}
            </div>
          )}
        </div>

        {hasAnswered && (
          <button className="ob-next-btn" onClick={handleNext}>
            {currentQ + 1 === QUESTIONS.length ? 'Ver resultado' : 'Próxima pergunta'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        )}
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────
  if (screen === 'result' && resultLevel) {
    const levelInfo = LEVELS.find(l => l.level === resultLevel)!;
    return (
      <div className="ob-wrapper ob-result-wrapper">
        <div className="ob-result-card" style={{ background: levelInfo.bg }}>
          <div className="ob-result-emoji">{levelInfo.emoji}</div>
          <div className="ob-result-level-code" style={{ color: levelInfo.color }}>{resultLevel}</div>
          <div className="ob-result-level-label" style={{ color: resultLevel === 'C2' ? '#fff' : levelInfo.color }}>{levelInfo.label}</div>
          <div className="ob-result-score" style={{ color: resultLevel === 'C2' ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
            {score} / {QUESTIONS.length} respostas certas
          </div>
        </div>

        <p className="ob-result-message">{RESULT_MESSAGES[resultLevel]}</p>

        <div className="ob-result-actions">
          <button className="ob-confirm-btn" onClick={() => handleConfirm(resultLevel)}>
            Começar com {resultLevel} · {levelInfo.label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button className="ob-change-btn" onClick={() => setScreen('pick')}>
            Prefiro escolher o nível manualmente
          </button>
        </div>
      </div>
    );
  }

  return null;
}
