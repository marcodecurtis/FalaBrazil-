// src/AccountScreen.tsx
import { useState } from 'react';
import { auth } from './firebase';
import AboutScreen from './AboutScreen';

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
  onLevelChange: (level: string) => void;
}

const TIME_LABELS: Record<string, string> = {
  '5': '5 minutes / day',
  '15': '15 minutes / day',
  '30': '30 minutes / day',
};

const LEVELS = [
  { code: 'A1', label: 'A1 — Beginner',        desc: 'Just starting out' },
  { code: 'A2', label: 'A2 — Elementary',       desc: 'Basic phrases & topics' },
  { code: 'B1', label: 'B1 — Intermediate',     desc: 'Everyday conversations' },
  { code: 'B2', label: 'B2 — Upper-Intermediate', desc: 'Fluent on most topics' },
  { code: 'C1', label: 'C1 — Advanced',         desc: 'Complex & nuanced language' },
  { code: 'C2', label: 'C2 — Proficient',       desc: 'Near-native mastery' },
];

export default function AccountScreen({ isLoggedIn, userData, userLevel, onNavigate, onLogout, onLevelChange }: Props) {
  const [showAbout, setShowAbout]             = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [editingLevel, setEditingLevel]       = useState(false);

  const currentLevel = userLevel || userData?.level || null;

  if (showAbout) return <AboutScreen onBack={() => setShowAbout(false)} />;

  if (showPrivacyPolicy) return <PrivacyPolicyScreen onBack={() => setShowPrivacyPolicy(false)} />;

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }} className="bn-page-padding">
        <div style={{ padding: '24px 0 20px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Account</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Sign in to save your progress</p>
        </div>

        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>👤</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: 8 }}>You're not signed in</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
            Create a free account to save your streak, XP and progress across all your devices.
          </div>
          <button onClick={() => onNavigate('auth')} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #14532d, #166534)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>
            Sign in / Create account
          </button>
          <button onClick={() => onNavigate('today')} style={{ width: '100%', padding: '12px', background: 'none', border: '0.5px solid #e2e8f0', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', color: '#64748b' }}>
            Continue without account
          </button>
        </div>

        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current settings</div>
          </div>
          <SettingRow label="Level" value={userLevel || 'Not set'} />
          <SettingRow label="Daily goal" value={TIME_LABELS[localStorage.getItem('timePreference') || '15'] || '15 minutes / day'} last />

        </div>
      </div>
    );
  }

  const displayName = userData?.name || auth.currentUser?.displayName || 'Learner';
  const email       = userData?.email || auth.currentUser?.email || '';
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }} className="bn-page-padding">
      <div style={{ padding: '24px 0 20px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Account</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Your profile and settings</p>
      </div>

      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #14532d, #166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 2 }}>{displayName}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
        </div>
      </div>

      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Learning settings</div>
        </div>

        {/* Level row — tappable to edit */}
        <button
          onClick={() => setEditingLevel(v => !v)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderBottom: editingLevel ? '0.5px solid #f1f5f9' : 'none' }}
        >
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Level</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{currentLevel || 'Not set'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </span>
        </button>

        {editingLevel && (
          <div style={{ padding: '8px 12px 12px', borderBottom: '0.5px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 4 }}>Select your level</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LEVELS.map(({ code, label, desc }) => {
                const isSelected = currentLevel === code;
                return (
                  <button
                    key={code}
                    onClick={() => { onLevelChange(code); setEditingLevel(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'left',
                      background: isSelected ? '#f0fdf4' : '#f8fafc',
                      outline: isSelected ? '1.5px solid #16a34a' : '1.5px solid transparent',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</div>
                    </div>
                    {isSelected && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <SettingRow label="Daily goal" value={TIME_LABELS[userData?.timePreference || localStorage.getItem('timePreference') || '15'] || '15 minutes / day'} last />
      </div>

      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <LinkRow label="Privacy Policy" onClick={() => setShowPrivacyPolicy(true)} />
        <LinkRow label="About Fala Brazil!" onClick={() => setShowAbout(true)} last />
      </div>

      <button onClick={onLogout} style={{ width: '100%', padding: '14px', background: '#fef2f2', border: '0.5px solid #fecaca', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', color: '#dc2626' }}>
        Sign out
      </button>
    </div>
  );
}

function SettingRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: last ? 'none' : '0.5px solid #f1f5f9' }}>
      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{value}</span>
    </div>
  );
}

function LinkRow({ label, onClick, last }: { label: string; onClick: () => void; last?: boolean }) {
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', borderBottom: last ? 'none' : '0.5px solid #f1f5f9', textAlign: 'left' }}>
      <span style={{ fontSize: '0.85rem', color: '#0f172a' }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  );
}

function PrivacyPolicyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }} className="bn-page-padding">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 0 16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Privacy Policy</h1>
      </div>

      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: '20px 20px 24px', marginBottom: 24 }}>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 16 }}>Last updated: 22 March 2026</p>
        <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.7, marginBottom: 12 }}>Welcome to <strong>Fala Brazil!</strong> This Privacy Policy explains how we collect, use, and protect your information.</p>

        {[
          { title: '1. Information We Collect', content: 'If you create an account, we collect your name and email address. We also collect your selected level, lesson progress, and basic usage data (pages visited, device type). Google Sign-In users also share a profile picture from Google.' },
          { title: '2. How We Use Your Information', content: 'We use your data to create and manage your account, personalise your learning experience, save progress across devices, and improve the app. We do not sell your data to third parties or use it for advertising.' },
          { title: '3. Data Storage', content: 'Account data is stored securely via Google Firebase (EU/US servers, GDPR-compliant). If you use the app without an account, your progress is stored only on your device.' },
          { title: '4. AI Features', content: "Fala Brazil! uses Anthropic's Claude AI for lesson content and the AI Tutor. Your questions and level context are sent to Anthropic's API to generate responses. We do not store these conversations." },
          { title: '5. Cookies & Local Storage', content: 'We use browser local storage to remember your level and preferences. We do not use advertising or third-party tracking cookies.' },
          { title: '6. Your Rights (GDPR)', content: 'If you are in the EU or UK, you have the right to access, correct, delete, or export your data, and to object to certain uses. Contact us to exercise these rights.' },
          { title: '7. Data Retention', content: 'We retain account data while your account is active. If you delete your account, your data is removed within 30 days.' },
          { title: '8. Children\'s Privacy', content: 'Fala Brazil! is not directed at children under 13. We do not knowingly collect data from children under 13.' },
          { title: '9. Changes', content: 'We may update this policy and will update the date above. We encourage periodic review.' },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14532d', marginBottom: 4 }}>{title}</div>
            <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>{content}</p>
          </div>
        ))}

        <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14532d', marginBottom: 4 }}>10. Contact Us</div>
          <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>
            Questions about this policy or your data rights?<br />
            <strong>Fala Brazil!</strong> — Created by Marco De Curtis<br />
            Email: <a href="mailto:privacy@falabrazil.app" style={{ color: '#16a34a' }}>privacy@falabrazil.app</a>
          </p>
        </div>
      </div>
    </div>
  );
}
