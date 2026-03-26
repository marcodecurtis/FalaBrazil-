// src/AccountScreen.tsx
// If logged in: shows profile, settings, logout
// If not logged in: pushes to sign in / sign up

import { auth } from './firebase';

interface UserData {
  name: string;
  email: string;
  level: string | null;
  xp: number;
  streak: number;
  totalPts: number;
  timePreference: string | null;
  learningGoal: string | null;
}

interface Props {
  isLoggedIn: boolean;
  userData: UserData | null;
  userLevel: string | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const TIME_LABELS: Record<string, string> = {
  '5': '5 minutes / day',
  '15': '15 minutes / day',
  '30': '30 minutes / day',
};

const GOAL_LABELS: Record<string, string> = {
  conversation: 'Everyday conversation',
  tv_movies: 'TV & movies',
  travel: 'Travel',
  business: 'Business Portuguese',
};

export default function AccountScreen({ isLoggedIn, userData, userLevel, onNavigate, onLogout }: Props) {

  // ── Not logged in ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }} className="bn-page-padding">
        <div style={{ padding: '24px 0 20px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Account</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Sign in to save your progress</p>
        </div>

        <div style={{
          background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 16,
          padding: 24, textAlign: 'center', marginBottom: 16,
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>👤</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: 8 }}>
            You're not signed in
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
            Create a free account to save your streak, XP and progress across all your devices.
          </div>
          <button
            onClick={() => onNavigate('auth')}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #14532d, #166534)',
              color: 'white', border: 'none', borderRadius: 12,
              fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit',
              marginBottom: 10,
            }}
          >
            Sign in / Create account
          </button>
          <button
            onClick={() => onNavigate('today')}
            style={{
              width: '100%', padding: '12px', background: 'none',
              border: '0.5px solid #e2e8f0', borderRadius: 12,
              fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: 'inherit', color: '#64748b',
            }}
          >
            Continue without account
          </button>
        </div>

        {/* Current settings even without account */}
        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Current settings
            </div>
          </div>
          <SettingRow label="Level" value={userLevel || 'Not set'} />
          <SettingRow label="Daily goal" value={TIME_LABELS[localStorage.getItem('timePreference') || '30'] || '30 minutes'} />
          <SettingRow label="Learning goal" value={GOAL_LABELS[localStorage.getItem('learningGoal') || 'conversation'] || 'Conversation'} last />
        </div>
      </div>
    );
  }

  // ── Logged in ──────────────────────────────────────────────────
  const displayName = userData?.name || auth.currentUser?.displayName || 'Learner';
  const email = userData?.email || auth.currentUser?.email || '';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }} className="bn-page-padding">

      <div style={{ padding: '24px 0 20px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Account</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Your profile and settings</p>
      </div>

      {/* Profile card */}
      <div style={{
        background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 16,
        padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #14532d, #166534)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 2 }}>
            {displayName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {email}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Learning settings
          </div>
        </div>
        <SettingRow label="Level" value={userLevel || userData?.level || 'Not set'} />
        <SettingRow label="Daily goal" value={TIME_LABELS[userData?.timePreference || localStorage.getItem('timePreference') || '30'] || '30 minutes'} />
        <SettingRow label="Learning goal" value={GOAL_LABELS[userData?.learningGoal || localStorage.getItem('learningGoal') || 'conversation'] || 'Conversation'} last />
      </div>

      {/* Links */}
      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <LinkRow label="Privacy Policy" onClick={() => window.open('/privacy-policy.html', '_blank')} />
        <LinkRow label="About Fala Brazil!" onClick={() => {}} last />
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        style={{
          width: '100%', padding: '14px', background: '#fef2f2',
          border: '0.5px solid #fecaca', borderRadius: 12,
          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
          fontFamily: 'inherit', color: '#dc2626',
        }}
      >
        Sign out
      </button>

    </div>
  );
}

function SettingRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 16px',
      borderBottom: last ? 'none' : '0.5px solid #f1f5f9',
    }}>
      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{value}</span>
    </div>
  );
}

function LinkRow({ label, onClick, last }: { label: string; onClick: () => void; last?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', borderBottom: last ? 'none' : '0.5px solid #f1f5f9',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '0.85rem', color: '#0f172a' }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  );
}
