// src/components/IsabelaStudio.tsx
// Full rewrite — Deepgram Flux STT, mic setup screen, 3-min timer,
// live transcript, graceful ending, Claude Sonnet feedback screen

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Level } from './App';

interface Props {
  onBack: () => void;
  userLevel: Level | null;
}

// ── Screen states ─────────────────────────────────────────────────
type Screen = 'intro' | 'mic-setup' | 'conversation' | 'feedback';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DisplayMessage {
  role: 'user' | 'isabela';
  text: string;
}

// ── Constants ─────────────────────────────────────────────────────
const SESSION_DURATION_SECONDS = 180; // 3 minutes

const OPENING_LINES = [
  'Oi! Tudo bem? Que bom te ver por aqui! Me conta, o que você fez hoje?',
  'Olá! Estou tão feliz em praticar com você! Vamos conversar! Como foi o seu dia?',
  'Oi! Que ótimo que você veio! Me fala, você gosta de morar onde você mora?',
];

const CLOSING_LINE = 'Que sessão incrível! O tempo acabou por hoje, mas você foi muito bem! Vou preparar um resumo do que praticamos...';

const DAILY_INSTRUCTION = 'Today\'s focus: try to use past tense — fui, fiz, estava, tive. Tell Isabela about something you did recently.';

// ── Main component ────────────────────────────────────────────────
export default function IsabelaStudio({ onBack, userLevel }: Props) {
  const level = userLevel || 'B1';

  // Screen
  const [screen, setScreen] = useState<Screen>('intro');

  // Mic setup
  const [micStatus, setMicStatus]         = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error'>('idle');
  const [micVolume, setMicVolume]         = useState(0);
  const [micEverSpoke, setMicEverSpoke]   = useState(false);
  const [micDevices, setMicDevices]       = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  // Conversation
  const [apiMessages, setApiMessages]         = useState<Message[]>([]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [liveTranscript, setLiveTranscript]   = useState('');
  const [isabelaThinking, setIsabelaThinking] = useState(false);
  const [isabelaSpeaking, setIsabelaSpeaking] = useState(false);
  const [isMuted, setIsMuted]                 = useState(false);

  // Timer
  const [timeLeft, setTimeLeft]       = useState(SESSION_DURATION_SECONDS);
  const [timerActive, setTimerActive] = useState(false);

  // Session ending (graceful)
  const sessionEndingRef = useRef(false);
  const closingLinePlayedRef = useRef(false);

  // Feedback
  const [feedback, setFeedback]           = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Refs
  const deepgramWsRef     = useRef<WebSocket | null>(null);
  const audioRef          = useRef<HTMLAudioElement | null>(null);
  const analyserRef       = useRef<AnalyserNode | null>(null);
  const micStreamRef      = useRef<MediaStream | null>(null);
  const volumeTimerRef    = useRef<number | null>(null);
  const timerIntervalRef  = useRef<number | null>(null);
  const messagesEndRef    = useRef<HTMLDivElement>(null);
  const apiMessagesRef    = useRef<Message[]>([]);
  const displayMessagesRef = useRef<DisplayMessage[]>([]);

  // Keep refs in sync with state
  useEffect(() => { apiMessagesRef.current = apiMessages; }, [apiMessages]);
  useEffect(() => { displayMessagesRef.current = displayMessages; }, [displayMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, liveTranscript, isabelaThinking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicStream();
      stopDeepgram();
      audioRef.current?.pause();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (volumeTimerRef.current) clearInterval(volumeTimerRef.current);
    };
  }, []);

  // ── Timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive) return;
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerIntervalRef.current!);
          setTimerActive(false);
          handleTimerEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerIntervalRef.current!);
  }, [timerActive]);

  const handleTimerEnd = () => {
    // Set the flag — don't hard-stop anything
    // The conversation finishes its current exchange naturally
    // then triggers the closing line
    sessionEndingRef.current = true;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Mic stream helpers ─────────────────────────────────────────
  const stopMicStream = () => {
    if (volumeTimerRef.current) {
      clearInterval(volumeTimerRef.current);
      volumeTimerRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    analyserRef.current = null;
  };

  const startVolumeMonitor = (stream: MediaStream) => {
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    volumeTimerRef.current = window.setInterval(() => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      const vol = Math.min(100, Math.round((avg / 128) * 100));
      setMicVolume(vol);
      if (vol > 5) setMicEverSpoke(true);
    }, 50);
  };

  const requestMic = async (deviceId?: string) => {
    setMicStatus('requesting');
    stopMicStream();
    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = stream;
      startVolumeMonitor(stream);
      setMicStatus('granted');

      // Get list of audio devices for "try different mic" option
      const devices = await navigator.mediaDevices.enumerateDevices();
      setMicDevices(devices.filter(d => d.kind === 'audioinput'));
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicStatus('denied');
      } else {
        setMicStatus('error');
      }
    }
  };

  // ── Deepgram ───────────────────────────────────────────────────
  const stopDeepgram = () => {
    if (deepgramWsRef.current) {
      deepgramWsRef.current.close();
      deepgramWsRef.current = null;
    }
  };

  const startDeepgram = useCallback(async () => {
    // Get short-lived token from our backend
    const tokenRes = await fetch('/api/deepgram-token', { method: 'POST' });
    const { token } = await tokenRes.json();
    if (!token) throw new Error('No Deepgram token');

    // Connect directly to Deepgram — JWT token passed as query param
    // This is the correct approach for browser WebSocket connections
    const params = new URLSearchParams({
      model: 'nova-2',
      language: 'pt-BR',
      punctuate: 'true',
      interim_results: 'true',
      utterance_end_ms: '2500',
      vad_events: 'true',
    });

    const url = `wss://api.deepgram.com/v1/listen?${params.toString()}`;
    // Deepgram's supported browser auth: ['token', yourToken] as subprotocols
    const ws = new WebSocket(url, ['token', token]);
    deepgramWsRef.current = ws;
    (ws as any)._transcriptBuffer = []; // accumulate all final chunks

    ws.onopen = () => {
      const stream = micStreamRef.current;
      if (!stream) return;
      // Safari doesn't support audio/webm — fall back to audio/mp4
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorder.addEventListener('dataavailable', (e) => {
        if (ws.readyState === WebSocket.OPEN && e.data.size > 0) {
          ws.send(e.data);
        }
      });
      mediaRecorder.start(250); // send chunks every 250ms
      (ws as any)._recorder = mediaRecorder;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
        const text = data.channel.alternatives[0].transcript;
        const isFinal = data.is_final;

        if (text) {
          if (!isFinal) {
            // Show interim words live as user speaks
            setLiveTranscript(text);
          } else {
            // Accumulate final chunks — don't overwrite, append
            (ws as any)._transcriptBuffer.push(text);
            setLiveTranscript((ws as any)._transcriptBuffer.join(' '));
          }
        }
      }

      // UtteranceEnd fires after silence — send full accumulated transcript
      if (data.type === 'UtteranceEnd') {
        const buffer: string[] = (ws as any)._transcriptBuffer || [];
        const fullTranscript = buffer.join(' ').trim();
        (ws as any)._transcriptBuffer = []; // reset for next turn
        setLiveTranscript('');
        if (fullTranscript) {
          handleUserSpeech(fullTranscript);
        }
      }
    };

    ws.onerror = (e) => console.error('Deepgram WS error:', e);
    ws.onclose = () => console.log('Deepgram WS closed');
  }, []);

  const pauseDeepgram = () => {
    const ws = deepgramWsRef.current as any;
    if (ws?._recorder && ws._recorder.state === 'recording') {
      ws._recorder.pause();
    }
  };

  const resumeDeepgram = () => {
    const ws = deepgramWsRef.current as any;
    if (ws?._recorder && ws._recorder.state === 'paused') {
      ws._recorder.resume();
    }
  };

  // ── TTS ────────────────────────────────────────────────────────
  const speakText = async (text: string): Promise<void> => {
    if (isMuted) return;
    setIsabelaSpeaking(true);
    pauseDeepgram(); // Don't let Deepgram hear Isabela's voice

    try {
      const res = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      return new Promise((resolve) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setIsabelaSpeaking(false);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setIsabelaSpeaking(false);
          resolve();
        };
        audio.play().catch(() => {
          setIsabelaSpeaking(false);
          resolve();
        });
      });
    } catch {
      setIsabelaSpeaking(false);
    }
  };

  // ── Conversation turn ──────────────────────────────────────────
  const handleUserSpeech = async (userText: string) => {
    if (!userText.trim()) return;

    const newDisplay: DisplayMessage[] = [
      ...displayMessagesRef.current,
      { role: 'user', text: userText },
    ];
    const newApi: Message[] = [
      ...apiMessagesRef.current,
      { role: 'user', content: userText },
    ];

    setDisplayMessages(newDisplay);
    setApiMessages(newApi);
    setLiveTranscript('');
    setIsabelaThinking(true);

    try {
      const res = await fetch('/api/isabela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newApi, level }),
      });
      const data = await res.json();
      const reply = data.text || 'Desculpa, pode repetir?';

      const finalDisplay: DisplayMessage[] = [
        ...newDisplay,
        { role: 'isabela', text: reply },
      ];
      const finalApi: Message[] = [
        ...newApi,
        { role: 'assistant', content: reply },
      ];

      setDisplayMessages(finalDisplay);
      setApiMessages(finalApi);
      setIsabelaThinking(false);

      await speakText(reply);

      // After Isabela finishes speaking — check if session should end
      if (sessionEndingRef.current && !closingLinePlayedRef.current) {
        closingLinePlayedRef.current = true;
        await triggerClosingSequence(finalApi);
      } else if (!sessionEndingRef.current) {
        resumeDeepgram(); // Back to listening
      }

    } catch (err) {
      console.error('Conversation error:', err);
      setIsabelaThinking(false);
      resumeDeepgram();
    }
  };

  // ── Graceful session end ───────────────────────────────────────
  const triggerClosingSequence = async (finalMessages: Message[]) => {
    stopDeepgram(); // Stop listening for new input

    // Add closing line to chat
    const closingDisplay: DisplayMessage[] = [
      ...displayMessagesRef.current,
      { role: 'isabela', text: CLOSING_LINE },
    ];
    setDisplayMessages(closingDisplay);
    setIsabelaThinking(false);

    await speakText(CLOSING_LINE);

    // Now generate feedback
    await generateFeedback(finalMessages);
  };

  // ── Feedback ───────────────────────────────────────────────────
  const generateFeedback = async (messages: Message[]) => {
    setFeedbackLoading(true);
    setScreen('feedback');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, level }),
      });
      const data = await res.json();
      setFeedback(data.feedback || 'Unable to generate feedback.');
    } catch {
      setFeedback('Unable to generate feedback. But great session!');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // ── Start session ──────────────────────────────────────────────
  const handleStart = async () => {
    setScreen('conversation');
    setApiMessages([]);
    setDisplayMessages([]);
    setTimeLeft(SESSION_DURATION_SECONDS);
    sessionEndingRef.current = false;
    closingLinePlayedRef.current = false;

    const opener = OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)];
    const initialDisplay: DisplayMessage[] = [{ role: 'isabela', text: opener }];
    const initialApi: Message[] = [{ role: 'assistant', content: opener }];
    setDisplayMessages(initialDisplay);
    setApiMessages(initialApi);
    setIsabelaThinking(false);

    // Start timer
    setTimerActive(true);

    // Speak opener, then connect Deepgram
    await speakText(opener);
    await startDeepgram();
    resumeDeepgram();
  };

  const handleReset = () => {
    stopDeepgram();
    stopMicStream();
    audioRef.current?.pause();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setApiMessages([]);
    setDisplayMessages([]);
    setLiveTranscript('');
    setFeedback('');
    setTimeLeft(SESSION_DURATION_SECONDS);
    setTimerActive(false);
    setScreen('intro');
    sessionEndingRef.current = false;
    closingLinePlayedRef.current = false;
  };

  // ── SCREEN: INTRO ──────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>
        <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
          <div style={styles.avatar}>
            <img src="/isabela.png" alt="Isabela" style={styles.avatarImg}
              onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 style={styles.title}>Isabela</h1>
          <p style={styles.subtitle}>Your AI Brazilian Portuguese conversation partner</p>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>Today's focus</h3>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
            {DAILY_INSTRUCTION}
          </p>
        </div>

        <div style={{ ...styles.infoBox, background: '#fce7f3', marginTop: 10 }}>
          <p style={{ fontSize: '0.85rem', color: '#9d174d', fontWeight: 600, margin: 0 }}>
            ⏱️ Session length: <strong>3 minutes</strong> — Isabela will always finish her sentence before ending.
          </p>
        </div>

        <button onClick={() => requestMic().then(() => setScreen('mic-setup'))}
          style={styles.primaryBtn}>
          Speak with Isabela 🎙️
        </button>
      </div>
    );
  }

  // ── SCREEN: MIC SETUP ─────────────────────────────────────────
  if (screen === 'mic-setup') {
    const canStart = micStatus === 'granted' && micEverSpoke;

    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>
        <button onClick={() => setScreen('intro')} style={styles.backBtn}>← Back</button>

        <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎙️</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0f172a', margin: '0 0 8px' }}>
            Let's check your mic
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Say something in Portuguese — or anything — to test your microphone.
          </p>
        </div>

        {/* Status indicator */}
        {micStatus === 'requesting' && (
          <div style={styles.statusBox('#f1f5f9', '#475569')}>
            ⏳ Waiting for microphone permission — click <strong>Allow</strong> in the browser popup.
          </div>
        )}

        {micStatus === 'denied' && (
          <div style={styles.statusBox('#fee2e2', '#991b1b')}>
            <strong>🚫 Microphone access was denied.</strong>
            <div style={{ marginTop: 8, fontSize: '0.8rem', lineHeight: 1.6 }}>
              <strong>Chrome:</strong> Click the 🔒 icon in the address bar → Microphone → Allow → Refresh.<br />
              <strong>iPhone/Safari:</strong> Settings → Safari → Microphone → Allow → Come back here.<br />
              <strong>Android:</strong> Tap the 🔒 icon → Permissions → Microphone → Allow.
            </div>
            <button onClick={() => requestMic()} style={{ ...styles.primaryBtn, marginTop: 12, padding: '10px 20px', width: 'auto' }}>
              Try again
            </button>
          </div>
        )}

        {micStatus === 'granted' && (
          <>
            {/* Status row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>Microphone connected</span>
            </div>

            {/* Volume meter */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 6 }}>Volume level</div>
              <div style={{ background: '#f1f5f9', borderRadius: 8, height: 14, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${micVolume}%`,
                  background: micVolume > 5 ? '#16a34a' : '#cbd5e1',
                  borderRadius: 8,
                  transition: 'width 0.08s ease',
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>
                {micVolume > 5 ? '✅ We can hear you!' : 'Speak now to test your mic'}
              </div>
            </div>

            {/* Device switcher */}
            {micDevices.length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <select
                  value={selectedDevice}
                  onChange={e => { setSelectedDevice(e.target.value); requestMic(e.target.value); setMicEverSpoke(false); }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', background: 'white' }}
                >
                  {micDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Microphone ${d.deviceId.slice(0, 6)}`}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                  If the bar isn't moving, try a different microphone above.
                </div>
              </div>
            )}
          </>
        )}

        {/* Start button — only enabled when mic confirmed working */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          style={{
            ...styles.primaryBtn,
            opacity: canStart ? 1 : 0.4,
            cursor: canStart ? 'pointer' : 'not-allowed',
            marginTop: 20,
          }}
        >
          {canStart ? 'Start with Isabela →' : 'Say something to confirm your mic...'}
        </button>
      </div>
    );
  }

  // ── SCREEN: FEEDBACK ──────────────────────────────────────────
  if (screen === 'feedback') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 40px' }}>
        <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📊</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#0f172a', margin: '0 0 4px' }}>
            Session feedback
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Here's how your 3-minute session went
          </p>
        </div>

        {feedbackLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
            <p style={{ fontSize: '0.9rem' }}>Isabela is preparing your feedback...</p>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {feedback}
            </div>
          </div>
        )}

        <button onClick={handleReset} style={styles.primaryBtn}>
          Speak with Isabela again 🎙️
        </button>
      </div>
    );
  }

  // ── SCREEN: CONVERSATION ──────────────────────────────────────
  const timerColor = timeLeft <= 30 ? '#dc2626' : timeLeft <= 60 ? '#f59e0b' : '#14532d';

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={handleReset} style={styles.backBtn}>← End</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={styles.avatarSmall}>
            <img src="/isabela.png" alt="Isabela"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Isabela</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: isabelaSpeaking ? '#7c3aed' : isabelaThinking ? '#f59e0b' : '#4ade80' }}>
              {isabelaSpeaking ? '🔊 speaking' : isabelaThinking ? '⏳ thinking' : '● listening'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Timer */}
          <div style={{ fontWeight: 800, fontSize: '1rem', color: timerColor, minWidth: 48, textAlign: 'center' }}>
            {formatTime(timeLeft)}
          </div>
          <button onClick={() => { setIsMuted(m => !m); audioRef.current?.pause(); }}
            style={{ background: isMuted ? '#fee2e2' : '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: '0.9rem' }}>
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {displayMessages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {msg.role === 'isabela' && <div style={styles.avatarTiny} />}
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
        {liveTranscript && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              maxWidth: '75%', padding: '10px 14px',
              borderRadius: '18px 18px 4px 18px',
              background: '#dcfce7', color: '#14532d',
              fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500,
              border: '2px dashed #4ade80',
            }}>
              {liveTranscript}
            </div>
          </div>
        )}

        {/* Thinking dots */}
        {isabelaThinking && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={styles.avatarTiny} />
            <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1', animation: `dot 1.2s ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Session ending notice */}
        {sessionEndingRef.current && (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', padding: '8px 0' }}>
            Time's up — Isabela is wrapping up...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Status bar — with interrupt button when Isabela is speaking */}
      <div style={styles.statusBar}>
        {isabelaSpeaking ? (
          <button
            onClick={() => {
              audioRef.current?.pause();
              setIsabelaSpeaking(false);
              resumeDeepgram();
            }}
            style={{
              background: '#7c3aed', color: 'white', border: 'none',
              borderRadius: 20, padding: '8px 20px', fontWeight: 700,
              fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            ⏸️ Tap to interrupt
          </button>
        ) : (
          <div style={{ fontSize: '0.75rem', color: isabelaThinking ? '#f59e0b' : '#4ade80', fontWeight: 600 }}>
            {isabelaThinking ? '⏳ Isabela is thinking...' :
             sessionEndingRef.current ? '⏱️ Finishing up...' :
             '🎙️ Listening — just speak naturally'}
          </div>
        )}
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

// ── Shared styles ─────────────────────────────────────────────────
const styles = {
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontWeight: 700, color: '#64748b', fontSize: '0.85rem',
    padding: '16px 0', display: 'flex', alignItems: 'center', gap: 4,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  avatar: {
    width: 100, height: 100, borderRadius: '50%',
    background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    margin: '0 auto 16px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(219,39,119,0.15)',
  } as React.CSSProperties,

  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' } as React.CSSProperties,

  avatarSmall: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    overflow: 'hidden', flexShrink: 0,
  } as React.CSSProperties,

  avatarTiny: {
    width: 28, height: 28, borderRadius: '50%',
    background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    flexShrink: 0,
  } as React.CSSProperties,

  title: {
    fontWeight: 900, fontSize: '1.8rem', color: '#0f172a', margin: '0 0 6px',
  } as React.CSSProperties,

  subtitle: { color: '#64748b', fontSize: '0.9rem', margin: 0 } as React.CSSProperties,

  infoBox: {
    background: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 16,
  } as React.CSSProperties,

  infoTitle: {
    fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', margin: '0 0 8px',
  } as React.CSSProperties,

  primaryBtn: {
    width: '100%', padding: 16,
    background: 'linear-gradient(135deg, #14532d, #166534)',
    color: 'white', border: 'none', borderRadius: 14,
    fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer',
    fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(20,83,45,0.3)',
    display: 'block',
  } as React.CSSProperties,

  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderBottom: '1px solid #f1f5f9',
    background: 'white', flexShrink: 0,
  } as React.CSSProperties,

  messages: {
    flex: 1, overflowY: 'auto' as const, padding: 16,
    display: 'flex', flexDirection: 'column' as const,
    gap: 12, background: '#f8fafc',
  },

  statusBar: {
    padding: '12px 16px 24px', background: 'white',
    borderTop: '1px solid #f1f5f9', flexShrink: 0, textAlign: 'center' as const,
  },

  statusBox: (bg: string, color: string) => ({
    background: bg, borderRadius: 12, padding: '12px 16px',
    color, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16,
  }) as React.CSSProperties,
};
