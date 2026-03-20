import { useState } from 'react';
import { GRAMMAR_RULES } from './grammarData';
import type { GrammarRule, GrammarExample } from './grammarData';
import { speak } from './speak';

interface Props {
  onBack: () => void;
}

export default function GrammarStudio({ onBack }: Props) {
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);

  const levelColor: Record<string, string> = {
    A1: '#4caf7d',
    A2: '#2196b5',
    B1: '#e07b39',
    B2: '#9c4fd6',
  };

  if (selectedRule) {
    return (
      <div className="grammar-studio">
        <div className="grammar-detail">
          <div className="grammar-detail-header">
            <span className="grammar-level-badge" style={{ background: levelColor[selectedRule.level] }}>
              {selectedRule.level}
            </span>
            <h2>{selectedRule.title}</h2>
            <p className="grammar-summary">{selectedRule.summary}</p>
          </div>

          <div className="grammar-explanation-box">
            <h4>📖 Explicação</h4>
            <p>{selectedRule.explanation}</p>
          </div>

          <div className="grammar-examples-list">
            <h4>✏️ Exemplos</h4>
            {selectedRule.examples.map((ex: GrammarExample, i: number) => (
              <div key={i} className="grammar-example-row">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div className="grammar-pt">{ex.pt}</div>
                    <div className="grammar-en">{ex.en}</div>
                  </div>
                  <button className="speak-btn" onClick={() => speak(ex.pt)} title="Ouvir pronúncia">🔊</button>
                </div>
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

  return (
    <div className="grammar-studio">
      <header className="dashboard-header" style={{ marginBottom: '32px' }}>
        <h1 className="main-title" style={{ fontSize: '2.8rem' }}>Gramática</h1>
        <p className="main-subtitle">20 regras essenciais do Português</p>
      </header>

      <div className="grammar-rules-grid">
        {GRAMMAR_RULES.map((rule: GrammarRule) => (
          <div key={rule.id} className="grammar-rule-card" onClick={() => setSelectedRule(rule)}>
            <div className="grammar-rule-left">
              <span className="grammar-level-badge" style={{ background: levelColor[rule.level] }}>
                {rule.level}
              </span>
              <div>
                <h3>{rule.title}</h3>
                <p>{rule.summary}</p>
              </div>
            </div>
            <div className="card-arrow">→</div>
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
