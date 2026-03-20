import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { speak, stopSpeaking } from './speak';

interface Props {
  onBack: () => void;
  userLevel?: string | null;
}

interface FirestoreArticle {
  id: string;
  title: string;
  title_en: string;
  level: string;
  topic: string;
  text: string;
  questions: { question_pt: string; question_en: string; answer: string }[];
  vocabulary_highlight: { word: string; translation: string }[];
}

const NEXT_LEVEL: Record<string, string> = { A1:'A2', A2:'B1', B1:'B2', B2:'C1', C1:'C2', C2:'C2' };
const LEVEL_COLORS: Record<string, string> = {
  A1:'#4caf7d', A2:'#2196b5', B1:'#e07b39', B2:'#9c4fd6', C1:'#e63946', C2:'#c62828'
};

export default function ReadingStudio({ onBack, userLevel }: Props) {
  const [articles, setArticles]           = useState<FirestoreArticle[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selected, setSelected]           = useState<FirestoreArticle | null>(null);
  const [revealedIdx, setRevealedIdx]     = useState<Set<number>>(new Set());
  const [speakingIdx, setSpeakingIdx]     = useState<number | null>(null);
  const [showAnswers, setShowAnswers]     = useState<Set<number>>(new Set());
  const [doneAll, setDoneAll]             = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const level  = userLevel || 'B1';
        const next   = NEXT_LEVEL[level] || level;
        const levels = level === next ? [level] : [level, next];

        const all: FirestoreArticle[] = [];
        for (const lvl of levels) {
          const snap = await getDocs(collection(db, 'content', 'reading', lvl));
          snap.forEach(doc => all.push({ id: doc.id, ...doc.data() } as FirestoreArticle));
        }
        setArticles(all);
        setDoneAll(all.length === 0);
      } catch (e) {
        console.error('Error loading reading content:', e);
        setDoneAll(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userLevel]);

  const handleSpeak = (text: string, idx: number) => {
    setSpeakingIdx(idx);
    speak(text).finally(() => setSpeakingIdx(null));
  };

  const toggleReveal = (i: number) => {
    setRevealedIdx(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAnswer = (i: number) => {
    setShowAnswers(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  // ── LOADING ───────────────────────────────────────
  if (loading) {
    return (
      <div className="reading-studio">
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-dim)' }}>
          <div style={{ fontSize:'2rem', marginBottom:'12px' }}>📰</div>
          <p style={{ fontWeight:700 }}>Loading articles for your level…</p>
        </div>
      </div>
    );
  }

  // ── NO CONTENT ────────────────────────────────────
  if (doneAll || articles.length === 0) {
    return (
      <div className="reading-studio">
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'16px' }}>🎉</div>
          <h2 style={{ fontWeight:900, marginBottom:'8px' }}>More content coming soon!</h2>
          <p style={{ color:'var(--text-dim)', marginBottom:'32px' }}>You've explored all articles at your level. Check back soon for new ones.</p>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </div>
    );
  }

  // ── ARTICLE DETAIL ────────────────────────────────
  if (selected) {
    const paragraphs = selected.text.split('\n').filter(p => p.trim());

    return (
      <div className="reading-studio">
        <div className="article-detail">
          <div className="article-detail-header">
            <div className="article-meta-row">
              <span className="grammar-level-badge" style={{ background: LEVEL_COLORS[selected.level] }}>
                {selected.level}
              </span>
              <span className="article-topic-badge" style={{ background:'#64748b' }}>
                {selected.topic}
              </span>
            </div>
            <h2>{selected.title}</h2>
            <p className="article-intro" style={{ color:'#64748b', fontSize:'0.85rem', fontStyle:'italic' }}>
              {selected.title_en}
            </p>

            <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
              <button
                className="translation-toggle-btn"
                onClick={() => setRevealedIdx(
                  revealedIdx.size === paragraphs.length
                    ? new Set()
                    : new Set(paragraphs.map((_, i) => i))
                )}
              >
                {revealedIdx.size === paragraphs.length ? '🙈 Hide All' : '🌍 Show All Translations'}
              </button>
              <button
                className="translation-toggle-btn"
                style={{ background:'#2a9d8f' }}
                onClick={() => handleSpeak(selected.text, -1)}
              >
                {speakingIdx === -1 ? '⏹ Stop' : '🔊 Listen to Article'}
              </button>
            </div>
          </div>

          {/* Paragraphs */}
          <div className="article-paragraphs">
            {paragraphs.map((para, i) => (
              <div key={i} className="article-paragraph-block">
                <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <p className="article-pt-text" style={{ flex:1, margin:0 }}>{para}</p>
                  <button
                    className="speak-btn"
                    style={{ flexShrink:0, marginTop:'2px', background: speakingIdx === i ? '#e07b39' : undefined }}
                    onClick={() => handleSpeak(para, i)}
                  >
                    {speakingIdx === i ? '⏹' : '🔊'}
                  </button>
                </div>
                {revealedIdx.has(i) ? (
                  <div className="article-translation-box" style={{ marginTop:'12px' }}>
                    <p className="article-en-text" style={{ fontStyle:'italic', color:'#64748b' }}>
                      [Translation — tap to practice reading in Portuguese first]
                    </p>
                    <button className="para-toggle-btn hide-btn" onClick={() => toggleReveal(i)}>Hide ↑</button>
                  </div>
                ) : (
                  <button className="para-toggle-btn show-btn" style={{ marginTop:'10px' }} onClick={() => toggleReveal(i)}>
                    🌍 Translate this paragraph
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Vocabulary highlight */}
          {selected.vocabulary_highlight?.length > 0 && (
            <div style={{ margin:'24px 16px', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'16px' }}>
              <h4 style={{ fontWeight:800, color:'#14532d', marginBottom:'12px' }}>📚 Key Vocabulary</h4>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                {selected.vocabulary_highlight.map((v, i) => (
                  <div key={i} style={{ background:'white', border:'1px solid #d1fae5', borderRadius:'8px', padding:'8px 10px' }}>
                    <div style={{ fontWeight:800, color:'#14532d', fontSize:'0.85rem' }}>{v.word}</div>
                    <div style={{ color:'#64748b', fontSize:'0.75rem' }}>{v.translation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehension questions */}
          {selected.questions?.length > 0 && (
            <div style={{ margin:'0 16px 24px' }}>
              <h4 style={{ fontWeight:800, color:'#0f172a', marginBottom:'12px' }}>❓ Comprehension Questions</h4>
              {selected.questions.map((q, i) => (
                <div key={i} style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'12px', marginBottom:'8px' }}>
                  <p style={{ fontWeight:700, color:'#0f172a', margin:'0 0 4px', fontSize:'0.88rem' }}>{q.question_en}</p>
                  <p style={{ color:'#64748b', margin:'0 0 8px', fontSize:'0.8rem', fontStyle:'italic' }}>{q.question_pt}</p>
                  {showAnswers.has(i) ? (
                    <div>
                      <p style={{ color:'#14532d', fontWeight:700, fontSize:'0.85rem', margin:'0 0 4px' }}>✅ {q.answer}</p>
                      <button onClick={() => toggleAnswer(i)} style={{ fontSize:'0.72rem', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Hide answer</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleAnswer(i)}
                      style={{ fontSize:'0.78rem', fontWeight:700, color:'#14532d', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'8px', padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}
                    >
                      Show answer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="back-btn-container">
            <button className="back-btn" onClick={() => {
              stopSpeaking();
              setSelected(null);
              setRevealedIdx(new Set());
              setSpeakingIdx(null);
              setShowAnswers(new Set());
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ARTICLE LIST ──────────────────────────────────
  return (
    <div className="reading-studio">
      <header className="dashboard-header" style={{ marginBottom:'32px' }}>
        <h1 className="main-title" style={{ fontSize:'2.8rem' }}>Read Articles</h1>
        <p className="main-subtitle">
          {userLevel ? `Showing articles for level ${userLevel} & ${NEXT_LEVEL[userLevel]}` : 'Real Brazilian Portuguese articles'}
        </p>
      </header>

      <div className="articles-grid">
        {articles.map(article => (
          <div
            key={article.id}
            className="article-card"
            onClick={() => {
              setSelected(article);
              setRevealedIdx(new Set());
              setSpeakingIdx(null);
              setShowAnswers(new Set());
            }}
          >
            <div className="article-card-top" style={{ background: LEVEL_COLORS[article.level] }}>
              <span className="article-card-emoji">📰</span>
              <span className="grammar-level-badge" style={{ background:'rgba(255,255,255,0.25)', fontSize:'0.7rem' }}>
                {article.level}
              </span>
            </div>
            <div className="article-card-body">
              <span className="article-card-topic">{article.topic}</span>
              <h3>{article.title}</h3>
              <p style={{ fontSize:'0.8rem', color:'#94a3b8', fontStyle:'italic' }}>{article.title_en}</p>
              <div className="article-card-footer">
                <span>❓ {article.questions?.length || 0} questions</span>
                <span className="article-read-btn">Read →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="back-btn-container">
        <button className="back-btn" onClick={() => { stopSpeaking(); onBack(); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to Menu
        </button>
      </div>
    </div>
  );
}
