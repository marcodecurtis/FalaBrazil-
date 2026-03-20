import { useState } from 'react';
import { PRONUNCIATION_RULES } from './pronunciationData';
import type { PronunciationRule } from './pronunciationData';
import { speak } from './speak';

interface Props {
  onBack: () => void;
}

const categoryColors: Record<string, string> = {
  "Vogais": "#e63946",
  "Vogais Nasais": "#9c4fd6",
  "Consoantes": "#2a9d8f",
  "Dígrafos": "#e07b39",
  "Ditongos": "#f4a261",
  "Sons Especiais": "#2196b5",
  "Sotaques": "#14532d",
  "Ritmo": "#c77dff",
  "Acento": "#e9c46a",
  "Expressões": "#06d6a0",
};

export default function PronunciationStudio({ onBack }: Props) {
  const [selectedRule, setSelectedRule] = useState<PronunciationRule | null>(null);
  const [filter, setFilter] = useState<string>("Todos");

  const categories = ["Todos", ...Array.from(new Set(PRONUNCIATION_RULES.map(r => r.category)))];
  const filtered = filter === "Todos" ? PRONUNCIATION_RULES : PRONUNCIATION_RULES.filter(r => r.category === filter);

  // --- RULE DETAIL PAGE ---
  if (selectedRule) {
    const color = categoryColors[selectedRule.category] || '#14532d';
    return (
      <div className="pronunciation-studio">
        <div className="pronunciation-detail">

          <div className="pronunciation-detail-header" style={{ borderBottom: `3px solid ${color}` }}>
            <div className="pronunciation-meta-row">
              <span className="pronunciation-cat-badge" style={{ background: color }}>
                {selectedRule.emoji} {selectedRule.category}
              </span>
            </div>
            <h2>{selectedRule.title}</h2>
            <p className="pronunciation-summary">{selectedRule.summary}</p>
          </div>

          <div className="pronunciation-explanation-box">
            <h4>📖 Explicação</h4>
            <p>{selectedRule.explanation}</p>
          </div>

          <div className="pronunciation-tip-box">
            <h4>💡 Dica</h4>
            <p>{selectedRule.tip}</p>
          </div>

          <div className="pronunciation-examples-list">
            <h4>🔊 Exemplos — clica para ouvir</h4>
            {selectedRule.examples.map((ex, i) => (
              <div
                key={i}
                className="pronunciation-example-row"
                onClick={() => speak(ex.word)}
              >
                <div className="pronunciation-example-left">
                  <div className="pronunciation-word">{ex.word}</div>
                  <div className="pronunciation-phonetic">/{ex.phonetic}/</div>
                  <div className="pronunciation-meaning">{ex.meaning}</div>
                </div>
                <button className="speak-btn speak-btn-round" title="Ouvir pronúncia">
                  🔊
                </button>
              </div>
            ))}
          </div>

          <div className="back-btn-container">
            <button className="back-btn" onClick={() => setSelectedRule(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Voltar à Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RULE LIST PAGE ---
  return (
    <div className="pronunciation-studio">
      <header className="dashboard-header" style={{ marginBottom: '24px' }}>
        <h1 className="main-title" style={{ fontSize: '2.8rem' }}>Pronúncia</h1>
        <p className="main-subtitle">Aprende a soar como um brasileiro</p>
      </header>

      {/* Category Filter */}
      <div className="pronunciation-filter-row">
        {categories.map(cat => (
          <button
            key={cat}
            className={`pronunciation-filter-btn ${filter === cat ? 'active' : ''}`}
            style={filter === cat && cat !== "Todos" ? { background: categoryColors[cat], borderColor: categoryColors[cat] } : {}}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pronunciation-rules-grid">
        {filtered.map((rule) => {
          const color = categoryColors[rule.category] || '#14532d';
          return (
            <div
              key={rule.id}
              className="pronunciation-rule-card"
              onClick={() => setSelectedRule(rule)}
            >
              <div className="pronunciation-card-top" style={{ background: color }}>
                <span className="pronunciation-card-emoji">{rule.emoji}</span>
                <span className="pronunciation-card-cat">{rule.category}</span>
              </div>
              <div className="pronunciation-card-body">
                <h3>{rule.title}</h3>
                <p>{rule.summary}</p>
                <div className="pronunciation-card-footer">
                  <span>🔊 {rule.examples.length} exemplos</span>
                  <span className="pronunciation-read-btn">Ver →</span>
                </div>
              </div>
            </div>
          );
        })}
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
