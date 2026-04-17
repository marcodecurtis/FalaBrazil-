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
    youtubeId: 'IELrPIGdcec',
    title: 'Brazilian Famous Songs You Need To Know',
    description: 'Discover the iconic sounds of Samba, Bossa Nova and MPB — the music that defines Brazil.',
    level: 'A1',
    duration: '10 min',
    topic: 'Music & Culture',
    emoji: '🎵',
    questions: [
      {
        question: 'Which music genre originated in Rio de Janeiro in the late 1950s, blending samba with jazz?',
        options: ['Forró', 'Bossa Nova', 'Axé', 'Pagode'],
        correct: 1,
      },
      {
        question: 'What does "MPB" stand for in Brazilian music?',
        options: ['Música Popular Brasileira', 'Música Para Baile', 'Muito Boa Batida', 'Música Para Brasil'],
        correct: 0,
      },
      {
        question: 'Samba originated from which community in Brazil?',
        options: ['Indigenous communities in the Amazon', 'European immigrants in São Paulo', 'Afro-Brazilian communities', 'Fishermen in the Northeast'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v2',
    youtubeId: 'xmXLB1xtRpM',
    title: 'Deixa Falar: The First Samba School in Brazil',
    description: 'Learn the fascinating history of how Brazil\'s first samba school was born in Rio de Janeiro.',
    level: 'A1',
    duration: '8 min',
    topic: 'History & Culture',
    emoji: '🥁',
    questions: [
      {
        question: 'What does "Deixa Falar" mean in English?',
        options: ['Let it rain', 'Let them speak', 'Let\'s dance', 'Let it go'],
        correct: 1,
      },
      {
        question: 'In which city was the first samba school founded?',
        options: ['São Paulo', 'Salvador', 'Rio de Janeiro', 'Belo Horizonte'],
        correct: 2,
      },
      {
        question: 'Samba schools in Brazil are primarily associated with which celebration?',
        options: ['Christmas', 'Festa Junina', 'Carnival', 'New Year\'s Eve'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v3',
    youtubeId: 'VoBtI-oAeEI',
    title: 'Valentine\'s Day in Brazil: What You Need to Know',
    description: 'Brazil\'s version of Valentine\'s Day is nothing like what you expect — discover Dia dos Namorados.',
    level: 'A2',
    duration: '9 min',
    topic: 'Culture & Traditions',
    emoji: '💕',
    questions: [
      {
        question: 'What is Valentine\'s Day called in Brazil?',
        options: ['Dia do Amor', 'Dia dos Namorados', 'Dia dos Casados', 'Dia do Coração'],
        correct: 1,
      },
      {
        question: 'When is Dia dos Namorados celebrated in Brazil?',
        options: ['February 14th', 'March 8th', 'June 12th', 'July 4th'],
        correct: 2,
      },
      {
        question: 'What does "namorados" mean in English?',
        options: ['Friends', 'Sweethearts / dating partners', 'Married couples', 'Family members'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v4',
    youtubeId: 'tl-Pu3lFh7Q',
    title: 'Como os doces brasileiros ficaram tão doces',
    description: 'The sweet story behind Brazilian desserts — from brigadeiro to cocada — and why Brazilians love sugar.',
    level: 'A2',
    duration: '11 min',
    topic: 'Food & Culture',
    emoji: '🍬',
    questions: [
      {
        question: 'What is a "brigadeiro"?',
        options: ['A type of Brazilian bread', 'A chocolate truffle made with condensed milk', 'A grilled meat dish', 'A type of Brazilian cheese'],
        correct: 1,
      },
      {
        question: 'Which ingredient is central to most traditional Brazilian sweets?',
        options: ['Honey', 'Brown sugar', 'Condensed milk (leite condensado)', 'Maple syrup'],
        correct: 2,
      },
      {
        question: 'The Portuguese influence on Brazilian sweets mainly came through which ingredient?',
        options: ['Chocolate', 'Sugar cane', 'Coconut', 'Vanilla'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v5',
    youtubeId: 'a_xLlF-iu6M',
    title: 'What is Brazil\'s Festa Junina?',
    description: 'One of Brazil\'s most beloved festivals — forró dancing, corn dishes, and countryside costumes.',
    level: 'A2',
    duration: '10 min',
    topic: 'Festivals & Traditions',
    emoji: '🎪',
    questions: [
      {
        question: 'When does Festa Junina take place in Brazil?',
        options: ['December', 'March', 'June', 'September'],
        correct: 2,
      },
      {
        question: 'Which dance is most associated with Festa Junina?',
        options: ['Samba', 'Forró', 'Axé', 'Funk'],
        correct: 1,
      },
      {
        question: 'Festa Junina celebrates the harvest of which food?',
        options: ['Coffee', 'Sugar cane', 'Corn (milho)', 'Beans'],
        correct: 2,
      },
    ],
  },
  {
    id: 'v6',
    youtubeId: 'QhJE9lChJxI',
    title: 'How to Swear in Portuguese 🇧🇷',
    description: 'The real informal Brazilian Portuguese that textbooks won\'t teach you — explained with cultural context.',
    level: 'B1',
    duration: '12 min',
    topic: 'Slang & Informal Language',
    emoji: '🤬',
    questions: [
      {
        question: 'Why is learning informal and slang language important for Portuguese learners?',
        options: [
          'To be rude to people',
          'To understand native speakers in real conversations and movies',
          'It is not important — only formal language matters',
          'To pass formal exams',
        ],
        correct: 1,
      },
      {
        question: 'In Brazilian Portuguese, the word "caramba" is used to express:',
        options: ['Agreement', 'Surprise or frustration (a mild exclamation)', 'A greeting', 'A farewell'],
        correct: 1,
      },
      {
        question: 'When Brazilians say "que saudade!", they are expressing:',
        options: ['Anger', 'A deep longing or missing someone/something', 'Hunger', 'Surprise'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v7',
    youtubeId: 'CJQ7W6c7xt0',
    title: 'When do we use "nós" or "a gente"?',
    description: 'One of the most common points of confusion in Brazilian Portuguese — finally explained clearly.',
    level: 'B1',
    duration: '10 min',
    topic: 'Grammar & Usage',
    emoji: '🧩',
    questions: [
      {
        question: 'Both "nós" and "a gente" mean what in English?',
        options: ['"You" (plural)', '"We"', '"They"', '"One" (impersonal)'],
        correct: 1,
      },
      {
        question: 'In everyday spoken Brazilian Portuguese, which form is more commonly used?',
        options: ['"Nós" — it is always preferred', '"A gente" — it is more informal and widely used in speech', 'Both are used equally', '"Nós" in Rio, "a gente" only in São Paulo'],
        correct: 1,
      },
      {
        question: 'When "a gente" is used as "we", the verb is conjugated in which form?',
        options: ['First person plural (nós form)', 'Third person singular (ele/ela form)', 'Second person singular (você form)', 'Infinitive form'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v8',
    youtubeId: 'sFZgPuJmjBc',
    title: 'STOP Confusing Tudo and Todo!',
    description: 'A super common mistake even intermediate learners make — learn the difference once and for all.',
    level: 'B1',
    duration: '8 min',
    topic: 'Grammar & Usage',
    emoji: '✋',
    questions: [
      {
        question: 'What does "tudo" mean in English?',
        options: ['All (referring to a specific group)', 'Everything (general, uncountable)', 'Every day', 'All of them'],
        correct: 1,
      },
      {
        question: 'Which sentence is correct?',
        options: ['"Todo está bem" — Everything is fine', '"Tudo está bem" — Everything is fine', '"Todo são felizes" — Everyone is happy', '"Tudo as pessoas" — All people'],
        correct: 1,
      },
      {
        question: '"Todo dia" means:',
        options: ['Everything', 'Every day', 'All the things', 'The whole truth'],
        correct: 1,
      },
    ],
  },
  {
    id: 'v9',
    youtubeId: '4ygqb46j4P0',
    title: '10 Brazilian Telenovelas to Learn Authentic Portuguese',
    description: 'Virginia\'s guide to the most iconic telenovelas — and exactly how to use them to improve your Portuguese.',
    level: 'B2',
    duration: '15 min',
    topic: 'Telenovelas & Media',
    emoji: '📺',
    questions: [
      {
        question: 'Why are telenovelas particularly good for learning Portuguese?',
        options: [
          'They use only formal language',
          'They feature real everyday speech, emotions and cultural situations',
          'They are always subtitled in English',
          'They speak very slowly for learners',
        ],
        correct: 1,
      },
      {
        question: 'Avenida Brasil is considered one of the most watched telenovelas ever. What is its main theme?',
        options: ['A love story in the Amazon', 'Revenge, family secrets and social class in Rio de Janeiro', 'Brazilian football', 'A political drama in Brasília'],
        correct: 1,
      },
      {
        question: 'What is a practical tip for using telenovelas to learn Portuguese?',
        options: [
          'Watch only with English subtitles always',
          'Start with Portuguese subtitles then gradually remove them',
          'Skip dialogue and focus on visuals',
          'Only watch for 5 minutes at a time',
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 'v10',
    youtubeId: 'SgMfs9g_WRw',
    title: '3 Brazilian Telenovelas to Improve Your Portuguese',
    description: 'Three specific telenovela recommendations with tips on how to study with each one.',
    level: 'B2',
    duration: '12 min',
    topic: 'Telenovelas & Media',
    emoji: '🎬',
    questions: [
      {
        question: 'What makes Brazilian telenovelas different from American soap operas?',
        options: [
          'They run indefinitely for decades',
          'They typically have a defined end after around 6-8 months with one main storyline',
          'They are always comedies',
          'They are filmed in the Amazon',
        ],
        correct: 1,
      },
      {
        question: 'Which platform has invested heavily in Brazilian original series and telenovelas?',
        options: ['Disney+', 'Netflix', 'Apple TV+', 'HBO Max only'],
        correct: 1,
      },
      {
        question: 'When studying Portuguese with a telenovela, what should you focus on first?',
        options: [
          'Memorising every word',
          'Understanding the emotional context and getting used to the rhythm of speech',
          'Writing down every new word',
          'Translating every sentence',
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 'v11',
    youtubeId: 'JpSGEIvfquI',
    title: 'Learn Portuguese with Netflix — Brazilian Series',
    description: 'How to turn your Netflix watching into a powerful Portuguese learning tool — with specific Brazilian series recommendations.',
    level: 'C2',
    duration: '14 min',
    topic: 'Advanced Learning & Media',
    emoji: '🎯',
    questions: [
      {
        question: 'The Brazilian Netflix series "3%" is set in what kind of world?',
        options: ['A historical drama in colonial Brazil', 'A dystopian future where only 3% of people reach a privileged life', 'A romantic comedy in São Paulo', 'A crime thriller in Rio\'s favelas'],
        correct: 1,
      },
      {
        question: 'What is the most effective subtitle strategy for advanced Portuguese learners on Netflix?',
        options: [
          'Always use English subtitles',
          'Use Portuguese subtitles — this forces active listening and reading simultaneously',
          'Watch with no subtitles from the very start',
          'Pause every 10 seconds to look up words',
        ],
        correct: 1,
      },
      {
        question: 'Why is watching Brazilian series better than European Portuguese series for Brazilian Portuguese learners?',
        options: [
          'Brazilian series are always better quality',
          'The accent, vocabulary and cultural references are specific to Brazil and what you are learning',
          'They are cheaper to access',
          'They always have better subtitles',
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 'v12',
    youtubeId: 'lYv16N3TEwM',
    title: '17 Most Romantic and Sensual Words in Brazilian Portuguese',
    description: 'The most beautiful and expressive vocabulary in Portuguese — words that reveal the soul of the language.',
    level: 'C2',
    duration: '13 min',
    topic: 'Advanced Vocabulary',
    emoji: '💋',
    questions: [
      {
        question: 'What does "saudade" mean — considered one of the most untranslatable words in Portuguese?',
        options: [
          'A type of sadness with no hope',
          'A deep emotional longing for something or someone you love that is absent',
          'Romantic love at first sight',
          'The feeling of being homesick',
        ],
        correct: 1,
      },
      {
        question: 'The word "gostoso/gostosa" literally means "tasty" but is also used to mean:',
        options: ['Boring', 'Attractive or sexy in informal Brazilian speech', 'Kind and generous', 'Intelligent'],
        correct: 1,
      },
      {
        question: 'Why does Portuguese have so many expressive emotional words compared to other languages?',
        options: [
          'It is a newer language with more words',
          'Portuguese developed from a rich mix of Latin, Arabic, African and indigenous influences creating deep emotional vocabulary',
          'Brazilians invented most of these words recently',
          'They borrowed them all from Spanish',
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

export default function VideoStudio({ onBack: _onBack, userLevel }: Props) {
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

  // ── VIDEO PLAYER ──
  if (selectedVideo && phase === 'watch') {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
        <button onClick={() => setSelectedVideo(null)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', padding: '16px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: LEVEL_COLORS[selectedVideo.level], color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>
            {selectedVideo.level}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{selectedVideo.duration} · {selectedVideo.topic}</span>
        </div>

        <h2 style={{ fontWeight: 900, fontSize: '1.2rem', margin: '0 0 6px', color: '#0f172a' }}>{selectedVideo.title}</h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 24px' }}>{selectedVideo.description}</p>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <p style={{ fontWeight: 700, color: '#14532d', fontSize: '0.85rem', margin: '0 0 4px' }}>📝 Ready to test yourself?</p>
          <p style={{ color: '#166534', fontSize: '0.8rem', margin: 0 }}>Watch the video above, then answer {selectedVideo.questions.length} questions.</p>
        </div>

        <button onClick={() => setPhase('quiz')}
          style={{ width: '100%', padding: '14px', background: '#14532d', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          Start Quiz →
        </button>
      </div>
    );
  }

  // ── QUIZ ──
  if (selectedVideo && phase === 'quiz') {
    const q = selectedVideo.questions[currentQ];
    const isCorrect = selected === q.correct;
    const isLast = currentQ === selectedVideo.questions.length - 1;

    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          <button onClick={() => setPhase('watch')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
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
            let bg = 'white', border = '2px solid #e2e8f0', color = '#0f172a';
            if (showFeedback) {
              if (i === q.correct) { bg = '#f0fdf4'; border = '2px solid #4caf7d'; color = '#14532d'; }
              else if (i === selected) { bg = '#fff1f2'; border = '2px solid #f87171'; color = '#991b1b'; }
              else { bg = '#f8fafc'; color = '#94a3b8'; }
            } else if (selected === i) {
              bg = '#f0fdf4'; border = '2px solid #14532d';
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={showFeedback}
                style={{ background: bg, border, borderRadius: '12px', padding: '14px 16px', textAlign: 'left', cursor: showFeedback ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}>
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
          <button onClick={handleNext}
            style={{ width: '100%', padding: '14px', background: '#14532d', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            {isLast ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    );
  }

  // ── RESULT ──
  if (selectedVideo && phase === 'result') {
    const score = answers.filter((a, i) => a === selectedVideo.questions[i].correct).length;
    const total = selectedVideo.questions.length;
    const passed = score >= Math.ceil(total * 0.67);

    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', background: 'white', borderRadius: '20px', padding: '32px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{passed ? '🎉' : '📺'}</div>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: passed ? '#f0fdf4' : '#fff1f2', border: `3px solid ${passed ? '#4caf7d' : '#f87171'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: passed ? '#14532d' : '#991b1b' }}>{score}/{total}</span>
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', marginBottom: '8px' }}>{passed ? 'Well done!' : 'Keep watching!'}</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '28px' }}>
            {passed
              ? `You answered ${score} out of ${total} correctly. Great comprehension!`
              : `You got ${score} out of ${total}. Try re-watching and quiz again.`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {!passed && (
              <button onClick={() => { setPhase('watch'); setCurrentQ(0); setAnswers([]); setSelected(null); setShowFeedback(false); }}
                style={{ padding: '13px', background: '#14532d', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Re-watch & Retry →
              </button>
            )}
            <button onClick={() => setSelectedVideo(null)}
              style={{ padding: '13px', background: passed ? '#14532d' : 'white', color: passed ? 'white' : '#64748b', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit' }}>
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
        <button onClick={() => _onBack()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', padding: '0 0 12px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}>← Back</button>
        <h1 style={{ fontWeight: 900, fontSize: '2.2rem', color: '#0f172a', margin: '0 0 4px' }}>Watch & Learn</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Brazilian culture, music, food & telenovelas</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px', scrollbarWidth: 'none' }}>
        {levels.map(lvl => (
          <button key={lvl} onClick={() => setFilterLevel(lvl)}
            style={{ padding: '6px 14px', borderRadius: '99px', border: 'none', background: filterLevel === lvl ? '#14532d' : '#f1f5f9', color: filterLevel === lvl ? 'white' : '#64748b', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'all 0.15s' }}>
            {lvl === 'all' ? 'All Levels' : lvl}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredVideos.map(video => {
          const videoLevelNum = LEVEL_ORDER[video.level] || 1;
          const isAccessible = videoLevelNum <= userLevelNum + 1 || userLevel === 'C2';
          return (
            <div key={video.id} onClick={() => isAccessible && handleSelect(video)}
              style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: isAccessible ? 'pointer' : 'default', opacity: isAccessible ? 1 : 0.5, border: '1px solid #f1f5f9' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0f172a' }}>
                <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ background: LEVEL_COLORS[video.level], color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800 }}>{video.level}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{video.emoji} {video.topic}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3 }}>{video.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 8px', lineHeight: 1.4 }}>{video.description}</p>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>📝 {video.questions.length} comprehension questions</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
