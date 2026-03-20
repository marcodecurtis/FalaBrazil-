import { useState } from 'react';
import { ARTICLES } from './articlesData';
import type { Article } from './articlesData';

interface Props {
  onBack: () => void;
}

export default function ReadingStudio({ onBack }: Props) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [revealedParagraphs, setRevealedParagraphs] = useState<Set<number>>(new Set());

  const levelColor: Record<string, string> = {
    A2: '#2196b5',
    B1: '#e07b39',
    B2: '#9c4fd6',
  };

  const topicColor: Record<string, string> = {
    "Cultura Brasileira": '#e63946',
    "Comida & Gastronomia": '#f4a261',
    "Futebol & Desporto": '#2a9d8f',
    "Natureza & Amazónia": '#4caf7d',
  };

  const toggleParagraph = (index: number) => {
    setRevealedParagraphs(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // --- ARTICLE DETAIL VIEW ---
  if (selectedArticle) {
    return (
      <div className="reading-studio">
        <div className="article-detail">

          {/* Header */}
          <div className="article-detail-header">
            <div className="article-meta-row">
              <span className="article-topic-badge" style={{ background: topicColor[selectedArticle.topic] }}>
                {selectedArticle.emoji} {selectedArticle.topic}
              </span>
              <span className="grammar-level-badge" style={{ background: levelColor[selectedArticle.level] }}>
                {selectedArticle.level}
              </span>
            </div>
            <h2>{selectedArticle.title}</h2>
            <p className="article-intro">{selectedArticle.intro}</p>

            {/* Global toggle */}
            <button
              className="translation-toggle-btn"
              onClick={() => {
                setShowTranslation(!showTranslation);
                if (!showTranslation) {
                  const all = new Set(selectedArticle.paragraphs.map((_, i) => i));
                  setRevealedParagraphs(all);
                } else {
                  setRevealedParagraphs(new Set());
                }
              }}
            >
              {showTranslation ? '🙈 Esconder Tradução' : '🌍 Mostrar Toda a Tradução'}
            </button>
          </div>

          {/* Paragraphs */}
          <div className="article-paragraphs">
            {selectedArticle.paragraphs.map((para, i) => (
              <div key={i} className="article-paragraph-block">
                <p className="article-pt-text">{para.pt}</p>
                {revealedParagraphs.has(i) ? (
                  <div className="article-translation-box">
                    <p className="article-en-text">{para.en}</p>
                    <button className="para-toggle-btn hide-btn" onClick={() => toggleParagraph(i)}>
                      Esconder ↑
                    </button>
                  </div>
                ) : (
                  <button className="para-toggle-btn show-btn" onClick={() => toggleParagraph(i)}>
                    🌍 Traduzir este parágrafo
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="back-btn-container">
            <button className="back-btn" onClick={() => {
              setSelectedArticle(null);
              setShowTranslation(false);
              setRevealedParagraphs(new Set());
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Voltar aos Artigos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ARTICLE LIST VIEW ---
  return (
    <div className="reading-studio">
      <header className="dashboard-header" style={{ marginBottom: '32px' }}>
        <h1 className="main-title" style={{ fontSize: '2.8rem' }}>Leitura</h1>
        <p className="main-subtitle">Lê artigos reais em português</p>
      </header>

      <div className="articles-grid">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            className="article-card"
            onClick={() => {
              setSelectedArticle(article);
              setShowTranslation(false);
              setRevealedParagraphs(new Set());
            }}
          >
            <div className="article-card-top" style={{ background: topicColor[article.topic] }}>
              <span className="article-card-emoji">{article.emoji}</span>
              <span className="grammar-level-badge" style={{ background: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>
                {article.level}
              </span>
            </div>
            <div className="article-card-body">
              <span className="article-card-topic">{article.topic}</span>
              <h3>{article.title}</h3>
              <p>{article.intro}</p>
              <div className="article-card-footer">
                <span>📖 {article.paragraphs.length} parágrafos</span>
                <span className="article-read-btn">Ler →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="back-btn-container">
        <button className="back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
