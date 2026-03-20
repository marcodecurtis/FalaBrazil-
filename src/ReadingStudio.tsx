import { useState } from 'react';
import { ARTICLES } from './articlesData';
import type { Article } from './articlesData';
import { speak, stopSpeaking } from './speak';

interface Props {
  onBack: () => void;
}

export default function ReadingStudio({ onBack }: Props) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [revealedParagraphs, setRevealedParagraphs] = useState<Set<number>>(new Set());
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

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
      if (next.has(index)) { next.delete(index); } else { next.add(index); }
      return next;
    });
  };

  const handleSpeak = (text: string, index: number) => {
    setSpeakingIndex(index);
    speak(text).finally(() => setSpeakingIndex(null));
  };

  if (selectedArticle) {
    return (
      <div className="reading-studio">
        <div className="article-detail">

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

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="translation-toggle-btn"
                onClick={() => {
                  setShowTranslation(!showTranslation);
                  if (!showTranslation) {
                    setRevealedParagraphs(new Set(selectedArticle.paragraphs.map((_, i) => i)));
                  } else {
                    setRevealedParagraphs(new Set());
                  }
                }}
              >
                {showTranslation ? '🙈 Esconder Tradução' : '🌍 Mostrar Toda a Tradução'}
              </button>
              <button
                className="translation-toggle-btn"
                style={{ background: '#2a9d8f' }}
                onClick={() => {
                  const fullText = selectedArticle.paragraphs.map(p => p.pt).join(' ');
                  handleSpeak(fullText, -1);
                }}
              >
                {speakingIndex === -1 ? '⏹ Parar' : '🔊 Ouvir Artigo Completo'}
              </button>
            </div>
          </div>

          <div className="article-paragraphs">
            {selectedArticle.paragraphs.map((para, i) => (
              <div key={i} className="article-paragraph-block">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <p className="article-pt-text" style={{ flex: 1, margin: 0 }}>{para.pt}</p>
                  <button
                    className="speak-btn"
                    style={{ flexShrink: 0, marginTop: '2px', background: speakingIndex === i ? '#e07b39' : undefined }}
                    onClick={() => handleSpeak(para.pt, i)}
                    title="Ouvir parágrafo"
                  >
                    {speakingIndex === i ? '⏹' : '🔊'}
                  </button>
                </div>

                {revealedParagraphs.has(i) ? (
                  <div className="article-translation-box" style={{ marginTop: '12px' }}>
                    <p className="article-en-text">{para.en}</p>
                    <button className="para-toggle-btn hide-btn" onClick={() => toggleParagraph(i)}>
                      Esconder ↑
                    </button>
                  </div>
                ) : (
                  <button className="para-toggle-btn show-btn" style={{ marginTop: '10px' }} onClick={() => toggleParagraph(i)}>
                    🌍 Traduzir este parágrafo
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="back-btn-container">
            <button className="back-btn" onClick={() => {
              stopSpeaking();
              setSelectedArticle(null);
              setShowTranslation(false);
              setRevealedParagraphs(new Set());
              setSpeakingIndex(null);
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
              setSpeakingIndex(null);
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
        <button className="back-btn" onClick={() => { stopSpeaking(); onBack(); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Voltar ao Menu
        </button>
      </div>
    </div>
  );
}
