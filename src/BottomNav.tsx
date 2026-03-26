// src/BottomNav.tsx
import './BottomNav.css';

type Tab = 'today' | 'learn' | 'isabela' | 'progress' | 'account';

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

const IconToday = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    {active ? (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" fill="#14532d"/>
        <rect x="3" y="13" width="8" height="8" rx="2" fill="#14532d" opacity="0.35"/>
        <rect x="13" y="3" width="8" height="8" rx="2" fill="#14532d" opacity="0.35"/>
        <rect x="13" y="13" width="8" height="8" rx="2" fill="#14532d" opacity="0.35"/>
      </>
    ) : (
      <>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
      </>
    )}
  </svg>
);

const IconLearn = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 00-2 2z"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 19a2 2 0 002 2h12"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="15" y2="9"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="13" x2="13" y2="13"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconProgress = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      fill={active ? '#14532d' : 'none'} fillOpacity={active ? 0.15 : 0}/>
  </svg>
);

const IconAccount = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5"
      fill={active ? '#14532d' : 'none'} fillOpacity={active ? 0.15 : 0}/>
    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
      stroke={active ? '#14532d' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <nav className="bn-nav">

      <button className={`bn-tab ${active === 'today' ? 'bn-active' : ''}`} onClick={() => onNavigate('today')}>
        <IconToday active={active === 'today'} />
        <span className="bn-label">Today</span>
        {active === 'today' && <span className="bn-dot" />}
      </button>

      <button className={`bn-tab ${active === 'learn' ? 'bn-active' : ''}`} onClick={() => onNavigate('learn')}>
        <IconLearn active={active === 'learn'} />
        <span className="bn-label">Learn</span>
        {active === 'learn' && <span className="bn-dot" />}
      </button>

      <button className="bn-isabela-btn" onClick={() => onNavigate('isabela')}>
        <div className={`bn-isabela-ring ${active === 'isabela' ? 'bn-isabela-active' : ''}`}>
          <img
            src="/isabela.png"
            alt="Isabela"
            className="bn-isabela-img"
            onError={e => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = 'none';
              const parent = el.parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(135deg,#fce7f3,#fbcfe8)';
                parent.innerHTML = '<span style="font-size:20px">🎙️</span>';
              }
            }}
          />
        </div>
        <span className={`bn-isabela-label ${active === 'isabela' ? 'bn-active' : ''}`}>Isabela</span>
      </button>

      <button className={`bn-tab ${active === 'progress' ? 'bn-active' : ''}`} onClick={() => onNavigate('progress')}>
        <IconProgress active={active === 'progress'} />
        <span className="bn-label">Progress</span>
        {active === 'progress' && <span className="bn-dot" />}
      </button>

      <button className={`bn-tab ${active === 'account' ? 'bn-active' : ''}`} onClick={() => onNavigate('account')}>
        <IconAccount active={active === 'account'} />
        <span className="bn-label">Account</span>
        {active === 'account' && <span className="bn-dot" />}
      </button>

    </nav>
  );
}
