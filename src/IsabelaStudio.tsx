import { useState, useEffect, useRef } from 'react';
import './IsabelaStudio.css';

interface Props {
  onBack: () => void;
  userLevel: string | null;
}

type Screen = 'pick' | 'permission' | 'conv' | 'report';

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
  { id: 'food',        name: 'Food',        fullName: 'Brazilian food',        icon: '🍖', color: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  { id: 'music',       name: 'Music',       fullName: 'Brazilian music',       icon: '🎵', color: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
  { id: 'soccer',      name: 'Soccer',      fullName: 'Brazilian soccer',      icon: '⚽', color: '#dcfce7', border: '#86efac', text: '#14532d' },
  { id: 'telenovelas', name: 'Telenovelas', fullName: 'Brazilian telenovelas', icon: '📺', color: '#ede9fe', border: '#c4b5fd', text: '#4c1d95' },
  { id: 'books',       name: 'Books',       fullName: 'Brazilian books',       icon: '📚', color: '#e0f2fe', border: '#7dd3fc', text: '#0c4a6e' },
  { id: 'culture',     name: 'Culture',     fullName: 'Brazilian culture',     icon: '🎭', color: '#ffedd5', border: '#fdba74', text: '#7c2d12' },
  { id: 'cities',      name: 'Cities',      fullName: 'Brazilian cities',      icon: '🏙️', color: '#f1f5f9', border: '#cbd5e1', text: '#0f172a' },
  { id: 'politics',    name: 'Politics',    fullName: 'Brazilian politics',    icon: '🗳️', color: '#fef2f2', border: '#fca5a5', text: '#7f1d1d' },
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
  const [screen, setScreen]               = useState<Screen>('pick');
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0].id);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [isListening, setIsListening]     = useState(false);
  const [isSpeaking, setIsSpeaking]       = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [timeLeft, setTimeLeft]           = useState(CONVERSATION_SECONDS);
  const [error, setError]                 = useState('');
  const [report, setReport]               = useState<Report | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef  = useRef<any>(null);
  const messagesEndRef  = useRef<HTMLDivElement>(null);
  const audioRef        = useRef<HTMLAudioElement | null>(null);
  const conversationRef = useRef<Message[]>([]);
  const autoListenRef   = useRef(false);
  const level           = userLevel || 'B1';

  useEffect(() => { conversationRef.current = messages; }, [messages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isSpeaking]);
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

  const requestMicPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      return true;
    } catch {
      return false;
    }
  };

  const handlePermissionAndStart = async () => {
    const granted = await requestMicPermission();
    if (granted) {
      setPermissionDenied(false);
      await startConversation();
    } else {
      setPermissionDenied(true);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setError('Speech recognition not supported. Please use Chrome.'); return; }
    if (audioRef.current) { audioRef.current.pause(); setIsSpeaking(false); }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart  = () => setIsListening(true);
    recognition.onend    = () => setIsListening(false);
    recognition.onerror  = (e: any) => {
      setIsListening(false);
      if (e.error !== 'no-speech') {
        setError('Could not hear you. Try again.');
      }
    };
    recognition.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      if (t.trim()) sendToIsabela(t);
    };

    try { recognition.start(); } catch { }
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
      const blob  = await res.blob();
      const url   = URL.createObjectURL(blob);
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
      if (autoListenRef.current) {
        setTimeout(() => startListening(), 300);
      }
    }
  };

  const sendToIsabela = async (userText: string) => {
    const userMsg: Message = { role: 'user', text: userText };
    const updated = [...conversationRef.current, userMsg];
    setMessages(updated);
    setIsLoading(true);
    setError('');
    try {
      const topic = TOPICS.find(t => t.id === selectedTopic)?.fullName || selectedTopic;
      const res = await fetch('/api/isabela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role === 'isabela' ? 'assistant' : 'user', content: m.text })),
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
      setError('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    autoListenRef.current = true;
    setScreen('conv');
    setMessages([]);
    setTimeLeft(CONVERSATION_SECONDS);
    setError('');

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); endConversation(); return 0; }
        return prev - 1;
      });
    }, 1000);

    const topic = TOPICS.find(t => t.id === selectedTopic)?.fullName || selectedTopic;
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
      setMessages([{ role: 'isabela', text: greeting }]);
      setIsLoading(false);
      await speakWithElevenLabs(greeting);
    } catch {
      setError('Error starting conversation.');
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    autoListenRef.current = false;
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
            content: `Analyze this Portuguese learner's messages (level ${level}) and return ONLY valid JSON with no extra text. Include as many goodPhrases and corrections as are genuinely relevant — minimum 1, maximum 5 each. Do not force exactly 3 if there are more or fewer:
{
  "score": <number 1-10>,
  "goodPhrases": [
    {"phrase": "<exact phrase the learner used>", "note": "<why it was good>"}
  ],
  "corrections": [
    {"wrong": "<what they said>", "right": "<correct version with brief explanation>"}
  ],
  "tip": "<one specific, actionable tip for a ${level} learner>"
}

Learner messages:
${userMessages}`,
          }],
          systemPrompt: 'You are a Portuguese language expert. Return ONLY valid JSON, no markdown, no explanation.',
        }),
      });
      const data   = await res.json();
      const clean  = data.text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setReport(parsed);
    } catch {
      setReport({ score: 7, goodPhrases: [{ phrase: 'Boa tentativa!', note: 'You made a great effort.' }], corrections: [], tip: 'Keep practising — consistency is key!' });
    }
  };

  const topicInfo = TOPICS.find(t => t.id === selectedTopic);
  const topicName = topicInfo?.fullName || '';

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
              (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display');
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
              style={{
                background: selectedTopic === topic.id ? topic.color : 'white',
                borderColor: selectedTopic === topic.id ? topic.border : '#e2e8f0',
              }}
              onClick={() => setSelectedTopic(topic.id)}
            >
              <span className="is-topic-icon">{topic.icon}</span>
              <div className="is-topic-name" style={{ color: selectedTopic === topic.id ? topic.text : '#0f172a' }}>
                {topic.name}
              </div>
            </button>
          ))}
        </div>

        <button className="is-start-btn" onClick={() => setScreen('permission')}>
          Falar com Isabela →
        </button>
      </div>
    );
  }

  // ── PERMISSION SCREEN ────────────────────────────
  if (screen === 'permission') {
    return (
      <div className="is-wrapper">
        <div className="is-header">
          <img
            src="/isabela.png"
            alt="Isabela"
            className="is-avatar"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display');
            }}
          />
          <div className="is-avatar-fallback" style={{ display: 'none' }}>
            <span className="is-avatar-initials">Is</span>
          </div>
          <div className="is-name">Isabela</div>
          <div className="is-tagline">A tua parceira de conversa brasileira</div>
        </div>

        <div className="is-permission-card">
          <div className="is-permission-icon">🎙️</div>
          <h2 className="is-permission-title">Microphone access needed</h2>
          <p className="is-permission-desc">
            Isabela needs to hear you speak Portuguese! When prompted, please tap <strong>"Allow"</strong> to enable your microphone.
          </p>
          <div className="is-permission-steps">
            <div className="is-permission-step">
              <span className="is-permission-step-num">1</span>
              <span>Tap the button below</span>
            </div>
            <div className="is-permission-step">
              <span className="is-permission-step-num">2</span>
              <span>Allow microphone access when asked</span>
            </div>
            <div className="is-permission-step">
              <span className="is-permission-step-num">3</span>
              <span>Isabela will greet you and the conversation begins automatically!</span>
            </div>
          </div>

          {permissionDenied && (
            <div className="is-error" style={{ marginBottom: '16px' }}>
              Microphone access was denied. Please enable it in your browser settings and try again.
            </div>
          )}

          <button className="is-start-btn" onClick={handlePermissionAndStart}>
            Allow microphone & start →
          </button>
          <button className="is-permission-back" onClick={() => setScreen('pick')}>
            ← Go back
          </button>
        </div>
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
              (e.currentTarget.nextElementSibling as HTMLElement)?.style.removeProperty('display');
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
                  <div className="is-dot" /><div className="is-dot" /><div className="is-dot" />
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
            onClick={() => startListening()}
            disabled={isLoading || isSpeaking}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="white"/>
              <path d="M5 10a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="is-mic-label">
            {isListening ? 'Listening... tap to stop' : isSpeaking ? 'Isabela is speaking...' : 'Tap to speak or wait for auto-listen'}
          </div>
          <button className="is-end-btn" onClick={endConversation}>
            End conversation
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
          {report.goodPhrases.length > 0 && (
            <div className="is-report-section is-report-good">
              <div className="is-report-section-title">
                {report.goodPhrases.length === 1 ? 'Phrase you used well' : `${report.goodPhrases.length} phrases you used well`}
              </div>
              {report.goodPhrases.map((p, i) => (
                <div key={i} className="is-report-item">
                  <strong>"{p.phrase}"</strong> — {p.note}
                </div>
              ))}
            </div>
          )}
          {report.corrections.length > 0 && (
            <div className="is-report-section is-report-fix">
              <div className="is-report-section-title">
                {report.corrections.length === 1 ? 'Correction' : `${report.corrections.length} corrections`}
              </div>
              {report.corrections.map((c, i) => (
                <div key={i} className="is-report-item">
                  <span className="is-report-wrong">{c.wrong}</span>
                  <span className="is-report-right">✓ {c.right}</span>
                </div>
              ))}
            </div>
          )}
          <div className="is-report-section is-report-tip">
            <div className="is-report-section-title">Isabela's tip for {level}</div>
            <div className="is-report-item">{report.tip}</div>
          </div>
        </>
      ) : (
        <div className="is-report-item" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
          Preparing your report...
        </div>
      )}

      <button className="is-report-btn" onClick={() => { setScreen('pick'); setReport(null); autoListenRef.current = false; }}>
        Nova conversa →
      </button>
      <button className="is-report-btn-secondary" onClick={onBack}>
        Voltar ao início
      </button>
    </div>
  );
}
