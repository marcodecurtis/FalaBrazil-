import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { speak } from './speak';

interface Props {
  onBack: () => void;
  userLevel?: string | null;
}

interface FirestoreRule {
  id: string;
  rule: string;
  level: string;
  topic: string;
  explanation: string;
  examples: { pt: string; en: string }[];
  exercise: {
    instruction: string;
    questions: { sentence_pt: string; answer: string; hint_en: string }[];
  };
}

const NEXT_LEVEL: Record<string, string> = { A1:'A2', A2:'B1', B1:'B2', B2:'C1', C1:'C2', C2:'C2' };
const LEVEL_COLORS: Record<string, string> = {
  A1:'#4caf7d', A2:'#2196b5', B1:'#e07b39', B2:'#9c4fd6', C1:'#e63946', C2:'#c62828'
};

export default function GrammarStudio({ onBack, userLevel }: Props) {
  const [rules, setRules]           = useState<FirestoreRule[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<FirestoreRule | null>(null);
  const [answers, setAnswers]       = useState<Record<number, string>>({});
  const [checked, setChecked]       = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const level = userLevel || 'A1';
        const next  = NEXT_LEVEL[level] || level;
        const levels = level === next ? [level] : [level, next];

        const all: FirestoreRule[] = [];
        for (const lvl of levels) {
          const snap = await getDocs(collection(db, 'content', 'grammar', lvl));
          snap.forEach(doc => all.push({ id: doc.id, ...doc.data() } as FirestoreRule));
        }
        setRules(all);
      } catch (e) {
        console.error('Error loading grammar content:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userLevel]);

  const handleAnswer = (i: number, val: string) => {
    setAnswers(prev => ({ ...prev, [i]: val }));
  };

  const checkAnswer = (i: number, _correct: string) => {
    setChecked(prev => ({ ...prev, [i]: true }));
  };

  // ── LOADING ───────────────────────────────────────
  if (loading) {
    return (
      <div className="grammar-studio">
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-dim)' }}>
          <div style={{ fontSize:'2rem', marginBottom:'12px' }}>📖</div>
          <p style={{ fontWeight:700 }}>Loading grammar for your level…</p>
        </div>
      </div>
    );
  }

  // ── NO CONTENT ────────────────────────────────────
  if (rules.length === 0) {
    return (
      <div className="grammar-studio">
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'16px' }}>🎉</div>
          <h2 style={{ fontWeight:900, marginBottom:'8px' }}>More content coming soon!</h2>
          <p style={{ color:'var(--text-dim)', marginBottom:'32px' }}>You've completed all grammar lessons at your level.</p>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </div>
    );
  }

  // ── RULE DETAIL ───────────────────────────────────
  if (selected) {
    return (
      <div className="grammar-studio">
        <div className="grammar-detail">
          <div className="grammar-detail-header">
            <span className="grammar-level-badge" style={{ background: LEVEL_COLORS[selected.level] }}>
              {selected.level}
            </span>
            <h2>{selected.rule}</h2>
            <p className="grammar-summary" style={{ color:'#64748b', fontSize:'0.82rem' }}>{selected.topic}</p>
          </div>

          {/* Explanation */}
          <div className="grammar-explanation-box">
            <h4>📖 Explanation</h4>
            <p>{selected.explanation}</p>
          </div>

          {/* Examples */}
          <div className="grammar-examples-list">
            <h4>✏️ Examples</h4>
            {selected.examples.map((ex, i) => (
              <div key={i} className="grammar-example-row">
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px' }}>
                  <div>
                    <div className="grammar-pt">{ex.pt}</div>
                    <div className="grammar-en">{ex.en}</div>
                  </div>
                  <button className="speak-btn" onClick={() => speak(ex.pt)}>🔊</button>
                </div>
              </div>
            ))}
          </div>

          {/* Exercise */}
          {selected.exercise?.questions?.length > 0 && (
            <div style={{ margin:'16px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'12px', padding:'16px' }}>
              <h4 style={{ fontWeight:800, color:'#92400e', marginBottom:'4px' }}>🏋️ Practice</h4>
              <p style={{ fontSize:'0.82rem', color:'#92400e', marginBottom:'14px' }}>{selected.exercise.instruction}</p>
              {selected.exercise.questions.map((q, i) => {
                const isCorrect = checked[i] && answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim();
                const isWrong   = checked[i] && !isCorrect;
                return (
                  <div key={i} style={{ marginBottom:'12px' }}>
                    <p style={{ fontSize:'0.88rem', fontWeight:700, color:'#0f172a', marginBottom:'6px' }}>
                      {q.sentence_pt}
                    </p>
                    <p style={{ fontSize:'0.72rem', color:'#94a3b8', marginBottom:'6px', fontStyle:'italic' }}>
                      Hint: {q.hint_en}
                    </p>
                    <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                      <input
                        type="text"
                        value={answers[i] || ''}
                        onChange={e => handleAnswer(i, e.target.value)}
                        placeholder="Type your answer…"
                        style={{
                          flex:1, border:`1.5px solid ${isCorrect ? '#16a34a' : isWrong ? '#dc2626' : '#e2e8f0'}`,
                          borderRadius:'8px', padding:'8px 10px', fontSize:'0.85rem',
                          fontFamily:'inherit', outline:'none',
                          background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : 'white'
                        }}
                      />
                      {!checked[i] && (
                        <button
                          onClick={() => checkAnswer(i, q.answer)}
                          style={{ background:'#92400e', color:'white', border:'none', borderRadius:'8px', padding:'8px 14px', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
                        >
                          Check
                        </button>
                      )}
                    </div>
                    {isCorrect && <p style={{ color:'#16a34a', fontSize:'0.78rem', fontWeight:700, marginTop:'4px' }}>✅ Correct!</p>}
                    {isWrong   && <p style={{ color:'#dc2626', fontSize:'0.78rem', fontWeight:700, marginTop:'4px' }}>❌ Answer: {q.answer}</p>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="back-btn-container">
            <button className="back-btn" onClick={() => { setSelected(null); setAnswers({}); setChecked({}); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RULES LIST ────────────────────────────────────
  return (
    <div className="grammar-studio">
      <header className="dashboard-header" style={{ marginBottom:'32px' }}>
        <h1 className="main-title" style={{ fontSize:'2.8rem' }}>Master Grammar</h1>
        <p className="main-subtitle">
          {userLevel ? `Your level: ${userLevel} & ${NEXT_LEVEL[userLevel]}` : 'Grammar rules with examples'}
        </p>
      </header>

      <div className="grammar-rules-grid">
        {rules.map(rule => (
          <div key={rule.id} className="grammar-rule-card" onClick={() => { setSelected(rule); setAnswers({}); setChecked({}); }}>
            <div className="grammar-rule-left">
              <span className="grammar-level-badge" style={{ background: LEVEL_COLORS[rule.level] }}>
                {rule.level}
              </span>
              <div>
                <h3>{rule.rule}</h3>
                <p>{rule.topic}</p>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="back-btn-container">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to Menu
        </button>
      </div>
    </div>
  );
}
