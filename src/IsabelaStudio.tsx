import { useState, useMemo, useEffect } from 'react';
import './LessonPlayer.css';
import type { LessonBlock } from './TodayScreen';

interface Props {
  block: LessonBlock;
  onPass: () => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Accent-insensitive comparison ─────────────────────
function normalise(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getWrongOptions(correctWord: string, allWords: { word: string; translation: string }[], count = 3): string[] {
  const others = allWords.filter(w => w.translation !== correctWord).map(w => w.translation);
  return shuffle(others).slice(0, count);
}

export default function IsabelaStudio({ block, onPass, onBack }: Props) {
  const [phase, setPhase]                   = useState<'learn' | 'test' | 'result'>('learn');
  const [cardIndex, setCardIndex]           = useState(0);
  const [flipped, setFlipped]               = useState(false);
  const [testAnswers, setTestAnswers]       = useState<(string | null)[]>([]);
  const [currentTestQ, setCurrentTestQ]     = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback]     = useState(false);
  const [score, setScore]                   = useState(0);
  const [hasMicrophone, setHasMicrophone]   = useState<boolean | null>(null);

  const words: { word: string; translation: string; example: string }[] =
    block.content?.words || [];

  const testWords = useMemo(() => shuffle(words).slice(0, Math.min(5, words.length)), [block]);
  const testOptions = useMemo(() =>
    testWords.map(q => shuffle([q.translation, ...getWrongOptions(q.translation, words)])),
    [testWords]
  );

  // Note: pronouns array kept for potential future use with verb conjugation in isabela mode
  // const testPronouns = useMemo(() => shuffle(pronouns).slice(0, 4), [block]);

  // ── Check for microphone availability on mount ──
  useEffect(() => {
    const checkMicrophone = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMic = devices.some(device => device.kind === 'audioinput');
        setHasMicrophone(hasMic);
      } catch (error) {
        // If we can't check, assume no microphone for safety
        setHasMicrophone(false);
      }
    };
    checkMicrophone();
  }, []);

  const resetTest = () => {
    setPhase('test');
    setCurrentTestQ(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setTestAnswers([]);
  };

  // ── MICROPHONE NOT AVAILABLE FALLBACK ──
  if (hasMicrophone === false && block.type === 'isabela') {
    return (
      <div className="lp-wrapper">
        <div className="lp-header">
          <button className="lp-back-btn" onClick={onBack}>← Back</button>
          <div className="lp-header-title">Chat with Isabela</div>
          <div className="lp-counter">Unavailable</div>
        </div>
        
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#fef3c7',
          borderRadius: '12px',
          margin: '20px',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎙️</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
            Microphone Not Available
          </div>
          <div style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
            Chat with Isabela requires a microphone. Please enable microphone access or use a device with a microphone to practice voice conversation.
          </div>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            color: '#475569',
            borderLeft: '4px solid #14532d',
          }}>
            <strong>💡 Tip:</strong> You can still practice with other lessons that don't require a microphone, like vocabulary, grammar, and reading exercises.
          </div>
          <button
            onClick={onPass}
            style={{
              width: '100%',
              padding: '14px',
              background: '#14532d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Continue Anyway →
          </button>
        </div>
      </div>
    );
  }

  // ── LOADING: Checking for microphone (only for isabela block) ──
  if (hasMicrophone === null && block.type === 'isabela') {
    return (
      <div className="lp-wrapper">
        <div className="lp-header">
          <button className="lp-back-btn" onClick={onBack}>← Back</button>
          <div className="lp-header-title">Chat with Isabela</div>
        </div>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎙️</div>
          <p style={{ fontWeight: 700 }}>Checking microphone access...</p>
        </div>
      </div>
    );
  }

  // ── VOICE CHAT READY (when microphone available) ──
  if (hasMicrophone === true && block.type === 'isabela' && phase === 'learn') {
    return (
      <div className="lp-wrapper">
        <div className="lp-header">
          <button className="lp-back-btn" onClick={onBack}>← Back</button>
          <div className="lp-header-title">Chat with Isabela</div>
          <div className="lp-counter">Ready</div>
        </div>
        
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: '#fce7f3',
          borderRadius: '12px',
          margin: '20px',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎙️</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#0f172a' }}>
            Voice Chat Ready
          </div>
          <div style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
            Your microphone is ready! Speak naturally and practice Portuguese conversation with Isabela.
          </div>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            color: '#475569',
            borderLeft: '4px solid #d946a6',
          }}>
            <strong>💬 Tip:</strong> Speak clearly and naturally. Isabela will respond to help you learn conversational Portuguese.
          </div>
          <button
            onClick={onPass}
            style={{
              width: '100%',
              padding: '14px',
              background: '#14532d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Start Conversation →
          </button>
        </div>
      </div>
    );
  }

  // ── VOCABULARY ────────────────────────────────────
  if (block.type === 'vocabulary' || block.type === 'mini_exercise') {
    if (words.length === 0) { onPass(); return null; }

    if (phase === 'learn') {
      const card   = words[cardIndex];
      const isLast = cardIndex === words.length - 1;
      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={onBack}>← Back</button>
            <div className="lp-header-title">{block.title}</div>
            <div className="lp-counter">{cardIndex + 1} / {words.length}</div>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${((cardIndex + 1) / words.length) * 100}%` }} />
          </div>
          <div className="lp-phase-label">Learn the words</div>
          <div className={`lp-flashcard ${flipped ? 'lp-flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="lp-card-front">
              <div className="lp-card-lang">Portuguese</div>
              <div className="lp-card-word">{card.word}</div>
              <div className="lp-card-hint">Tap to reveal translation</div>
            </div>
            <div className="lp-card-back">
              <div className="lp-card-lang">English</div>
              <div className="lp-card-word">{card.translation}</div>
              {card.example && <div className="lp-card-example">"{card.example}"</div>}
            </div>
          </div>
          <div className="lp-nav-row">
            {cardIndex > 0 && (
              <button className="lp-nav-btn lp-nav-prev" onClick={() => { setCardIndex(i => i - 1); setFlipped(false); }}>← Previous</button>
            )}
            {!isLast ? (
              <button className="lp-nav-btn lp-nav-next" onClick={() => { setCardIndex(i => i + 1); setFlipped(false); }}>Next →</button>
            ) : (
              <button className="lp-nav-btn lp-nav-test" onClick={() => { setPhase('test'); setCurrentTestQ(0); setScore(0); setSelectedOption(null); setShowFeedback(false); }}>Take the test →</button>
            )}
          </div>
        </div>
      );
    }

    if (phase === 'test') {
      // ── SAFETY CHECK: Prevent test from running with invalid state ──
      if (testWords.length === 0 || currentTestQ >= testWords.length) {
        setPhase('result');
        return null;
      }

      const q          = testWords[currentTestQ];
      const allOptions = testOptions[currentTestQ] || [];
      if (!q || !allOptions || allOptions.length === 0) {
        setPhase('result');
        return null;
      }

      const isAnswered = selectedOption !== null;
      const isCorrect  = selectedOption === q.translation;
      const isLastQ    = currentTestQ === testWords.length - 1;

      const handleSelect = (opt: string) => {
        if (isAnswered) return;
        setSelectedOption(opt);
        setShowFeedback(true);
        if (opt === q.translation) setScore(s => s + 1);
      };

      const handleNext = () => {
        setSelectedOption(null);
        setShowFeedback(false);
        if (isLastQ) { setPhase('result'); } else { setCurrentTestQ(i => i + 1); }
      };

      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={() => { setPhase('learn'); setSelectedOption(null); setShowFeedback(false); }}>← Study</button>
            <div className="lp-header-title">Quick test</div>
            <div className="lp-counter">{currentTestQ + 1} / {testWords.length}</div>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${((currentTestQ + 1) / testWords.length) * 100}%` }} />
          </div>
          <div className="lp-phase-label">What does this word mean?</div>
          <div className="lp-test-question"><div className="lp-test-word">{q.word}</div></div>
          <div className="lp-options">
            {allOptions.map((opt, i) => {
              let cls = 'lp-option';
              if (isAnswered) {
                if (opt === q.translation)       cls += ' lp-option-correct';
                else if (opt === selectedOption) cls += ' lp-option-wrong';
                else                             cls += ' lp-option-dim';
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(opt)} disabled={isAnswered}>
                  <span className="lp-option-letter">{['A','B','C','D'][i]}</span>
                  <span className="lp-option-text">{opt}</span>
                  {isAnswered && opt === q.translation && <span className="lp-option-icon">✓</span>}
                  {isAnswered && opt === selectedOption && opt !== q.translation && <span className="lp-option-icon lp-option-x">✗</span>}
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className={`lp-feedback ${isCorrect ? 'lp-feedback-good' : 'lp-feedback-bad'}`}>
              {isCorrect ? '✓ Correct!' : `Correct answer: ${q.translation}`}
            </div>
          )}
          {isAnswered && (
            <button className="lp-next-btn" onClick={handleNext}>
              {isLastQ ? 'See result →' : 'Next →'}
            </button>
          )}
        </div>
      );
    }

    if (phase === 'result') {
      const total     = testWords.length;
      const passScore = Math.ceil(total * 0.8);
      const passed    = score >= passScore;
      return (
        <div className="lp-wrapper">
          <div className="lp-result-card">
            <div className={`lp-result-circle ${passed ? 'lp-result-pass' : 'lp-result-fail'}`}>
              <div className="lp-result-num">{score}/{total}</div>
              <div className="lp-result-label">{passed ? 'Passed!' : 'Try again'}</div>
            </div>
            {passed ? (
              <>
                <div className="lp-result-title">Well done! 🎉</div>
                <div className="lp-result-sub">You know these words. Block complete!</div>
                <button className="lp-result-btn" onClick={onPass}>Continue →</button>
              </>
            ) : (
              <>
                <div className="lp-result-title">Not quite there yet</div>
                <div className="lp-result-sub">You need {passScore}/{total} to pass. Study the words again and retry.</div>
                <button className="lp-result-btn" onClick={() => { setPhase('learn'); setCardIndex(0); setFlipped(false); setScore(0); setSelectedOption(null); setShowFeedback(false); }}>Study again →</button>
                <button className="lp-result-btn-sec" onClick={resetTest}>Retry test</button>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  // ── GRAMMAR BLOCK ─────────────────────────────────
  if (block.type === 'grammar') {
    const point       = block.content?.point       || '';
    const explanation = block.content?.explanation || '';
    const examples    = block.content?.examples    || [];
    const items: { question: string; answer: string }[] = block.content?.items || [];

    const testItems = items.length > 0
      ? items.slice(0, 3)
      : examples.slice(0, 3).map((ex: string) => {
          const ws = ex.split(' ');
          const blankIdx = Math.floor(ws.length / 2);
          const answer = ws[blankIdx];
          ws[blankIdx] = '___';
          return { question: ws.join(' '), answer };
        });

    if (phase === 'learn') {
      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={onBack}>← Back</button>
            <div className="lp-header-title">{block.title}</div>
            <div className="lp-counter">Grammar</div>
          </div>
          <div className="lp-phase-label">Today's grammar point</div>
          <div className="lp-grammar-card">
            <div className="lp-grammar-point">{point}</div>
            <div className="lp-grammar-explanation">{explanation}</div>
          </div>
          {examples.length > 0 && (
            <div className="lp-grammar-examples">
              <div className="lp-examples-label">Examples:</div>
              {examples.map((ex: string, i: number) => (
                <div key={i} className="lp-grammar-example">{ex}</div>
              ))}
            </div>
          )}
          <button className="lp-next-btn" style={{ marginTop: '24px' }} onClick={() => { setPhase('test'); setCurrentTestQ(0); setScore(0); setTestAnswers([]); }}>
            Take the test →
          </button>
        </div>
      );
    }

    if (phase === 'test') {
      const q          = testItems[currentTestQ];
      if (!q) { setPhase('result'); return null; }
      const isAnswered = testAnswers[currentTestQ] !== undefined && testAnswers[currentTestQ] !== null;
      // ── Accent-insensitive check ──
      const isCorrect  = normalise(testAnswers[currentTestQ] || '') === normalise(q.answer);
      const isLastQ    = currentTestQ === testItems.length - 1;

      const checkAnswer = (val: string) => {
        if (!val.trim() || isAnswered) return;
        const newAnswers = [...testAnswers];
        newAnswers[currentTestQ] = val;
        setTestAnswers(newAnswers);
        if (normalise(val) === normalise(q.answer)) setScore(s => s + 1);
      };

      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={() => { setPhase('learn'); setTestAnswers([]); setScore(0); }}>← Study</button>
            <div className="lp-header-title">Fill in the blank</div>
            <div className="lp-counter">{currentTestQ + 1} / {testItems.length}</div>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${((currentTestQ + 1) / testItems.length) * 100}%` }} />
          </div>
          <div className="lp-phase-label">Complete the sentence</div>
          <div className="lp-grammar-fill-q">{q.question}</div>
          <div className="lp-accent-hint">Accents are optional 👍</div>
          <input
            key={currentTestQ}
            className="lp-fill-input"
            placeholder="Type your answer..."
            disabled={isAnswered}
            onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer((e.target as HTMLInputElement).value); }}
          />
          {!isAnswered && (
            <button className="lp-next-btn" onClick={(e) => {
              const input = e.currentTarget.parentElement?.querySelector('.lp-fill-input') as HTMLInputElement;
              checkAnswer(input?.value || '');
            }}>Check answer</button>
          )}
          {isAnswered && (
            <>
              <div className={`lp-feedback ${isCorrect ? 'lp-feedback-good' : 'lp-feedback-bad'}`}>
                {isCorrect ? '✓ Correct!' : `Correct answer: ${q.answer}`}
              </div>
              <button className="lp-next-btn" onClick={() => {
                if (isLastQ) { setPhase('result'); } else { setCurrentTestQ(i => i + 1); }
              }}>
                {isLastQ ? 'See result →' : 'Next →'}
              </button>
            </>
          )}
        </div>
      );
    }

    if (phase === 'result') {
      const total     = testItems.length;
      const passScore = Math.ceil(total * 0.67);
      const passed    = score >= passScore;
      return (
        <div className="lp-wrapper">
          <div className="lp-result-card">
            <div className={`lp-result-circle ${passed ? 'lp-result-pass' : 'lp-result-fail'}`}>
              <div className="lp-result-num">{score}/{total}</div>
              <div className="lp-result-label">{passed ? 'Passed!' : 'Try again'}</div>
            </div>
            {passed ? (
              <>
                <div className="lp-result-title">Grammar mastered! 🎉</div>
                <div className="lp-result-sub">Block complete!</div>
                <button className="lp-result-btn" onClick={onPass}>Continue →</button>
              </>
            ) : (
              <>
                <div className="lp-result-title">Keep practising</div>
                <div className="lp-result-sub">You need {passScore}/{total} to pass. Review and try again.</div>
                <button className="lp-result-btn" onClick={() => { setPhase('learn'); setScore(0); setTestAnswers([]); }}>Study again →</button>
                <button className="lp-result-btn-sec" onClick={() => { setPhase('test'); setCurrentTestQ(0); setScore(0); setTestAnswers([]); }}>Retry test</button>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  // ── READING BLOCK ─────────────────────────────────
  if (block.type === 'reading') {
    const title     = block.content?.title     || 'Reading';
    const text      = block.content?.text      || '';
    const questions: string[] = block.content?.questions || [];

    if (phase === 'learn') {
      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={onBack}>← Back</button>
            <div className="lp-header-title">Reading</div>
            <div className="lp-counter">Read</div>
          </div>
          <div className="lp-phase-label">Read carefully</div>
          <div className="lp-reading-card">
            <div className="lp-reading-title">{title}</div>
            <div className="lp-reading-text">{text}</div>
          </div>
          <button className="lp-next-btn" style={{ marginTop: '16px' }} onClick={() => { setPhase('test'); setCurrentTestQ(0); setScore(0); setTestAnswers([]); }}>
            Answer questions →
          </button>
        </div>
      );
    }

    if (phase === 'test' && questions.length > 0) {
      const q          = questions[currentTestQ];
      const isAnswered = testAnswers[currentTestQ] !== undefined && testAnswers[currentTestQ] !== null;
      const isLastQ    = currentTestQ === questions.length - 1;

      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={() => setPhase('learn')}>← Re-read</button>
            <div className="lp-header-title">Comprehension</div>
            <div className="lp-counter">{currentTestQ + 1} / {questions.length}</div>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${((currentTestQ + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="lp-phase-label">Answer in Portuguese or English</div>
          <div className="lp-grammar-fill-q">{q}</div>
          <textarea
            key={currentTestQ}
            className="lp-fill-textarea"
            placeholder="Type your answer..."
            rows={3}
            disabled={isAnswered}
          />
          {!isAnswered && (
            <button className="lp-next-btn" onClick={(e) => {
              const ta = e.currentTarget.parentElement?.querySelector('.lp-fill-textarea') as HTMLTextAreaElement;
              const val = ta?.value.trim();
              if (!val) return;
              const newAnswers = [...testAnswers];
              newAnswers[currentTestQ] = val;
              setTestAnswers(newAnswers);
              setScore(s => s + 1);
            }}>Submit answer</button>
          )}
          {isAnswered && (
            <>
              <div className="lp-feedback lp-feedback-good">✓ Answer recorded — keep going!</div>
              <button className="lp-next-btn" onClick={() => {
                if (isLastQ) { setPhase('result'); } else { setCurrentTestQ(i => i + 1); }
              }}>
                {isLastQ ? 'Finish →' : 'Next →'}
              </button>
            </>
          )}
        </div>
      );
    }

    if (phase === 'result' || questions.length === 0) {
      return (
        <div className="lp-wrapper">
          <div className="lp-result-card">
            <div className="lp-result-circle lp-result-pass">
              <div className="lp-result-num">✓</div>
              <div className="lp-result-label">Done!</div>
            </div>
            <div className="lp-result-title">Reading complete! 📰</div>
            <div className="lp-result-sub">Great work — you answered all the questions.</div>
            <button className="lp-result-btn" onClick={onPass}>Continue →</button>
          </div>
        </div>
      );
    }
  }

  onPass();
  return null;
}
