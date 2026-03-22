import { useState, useRef } from 'react';
import './WelcomeScreen.css';

interface Props {
  onFinish: () => void;
}

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900&q=85',
    imageAlt: 'Rio de Janeiro panorama',
    eyebrow: 'Welcome · Bem-vindo',
    titleEn: 'Speak Portuguese like a Brazilian',
    titlePt: 'Fala português como um brasileiro',
    descEn: 'The most vibrant language in the world — now in your pocket.',
    features: null,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900&q=85',
    imageAlt: 'Soccer players on the pitch',
    eyebrow: 'Learn · Aprende',
    titleEn: 'From beginner to fluent — A1 to C2',
    titlePt: 'Do iniciante ao fluente — A1 ao C2',
    descEn: 'Structured lessons across every CEFR level, built for real progress.',
    features: null,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=900&q=85',
    imageAlt: 'Carnival Rio',
    eyebrow: 'Culture · Cultura',
    titleEn: 'Dive into Brazilian culture',
    titlePt: 'Mergulha na cultura brasileira',
    descEn: 'Real articles, carnival, music. Learn how Brazilians actually live.',
    features: null,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=900&q=85',
    imageAlt: 'Copacabana beach',
    eyebrow: 'Everything you need · Tudo que precisas',
    titleEn: 'One app. Every skill.',
    titlePt: 'Uma app. Todas as competências.',
    descEn: null,
    features: [
      { icon: '📚', label: 'Verbs', desc: '100 verbs · 6 tenses' },
      { icon: '🃏', label: 'Vocab', desc: '10 categories · flashcards' },
      { icon: '📖', label: 'Grammar', desc: 'A1 to C2 · clear rules' },
      { icon: '📰', label: 'Reading', desc: 'Real Brazilian articles' },
      { icon: '🔊', label: 'Pronunciation', desc: 'AI-powered feedback' },
      { icon: '🤖', label: 'AI Tutor', desc: 'Chat in Portuguese' },
    ],
  },
  {
    id: 5,
    image: '/Dancer.png',
    imageAlt: 'Brazilian carnival dancer',
    eyebrow: 'Start · Começa',
    titleEn: 'Your first lesson starts now',
    titlePt: 'A tua primeira aula começa agora',
    descEn: 'No sign-up needed. Just tap and go.',
    features: null,
  },
];

export default function WelcomeScreen({ onFinish }: Props) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const goNext = () => { if (!isLast) setCurrent(c => c + 1); };
  const goPrev = () => { if (current > 0) setCurrent(c => c - 1); };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  return (
    <div className="wc-root" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* Top: Image */}
      <div className="wc-image-section" key={slide.id}>
        <img src={slide.image} alt={slide.imageAlt} className="wc-photo" />
        <div className="wc-photo-scrim" />
        <div className="wc-logo-overlay">
          <img src="https://flagcdn.com/w40/br.png" alt="BR" className="wc-flag" />
          <span className="wc-logo-text">Fala Brazil!</span>
        </div>
        <button className="wc-skip" onClick={onFinish}>Skip</button>
      </div>

      {/* Bottom: Content card */}
      <div className="wc-card" key={`card-${slide.id}`}>
        <div className="wc-eyebrow">{slide.eyebrow}</div>
        <h1 className="wc-title">{slide.titleEn}</h1>
        <p className="wc-title-pt">{slide.titlePt}</p>

        {/* Features grid (slide 4 only) */}
        {slide.features ? (
          <div className="wc-features">
            {slide.features.map(f => (
              <div key={f.label} className="wc-feature-item">
                <span className="wc-feature-icon">{f.icon}</span>
                <span className="wc-feature-label">{f.label}</span>
                <span className="wc-feature-desc">{f.desc}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="wc-desc">{slide.descEn}</p>
        )}

        <div className="wc-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`wc-dot ${i === current ? 'wc-dot-active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {!isLast ? (
          <button className="wc-btn" onClick={goNext}>Next →</button>
        ) : (
          <button className="wc-btn wc-btn-final" onClick={onFinish}>Começar agora →</button>
        )}
      </div>
    </div>
  );
}
