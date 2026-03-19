import { useState } from 'react';
import { VERB_BANK, TENSE_ORDER, PERSON_ORDER, norm } from './verbData';

interface Props {
  onBack: () => void;
  onGainXp: (amount: number) => void;
}

export default function VerbStudio({ onBack, onGainXp }: Props) {
  const [currentVerb, setCurrentVerb] = useState("Falar");
  const [isQuiz, setIsQuiz] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [rewardedForms, setRewardedForms] = useState<Set<string>>(new Set());

  const allVerbKeys = Object.keys(VERB_BANK).sort();
  
  const filteredKeys = allVerbKeys.filter(key => {
    const verbData = VERB_BANK[key];
    const search = norm(searchTerm);
    return norm(key).includes(search) || norm(verbData.meaning).includes(search);
  });

  const verb = VERB_BANK[currentVerb];

  if (!verb) {
    return (
      <div className="container">
        <h2 style={{ color: 'var(--accent)' }}>Carregando verbos...</h2>
        <button className="back-btn" onClick={onBack}>Voltar</button>
      </div>
    );
  }

  const handleInputChange = (tense: string, index: number, value: string) => {
    const inputKey = `${tense}-${index}`;
    const uniqueId = `${currentVerb}-${inputKey}`;
    setUserInputs({ ...userInputs, [inputKey]: value });

    const tenseData = verb.tenses[tense];
    const correctForm = tenseData.forms[index];
    
    if (norm(value) === norm(correctForm) && !rewardedForms.has(uniqueId)) {
      onGainXp(20);
      setRewardedForms(prev => new Set(prev).add(uniqueId));
    }
  };

  return (
    <div className="verb-studio">
      <div className="header-glass">
        <div className="top-row">
          <div className="controls-group">
            <div className="search-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search verb or meaning..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="verb-search-input"
              />
            </div>

            <select 
              className="verb-select"
              value={currentVerb} 
              onChange={(e) => {
                setCurrentVerb(e.target.value); 
                setUserInputs({}); 
              }}
            >
              {filteredKeys.length > 0 ? (
                filteredKeys.map(v => <option key={v} value={v}>{v}</option>)
              ) : (
                <option disabled>No verbs found...</option>
              )}
            </select>
          </div>

          <div className="mode-selector" onClick={() => setIsQuiz(!isQuiz)}>
            <span className="mode-label">Mode <b>{isQuiz ? "Quiz" : "Study"}</b></span>
            <div className={`toggle-switch ${isQuiz ? 'active' : ''}`}>
              <div className="switch-handle" />
            </div>
          </div>
        </div>
        
        <div className="pill-row">
          <div className="pill active">● <b>{currentVerb}</b> — {verb.meaning}</div>
          <div className="pill">Tenses <b>{TENSE_ORDER.length}</b></div>
          <div className="pill">XP per correct <b>20</b></div>
        </div>
      </div>

      <div className="verb-grid">
        {TENSE_ORDER.map(tenseName => {
          const tenseData = verb.tenses[tenseName];
          if (!tenseData) return null;

          return (
            <div key={tenseName} className="tense-card">
              <div className="card-header">
                <h3>{tenseName}</h3>
                <div className="study-badge">{isQuiz ? "Quiz" : "Study"}</div>
              </div>
              
              <div className="conjugation-list">
                {PERSON_ORDER.map((person, i) => {
                  const correct = tenseData.forms[i];
                  const inputKey = `${tenseName}-${i}`;
                  const userVal = userInputs[inputKey] || "";
                  const isCorrect = norm(userVal) === norm(correct);

                  return (
                    <div key={person} className="row">
                      <span className="person">{person}</span>
                      {isQuiz ? (
                        <input 
                          type="text"
                          className={`quiz-input ${userVal ? (isCorrect ? "good" : "bad") : ""}`}
                          placeholder="..."
                          value={userVal}
                          onChange={(e) => handleInputChange(tenseName, i, e.target.value)}
                          spellCheck="false"
                          autoComplete="off"
                        />
                      ) : (
                        <span className="answer">{correct}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="sentence-box">
                <div className="pt-sent">{tenseData.sentence.pt}</div>
                <div className="en-sent">{tenseData.sentence.en}</div>
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
          Voltar para o Menu
        </button>
      </div>
    </div>
  );
}
