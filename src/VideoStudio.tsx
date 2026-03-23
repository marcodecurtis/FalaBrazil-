import { useState } from 'react';
import type { Level } from './App';

interface Props {
  onBack: () => void;
  userLevel: Level | null;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  topic: string;
  emoji: string;
  questions: Question[];
}

const VIDEOS: Video[] = [
  {
    id: 'v1',
    youtubeId: 'CkIiJj_s7CM',
    title: 'Greetings in Brazilian Portuguese',
    description: 'Learn how Brazilians greet each other in everyday situations.',
    level: 'A1',
    duration: '8 min',
    topic: 'Greetings',
    emoji: '👋',
    questions: [
      {
        question: 'How do you say "Good morning" in Brazilian Portuguese?',
        options: ['Boa tarde', 'Boa noite', 'Bom dia', 'Olá'],
        correct: 2,
      },
      {
        question: 'Which phrase means "How are you?" in informal Brazilian Portuguese?',
        options: ['Como vai?', 'Obrigado', 'Até logo', 'Por favor'],
        correct: 0,
      },
      {
        question: 'What does "Tchau" mean?',
        options: ['Hello', 'Thank you', 'Goodbye', 'Please'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v2',
    youtubeId: '5x7dBcFBHo4',
    title: 'Brazilian Portuguese Numbers 1–20',
    description: 'Master counting from 1 to 20 with native pronunciation.',
    level: 'A1',
    duration: '6 min',
    topic: 'Numbers',
    emoji: '🔢',
    questions: [
      {
        question: 'How do you say the number 5 in Portuguese?',
        options: ['Quatro', 'Seis', 'Cinco', 'Três'],
        correct: 2,
      },
      {
        question: 'What is "dez" in English?',
        options: ['Two', 'Ten', 'Twenty', 'Twelve'],
        correct: 1,
      },
      {
        question: 'How do you say 15 in Portuguese?',
        options: ['Treze', 'Quatorze', 'Dezesseis', 'Quinze'],
        correct: 3,
      },
    ],
  },
  {
    id: 'v3',
    youtubeId: 'viZjTlGwXWc',
    title: 'Ordering Food at a Brazilian Restaurant',
    description: 'Practical phrases for eating out in Brazil.',
    level: 'A2',
    duration: '10 min',
    topic: 'Food & Drink',
    emoji: '🍽️',
    questions: [
      {
        question: 'How do you ask for the menu in Portuguese?',
        options: ['Onde fica o banheiro?', 'O cardápio, por favor', 'A conta, por favor', 'Eu quero água'],
        correct: 1,
      },
      {
        question: 'What does "A conta, por favor" mean?',
        options: ['The menu, please', 'The water, please', 'The bill, please', 'The table, please'],
        correct: 2,
      },
      {
        question: 'How do you say "I am vegetarian" in Portuguese?',
        options: ['Eu sou alérgico', 'Eu não como carne', 'Eu sou vegetariano', 'Eu quero frango'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v4',
    youtubeId: 'Qwh6RuoHexw',
    title: 'Brazilian Portuguese Pronunciation Tips',
    description: 'Master the sounds that make Brazilian Portuguese unique.',
    level: 'A2',
    duration: '12 min',
    topic: 'Pronunciation',
    emoji: '🔊',
    questions: [
      {
        question: 'The nasal vowel sound in Portuguese is often represented by which letters?',
        options: ['ss and rr', 'ão and ãe', 'lh and nh', 'ch and x'],
        correct: 1,
      },
      {
        question: 'How is the letter "R" at the start of a word typically pronounced in Brazilian Portuguese?',
        options: ['Like English R', 'Like English H', 'Like English L', 'Like English V'],
        correct: 1,
      },
      {
        question: 'What is the term for the accent that shows a nasal vowel in Portuguese?',
        options: ['Acento agudo', 'Cedilha', 'Til', 'Acento circunflexo'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v5',
    youtubeId: 'JoXHhMSQiAA',
    title: 'Brazilian Slang & Everyday Expressions',
    description: 'Sound like a local with these popular Brazilian expressions.',
    level: 'B1',
    duration: '11 min',
    topic: 'Slang',
    emoji: '😎',
    questions: [
      {
        question: 'What does "saudade" mean?',
        options: [
          'A feeling of anger',
          'A longing or nostalgia for something you miss',
          'A type of Brazilian dance',
          'A greeting between friends',
        ],
        correct: 1,
      },
      {
        question: 'If someone says "que saudade de você!", what are they expressing?',
        options: ['They are angry at you', 'They missed you', 'They are congratulating you', 'They are saying goodbye'],
        correct: 1,
      },
      {
        question: 'What does the slang "cara" mean when talking to a friend?',
        options: ['Face', 'Expensive', 'Dude / guy', 'Careful'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v6',
    youtubeId: 'OhAmJ8bDPSg',
    title: 'Brazil: Culture, People & Traditions',
    description: 'Explore Brazilian culture and the Portuguese vocabulary that comes with it.',
    level: 'B1',
    duration: '14 min',
    topic: 'Culture',
    emoji: '🇧🇷',
    questions: [
      {
        question: 'What is the name of the famous Brazilian carnival city?',
        options: ['São Paulo', 'Brasília', 'Rio de Janeiro', 'Salvador'],
        correct: 2,
      },
      {
        question: 'What is "capoeira"?',
        options: [
          'A type of Brazilian food',
          'An Afro-Brazilian martial art and dance',
          'A Brazilian music style',
          'A traditional Brazilian festival',
        ],
        correct: 1,
      },
      {
        question: 'What does "festa junina" celebrate?',
        options: ['New Year', 'Harvest and rural traditions in June', 'Independence Day', 'Carnival'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v7',
    youtubeId: 'j9GKFaHNMKY',
    title: 'The Subjunctive in Brazilian Portuguese',
    description: 'Understand when and how to use the subjunctive mood.',
    level: 'B2',
    duration: '15 min',
    topic: 'Grammar',
    emoji: '✍️',
    questions: [
      {
        question: 'The subjunctive mood is typically used after which type of expression?',
        options: [
          'Certainty and facts',
          'Doubt, wish, emotion, or necessity',
          'Simple past actions',
          'Physical descriptions',
        ],
        correct: 1,
      },
      {
        question: 'Which sentence uses the subjunctive correctly?',
        options: [
          'Eu quero que você vem.',
          'Espero que ele está bem.',
          'Quero que você venha.',
          'Ele vai que eu falo.',
        ],
        correct: 2,
      },
      {
        question: 'After which word does Portuguese almost always require the subjunctive?',
        options: ['Porque', 'Talvez', 'Sempre', 'Já'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v8',
    youtubeId: '8EzGd7oPoBI',
    title: 'Advanced Brazilian Idioms',
    description: 'Master colourful Brazilian expressions to sound truly fluent.',
    level: 'C1',
    duration: '13 min',
    topic: 'Idioms',
    emoji: '🧠',
    questions: [
      {
        question: 'What does "chutar o balde" literally mean and what does it imply?',
        options: [
          'To kick the bucket — meaning to die',
          'To kick the bucket — meaning to give up on everything',
          'To lose your keys — meaning to be forgetful',
          'To spill water — meaning to make a mistake',
        ],
        correct: 1,
      },
      {
        question: 'If someone tells you "não é mole não", what are they saying?',
        options: ["It's not easy", "It's not soft", "It's not mine", "It's not late"],
        correct: 0,
      },
      {
        question: 'What does "dar um jeitinho" refer to in Brazilian culture?',
        options: [
          'Working very hard',
          'Finding a clever or informal way to solve a problem',
          'Asking for help from others',
          'Following rules strictly',
        ],
        correct: 1,
      },
    ],
  },
];

const LEVEL_ORDER: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
const LEVEL_COLORS: Record<string, string> = {
  A1: '#4caf7d', A2: '#2196b5', B1: '#e07b39', B2: '#9c4fd6', C1: '#e63946', C2: '#c62828',
};

export default function VideoStudio({ onBack, userLevel }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [phase, setPhase]                 = useState<'watch' | 'quiz' | 'result'>('watch');
  const [currentQ, setCurrentQ]           = useState(0);
  const [answers, setAnswers]             = useState<number[]>([]);
  const [selected, setSelected]           = useState<number | null>(null);
  const [showFeedback, setShowFeedback]   = useState(false);
  const [filterLevel, setFilterLevel]     = useState<string>('all');

  const userLevelNum = LEVEL_ORDER[userLevel || 'A1'] || 1;

  const filteredVideos = filterLevel === 'all'
    ? VIDEOS
    : VIDEOS.filter(v => v.level === filterLevel);

  const handleSelect = (video: Video) => {
    setSelectedVideo(video);
    setPhase('watch');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowFeedback(false);
  };

  const handleAnswer = (i: number) => {
    if (showFeedback) return;
    setSelected(i);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (selected === null || !selectedVideo) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    setShowFeedback(false);
    if (currentQ + 1 >= selectedVideo.questions.length) {
      setPhase('result');
    } else {
      setCurrentQ(q => q + 1);
    }
  };

  // ── VIDEO PLAYER PHASE ──
  if (selectedVideo && phase === 'watch') {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
        <button
          onClick={() => setSelectedVideo(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', padding: '16px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ← All Videos
        </button>

        <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
              title={selectedVideo.title}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: LEVEL_COLORS[selectedVideo.level], color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>
            {selectedVideo.level}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{selectedVideo.duration} · {selectedVideo.topic}</span>
        </div>

        <h2 style={{ fontWeight: 900, fontSize: '1.2rem', margin: '0 0 6px', color: '#0f172a' }}>{selectedVideo.title}</h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 24px' }}>{selectedVideo.description}</p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ fontWeight: 700, color: '#14532d', fontSize: '0.85rem', margin: '0 0 4px' }}>📝 Ready to test yourself?</p>
          <p style={{ color: '#166534', fontSize: '0.8rem', margin: 0 }}>Watch the video above, then answer {selectedVideo.questions.length} comprehension questions.</p>
        </div>

        <button
          onClick={() => setPhase('quiz')}
          style={{ width: '100%', padding: '14px', background: '#14532d', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  // ── QUIZ PHASE ──
  if (selectedVideo && phase === 'quiz') {
    const q = selectedVideo.questions[currentQ];
    const isCorrect = selected === q.correct;
    const isLast = currentQ === selectedVideo.questions.length - 1;

    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <button
            onClick={() => setPhase('watch')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}
          >
            ← Re-watch
          </button>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
            Question {currentQ + 1} / {selectedVideo.questions.length}
          </span>
        </div>

        <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '6px', marginBottom: '24px' }}>
          <div style={{ background: '#14532d', borderRadius: '99px', height: '100%', width: `${((currentQ + 1) / selectedVideo.questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          {selectedVideo.emoji} {selectedVideo.title}
        </p>
        <h2 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a', marginBottom: '24px', lineHeight: 1.4 }}>{q.question}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {q.options.map((opt, i) => {
            let bg = 'white';
            let border = '2px solid #e2e8f0';
            let color = '#0f172a';
            if (showFeedback) {
              if (i === q.correct) { bg = '#f0fdf4'; border = '2px solid #4caf7d'; color = '#14532d'; }
              else if (i === selected) { bg = '#fff1f2'; border = '2px solid #f87171'; color = '#991b1b'; }
              else { bg = '#f8fafc'; color = '#94a3b8'; border = '2px solid #e2e8f0'; }
            } else if (selected === i) {
              bg = '#f0fdf4'; border = '2px solid #14532d';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                style={{ background: bg, border, borderRadius: '12px', padding: '14px 16px', textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}
              >
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: showFeedback && i === q.correct ? '#14532d' : '#f1f5f9', color: showFeedback && i === q.correct ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
                  {['A', 'B', 'C', 'D'][i]}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color }}>{opt}</span>
                {showFeedback && i === q.correct && <span style={{ marginLeft: 'auto' }}>✓</span>}
                {showFeedback && i === selected && i !== q.correct && <span style={{ marginLeft: 'auto' }}>✗</span>}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div style={{ background: isCorrect ? '#f0fdf4' : '#fff1f2', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`, borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
            <p style={{ fontWeight: 800, color: isCorrect ? '#14532d' : '#991b1b', margin: 0, fontSize: '0.9rem' }}>
              {isCorrect ? '✓ Correct!' : `✗ The correct answer is: ${q.options[q.correct]}`}
            </p>
          </div>
        )}

        {showFeedback && (
          <button
            onClick={handleNext}
            style={{ width: '100%', padding: '14px', background: '#14532d', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {isLast ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    );
  }

  // ── RESULT PHASE ──
  if (selectedVideo && phase === 'result') {
    const score = answers.filter((a, i) => a === selectedVideo.questions[i].correct).length;
    const total = selectedVideo.questions.length;
    const passed = score >= Math.ceil(total * 0.67);

    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', background: 'white', borderRadius: '20px', padding: '32px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{passed ? '🎉' : '📺'}</div>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: passed ? '#f0fdf4' : '#fff1f2', border: `3px solid ${passed ? '#4caf7d' : '#f87171'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: passed ? '#14532d' : '#991b1b' }}>{score}/{total}</span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: '8px' }}>
            {passed ? 'Well done!' : 'Keep watching!'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '28px' }}>
            {passed
              ? `You answered ${score} out of ${total} questions correctly. Great comprehension!`
              : `You got ${score} out of ${total}. Try re-watching the video and quiz again.`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!passed && (
              <button
                onClick={() => { setPhase('watch'); setCurrentQ(0); setAnswers([]); setSelected(null); setShowFeedback(false); }}
                style={{ padding: '13px', background: '#14532d', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Re-watch & Retry →
              </button>
            )}
            <button
              onClick={() => setSelectedVideo(null)}
              style={{ padding: '13px', background: passed ? '#14532d' : 'white', color: passed ? 'white' : '#64748b', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {passed ? 'Watch More Videos →' : 'Back to Videos'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VIDEO LIST ──
  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
      <header style={{ padding: '24px 0 20px' }}>
        <h1 style={{ fontWeight: 900, fontSize: '2.2rem', color: '#0f172a', margin: '0 0 4px' }}>Watch & Learn</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Brazilian videos with comprehension Q&A</p>
      </header>

      {/* Level filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px', scrollbarWidth: 'none' }}>
        {levels.map(lvl => (
          <button
            key={lvl}
            onClick={() => setFilterLevel(lvl)}
            style={{
              padding: '6px 14px',
              borderRadius: '99px',
              border: 'none',
              background: filterLevel === lvl ? '#14532d' : '#f1f5f9',
              color: filterLevel === lvl ? 'white' : '#64748b',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            {lvl === 'all' ? 'All Levels' : lvl}
          </button>
        ))}
      </div>

      {/* Video cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredVideos.map(video => {
          const videoLevelNum = LEVEL_ORDER[video.level] || 1;
          const isAccessible = videoLevelNum <= userLevelNum + 1;
          return (
            <div
              key={video.id}
              onClick={() => isAccessible && handleSelect(video)}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                cursor: isAccessible ? 'pointer' : 'default',
                opacity: isAccessible ? 1 : 0.5,
                border: '1px solid #f1f5f9',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0f172a' }}>
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                {!isAccessible && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>🔒</span>
                  </div>
                )}
                <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.75)', color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ background: LEVEL_COLORS[video.level], color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800 }}>
                    {video.level}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{video.emoji} {video.topic}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3 }}>{video.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 8px', lineHeight: 1.4 }}>{video.description}</p>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                  📝 {video.questions.length} comprehension questions
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
