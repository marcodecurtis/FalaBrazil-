import { useRef, useState, useEffect } from 'react';
import type { Level } from './App';

interface UserData {
  name: string;
  email: string;
  level: Level | null;
  xp: number;
  streak: number;
}

interface Props {
  isLoggedIn: boolean;
  userData: UserData | null;
  userLevel: Level | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function SandwichMenu({ isLoggedIn, userData, userLevel, onNavigate, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (view: string) => {
    setMenuOpen(false);
    onNavigate(view);
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 999999,
      }}
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: 'white', border: '1.5px solid #e2e8f0',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '5px', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', display: 'block' }} />
        <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', display: 'block' }} />
        <span style={{ width: '18px', height: '2px', background: '#0f172a', borderRadius: '2px', display: 'block' }} />
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '8px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          minWidth: '220px',
          overflow: 'hidden',
          zIndex: 999999,
        }}>
          {isLoggedIn && userData && (
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Account</div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{userData.name}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{userData.email}</div>
            </div>
          )}

          {!isLoggedIn && (
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>Not logged in</div>
              <button
                onClick={() => handleNavigate('auth')}
                style={{ width: '100%', background: '#14532d', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Create account / Log in
              </button>
            </div>
          )}

          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Level</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ background: '#14532d', color: 'white', fontWeight: 800, fontSize: '0.82rem', padding: '3px 12px', borderRadius: '20px' }}>
                {userLevel || 'Not set'}
              </span>
              <button
                onClick={() => handleNavigate('onboarding')}
                style={{ background: 'none', border: '1px solid #e2e8f0', color: '#14532d', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: '3px 10px', borderRadius: '8px', fontFamily: 'inherit' }}
              >
                Change →
              </button>
            </div>
          </div>

          <a
            href="/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', padding: '12px 16px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
            onClick={() => setMenuOpen(false)}
          >
            📄 Privacy Policy & Terms
          </a>

          {isLoggedIn && (
            <button
              onClick={handleLogoutClick}
              style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🚪 Log out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
