import { useState } from 'react';
import { VOCAB_LIBRARY } from './vocabData';
import type { VocabItem } from './vocabData';

interface Props {
  onBack: () => void;
  onGainXp: (amount: number) => void;
}

const shuffleArray = (array: VocabItem[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function VocabStudio({ onBack, onGainXp }: Props) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [words, setWords] = useState<VocabItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasGainedXpForCard, setHasGainedXpForCard] = useState(false);

  const handleSelectCategory = (cat: string) => {
    const shuffled = shuffleArray(VOCAB_LIBRARY[cat]);
    setWords(shuffled);
    setSelectedCat(cat);
    setIndex(0);
    setIsFlipped(false);
    setHasGainedXpForCard(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !hasGainedXpForCard) {
      onGainXp(10);
      setHasGainedXpForCard(true);
    }
  };

  const nextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setHasGainedXpForCard(false);
    setIndex((prev) => (prev + 1) % words.length);
  };

  const prevCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setHasGainedXpForCard(false);
    setIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  if (!selectedCat) {
    return (
      <div className="vocab-studio">
        <header className="dashboard-header" style={{ marginBottom: '40px' }}>
          <h1 className="main-title" style={{ fontSize: '3rem' }}>Vocabulário</h1>
          <p className="main-subtitle">Escolha um cluster para praticar</p>
        </header>

        <div className="vocab-cat-grid">
          {Object.keys(VOCAB_LIBRARY).map((cat) => (
            <div key={cat} className="cat-card" onClick={() => handleSelectCategory(cat)}>
              <div className="cat-icon">
                {cat === "Natureza" && "🌿"}
                {cat === "Casa" && "🏠"}
                {cat === "Comida" && "🍎"}
                {cat === "Profissões" && "💼"}
                {cat === "Viagem" && "✈️"}
                {cat === "Animais" && "🐾"}
                {cat === "Cidade" && "🏙️"}
                {cat === "Corpo" && "👤"}
                {cat === "Tempo" && "⏰"}
                {cat === "Cores" && "🎨"}
              </div>
              <h3>{cat}</h3>
              <p>{VOCAB_LIBRARY[cat].length} Palavras</p>
            </div>
          ))}
        </div>

        <div className="back-btn-container">
          <button className="back-btn" onClick={onBack}>Voltar ao Dashboard</button>
        </div>
      </div>
    );
  }

  const current = words[index];

  return (
    <div className="vocab-studio">
      <div className="flashcard-session">
        <div className="session-nav">
          <button className="change-cat-btn" onClick={() => setSelectedCat(null)}>← Trocar Categoria</button>
          <div className="pill active">{selectedCat}</div>
          <div className="pill"><b>{index + 1}</b> / {words.length}</div>
        </div>

        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="card-inner">
            <div className="card-front">
              <span className="lock-tag" style={{ top: '30px', background: 'var(--accent-light)', color: 'var(--accent)' }}>Português</span>
              <h2>{current.pt}</h2>
              <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5, fontWeight: 800 }}>Tap to Reveal</p>
            </div>
            <div className="card-back">
              <span className="lock-tag" style={{ top: '30px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>English</span>
              <h2>{current.en}</h2>
              <div style={{ marginTop: '20px', height: '20px' }}>{isFlipped && <span>+10 XP 🔥</span>}</div>
            </div>
          </div>
        </div>

        <div className="back-btn-container" style={{ gap: '15px', marginTop: '30px' }}>
          <button className="back-btn" onClick={prevCard}>Anterior</button>
          <button className="back-btn" style={{ background: 'var(--accent)', color: 'white' }} onClick={nextCard}>Próximo</button>
        </div>
      </div>
    </div>
  );
}