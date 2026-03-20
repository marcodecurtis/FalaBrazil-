import { useState } from 'react';
import { EXPRESSION_CATEGORIES } from './expressionsData';
import type { ExpressionCategory, Expression } from './expressionsData';
import { speak } from './speak';

interface Props {
  onBack: () => void;
}

export default function ExpressionsStudio({ onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<ExpressionCategory | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<Expression | null>(null);

  if (selectedExpression && selectedCategory) {
    return (
      <div className="expressions-studio">
        <div className="expression-detail">
          <div className="expression-detail-header" style={{ borderLeft: `4px solid ${selectedCategory.color}` }}>
            <span className="expression-cat-label" style={{ color: selectedCategory.color }}>
              {selectedCategory.emoji} {selectedCategory.title}
            </span>
            <h2 className="expression-main-pt">{selectedExpression.pt}</h2>
            <div className="expression-main-en">{selectedExpression.en}</div>
            <button className="speak-btn-large" style={{ marginTop: '16px' }} onClick={() => speak(selectedExpression.pt)}>
              🔊 Ouvir pronúncia
            </button>
          </div>

          <div className="expression-example-box">
            <h4>💬 Exemplo em contexto</h4>
            <div className="expression-example-pt">{selectedExpression.example}</div>
            <div className="expression-example-en">{selectedExpression.exampleEn}</div>
            <button className="speak-btn" style={{ marginTop: '10px' }} onClick={() => speak(selectedExpression.example)}>
              🔊 Ouvir exemplo
            </button>
          </div>

          <div className="back-btn-container" style={{ marginTop: '24px' }}>
            <button className="back-btn" onClick={() => setSelectedExpression(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Voltar à lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="expressions-studio">
        <div className="expressions-cat-header" style={{ borderBottom: `3px solid ${selectedCategory.color}` }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{selectedCategory.emoji}</div>
          <h2>{selectedCategory.title}</h2>
          <p>{selectedCategory.description}</p>
        </div>

        <div className="expressions-list">
          {selectedCategory.expressions.map((expr, i) => (
            <div key={i} className="expression-row" onClick={() => setSelectedExpression(expr)}>
              <div className="expression-row-left">
                <div className="expression-row-pt">{expr.pt}</div>
                <div className="expression-row-en">{expr.en}</div>
              </div>
              <div className="expression-row-right">
                <button className="speak-btn" onClick={(e) => { e.stopPropagation(); speak(expr.pt); }} title="Ouvir">🔊</button>
                <span className="expression-row-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="back-btn-container">
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Voltar às categorias
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="expressions-studio">
      <header className="dashboard-header" style={{ marginBottom: '32px' }}>
        <h1 className="main-title" style={{ fontSize: '2.8rem' }}>Expressões</h1>
        <p className="main-subtitle">100 expressões do português brasileiro do dia a dia</p>
      </header>

      <div className="expressions-grid">
        {EXPRESSION_CATEGORIES.map((cat) => (
          <div key={cat.id} className="expressions-cat-card" onClick={() => setSelectedCategory(cat)}>
            <div className="expressions-cat-top" style={{ background: cat.color }}>
              <span className="expressions-cat-emoji">{cat.emoji}</span>
            </div>
            <div className="expressions-cat-body">
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
              <div className="expressions-cat-footer">
                <span>💬 {cat.expressions.length} expressões</span>
                <span className="expressions-read-btn">Ver →</span>
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
