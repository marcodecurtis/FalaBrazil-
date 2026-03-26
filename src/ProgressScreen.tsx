// src/ProgressScreen.tsx
// Shows streak, XP history and level progress
// Placeholder for now — can be expanded later

interface Props {
    userLevel: string | null;
    streak: number;
    totalPts: number;
    lessonsCompleted: number;
  }
  
  const NEXT_LEVEL: Record<string, string> = {
    A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C2', C2: 'C2',
  };
  
  const LESSONS_PER_LEVEL: Record<string, number> = {
    A1: 30, A2: 30, B1: 30, B2: 30, C1: 30, C2: 30,
  };
  
  export default function ProgressScreen({ userLevel, streak, totalPts, lessonsCompleted }: Props) {
    const level = userLevel || 'A1';
    const nextLevel = NEXT_LEVEL[level];
    const lessonsNeeded = LESSONS_PER_LEVEL[level] || 30;
    const levelProgress = Math.min(100, Math.round((lessonsCompleted / lessonsNeeded) * 100));
  
    const stats = [
      { label: 'Day streak', value: streak, icon: '🔥', color: '#fff7ed', text: '#c2410c' },
      { label: 'Total points', value: totalPts.toLocaleString(), icon: '⭐', color: '#fefce8', text: '#a16207' },
      { label: 'Lessons done', value: lessonsCompleted, icon: '📚', color: '#f0fdf4', text: '#15803d' },
      { label: 'Current level', value: level, icon: '🎯', color: '#f0f9ff', text: '#0369a1' },
    ];
  
    return (
      <div style={{ padding: '0 16px', maxWidth: 480, margin: '0 auto' }} className="bn-page-padding">
  
        <div style={{ padding: '24px 0 20px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Progress</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Keep going — every lesson counts</p>
        </div>
  
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: s.color, borderRadius: 14, padding: '16px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: s.text, lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: '0.75rem', color: s.text, opacity: 0.8, fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
  
        {/* Level progress */}
        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Level {level}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {level !== 'C2' ? `${lessonsCompleted} of ${lessonsNeeded} lessons to ${nextLevel}` : 'Maximum level reached!'}
              </div>
            </div>
            <div style={{
              background: '#f0fdf4', color: '#14532d', fontWeight: 800,
              fontSize: '1.1rem', padding: '6px 14px', borderRadius: 20,
            }}>{levelProgress}%</div>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 8, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${levelProgress}%`,
              background: 'linear-gradient(90deg, #14532d, #166534)',
              borderRadius: 8, transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
  
        {/* Coming soon */}
        <div style={{
          background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 14,
          padding: 20, textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📈</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 4 }}>
            Detailed stats coming soon
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            XP history, lesson breakdown and achievements
          </div>
        </div>
  
      </div>
    );
  }
  