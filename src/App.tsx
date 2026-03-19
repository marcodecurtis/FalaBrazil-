import { useState } from 'react';
import './App.css';
import VerbStudio from './VerbStudio';
import VocabStudio from './VocabStudio';
import GrammarStudio from './GrammarStudio';

type View = 'home' | 'verbs' | 'vocab' | 'grammar';

function App() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="container">

      {/* 1. DASHBOARD VIEW */}
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
            <h1 className="main-title">Fala Brazil</h1>
            <p className="main-subtitle">Aprende português do jeito certo</p>
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
          </div>
        </div>
      )}

      {/* 2. VERB STUDIO VIEW */}
      {view === 'verbs' && (
        <VerbStudio onBack={() => setView('home')} onGainXp={() => {}} />
      )}

      {/* 3. VOCAB STUDIO VIEW */}
      {view === 'vocab' && (
        <VocabStudio onBack={() => setView('home')} onGainXp={() => {}} />
      )}

      {/* 4. GRAMMAR STUDIO VIEW */}
      {view === 'grammar' && (
        <GrammarStudio onBack={() => setView('home')} />
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
