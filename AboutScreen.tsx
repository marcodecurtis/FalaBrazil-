// src/AboutScreen.tsx
import { useState } from 'react';

interface Props {
  onBack: () => void;
}

const FEATURES = [
  {
    emoji: '🧠',
    title: 'AI-Personalised Daily Lessons',
    desc: 'Every day, our AI builds a fresh lesson plan tailored to your exact level — from A1 beginner to C2 proficient. No two learners get the same content.',
    color: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    emoji: '🎙️',
    title: 'Isabela — Your AI Conversation Partner',
    desc: 'Isabela is a warm, encouraging Brazilian Portuguese tutor powered by AI. Have real 3-minute conversations, get corrected naturally, and build confidence to actually speak.',
    color: '#fdf2f8',
    border: '#f9a8d4',
  },
  {
    emoji: '📚',
    title: 'Vocabulary Flashcards',
    desc: 'Learn words in context across 17 topic categories — from everyday basics to Brazilian culture, football, telenovelas and music.',
    color: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    emoji: '✍️',
    title: 'Grammar Mastery',
    desc: 'Clear, level-appropriate grammar rules with real examples and fill-in-the-blank exercises. No dry textbook theory — just what you actually need.',
    color: '#fff7ed',
    border: '#fed7aa',
  },
  {
    emoji: '📰',
    title: 'Real Brazilian Articles',
    desc: 'Read authentic articles about Pelé, Carnaval, bossa nova, telenovelas, the Amazon and more. Language learning through culture you actually care about.',
    color: '#f8fafc',
    border: '#e2e8f0',
  },
  {
    emoji: '🎬',
    title: 'Watch & Learn',
    desc: 'Curated Brazilian YouTube videos with comprehension questions — from A1 to C2. Learn the language through music, culture, food and telenovelas.',
    color: '#fef9c3',
    border: '#fde68a',
  },
  {
    emoji: '🔊',
    title: 'Pronunciation Training',
    desc: '20 essential Brazilian Portuguese pronunciation rules with audio examples. Sound like a carioca, not a textbook.',
    color: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    emoji: '📈',
    title: 'Progress Tracking',
    desc: 'Track your day streak, XP points and lessons completed. Watch yourself move from A1 to C2 with a clear visual progress bar.',
    color: '#fdf4ff',
    border: '#e9d5ff',
  },
];

const LEVELS = [
  { code: 'A1', label: 'Beginner', emoji: '🌱', desc: 'Hello, numbers, colours' },
  { code: 'A2', label: 'Elementary', emoji: '🌿', desc: 'Daily life, simple past' },
  { code: 'B1', label: 'Intermediate', emoji: '🌳', desc: 'Opinions, storytelling' },
  { code: 'B2', label: 'Upper Int.', emoji: '🎋', desc: 'Subjunctive, idioms' },
  { code: 'C1', label: 'Advanced', emoji: '🌴', desc: 'Native-like fluency' },
  { code: 'C2', label: 'Proficient', emoji: '👑', desc: 'Complete mastery' },
];

export default function AboutScreen({ onBack }: Props) {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', background: 'white', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #052e16 0%, #14532d 60%, #166534 100%)',
        padding: '48px 24px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <button onClick={onBack} style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 20,
          padding: '6px 14px', color: 'white', fontSize: '0.8rem',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>← Back</button>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative' }}>
          <img src="https://flagcdn.com/w80/br.png" alt="Brazil" style={{ width: 56, borderRadius: 8, marginBottom: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }} />
          <h1 style={{ fontWeight: 900, fontSize: '2.2rem', color: 'white', margin: '0 0 8px', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Fala Brazil!
          </h1>
          <p style={{ color: '#86efac', fontSize: '1rem', fontWeight: 600, margin: '0 0 16px' }}>
            Speak Portuguese like a Brazilian
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
            The most complete AI-powered Brazilian Portuguese learning app — from your first "olá" to full fluency.
          </p>
        </div>
      </div>

      <div style={{ padding: '0 16px 80px' }}>

        {/* ── What is Fala Brazil ── */}
        <div style={{ padding: '28px 0 20px' }}>
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0f172a', margin: '0 0 12px' }}>
            What is Fala Brazil!?
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.8, margin: '0 0 12px' }}>
            Fala Brazil! is an AI-powered language learning app built specifically for Brazilian Portuguese. Unlike generic apps, every lesson is personalised to your exact level and adapts as you grow.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.8, margin: 0 }}>
            Whether you're a complete beginner or already conversational, Fala Brazil! gives you the tools to learn the real language — the way Brazilians actually speak it.
          </p>
        </div>

        {/* ── CEFR Levels ── */}
        <div style={{ background: '#f8fafc', borderRadius: 20, padding: '20px 16px', marginBottom: 24 }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 4px' }}>
            All 6 CEFR levels covered
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 16px' }}>
            From absolute beginner to native-level proficiency
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {LEVELS.map(({ code, label, emoji, desc }) => (
              <div key={code} style={{
                background: 'white', borderRadius: 12, padding: '12px 10px',
                textAlign: 'center', border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#14532d' }}>{code}</div>
                <div style={{ fontWeight: 600, fontSize: '0.7rem', color: '#0f172a', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0f172a', margin: '0 0 16px' }}>
          Everything you need to get fluent
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              onClick={() => setActiveFeature(activeFeature === i ? null : i)}
              style={{
                background: activeFeature === i ? f.color : 'white',
                border: `1px solid ${activeFeature === i ? f.border : '#e2e8f0'}`,
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{f.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{f.title}</div>
                  {activeFeature === i && (
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, marginTop: 6 }}>
                      {f.desc}
                    </div>
                  )}
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', flexShrink: 0, transition: 'transform 0.2s', transform: activeFeature === i ? 'rotate(90deg)' : 'none' }}>›</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── How it works ── */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 20, padding: '20px 18px', marginBottom: 24, border: '1px solid #bbf7d0' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#14532d', margin: '0 0 16px' }}>
            How it works
          </h3>
          {[
            { step: '1', title: 'Take the placement test', desc: 'A 20-question test places you at the right CEFR level — or pick your level manually.' },
            { step: '2', title: 'Get your daily lesson', desc: 'Every day the AI builds a personalised lesson with vocabulary, grammar, reading and speaking practice.' },
            { step: '3', title: 'Practice freely', desc: 'Dive into verb conjugation, flashcards, articles, videos and conversations with Isabela anytime.' },
            { step: '4', title: 'Track your progress', desc: 'Complete lessons to advance from your current level. Watch your streak and XP grow every day.' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#14532d',
                color: 'white', fontWeight: 800, fontSize: '0.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{step}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#14532d', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: '0.8rem', color: '#166534', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quote ── */}
        <div style={{ textAlign: 'center', padding: '8px 8px 24px' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 8px' }}>
            "Quem fala uma língua, vive uma vida.<br />Quem fala duas, vive duas."
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
            "Who speaks one language lives one life. Who speaks two, lives two." — Brazilian saying
          </p>
        </div>

        {/* ── CTA ── */}
        <button onClick={onBack} style={{
          width: '100%', padding: '15px',
          background: 'linear-gradient(135deg, #14532d, #166534)',
          color: 'white', border: 'none', borderRadius: 14,
          fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
          fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(20,83,45,0.25)',
        }}>
          Keep learning →
        </button>

      </div>
    </div>
  );
}
