// src/TopBar.tsx
import './TopBar.css';

interface Props {
  streak: number;
  totalPts: number;
}

export default function TopBar({ streak, totalPts }: Props) {
  return (
    <div className="topbar-fixed" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '52px',
      background: 'white',
      borderBottom: '0.5px solid #e2e8f0',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 16px',
      zIndex: 9998,
    }}>
      {/* Left — streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifySelf: 'start' }}>
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🔥</span>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ea580c', lineHeight: 1 }}>
            {streak}
          </div>
          <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>day streak</div>
        </div>
      </div>

      {/* Centre — logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, justifySelf: 'center' }}>
        <img src="https://flagcdn.com/w40/br.png" alt="BR" style={{ width: 24, borderRadius: 3 }} />
        <span style={{
          fontSize: '0.75rem', fontWeight: 900, color: '#14532d',
          fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.3px',
        }}>
          Fala Brazil!
        </span>
      </div>

      {/* Right — pts */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifySelf: 'end' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#14532d', lineHeight: 1 }}>
          {totalPts.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>pts</div>
      </div>
    </div>
  );
}
