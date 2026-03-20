import { useState } from 'react';
import './WelcomeScreen.css';

interface Props {
  onFinish: () => void;
}

const SLIDES = [
  {
    id: 1,
    tag: 'Verbos',
    title: 'Conjuga verbos como um nativo',
    desc: '100 verbos essenciais. 6 tempos. Modo estudo ou quiz interativo.',
    color: '#14532d',
    bg: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
    accent: '#14532d',
    mockup: 'verbs',
  },
  {
    id: 2,
    tag: 'Vocabulário',
    title: 'Aprende palavras com flashcards',
    desc: '10 categorias temáticas. Clica para revelar. Ouve a pronúncia.',
    color: '#1d4ed8',
    bg: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
    accent: '#1d4ed8',
    mockup: 'vocab',
  },
  {
    id: 3,
    tag: 'Gramática',
    title: 'Gramática clara e com exemplos',
    desc: '20 regras do A1 ao B2. Cada regra com explicação e frases reais.',
    color: '#7c3aed',
    bg: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)',
    accent: '#7c3aed',
    mockup: 'grammar',
  },
  {
    id: 4,
    tag: 'Leitura',
    title: 'Lê artigos reais em português',
    desc: 'Cultura, gastronomia, futebol. Tradução integrada parágrafo a parágrafo.',
    color: '#b45309',
    bg: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)',
    accent: '#b45309',
    mockup: 'reading',
  },
];

function VerbsMockup() {
  return (
    <div className="wc-mockup-inner">
      <div className="wc-mock-header">
        <div className="wc-mock-title">Praticar Verbos</div>
        <div className="wc-mock-verb-pill">
          <span className="wc-mock-dot" />
          Falar — to speak
          <span className="wc-mock-speak">🔊</span>
        </div>
      </div>
      <div className="wc-mock-tense-label">Presente <span className="wc-mock-badge">Study</span></div>
      {[['Eu', 'falo'], ['Tu', 'falas'], ['Ele/Ela', 'fala'], ['Nós', 'falamos']].map(([p, v]) => (
        <div key={p} className="wc-mock-row">
          <span className="wc-mock-person">{p}</span>
          <span className="wc-mock-verb">{v} <span className="wc-mock-speak-sm">🔊</span></span>
        </div>
      ))}
      <div className="wc-mock-sentence">Eu falo todos os dias. 🔊</div>
    </div>
  );
}

function VocabMockup() {
  return (
    <div className="wc-mockup-inner">
      <div className="wc-mock-session-nav">
        <span className="wc-mock-cat-btn">← Natureza</span>
        <span className="wc-mock-counter">1 / 20</span>
      </div>
      <div className="wc-mock-flashcard">
        <div className="wc-mock-card-label">PORTUGUÊS</div>
        <div className="wc-mock-card-word">Areia</div>
        <div className="wc-mock-card-hint">Toca para revelar</div>
      </div>
      <div className="wc-mock-listen-btn">🔊 Ouvir em português</div>
      <div className="wc-mock-nav-row">
        <div className="wc-mock-prev">Anterior</div>
        <div className="wc-mock-next">Próximo</div>
      </div>
    </div>
  );
}

function GrammarMockup() {
  return (
    <div className="wc-mockup-inner">
      <div className="wc-mock-rule-header">
        <div className="wc-mock-level-dot" style={{ background: '#2196b5' }}>A2</div>
        <div className="wc-mock-rule-title">Ser vs. Estar</div>
        <div className="wc-mock-rule-sub">Two verbs both mean 'to be'...</div>
      </div>
      <div className="wc-mock-explanation">
        <div className="wc-mock-exp-label">📖 Explicação</div>
        <div className="wc-mock-exp-text">Use 'ser' for permanent characteristics. Use 'estar' for temporary states.</div>
      </div>
      {[['Eu sou português.', 'I am Portuguese.'], ['Eu estou cansado.', 'I am tired.']].map(([pt, en]) => (
        <div key={pt} className="wc-mock-example">
          <div className="wc-mock-ex-pt">{pt} <span className="wc-mock-speak-sm">🔊</span></div>
          <div className="wc-mock-ex-en">{en}</div>
        </div>
      ))}
    </div>
  );
}

function ReadingMockup() {
  return (
    <div className="wc-mockup-inner">
      <div className="wc-mock-article-top">
        <span className="wc-mock-topic-badge" style={{ background: '#e63946' }}>🎭 Cultura Brasileira</span>
        <span className="wc-mock-level-dot" style={{ background: '#e07b39', fontSize: '0.6rem' }}>B1</span>
      </div>
      <div className="wc-mock-article-title">O Carnaval do Rio de Janeiro</div>
      <div className="wc-mock-article-intro">O maior espetáculo da Terra...</div>
      <div className="wc-mock-article-btns">
        <div className="wc-mock-translate-btn">🌍 Mostrar Tradução</div>
        <div className="wc-mock-listen-btn" style={{ background: '#2a9d8f' }}>🔊 Ouvir Artigo</div>
      </div>
      <div className="wc-mock-para">
        O Carnaval do Rio é considerado o maior e mais famoso carnaval do mundo...
        <span className="wc-mock-speak-sm" style={{ marginLeft: 4 }}>🔊</span>
      </div>
    </div>
  );
}

const MOCKUPS = { verbs: VerbsMockup, vocab: VocabMockup, grammar: GrammarMockup, reading: ReadingMockup };

export default function WelcomeScreen({ onFinish }: Props) {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;
  const MockupComponent = MOCKUPS[slide.mockup as keyof typeof MOCKUPS];

  return (
    <div className="wc-wrapper" style={{ background: slide.bg }}>

      {/* Skip button */}
      <button className="wc-skip" onClick={onFinish}>Saltar →</button>

      {/* Phone mockup */}
      <div className="wc-phone-wrap">
        <div className="wc-phone" style={{ borderColor: slide.accent + '33' }}>
          <div className="wc-phone-notch" />
          <div className="wc-phone-screen">
            <div className="wc-phone-topbar">
              <img src="https://flagcdn.com/w40/br.png" alt="BR" className="wc-phone-flag" />
              <span className="wc-phone-appname" style={{ color: slide.accent }}>Fala Brazil!</span>
            </div>
            <MockupComponent />
          </div>
        </div>
        {/* Glow behind phone */}
        <div className="wc-phone-glow" style={{ background: slide.accent + '22' }} />
      </div>

      {/* Text content */}
      <div className="wc-content">
        <div className="wc-tag" style={{ color: slide.accent, background: slide.accent + '15' }}>{slide.tag}</div>
        <h2 className="wc-title" style={{ color: slide.color }}>{slide.title}</h2>
        <p className="wc-desc">{slide.desc}</p>
      </div>

      {/* Dots */}
      <div className="wc-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`wc-dot ${i === current ? 'wc-dot-active' : ''}`}
            style={i === current ? { background: slide.accent } : {}}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="wc-actions">
        {!isLast ? (
          <button className="wc-next-btn" style={{ background: slide.accent }} onClick={() => setCurrent(c => c + 1)}>
            Próximo →
          </button>
        ) : (
          <button className="wc-start-btn" style={{ background: slide.accent }} onClick={onFinish}>
            Começar agora →
          </button>
        )}
      </div>
    </div>
  );
}
