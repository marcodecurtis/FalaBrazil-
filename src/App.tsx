import { useState } from 'react';
import './App.css';
import VerbStudio from './VerbStudio';
import VocabStudio from './VocabStudio';
import GrammarStudio from './GrammarStudio';
import ReadingStudio from './ReadingStudio';
import PronunciationStudio from './PronunciationStudio';
import ExpressionsStudio from './ExpressionsStudio';

type View = 'home' | 'verbs' | 'vocab' | 'grammar' | 'reading' | 'pronunciation' | 'expressions';

function App() {
  const [view, setView] = useState<View>('home');

  return (
    <div className="container">

      {view !== 'home' && (
        <button className="top-back-btn" onClick={() => setView('home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Voltar
        </button>
      )}

      {view === 'home' && (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="flag-circle">
              <img src="https://flagcdn.com/w160/br.png" alt="Brazil"
                style={{ width: '60px', height: '42px', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
            <h1 className="main-title">Fala Brazil!</h1>
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
                <h3>Dominar a Gramatica</h3>
                <p>20 regras essenciais com exemplos do A1 ao B2.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('reading')}>
              <div className="card-icon">📰</div>
              <div className="card-content">
                <h3>Ler em Portugues</h3>
                <p>10 artigos reais em português com tradução integrada.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('pronunciation')}>
              <div className="card-icon">🔊</div>
              <div className="card-content">
                <h3>Pronunciar Bem</h3>
                <p>20 regras de pronúncia com exemplos para ouvir.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>

            <div className="nav-card" onClick={() => setView('expressions')}>
              <div className="card-icon">💬</div>
              <div className="card-content">
                <h3>Falar no Dia a Dia</h3>
                <p>100 expressões essenciais organizadas por categoria.</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          </div>
        </div>
      )}

      {view === 'verbs' && <VerbStudio onBack={() => setView('home')} onGainXp={() => {}} />}
      {view === 'vocab' && <VocabStudio onBack={() => setView('home')} onGainXp={() => {}} />}
      {view === 'grammar' && <GrammarStudio onBack={() => setView('home')} />}
      {view === 'reading' && <ReadingStudio onBack={() => setView('home')} />}
      {view === 'pronunciation' && <PronunciationStudio onBack={() => setView('home')} />}
      {view === 'expressions' && <ExpressionsStudio onBack={() => setView('home')} />}

      <footer style={{ marginTop: 'auto', paddingTop: '60px', paddingBottom: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
        Created by{' '}
        <a href="https://www.nocodediary.co.uk/" target="_blank" rel="noopener noreferrer"
          style={{ color: '#14532d', fontWeight: 800, textDecoration: 'none' }}>
          Marco De Curtis
        </a>
      </footer>
    </div>
  );
}

export default App;
