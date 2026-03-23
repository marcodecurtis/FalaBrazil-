import { useState, useEffect, useRef } from 'react';
import type { Level } from './App';

interface Props {
  onBack: () => void;
  userLevel: Level | null;
}

type Status = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DisplayMessage {
  role: 'user' | 'isabela';
  text: string;
}

const CONVERSATION_STARTERS = [
  'Oi! Tudo bem com você? Me conta, o que você fez hoje?',
  'Olá! Que bom te ver! Você gosta de morar onde você mora?',
  'Oi! Vamos conversar! Me fala um pouco sobre você.',
  'Olá! Estou animada para praticar com você! Qual é o seu nome?',
  'Oi! Que dia lindo! Você tem algum plano para o fim de semana?',
];

export default function IsabelaStudio({ onBack, userLevel }: Props) {
  const [status, setStatus]                   = useState<Status>('idle');
  const [apiMessages, setApiMessages]         = useState<Message[]>([]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [transcript, setTranscript]           = useState('');
  const [error, setError]                     = useState('');
  const [isStarted, setIsStarted]             = useState(false);
  const [isMuted, setIsMuted]                 = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isListeningRef = useRef(false);
  const transcriptRef  = useRef('');

  const level = userLevel || 'A1';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, transcript]);

  useEffect(() => {
    return () => {
      stopListening();
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stopListening = () => {
    if (recognitionRef.current) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // ── ElevenLabs TTS via backend proxy ──
  const speakText = async (text: string): Promise<void> => {
    if (isMuted) return;
    setStatus('speaking');
    try {
      const res = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      return new Promise((resolve) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play().catch(() => resolve());
      });
    } catch (e) {
      console.error('TTS error:', e);
      // Don't block conversation if TTS fails
    }
  };

  // ── Get Isabela's reply from Claude via backend ──
  const getIsabelaReply = async (history: Message[]): Promise<string> => {
    const res = await fetch('/api/isabela', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, level }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  };

  // ── Process a completed user utterance ──
  const handleUserSpeech = async (userText: string) => {
    if (!userText.trim()) { setStatus('idle'); return; }

    const newDisplay: DisplayMessage[] = [...displayMessages, { role: 'user', text: userText }];
    const newApi: Message[]            = [...apiMessages,     { role: 'user', content: userText }];
    setDisplayMessages(newDisplay);
    setApiMessages(newApi);
    setTranscript('');
    setStatus('thinking');

    try {
      const reply = await getIsabelaReply(newApi);
      setDisplayMessages([...newDisplay, { role: 'isabela', text: reply }]);
      setApiMessages([...newApi, { role: 'assistant', content: reply }]);
      await speakText(reply);
      setStatus('idle');
    } catch (e) {
      console.error(e);
      setError('Could not connect. Check your internet connection and try again.');
      setStatus('error');
    }
  };

  // ── Start speech recognition ──
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice recognition is not supported in this browser. Please use Chrome on Android or desktop.');
      setStatus('error');
      return;
    }

    audioRef.current?.pause();

    const recognition        = new SpeechRecognition();
    recognition.lang           = 'pt-BR';
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognitionRef.current     = recognition;
    isListeningRef.current     = true;

    recognition.onstart = () => {
      setStatus('listening');
      setTranscript('');
      transcriptRef.current = '';
    };

    recognition.onresult = (e: any) => {
      const current = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(current);
      transcriptRef.current = current;
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (!isListeningRef.current) return;
      isListeningRef.current = false;
      const final = transcriptRef.current;
      setTranscript('');
      if (final.trim()) {
        handleUserSpeech(final);
      } else {
        setStatus('idle');
      }
    };

    recognition.onerror = (e: any) => {
      isListeningRef.current = false;
      recognitionRef.current = null;
      if (e.error === 'no-speech')   { setStatus('idle'); return; }
      if (e.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions and try again.');
        setStatus('error');
        return;
      }
      setStatus('idle');
    };

    recognition.start();
  };

  const handleMicPress = () => {
    if (status === 'listening') {
      stopListening();
      const final = transcriptRef.current;
      setTranscript('');
      if (final.trim()) handleUserSpeech(final);
      else setStatus('idle');
    } else if (status === 'speaking') {
      audioRef.current?.pause();
      setStatus('idle');
    } else if (status === 'idle') {
      startListening();
    }
  };

  const handleStart = async () => {
    setIsStarted(true);
    setStatus('thinking');
    const starter = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];
    setDisplayMessages([{ role: 'isabela', text: starter }]);
    setApiMessages([{ role: 'assistant', content: starter }]);
    await speakText(starter);
    setStatus('idle');
  };

  const handleReset = () => {
    stopListening();
    audioRef.current?.pause();
    setApiMessages([]);
    setDisplayMessages([]);
    setTranscript('');
    setError('');
    setIsStarted(false);
    setStatus('idle');
  };

  // ── INTRO SCREEN ──────────────────────────────────
  if (!isStarted) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', padding: '16px 0', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}>
          ← Back
        </button>

        <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(219,39,119,0.15)', overflow: 'hidden' }}>
            <img src="/isabela.png" alt="Isabela" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#0f172a', margin: '0 0 6px' }}>Isabela</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Your AI Brazilian Portuguese conversation partner</p>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', margin: '0 0 12px' }}>How it works</h3>
          {[
            ['🎙️', 'Tap the mic and speak in Portuguese (or try your best!)'],
            ['🤖', 'Isabela replies in Portuguese, matched to your level'],
            ['🔊', 'Her voice is powered by ElevenLabs — natural Brazilian sound'],
            ['💬', "She'll gently correct mistakes and keep the chat going"],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 3 ? '10px' : 0 }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fce7f3', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>📶</span>
          <span style={{ fontSize: '0.8rem', color: '#9d174d', fontWeight: 600 }}>
            Level <strong>{level}</strong> detected — Isabela will adapt to your pace.
          </span>
        </div>

        <button
          onClick={handleStart}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #14532d, #166534)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(20,83,45,0.3)' }}
        >
          Start Conversation 🎙️
        </button>
      </div>
    );
  }

  // ── CHAT SCREEN ───────────────────────────────────
  const micColor =
    status === 'listening' ? '#dc2626' :
    status === 'thinking'  ? '#94a3b8' :
    status === 'speaking'  ? '#7c3aed' : '#14532d';

  const micLabel =
    status === 'listening' ? 'Listening… tap to send' :
    status === 'thinking'  ? 'Isabela is thinking…' :
    status === 'speaking'  ? 'Tap to interrupt' :
    'Tap to speak';

  const micEmoji =
    status === 'listening' ? '⏹️' :
    status === 'thinking'  ? '⏳' :
    status === 'speaking'  ? '🔊' : '🎙️';

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', background: 'white', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b', fontSize: '0.85rem', fontFamily: 'inherit' }}>← Back</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', overflow: 'hidden', flexShrink: 0 }}>
            <img src="/isabela.png" alt="Isabela" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', lineHeight: 1.1 }}>Isabela</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: status === 'speaking' ? '#7c3aed' : status === 'listening' ? '#dc2626' : status === 'thinking' ? '#f59e0b' : '#4ade80' }}>
              {status === 'listening' ? '🔴 listening' : status === 'speaking' ? '🔊 speaking' : status === 'thinking' ? '⏳ thinking' : '● online'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => { setIsMuted(m => !m); audioRef.current?.pause(); }} style={{ background: isMuted ? '#fee2e2' : '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button onClick={handleReset} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            🔄
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
        {displayMessages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
            {msg.role === 'isabela' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', flexShrink: 0, overflow: 'hidden' }}>
                <img src="/isabela.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? '#14532d' : 'white',
              color: msg.role === 'user' ? 'white' : '#0f172a',
              fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Live transcript */}
        {transcript && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: '18px 18px 4px 18px', background: '#dcfce7', color: '#14532d', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500, border: '2px dashed #4ade80' }}>
              {transcript}
            </div>
          </div>
        )}

        {/* Thinking dots */}
        {status === 'thinking' && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', flexShrink: 0 }} />
            <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#cbd5e1', animation: `dot 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
            ⚠️ {error}
            <button onClick={() => { setError(''); setStatus('idle'); }} style={{ display: 'block', margin: '8px auto 0', background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>
              Dismiss
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mic */}
      <div style={{ padding: '16px 16px 28px', background: 'white', borderTop: '1px solid #f1f5f9', flexShrink: 0, textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '14px', height: '16px' }}>{micLabel}</div>
        <button
          onClick={handleMicPress}
          disabled={status === 'thinking'}
          style={{
            width: '76px', height: '76px', borderRadius: '50%',
            background: status === 'thinking' ? '#f1f5f9' : micColor,
            border: 'none', cursor: status === 'thinking' ? 'default' : 'pointer',
            fontSize: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: status === 'listening'
              ? '0 0 0 10px rgba(220,38,38,0.12), 0 4px 20px rgba(220,38,38,0.25)'
              : status === 'speaking'
              ? '0 0 0 10px rgba(124,58,237,0.12), 0 4px 20px rgba(124,58,237,0.25)'
              : '0 4px 20px rgba(0,0,0,0.12)',
            transition: 'all 0.2s',
          }}
        >
          {micEmoji}
        </button>
        <div style={{ marginTop: '10px', fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 600 }}>
          {displayMessages.filter(m => m.role === 'user').length > 0 &&
            `${displayMessages.filter(m => m.role === 'user').length} message${displayMessages.filter(m => m.role === 'user').length !== 1 ? 's' : ''} sent`}
        </div>
      </div>

      <style>{`
        @keyframes dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
