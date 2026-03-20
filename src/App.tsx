import { useState, useEffect } from 'react';
import './App.css';
import VerbStudio from './VerbStudio';
import VocabStudio from './VocabStudio';
import GrammarStudio from './GrammarStudio';
import ReadingStudio from './ReadingStudio';
import PronunciationStudio from './PronunciationStudio';
import OnboardingScreen from './OnboardingScreen';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type View = 'onboarding' | 'home' | 'verbs' | 'vocab' | 'grammar' | 'reading' | 'pronunciation';

function App() {
  const [view, setView] = useState<View>('onboarding');
  const [userLevel, setUserLevel] = useState<Level | null>(null);

  // On first load: check if user already has a saved level
  useEffect(() => {
    const saved = localStorage.getItem('userLevel') as Level | null;
    if (saved) {
      setUserLevel(saved);
      setView('home');
    }
  }, []);

  const handleOnboardingComplete = (level: Level) => {
    setUserLevel(level);
    setView('home');
  };

  return (
    <div className="container">

      {/* ── BACK BUTTON (all views except home & onboarding) ── */}
      {view !== 'home' && view !== 'onboarding' && (
        <button className="top-back-btn" onClick={() => setView('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Voltar
        </button>
      )}

      {/* ── ONBOARDING ── */}
      {view === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* ── HOME DASHBOARD ── */}
      {view === 'home' && (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="flag-circle">
              <img
                src="https://flagcdn.com/w160/br.png"
                alt="Brazil"
                style={{ width: '60px', height: '42px', borderRadius: '4px', objectFit: 'cover' }}
              />
            </div>
            <h1 className="main-title">Fala Brazil!</h1>
            <p className="main-subtitle">Aprende português do jeito certo</p>

            {/* Level badge — shown once user has a level */}
            {userLevel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                <span style={{
                  background: 'var(--accent)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  letterSpacing: '0.5px',
                }}>
                  Nível {userLevel}
                </span>
                <button
                  onClick={() => setView('onboarding')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                  }}
                >
                  Alterar nível
                </button>
              </div>
            )}
          </header>

          <div className="grid-nav">
            <div className="nav-card" onClick={() => setView('verbs')}>
              <div className="card-icon">📚</div>
              <div className="card-content">
                <h3>Praticar Verbos</h3>
                <p>Treine as 6 conjugações mais importantes de 100 verbos.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('vocab')}>
              <div className="card-icon">🗂️</div>
              <div className="card-content">
                <h3>Aprender Palavras</h3>
                <p>Flashcards inteligentes divididos por 10 categorias.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('grammar')}>
              <div className="card-icon">✍️</div>
              <div className="card-content">
                <h3>Gramática</h3>
                <p>20 regras essenciais com exemplos do A1 ao B2.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('reading')}>
              <div className="card-icon">📰</div>
              <div className="card-content">
                <h3>Leitura</h3>
                <p>Lê artigos reais em português com tradução integrada.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('pronunciation')}>
              <div className="card-icon">🔊</div>
              <div className="card-content">
                <h3>Pronúncia</h3>
                <p>20 regras de pronúncia com exemplos para ouvir.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          </div>
        </div>
      )}

      {/* ── VERB STUDIO ── */}
      {view === 'verbs' && (
        <VerbStudio onBack={() => setView('home')} onGainXp={() => {}} />
      )}

      {/* ── VOCAB STUDIO ── */}
      {view === 'vocab' && (
        <VocabStudio onBack={() => setView('home')} onGainXp={() => {}} />
      )}

      {/* ── GRAMMAR STUDIO ── */}
      {view === 'grammar' && (
        <GrammarStudio onBack={() => setView('home')} />
      )}

      {/* ── READING STUDIO ── */}
      {view === 'reading' && (
        <ReadingStudio onBack={() => setView('home')} />
      )}

      {/* ── PRONUNCIATION STUDIO ── */}
      {view === 'pronunciation' && (
        <PronunciationStudio onBack={() => setView('home')} />
      )}

      {/* FOOTER */}
      <footer style={{ marginTop: 'auto', paddingTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        Created by{' '}
        <a
          href="https://www.nocodediary.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#14532d', fontWeight: 800, textDecoration: 'none' }}
        >
          Marco De Curtis
        </a>
      </footer>
    </div>
  );
}

export default App;
