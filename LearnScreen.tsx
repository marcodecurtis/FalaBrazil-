// src/LearnScreen.tsx
// All 6 practice modules in one clean screen
// Replaces the "free practice" section that used to live at the bottom of TodayScreen

import './LearnScreen.css';

interface Props {
  onNavigate: (view: string) => void;
  userLevel: string | null;
}

const MODULES = [
  {
    id: 'verbs',
    label: 'Practise Verbs',
    desc: '100 essential verbs · 6 tenses',
    icon: '📚',
    color: '#ede9fe',
    textColor: '#5b21b6',
  },
  {
    id: 'vocab',
    label: 'Vocabulary',
    desc: 'Flashcards by category',
    icon: '🗂️',
    color: '#dcfce7',
    textColor: '#15803d',
  },
  {
    id: 'grammar',
    label: 'Grammar',
    desc: 'Rules for your level',
    icon: '✍️',
    color: '#e0f2fe',
    textColor: '#0369a1',
  },
  {
    id: 'reading',
    label: 'Reading',
    desc: 'Real Brazilian Portuguese texts',
    icon: '📰',
    color: '#f1f5f9',
    textColor: '#475569',
  },
  {
    id: 'pronunciation',
    label: 'Pronunciation',
    desc: '20 rules with native audio',
    icon: '🔊',
    color: '#fce7f3',
    textColor: '#9d174d',
  },
  {
    id: 'video',
    label: 'Watch & Learn',
    desc: 'Brazilian videos + comprehension',
    icon: '🎬',
    color: '#fef3c7',
    textColor: '#92400e',
  },
];

export default function LearnScreen({ onNavigate }: Props) {
  return (
    <div className="learn-wrapper bn-page-padding">

      <div className="learn-header">
        <h1 className="learn-title">Learn</h1>
        <p className="learn-subtitle">Choose what you want to practise</p>
      </div>

      <div className="learn-grid">
        {MODULES.map(mod => (
          <button
            key={mod.id}
            className="learn-card"
            onClick={() => onNavigate(mod.id)}
          >
            <div className="learn-card-icon" style={{ background: mod.color }}>
              <span style={{ fontSize: '22px' }}>{mod.icon}</span>
            </div>
            <div className="learn-card-body">
              <div className="learn-card-label">{mod.label}</div>
              <div className="learn-card-desc">{mod.desc}</div>
            </div>
            <div className="learn-card-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
