import { useState, useEffect, useRef } from 'react';
import './IsabelaStudio.css';

interface Props {
  onBack: () => void;
  userLevel: string | null;
}

type Screen = 'pick' | 'conv' | 'report';

interface Message {
  role: 'isabela' | 'user';
  text: string;
}

interface Report {
  score: number;
  goodPhrases: { phrase: string; note: string }[];
  corrections: { wrong: string; right: string }[];
  tip: string;
}

const TOPICS = [
  { id: 'food',       name: 'Brazilian food',       icon: '🍖' },
  { id: 'music',      name: 'Brazilian music',       icon: '🎵' },
  { id: 'soccer',     name: 'Brazilian soccer',      icon: '⚽' },
  { id: 'telenovelas',name: 'Brazilian telenovelas', icon: '📺' },
  { id: 'books',      name: 'Brazilian books',       icon: '📚' },
  { id: 'culture',    name: 'Brazilian culture',     icon: '🎭' },
  { id: 'cities',     name: 'Brazilian cities',      icon: '🏙️' },
  { id: 'politics',   name: 'Brazilian politics',    icon: '🗳️' },
];

const ELEVENLABS_VOICE_ID = '33B4UnXyTNbgLmdEDh5P';
const CONVERSATION_SECONDS = 180;

function buildSystemPrompt(topic: string, level: string): string {
  const levelInstructions: Record<string, string> = {
    A1: 'Use only very simple present tense sentences. Maximum 8 words per sentence. Use common everyday vocabulary only. Avoid any complex grammar.',
    A2: 'Use simple present and past tense. Short sentences up to 12 words. Use basic connectors like "e", "mas", "porque". Avoid subjunctive.',
    B1: 'Use present, past and future tenses naturally. Medium complexity sentences. Introduce some idioms. You can use subjunctive occasionally.',
    B2: 'Speak naturally with varied tenses including subjunctive. Use Brazilian idioms and expressions freely. Discuss nuanced ideas.',
    C1: 'Speak with full native-like complexity. Use all tenses, idiomatic expressions, colloquialisms, and cultural references freely.',
    C2: 'Speak exactly as a native Brazilian would. Use slang, regional expressions, complex grammar, and cultural nuances without restriction.',
  };

  return `Você é Isabela, uma brasileira calorosa, animada e encorajadora que adora conversar sobre cultura brasileira. Você é a parceira de conversação do utilizador no app Fala Brazil!

PERSONALIDADE:
- Calorosa, paciente e muito encorajadora
- Celebra os esforços do utilizador, mesmo quando ele comete erros
- Usa expressões brasileiras naturais como "Nossa!", "Que bacana!", "Que legal!"
- Nunca quebra o personagem
- Nunca corrige erros durante a conversa — guarda as correções para o relatório final

NÍVEL DO UTILIZADOR: ${level}
INSTRUÇÕES DE NÍVEL: ${levelInstructions[level] || levelInstructions['B1']}

TEMA DA CONVERSA: ${topic}

REGRAS IMPORTANTES:
- Fale SEMPRE em português brasileiro, sem exceções
- Adapte a complexidade ao nível ${level} do utilizador
- Faça perguntas abertas para manter a conversa fluindo
- Respostas curtas e naturais — máximo 2-3 frases por resposta
- Se o utilizador escrever em inglês, responda em português gentilmente e encoraje-o a tentar em português
- NÃO corrija erros durante a conversa
- Seja autêntica e espontânea como uma brasileira real

Comece a conversa com uma saudação calorosa e uma pergunta sobre o tema.`;
}

export default function IsabelaStudio({ onBack, userLevel }: Props) {
  const [screen, setScreen]           = useState<Screen>('pick');
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0].id);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [timeLeft, setTimeLeft]       = useState(CONVERSATION_SECONDS);
  const [error, setError]             = useState('');
  const [report, setReport]           = useState<Report | null>(null);

  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef  = useRef<any>(null);
  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const audioRef        = useRef<HTMLAudioElement | null>(null);
  const conversationRef = useRef<Message[]>([]);
  const level           = userLevel || 'B1';

  useEffect(() => {
    conversationRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) recognitionRef.current.abort();
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const speakWithElevenLabs = async (text: string) => {
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/isabela-speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: ELEVENLABS_VOICE_ID }),
      });
      if (!res.ok) throw new Error('ElevenLabs error');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      await new Promise<void>(resolve => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
      });
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ElevenLabs error:', e);
    } finally {
      setIsSpeaking(false);
    }
  };

  const sendToIsabela = async (userText: string) => {
    const userMsg: Message = { role: 'user', text: userText };
    const updated = [...conversationRef.current, userMsg];
    setMessages(updated);
    setIsLoading(true);
    setError('');

    try {
      const topic = TOPICS.find(t => t.id === selectedTopic)?.name || selectedTopic;
      const res = await fetch('/api/isabela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({
            role: m.role === 'isabela' ? 'assistant' : 'user',
            content: m.text,
          })),
          systemPrompt: buildSystemPrompt(topic, level),
        }),
      });
      const data = await res.json();
      const reply = data.text || 'Desculpa, houve um erro. Podes repetir?';
      const isabelaMsg: Message = { role: 'isabela', text: reply };
      setMessages(prev => [...prev, isabelaMsg]);
      setIsLoading(false);
      await speakWithElevenLabs(reply);
    } catch {
      setError('Erro de ligação. Tenta novamente.');
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    setScreen('conv');
    setMessages([]);
    setTimeLeft(CONVERSATION_SECONDS);
    setError('');

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endConversation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const topic = TOPICS.find(t => t.id === selectedTopic)?.name || selectedTopic;
    setIsLoading(true);
    try {
      const res = await fetch('/api/isabela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          systemPrompt: buildSystemPrompt(topic, level),
        }),
      });
      const data = await res.json();
      const greeting = data.text || 'Olá! Vamos conversar!';
      const msg: Message = { role: 'isabela', text: greeting };
      setMessages([msg]);
      setIsLoading(false);
      await speakWithElevenLabs(greeting);
    } catch {
      setError('Erro ao iniciar conversa.');
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('O teu browser não suporta reconhecimento de voz. Tenta o Chrome.');
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart  = () => setIsListening(true);
    recognition.onend    = () => setIsListening(false);
    recognition.onerror  = () => { setIsListening(false); setError('Não consegui ouvir. Tenta novamente.'); };
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      if (transcript.trim()) sendToIsabela(transcript);
    };
    recognition.start();
  };

  const endConversation = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.abort();
    if (audioRef.current) audioRef.current.pause();
    setIsListening(false);
    setIsSpeaking(false);
    setScreen('report');
    await generateReport();
  };

  const generateReport = async () => {
    const msgs = conversationRef.current;
    const userMessages = msgs.filter(m => m.role === 'user').map(m => m.text).join('\n');
    if (!userMessages.trim()) {
      setReport({ score: 0, goodPhrases: [], corrections: [], tip: 'Try to speak more next time!' });
      return;
    }

    try {
      const res = await fetch('/api/isabela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyze this Portuguese learner's messages (level ${level}) and return ONLY valid JSON with no extra text:
{
  "score": <number 1-10>,
  "goodPhrases": [
    {"phrase": "<exact phrase used>", "note": "<why it was good>"},
    {"phrase": "<exact phrase used>", "note": "<why it was good>"},
    {"phrase": "<exact phrase used>", "note": "<why it was good>"}
  ],
  "corrections": [
    {"wrong": "<what they said>", "right": "<correct version>"},
    {"wrong": "<what they said>", "right": "<correct version>"},
    {"wrong": "<what they said>", "right": "<correct version>"}
  ],
  "tip": "<one specific tip for a ${level} learner>"
}

Learner messages:
${userMessages}`,
          }],
          systemPrompt: 'You are a Portuguese language expert. Return ONLY valid JSON, no markdown, no explanation.',
        }),
      });
      const data = await res.json();
      const clean = data.text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setReport(parsed);
    } catch {
      setReport({
        score: 7,
        goodPhrases: [{ phrase: 'Boa tentativa!', note: 'You made a great effort.' }],
        corrections: [],
        tip: 'Keep practising — consistency is key!',
      });
    }
  };

  const topicName = TOPICS.find(t => t.id === selectedTopic)?.name || '';

  // ── TOPIC PICKER ─────────────────────────────────
  if (screen === 'pick') {
    return (
      <div className="is-wrapper">
        <div className="is-header">
          <img
            src="/isabela.png"
            alt="Isabela"
            className="is-avatar"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.removeAttribute('style');
            }}
          />
          <div className="is-avatar-fallback" style={{ display: 'none' }}>
            <span className="is-avatar-initials">Is</span>
          </div>
          <div className="is-name">Isabela</div>
          <div className="is-tagline">A tua parceira de conversa brasileira</div>
          <div className="is-level-pill">Level {level}</div>
        </div>

        <div className="is-section-label">Choose a topic · Escolhe um tema</div>
        <div className="is-topics-grid">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              className={`is-topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <span className="is-topic-icon">{topic.icon}</span>
              <div className="is-topic-name">{topic.name}</div>
            </button>
          ))}
        </div>

        <button className="is-start-btn" onClick={startConversation}>
          Falar com Isabela →
        </button>
      </div>
    );
  }

  // ── CONVERSATION ─────────────────────────────────
  if (screen === 'conv') {
    return (
      <div className="is-wrapper">
        <div className="is-conv-header">
          <img
            src="/isabela.png"
            alt="Isabela"
            className="is-conv-avatar"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.removeAttribute('style');
            }}
          />
          <div className="is-conv-avatar-fallback" style={{ display: 'none' }}>Is</div>
          <div className="is-conv-info">
            <div className="is-conv-name">Isabela</div>
            <div className="is-conv-topic">{topicName} · {level}</div>
          </div>
          <div className={`is-timer ${timeLeft <= 30 ? 'urgent' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="is-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`is-msg is-msg-${msg.role}`}>
              <div className="is-msg-sender">{msg.role === 'isabela' ? 'Isabela' : 'You'}</div>
              <div className="is-msg-bubble">{msg.text}</div>
            </div>
          ))}

          {(isLoading || isSpeaking) && (
            <div className="is-msg is-msg-isabela">
              <div className="is-msg-sender">Isabela</div>
              <div className="is-msg-bubble">
                <div className="is-speaking-dots">
                  <div className="is-dot" />
                  <div className="is-dot" />
                  <div className="is-dot" />
                </div>
              </div>
            </div>
          )}

          {error && <div className="is-error">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="is-voice-bar">
          <button
            className={`is-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={startListening}
            disabled={isLoading || isSpeaking}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="white"/>
              <path d="M5 10a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="is-mic-label">
            {isListening ? 'A ouvir... toca para parar' : isSpeaking ? 'Isabela está a falar...' : 'Toca para falar'}
          </div>
          <button className="is-end-btn" onClick={endConversation}>
            Terminar conversa
          </button>
        </div>
      </div>
    );
  }

  // ── REPORT ───────────────────────────────────────
  return (
    <div className="is-wrapper">
      <div className="is-report-header">
        <div className="is-score-circle">
          <div className="is-score-num">{report?.score ?? '...'}</div>
          <div className="is-score-den">/ 10</div>
        </div>
        <div className="is-report-title">
          {report ? (report.score >= 8 ? 'Excelente! 🎉' : report.score >= 6 ? 'Muito bem! 👏' : 'Bom esforço! 💪') : 'A analisar...'}
        </div>
        <div className="is-report-sub">{topicName} · 3 min · {level}</div>
      </div>

      {report ? (
        <>
          <div className="is-report-section is-report-good">
            <div className="is-report-section-title">3 phrases you used well</div>
            {report.goodPhrases.map((p, i) => (
              <div key={i} className="is-report-item">
                <strong>"{p.phrase}"</strong> — {p.note}
              </div>
            ))}
          </div>

          <div className="is-report-section is-report-fix">
            <div className="is-report-section-title">3 corrections</div>
            {report.corrections.map((c, i) => (
              <div key={i} className="is-report-item">
                <span className="is-report-wrong">{c.wrong}</span>
                <span className="is-report-right">✓ {c.right}</span>
              </div>
            ))}
          </div>

          <div className="is-report-section is-report-tip">
            <div className="is-report-section-title">Isabela's tip for {level}</div>
            <div className="is-report-item">{report.tip}</div>
          </div>
        </>
      ) : (
        <div className="is-report-item" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
          A preparar o teu relatório...
        </div>
      )}

      <button className="is-report-btn" onClick={() => { setScreen('pick'); setReport(null); }}>
        Nova conversa →
      </button>
      <button className="is-report-btn-secondary" onClick={onBack}>
        Voltar ao início
      </button>
    </div>
  );
}
