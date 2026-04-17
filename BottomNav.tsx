// src/BottomNav.tsx
import './BottomNav.css';

type Tab = 'today' | 'learn' | 'isabela' | 'progress' | 'account';

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

// Colour palette — one per tab
const COLORS = {
  today:    { active: '#16a34a', bg: '#f0fdf4' },  // green
  learn:    { active: '#2563eb', bg: '#eff6ff' },  // blue
  isabela:  { active: '#db2777', bg: '#fdf2f8' },  // pink
  progress: { active: '#d97706', bg: '#fffbeb' },  // amber
  account:  { active: '#7c3aed', bg: '#f5f3ff' },  // purple
};

const IconToday = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="2"
      fill={active ? COLORS.today.active : 'none'}
      stroke={active ? COLORS.today.active : '#94a3b8'} strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="2"
      fill={active ? COLORS.today.active : 'none'} fillOpacity={active ? 0.3 : 0}
      stroke={active ? COLORS.today.active : '#94a3b8'} strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="2"
      fill={active ? COLORS.today.active : 'none'} fillOpacity={active ? 0.3 : 0}
      stroke={active ? COLORS.today.active : '#94a3b8'} strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="2"
      fill={active ? COLORS.today.active : 'none'} fillOpacity={active ? 0.3 : 0}
      stroke={active ? COLORS.today.active : '#94a3b8'} strokeWidth="1.5"/>
  </svg>
);

const IconLearn = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 00-2 2z"
      fill={active ? COLORS.learn.active : 'none'} fillOpacity={active ? 0.12 : 0}
      stroke={active ? COLORS.learn.active : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 19a2 2 0 002 2h12"
      stroke={active ? COLORS.learn.active : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="15" y2="9"
      stroke={active ? COLORS.learn.active : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="13" x2="13" y2="13"
      stroke={active ? COLORS.learn.active : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconIsabela = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"
      fill={active ? COLORS.isabela.active : 'none'} fillOpacity={active ? 0.15 : 0}
      stroke={active ? COLORS.isabela.active : '#94a3b8'} strokeWidth="1.5"/>
    <path d="M4 20c0-4 3.582-6 8-6s8 2 8 6"
      stroke={active ? COLORS.isabela.active : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="16" r="4"
      fill={active ? COLORS.isabela.active : '#e2e8f0'}/>
    <path d="M16.5 16h3M18 14.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconProgress = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={active ? COLORS.progress.active : 'none'} fillOpacity={active ? 0.2 : 0}
      stroke={active ? COLORS.progress.active : '#94a3b8'} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAccount = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"
      fill={active ? COLORS.account.active : 'none'} fillOpacity={active ? 0.15 : 0}
      stroke={active ? COLORS.account.active : '#94a3b8'} strokeWidth="1.5"/>
    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
      stroke={active ? COLORS.account.active : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ active: boolean }> }[] = [
  { id: 'today',    label: 'Today',    Icon: IconToday    },
  { id: 'learn',    label: 'Learn',    Icon: IconLearn    },
  { id: 'isabela',  label: 'Isabela',  Icon: IconIsabela  },
  { id: 'progress', label: 'Progress', Icon: IconProgress },
  { id: 'account',  label: 'Account',  Icon: IconAccount  },
];

export default function BottomNav({ active, onNavigate }: Props) {
  return (
    <nav className="bn-nav">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        const color = COLORS[id];
        return (
          <button
            key={id}
            className={`bn-tab ${isActive ? 'bn-active' : ''}`}
            onClick={() => onNavigate(id)}
            style={isActive ? { '--tab-color': color.active, '--tab-bg': color.bg } as React.CSSProperties : {}}
          >
            <div className={`bn-icon-wrap ${isActive ? 'bn-icon-active' : ''}`}>
              <Icon active={isActive} />
            </div>
            <span className="bn-label" style={isActive ? { color: color.active } : {}}>
              {label}
            </span>
            {isActive && <span className="bn-dot" style={{ background: color.active }} />}
          </button>
        );
      })}
    </nav>
  );
}
