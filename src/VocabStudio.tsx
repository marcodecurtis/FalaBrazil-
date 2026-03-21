import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { speak } from './speak';

interface Props {
  onBack: () => void;
  onGainXp: (amount: number) => void;
  userLevel?: string | null;
}

interface VocabWord {
  word: string;
  translation: string;
  example_pt: string;
  example_en: string;
}

interface VocabSet {
  id: string;
  topic: string;
  level: string;
  words: VocabWord[];
}

const NEXT_LEVEL: Record<string, string> = { A1:'A2', A2:'B1', B1:'B2', B2:'C1', C1:'C2', C2:'C2' };
const LEVEL_COLORS: Record<string, string> = {
  A1:'#4caf7d', A2:'#2196b5', B1:'#e07b39', B2:'#9c4fd6', C1:'#e63946', C2:'#c62828'
};

const TOPIC_ICONS: Record<string, string> = {
  greetings:'👋', numbers:'🔢', colors:'🎨', family:'👨‍👩‍👧', food:'🍎',
  animals:'🐾', house:'🏠', body:'👤', clothes:'👗', weather:'🌤',
  shopping:'🛍', transport:'🚌', hobbies:'🎯', school:'📚', health:'❤️',
  time:'⏰', city:'🏙', nature:'🌿', jobs:'💼', emotions:'😊',
  travel:'✈️', technology:'💻', environment:'🌍', culture:'🎭', sports:'⚽',
  media:'📺', relationships:'🤝', money:'💰', education:'🎓', work:'💼',
  politics:'🏛', economy:'📈', science:'🔬', art:'🎨', literature:'📖',
  society:'👥', history:'📜', philosophy:'🧠', business:'💼', psychology:'🧩',
};

export default function VocabStudio({ onBack, onGainXp, userLevel }: Props) {
  const [vocabSets, setVocabSets]     = useState<VocabSet[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedSet, setSelectedSet] = useState<VocabSet | null>(null);
  const [cardIndex, setCardIndex]     = useState(0);
  const [isFlipped, setIsFlipped]     = useState(false);
  const [hasGainedXp, setHasGainedXp] = useState(false);
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const level  = userLevel || 'A1';
        const next   = NEXT_LEVEL[level] || level;
        const levels = level === next ? [level] : [level, next];

        const all: VocabSet[] = [];
        for (const lvl of levels) {
          const snap = await getDocs(collection(db, 'content', 'vocabulary', lvl));
          snap.forEach(doc => all.push({ id: doc.id, ...doc.data() } as VocabSet));
        }
        setVocabSets(all);
      } catch (e) {
        console.error('Error loading vocabulary content:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userLevel]);

  const handleSelectSet = (set: VocabSet) => {
    setSelectedSet(set);
    setCardIndex(0);
    setIsFlipped(false);
    setHasGainedXp(false);
    setShowExample(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !hasGainedXp) {
      onGainXp(10);
      setHasGainedXp(true);
    }
  };

  const nextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setHasGainedXp(false);
    setShowExample(false);
    setCardIndex(prev => (prev + 1) % (selectedSet?.words.length || 1));
  };

  const prevCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setHasGainedXp(false);
    setShowExample(false);
    setCardIndex(prev => (prev - 1 + (selectedSet?.words.length || 1)) % (selectedSet?.words.length || 1));
  };

  if (loading) {
    return (
      <div className="vocab-studio">
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-dim)' }}>
          <div style={{ fontSize:'2rem', marginBottom:'12px' }}>🃏</div>
          <p style={{ fontWeight:700 }}>Loading vocabulary for your level…</p>
        </div>
      </div>
    );
  }

  if (vocabSets.length === 0) {
    return (
      <div className="vocab-studio">
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'16px' }}>🎉</div>
          <h2 style={{ fontWeight:900, marginBottom:'8px' }}>More content coming soon!</h2>
          <p style={{ color:'var(--text-dim)', marginBottom:'32px' }}>Check back soon for new vocabulary sets.</p>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </div>
    );
  }

  if (selectedSet) {
    const current = selectedSet.words[cardIndex];
    return (
      <div className="vocab-studio">
        <div className="flashcard-session">
          <div className="session-nav">
            <button className="change-cat-btn" onClick={() => setSelectedSet(null)}>← Change Topic</button>
            <div className="pill active">{selectedSet.topic}</div>
            <div className="pill"><b>{cardIndex + 1}</b> / {selectedSet.words.length}</div>
          </div>

          <div style={{ textAlign:'center', marginBottom:'8px' }}>
            <span className="grammar-level-badge" style={{ background: LEVEL_COLORS[selectedSet.level] }}>
              {selectedSet.level}
            </span>
          </div>

          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="card-inner">
              <div className="card-front">
                <span className="lock-tag" style={{ top:'30px', background:'var(--accent-light)', color:'var(--accent)' }}>Português</span>
                <h2>{current.word}</h2>
                <p style={{ marginTop:'20px', fontSize:'0.8rem', opacity:0.5, fontWeight:800 }}>Tap to Reveal</p>
              </div>
              <div className="card-back">
                <span className="lock-tag" style={{ top:'30px', background:'rgba(255,255,255,0.2)', color:'white' }}>English</span>
                <h2>{current.translation}</h2>
                <div style={{ marginTop:'20px', height:'20px' }}>{isFlipped && <span>+10 XP 🔥</span>}</div>
              </div>
            </div>
          </div>

          <button
            className="speak-btn speak-btn-large"
            onClick={e => { e.stopPropagation(); speak(current.word); }}
            style={{ marginTop:'16px' }}
          >
            🔊 Listen in Portuguese
          </button>

          {current.example_pt && (
            <div style={{ margin:'12px 16px 0', textAlign:'center' }}>
              {showExample ? (
                <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'12px' }}>
                  <p style={{ fontWeight:700, color:'#14532d', fontSize:'0.85rem', margin:'0 0 4px' }}>{current.example_pt}</p>
                  <p style={{ color:'#64748b', fontSize:'0.78rem', fontStyle:'italic', margin:0 }}>{current.example_en}</p>
                  <button onClick={() => setShowExample(false)} style={{ marginTop:'8px', fontSize:'0.72rem', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                    Hide example
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowExample(true)}
                  style={{ fontSize:'0.78rem', fontWeight:700, color:'#14532d', background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'8px', padding:'6px 14px', cursor:'pointer', fontFamily:'inherit' }}
                >
                  See example sentence
                </button>
              )}
            </div>
          )}

          <div className="back-btn-container" style={{ gap:'15px', marginTop:'16px' }}>
            <button className="back-btn" onClick={prevCard}>Previous</button>
            <button className="back-btn" style={{ background:'var(--accent)', color:'white' }} onClick={nextCard}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-studio">
      <header className="dashboard-header" style={{ marginBottom:'40px' }}>
        <h1 className="main-title" style={{ fontSize:'3rem' }}>Learn Vocabulary</h1>
        <p className="main-subtitle">
          {userLevel ? `Level ${userLevel} & ${NEXT_LEVEL[userLevel]}` : 'Choose a topic to practise'}
        </p>
      </header>

      <div className="vocab-cat-grid">
        {vocabSets.map(set => (
          <div key={set.id} className="cat-card" onClick={() => handleSelectSet(set)} style={{ position:'relative' }}>
            <div className="cat-icon">
              {TOPIC_ICONS[set.topic.toLowerCase()] || '📝'}
            </div>
            <div style={{ position:'absolute', top:'8px', right:'8px' }}>
              <span className="grammar-level-badge" style={{ background: LEVEL_COLORS[set.level], fontSize:'0.58rem', padding:'2px 6px' }}>
                {set.level}
              </span>
            </div>
            <h3 style={{ textTransform:'capitalize' }}>{set.topic}</h3>
            <p>{set.words.length} words</p>
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
