import { useState, useMemo } from 'react';
import './LessonPlayer.css';
import { speak } from './speak';
import type { LessonBlock } from './TodayScreen';

interface Props {
  block: LessonBlock;
  onPass: () => void;
  onBack: () => void;
  blockIndex?: number;
  totalBlocks?: number;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

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

export default function LessonPlayer({ block, onPass, onBack, blockIndex = 0, totalBlocks = 1 }: Props) {
  const [phase, setPhase]                   = useState<'learn' | 'test' | 'result'>('learn');
  const [cardIndex, setCardIndex]           = useState(0);
  const [flipped, setFlipped]               = useState(false);
  const [testAnswers, setTestAnswers]       = useState<(string | null)[]>([]);
  const [currentTestQ, setCurrentTestQ]     = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback]     = useState(false);
  const [score, setScore]                   = useState(0);

  const words: { word: string; translation: string; example: string }[] =
    block.content?.words || block.content?.items || [];

  const testWords = useMemo(() => shuffle(words).slice(0, Math.min(5, words.length)), [block]);

  const testOptions = useMemo(() =>
    testWords.map(q => shuffle([q.translation, ...getWrongOptions(q.translation, words)])),
    [testWords]
  );

  const pronouns = ['eu', 'você', 'ele/ela', 'nós', 'vocês', 'eles/elas'];
  const testPronouns = useMemo(() => shuffle(pronouns).slice(0, 4), [block]);

  const resetTest = () => {
    setPhase('test');
    setCurrentTestQ(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setTestAnswers([]);
  };

  // ── VOCABULARY / MINI_EXERCISE / EXERCISE ─────────────────────
  if (block.type === 'vocabulary' || block.type === 'mini_exercise' || block.type === 'exercise') {
    if (words.length === 0) {
      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={onBack}>← Back</button>
            <div className="lp-header-title">{block.title}</div>
          </div>
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
            <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Content not available</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
              This block didn't load any content. You can skip it and continue.
            </p>
            <button className="lp-next-btn" onClick={onPass}>Skip and continue →</button>
          </div>
        </div>
      );
    }

    if (phase === 'learn') {
      const card   = words[cardIndex];
      const isLast = cardIndex === words.length - 1;
      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={onBack}>{blockIndex > 0 ? '← Previous' : '← Back'}</button>
            <div className="lp-header-title">{block.title}</div>
            <div className="lp-counter">{totalBlocks > 1 ? `${blockIndex + 1}/${totalBlocks} · ` : ''}{cardIndex + 1} / {words.length}</div>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${((cardIndex + 1) / words.length) * 100}%` }} />
          </div>
          <div className="lp-phase-label">Learn the words</div>
          <div className={`lp-flashcard ${flipped ? 'lp-flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="lp-card-front">
              <div className="lp-card-lang">Portuguese</div>
              <div className="lp-card-word">{card.word}</div>
              {card.example && <div className="lp-card-example">"{card.example}"</div>}
              <div className="lp-card-hint">Tap to reveal translation</div>
            </div>
            <div className="lp-card-back">
              <div className="lp-card-lang">English</div>
              <div className="lp-card-word">{card.translation}</div>
            </div>
          </div>
          <button
            className="speak-btn speak-btn-large"
            onClick={() => speak(card.word)}
            style={{ marginTop: '16px' }}
          >
            🔊 Listen to pronunciation
          </button>
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
        if (isLastQ) {
          setPhase('result');
        } else {
          setCurrentTestQ(i => i + 1);
        }
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

  // ── VERB BLOCK ────────────────────────────────────
  if (block.type === 'verb') {
    const verb        = block.content?.verb        || '';
    const translation = block.content?.translation || '';

    const rawConjugation = block.content?.conjugation || {};

    // Detect if the AI returned multiple tenses (nested) or a flat pronoun map.
    const firstVal = Object.values(rawConjugation)[0];
    const isNestedByTense = firstVal !== null && typeof firstVal === 'object';

    // Human-readable tense labels (Portuguese key → English label)
    const TENSE_LABELS: Record<string, string> = {
      presente:              'Present tense',
      present:               'Present tense',
      'Presente':            'Present tense',
      preterito_perfeito:    'Simple past',
      'pretérito perfeito':  'Simple past',
      'preterito perfeito':  'Simple past',
      preterito_imperfeito:  'Imperfect past',
      'pretérito imperfeito':'Imperfect past',
      imperfeito:            'Imperfect past',
      futuro:                'Future',
      future:                'Future',
      condicional:           'Conditional',
      subjuntivo:            'Subjunctive',
      imperativo:            'Imperative',
    };

    // All tenses as an array of { label, forms } for the learn phase display
    const tenseTables: { label: string; forms: Record<string, string> }[] = isNestedByTense
      ? Object.entries(rawConjugation).map(([key, forms]) => ({
          label: TENSE_LABELS[key] || TENSE_LABELS[key.toLowerCase()] || key,
          forms: forms as Record<string, string>,
        }))
      : [{ label: 'Conjugation', forms: rawConjugation as Record<string, string> }];

    // Flat present-tense map used in the test phase for pronoun look-ups
    const conjugation: Record<string, string> = (() => {
      if (!isNestedByTense) return rawConjugation as Record<string, string>;
      const present =
        (rawConjugation as any)['presente'] ||
        (rawConjugation as any)['present']  ||
        (rawConjugation as any)['Presente'] ||
        Object.values(rawConjugation)[0];
      return (typeof present === 'object' ? present : {}) as Record<string, string>;
    })();

    const examples: string[] = block.content?.examples || [];

    if (phase === 'learn') {
      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={onBack}>← Back</button>
            <div className="lp-header-title">{block.title}</div>
            <div className="lp-counter">Verb</div>
          </div>
          <div className="lp-phase-label">Today's verb</div>
          <div className="lp-verb-card">
            <div className="lp-verb-title">{verb}</div>
            <div className="lp-verb-translation">{translation}</div>
          </div>
          {tenseTables.map(({ label, forms }) => (
            <div key={label} className="lp-conjugation-table">
              <div className="lp-conj-label">{label}</div>
              {pronouns.map(p => (
                <div key={p} className="lp-conj-row">
                  <span className="lp-conj-pronoun">{p}</span>
                  <span className="lp-conj-form">{forms[p] || '—'}</span>
                </div>
              ))}
            </div>
          ))}
          {examples.length > 0 && (
            <div className="lp-grammar-examples" style={{ marginTop: '16px' }}>
              <div className="lp-examples-label">Example sentences:</div>
              {examples.map((ex: string, i: number) => (
                <div key={i} className="lp-grammar-example">{ex}</div>
              ))}
            </div>
          )}
          <button className="lp-next-btn" style={{ marginTop: '24px' }} onClick={() => { setPhase('test'); setCurrentTestQ(0); setScore(0); setTestAnswers([]); }}>
            Test yourself →
          </button>
        </div>
      );
    }

    if (phase === 'test') {
      const q           = testPronouns[currentTestQ];
      const correctForm = conjugation[q] || '';
      const isAnswered  = testAnswers[currentTestQ] !== undefined && testAnswers[currentTestQ] !== null;
      const _rawAnswer  = normalise(testAnswers[currentTestQ] || '');
      const _stripped   = _rawAnswer.replace(new RegExp(`^${normalise(q)}\\s+`), '');
      const isCorrect   = _stripped === normalise(correctForm) || _rawAnswer === normalise(correctForm);
      const isLastQ     = currentTestQ === testPronouns.length - 1;

      const checkAnswer = (val: string) => {
        if (!val.trim() || isAnswered) return;
        // Strip leading pronoun if user types e.g. "eu moro" instead of just "moro"
        const stripped = normalise(val).replace(new RegExp(`^${normalise(q)}\\s+`), '');
        const correct = stripped === normalise(correctForm) || normalise(val) === normalise(correctForm);
        const newAnswers = [...testAnswers];
        newAnswers[currentTestQ] = val;
        setTestAnswers(newAnswers);
        if (correct) setScore(s => s + 1);
      };

      return (
        <div className="lp-wrapper">
          <div className="lp-header">
            <button className="lp-back-btn" onClick={() => { setPhase('learn'); setTestAnswers([]); setScore(0); }}>← Study</button>
            <div className="lp-header-title">Conjugation test</div>
            <div className="lp-counter">{currentTestQ + 1} / {testPronouns.length}</div>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${((currentTestQ + 1) / testPronouns.length) * 100}%` }} />
          </div>
          <div className="lp-phase-label">Complete the conjugation</div>
          <div className="lp-grammar-fill-q">
            {verb} → <strong>{q}</strong> ___?
          </div>
          <div className="lp-accent-hint">Accents are optional — type without them if easier 👍</div>
          <input
            key={currentTestQ}
            className="lp-fill-input"
            placeholder="Type the conjugated form..."
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
                {isCorrect ? `✓ Correct! ${q} → ${correctForm}` : `Correct: ${q} → ${correctForm}`}
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
      const total     = testPronouns.length;
      const passScore = Math.ceil(total * 0.75);
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
                <div className="lp-result-title">Verb mastered! 🎉</div>
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
    const title = block.content?.title || 'Reading';
    const text  = block.content?.text  || '';

    type ReadingQuestion = string | { question: string; options: string[]; correctAnswer: string };
    const questions: ReadingQuestion[] = block.content?.questions || [];

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
          {questions.length > 0 ? (
            <button className="lp-next-btn" style={{ marginTop: '16px' }} onClick={() => { setPhase('test'); setCurrentTestQ(0); setScore(0); setTestAnswers([]); }}>
              Answer questions →
            </button>
          ) : (
            <button className="lp-next-btn" style={{ marginTop: '16px' }} onClick={onPass}>
              I've finished reading →
            </button>
          )}
        </div>
      );
    }

    if (phase === 'test' && questions.length > 0) {
      const q = questions[currentTestQ];

      let question = '';
      let options: string[] = [];
      let correctAnswer = '';

      if (typeof q === 'string') {
        question = q;
      } else {
        question      = q.question      || '';
        options       = q.options       || [];
        correctAnswer = q.correctAnswer || '';
      }

      const isAnswered     = testAnswers[currentTestQ] !== undefined && testAnswers[currentTestQ] !== null;
      const selectedAnswer = testAnswers[currentTestQ];
      const isCorrect      = selectedAnswer === correctAnswer;
      const isLastQ        = currentTestQ === questions.length - 1;

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
          <div className="lp-phase-label">Answer the question</div>
          <div className="lp-grammar-fill-q">{question}</div>

          {options.length > 0 ? (
            <div className="lp-options">
              {options.map((option: string, i: number) => {
                let cls = 'lp-option';
                if (isAnswered) {
                  if (option === correctAnswer)       cls += ' lp-option-correct';
                  else if (option === selectedAnswer) cls += ' lp-option-wrong';
                  else                               cls += ' lp-option-dim';
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => {
                      if (!isAnswered) {
                        const newAnswers = [...testAnswers];
                        newAnswers[currentTestQ] = option;
                        setTestAnswers(newAnswers);
                        if (option === correctAnswer) setScore(s => s + 1);
                      }
                    }}
                    disabled={isAnswered}
                  >
                    <span className="lp-option-letter">{['A','B','C','D'][i]}</span>
                    <span className="lp-option-text">{option}</span>
                    {isAnswered && option === correctAnswer && <span className="lp-option-icon">✓</span>}
                    {isAnswered && option === selectedAnswer && option !== correctAnswer && <span className="lp-option-icon lp-option-x">✗</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              key={currentTestQ}
              className="lp-fill-textarea"
              placeholder="Type your answer..."
              rows={3}
              disabled={isAnswered}
            />
          )}

          {!isAnswered && options.length === 0 && (
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
              {options.length > 0 ? (
                <div className={`lp-feedback ${isCorrect ? 'lp-feedback-good' : 'lp-feedback-bad'}`}>
                  {isCorrect ? '✓ Correct!' : `✗ Incorrect. The correct answer is: ${correctAnswer}`}
                </div>
              ) : (
                <div className="lp-feedback lp-feedback-good">✓ Answer recorded — keep going!</div>
              )}
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

    if (phase === 'result') {
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

  // ── ISABELA BLOCK ──────────────────────────────
  if (block.type === 'isabela') {
    return (
      <div className="lp-wrapper">
        <div className="lp-header">
          <button className="lp-back-btn" onClick={onBack}>← Back</button>
          <div className="lp-header-title">Chat with Isabela</div>
        </div>
        <div style={{ padding: '40px 20px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎙️</div>
          <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>
            Speaking practice with Isabela
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px', lineHeight: 1.6 }}>
            {block.description}
          </p>
          {block.content?.suggestedPhrases?.length > 0 && (
            <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14532d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Suggested phrases
              </div>
              {block.content.suggestedPhrases.map((phrase: string, i: number) => (
                <div key={i} style={{ fontSize: '0.82rem', color: '#166534', marginBottom: '4px', fontStyle: 'italic' }}>
                  "{phrase}"
                </div>
              ))}
            </div>
          )}
          <button className="lp-next-btn" onClick={onPass} style={{ marginBottom: '12px' }}>
            Start Chat with Isabela →
          </button>
          <button
            onClick={onPass}
            style={{
              width: '100%', padding: '11px', background: 'none',
              border: '1px solid #e2e8f0', borderRadius: '10px',
              color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Skip speaking practice
          </button>
          <p style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '10px', lineHeight: 1.5 }}>
            Speaking practice is optional — skip if you're having technical issues.
          </p>
        </div>
      </div>
    );
  }

  // ── FALLBACK — unknown block type ─────────────────
  // Never auto-pass. Show a message so the user can skip manually.
  return (
    <div className="lp-wrapper">
      <div className="lp-header">
        <button className="lp-back-btn" onClick={onBack}>← Back</button>
        <div className="lp-header-title">{block.title}</div>
      </div>
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📖</div>
        <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{block.title}</p>
        <p style={{ fontSize: '0.85rem', marginBottom: '24px', lineHeight: 1.5 }}>{block.description}</p>
        <button className="lp-next-btn" onClick={onPass}>
          Mark as complete →
        </button>
      </div>
    </div>
  );
}
