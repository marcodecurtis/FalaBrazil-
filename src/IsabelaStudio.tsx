// src/components/IsabelaStudio.tsx
// Rewritten to use OpenAI Realtime API
// STT + AI + TTS all in one WebSocket — works natively on iOS Safari + Android
// Post-session feedback still uses Claude Sonnet

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Level } from './App';

interface Props {
  onBack: () => void;
  userLevel: Level | null;
}

type Screen = 'intro' | 'mic-setup' | 'conversation' | 'feedback';

interface DisplayMessage {
  role: 'user' | 'isabela';
  text: string;
}

interface TranscriptEntry {
  role: 'user' | 'assistant';
  content: string;
}

const SESSION_DURATION_SECONDS = 180;

const DAILY_INSTRUCTION = "Today's focus: try to use past tense — fui, fiz, estava, tive. Tell Isabela about something you did recently.";

const ISABELA_SYSTEM_PROMPT = `You are Isabela, a warm, encouraging, and playful Brazilian Portuguese conversation partner. 

CRITICAL RULES:
- Speak ONLY in Brazilian Portuguese at all times — never switch to English
- Keep every response to 2-3 short sentences maximum
- Always end with a question to keep the conversation going
- Gently and naturally correct mistakes by repeating the correct form in your reply (don't explicitly say "you made a mistake")
- Be warm, enthusiastic, and encouraging — like a friendly Brazilian friend
- Use natural Brazilian expressions (né, tá, que legal, que bacana, etc.)
- Adapt vocabulary complexity to the student's level

The student is at level STUDENT_LEVEL. Start by greeting them warmly and asking about their day or something they did recently.`;

// ── Volume cap to prevent echo on mobile ────────────────────────
const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const MAX_VOLUME = IS_MOBILE ? 0.5 : 1.0;

function clampVolume(v: number): number {
  return Math.max(0, Math.min(MAX_VOLUME, v));
}

export default function IsabelaStudio({ onBack, userLevel }: Props) {
  const level = userLevel || 'B1';

  const [screen, setScreen] = useState<Screen>('intro');
  const [showVolumeWarning, setShowVolumeWarning] = useState(false);

  // Mic setup
  const [micStatus, setMicStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error'>('idle');
  const [micVolume, setMicVolume] = useState(0);
  const [micEverSpoke, setMicEverSpoke] = useState(false);
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  // Conversation
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [liveUserTranscript, setLiveUserTranscript] = useState('');
  const [liveIsabelaText, setLiveIsabelaText] = useState('');
  const [isabelaSpeaking, setIsabelaSpeaking] = useState(false);
  const [isabelaThinking, setIsabelaThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(clampVolume(IS_MOBILE ? 0.35 : 0.8));
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const volumeRef = useRef(volume);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  const isMutedRef = useRef(false);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // Timer
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SECONDS);
  const [timerActive, setTimerActive] = useState(false);

  // Session ending
  const sessionEndingRef = useRef(false);
  const closingLinePlayedRef = useRef(false);
  const feedbackTriggeredRef = useRef(false);

  // Feedback
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Transcript log for feedback
  const transcriptLogRef = useRef<TranscriptEntry[]>([]);

  // Refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeTimerRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const displayMessagesRef = useRef<DisplayMessage[]>([]);

  // Web Audio API GainNode for REAL volume control on iOS
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Accumulate streaming text
  const isabelaStreamRef = useRef('');
  const userStreamRef = useRef('');

  useEffect(() => { displayMessagesRef.current = displayMessages; }, [displayMessages]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);

  // ── Safe volume setter ──────────────────────────────────────
  const safeSetVolume = useCallback((v: number) => {
    const clamped = clampVolume(v);
    setVolume(clamped);
    volumeRef.current = clamped;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMutedRef.current ? 0 : clamped;
    }
    if (audioElRef.current) {
      audioElRef.current.volume = isMutedRef.current ? 0 : clamped;
    }
  }, []);

  const syncAudioVolume = useCallback(() => {
    const val = isMutedRef.current ? 0 : volumeRef.current;
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = val;
    }
    if (audioElRef.current) {
      audioElRef.current.volume = val;
    }
  }, []);

  // Track if user has scrolled up manually
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      userScrolledUpRef.current = distanceFromBottom > 80;
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [screen]);

  // Only auto-scroll if user hasn't scrolled up
  useEffect(() => {
    if (userScrolledUpRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, liveUserTranscript, liveIsabelaText, isabelaThinking]);

  useEffect(() => {
    return () => { cleanup(); };
  }, []);

  // ── Timer ─────────────────────────────────────────────────────
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
    sessionEndingRef.current = true;
  };

  const sendGoodbye = () => {
    sendDataChannelMessage({ type: 'response.cancel' });
    setTimeout(() => {
      sendDataChannelMessage({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{
            type: 'input_text',
            text: '[SYSTEM: The 3-minute session has ended. Say a warm, natural goodbye in 2 short sentences. Tell the student they did really well today. Do not ask any more questions.]'
          }]
        }
      });
      sendDataChannelMessage({ type: 'response.create' });
    }, 300);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ── Cleanup ───────────────────────────────────────────────────
  const cleanup = () => {
    stopMicStream();
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    dcRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    gainNodeRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  // ── Mic helpers ───────────────────────────────────────────────
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
        audio: deviceId
          ? { deviceId: { exact: deviceId }, echoCancellation: true, noiseSuppression: true }
          : { echoCancellation: true, noiseSuppression: true },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      micStreamRef.current = stream;
      startVolumeMonitor(stream);
      setMicStatus('granted');
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

  // ── OpenAI Realtime via WebRTC ────────────────────────────────
  const sendDataChannelMessage = (msg: object) => {
    if (dcRef.current?.readyState === 'open') {
      dcRef.current.send(JSON.stringify(msg));
    }
  };

  const startRealtimeSession = useCallback(async () => {
    try {
      setConnectionStatus('connecting');

      const tokenRes = await fetch('/api/realtime-token', { method: 'POST' });
      const { client_secret } = await tokenRes.json();
      if (!client_secret?.value) throw new Error('No realtime token');

      // ── iOS voice-call audio routing ──────────────────────
      // Set BEFORE creating RTCPeerConnection so it applies to
      // the very first audio chunk. Setting it inside ontrack is
      // too late — the first message plays before iOS switches mode.
      // Routes through earpiece (quiet, directional) not loud speaker.
      // Supported on iOS 16.4+ Safari. Gracefully ignored elsewhere.
      if (IS_MOBILE && (navigator as any).audioSession) {
        (navigator as any).audioSession.type = 'voice-call';
      }

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;

      pc.ontrack = (e) => {
        const remoteStream = e.streams[0];

        // Route through Web Audio API GainNode for REAL volume control.
        // iOS Safari ignores audioEl.volume (always 1.0), but GainNode
        // actually attenuates the signal before it reaches the speaker.
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = ctx;

          const source = ctx.createMediaStreamSource(remoteStream);
          const gain = ctx.createGain();
          gain.gain.value = isMutedRef.current ? 0 : volumeRef.current;
          gainNodeRef.current = gain;

          source.connect(gain);
          gain.connect(ctx.destination);

          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          audioEl.srcObject = remoteStream;
          audioEl.volume = 0; // Muted — GainNode handles real volume
        } catch (err) {
          console.warn('GainNode setup failed, falling back to audioEl:', err);
          audioEl.srcObject = remoteStream;
          audioEl.volume = volumeRef.current;
        }
      };

      const stream = micStreamRef.current;
      if (!stream) throw new Error('No mic stream');
      stream.getAudioTracks().forEach(track => pc.addTrack(track, stream));

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        setConnectionStatus('connected');

        sendDataChannelMessage({
          type: 'session.update',
          session: {
            modalities: ['audio', 'text'],
            voice: 'shimmer',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: { model: 'whisper-1', language: 'pt' },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 700,
            },
            instructions: ISABELA_SYSTEM_PROMPT.replace('STUDENT_LEVEL', level),
          }
        });

        sendDataChannelMessage({ type: 'response.create' });
      };

      dc.onmessage = (e) => {
        handleRealtimeEvent(JSON.parse(e.data));
      };

      dc.onerror = () => setConnectionStatus('error');

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${client_secret.value}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      );

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

    } catch (err) {
      console.error('Realtime session error:', err);
      setConnectionStatus('error');
    }
  }, [level]);

  // ── Handle Realtime events ────────────────────────────────────
  const handleRealtimeEvent = (event: any) => {
    switch (event.type) {

      case 'response.audio.delta':
        setIsabelaThinking(false);
        setIsabelaSpeaking(true);
        syncAudioVolume();
        break;

      case 'response.audio_transcript.delta':
        isabelaStreamRef.current += event.delta || '';
        setLiveIsabelaText(isabelaStreamRef.current);
        setIsabelaThinking(false);
        setIsabelaSpeaking(true);
        break;

      case 'response.audio_transcript.done':
      case 'response.text.done': {
        const fullText = event.transcript || event.text || isabelaStreamRef.current;
        if (fullText.trim()) {
          setDisplayMessages(prev => [
            ...prev,
            { role: 'isabela', text: fullText.trim() }
          ]);
          transcriptLogRef.current.push({ role: 'assistant', content: fullText.trim() });
        }
        isabelaStreamRef.current = '';
        setLiveIsabelaText('');
        break;
      }

      case 'response.done':
        setIsabelaSpeaking(false);
        setIsabelaThinking(false);
        if (micStreamRef.current) {
          micStreamRef.current.getAudioTracks().forEach(t => { t.enabled = true; });
        }

        if (sessionEndingRef.current) {
          if (!closingLinePlayedRef.current) {
            closingLinePlayedRef.current = true;
            sendGoodbye();
            // Safety fallback — if response.done never fires again on iOS
            setTimeout(() => {
              if (!feedbackTriggeredRef.current) {
                feedbackTriggeredRef.current = true;
                generateFeedback();
              }
            }, 8000);
          } else {
            if (!feedbackTriggeredRef.current) {
              feedbackTriggeredRef.current = true;
              setTimeout(() => generateFeedback(), 1500);
            }
          }
        }
        break;

      case 'input_audio_buffer.speech_started':
        setLiveUserTranscript('...');
        userStreamRef.current = '';
        if (micStreamRef.current) {
          micStreamRef.current.getAudioTracks().forEach(t => { t.enabled = true; });
        }
        setIsabelaSpeaking(false);
        setLiveIsabelaText('');
        isabelaStreamRef.current = '';
        break;

      case 'conversation.item.input_audio_transcription.delta':
        userStreamRef.current += event.delta || '';
        setLiveUserTranscript(userStreamRef.current);
        break;

      case 'conversation.item.input_audio_transcription.completed': {
        const userText = event.transcript?.trim();
        if (userText) {
          setDisplayMessages(prev => [
            ...prev,
            { role: 'user', text: userText }
          ]);
          transcriptLogRef.current.push({ role: 'user', content: userText });
        }
        userStreamRef.current = '';
        setLiveUserTranscript('');
        setIsabelaThinking(true);
        break;
      }

      case 'response.created':
        setIsabelaThinking(true);
        if (micStreamRef.current) {
          micStreamRef.current.getAudioTracks().forEach(t => { t.enabled = false; });
        }
        break;

      case 'error':
        console.error('Realtime error:', event.error);
        setConnectionStatus('error');
        break;
    }
  };

  // ── Start session ─────────────────────────────────────────────
  const handleStartClick = () => {
    if (IS_MOBILE) {
      setShowVolumeWarning(true);
    } else {
      handleStart();
    }
  };

  const handleStart = async () => {
    setShowVolumeWarning(false);
    setScreen('conversation');
    setDisplayMessages([]);
    setTimeLeft(SESSION_DURATION_SECONDS);
    sessionEndingRef.current = false;
    closingLinePlayedRef.current = false;
    feedbackTriggeredRef.current = false;
    transcriptLogRef.current = [];
    isabelaStreamRef.current = '';
    userStreamRef.current = '';

    setTimerActive(true);
    await startRealtimeSession();
  };

  // ── Feedback ──────────────────────────────────────────────────
  const generateFeedback = async () => {
    cleanup();
    setFeedbackLoading(true);
    setScreen('feedback');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: transcriptLogRef.current, level }),
      });
      const data = await res.json();
      setFeedback(data.feedback || 'Great session!');
    } catch {
      setFeedback('Unable to generate feedback. But great session!');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleReset = () => {
    cleanup();
    setDisplayMessages([]);
    setLiveUserTranscript('');
    setLiveIsabelaText('');
    setFeedback('');
    setTimeLeft(SESSION_DURATION_SECONDS);
    setTimerActive(false);
    setIsabelaSpeaking(false);
    setIsabelaThinking(false);
    setScreen('intro');
    sessionEndingRef.current = false;
    closingLinePlayedRef.current = false;
    feedbackTriggeredRef.current = false;
    transcriptLogRef.current = [];
  };

  // ── Mute toggle ───────────────────────────────────────────────
  const handleMuteToggle = () => {
    setIsMuted(m => {
      const nowMuted = !m;
      isMutedRef.current = nowMuted;
      const val = nowMuted ? 0 : volumeRef.current;
      if (gainNodeRef.current) gainNodeRef.current.gain.value = val;
      if (audioElRef.current) audioElRef.current.volume = val;
      return nowMuted;
    });
  };

  // ── Interrupt ─────────────────────────────────────────────────
  const handleInterrupt = () => {
    sendDataChannelMessage({ type: 'response.cancel' });
    setIsabelaSpeaking(false);
    setLiveIsabelaText('');
    isabelaStreamRef.current = '';
  };

  // ─────────────────────────────────────────────────────────────
  // SCREENS
  // ─────────────────────────────────────────────────────────────

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
            ⏱️ Session length: <strong>3 minutes</strong> — Isabela will wrap up naturally when time is up.
          </p>
        </div>

        {IS_MOBILE && (
          <div style={{ ...styles.infoBox, background: '#fef9c3', marginTop: 10 }}>
            <p style={{ fontSize: '0.82rem', color: '#854d0e', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
              🎧 <strong>Earphones recommended.</strong> On mobile, speaker volume is capped at 50% to prevent echo. Earphones give you full volume and better quality.
            </p>
          </div>
        )}

        <button
          onClick={() => requestMic().then(() => setScreen('mic-setup'))}
          style={styles.primaryBtn}
        >
          Speak with Isabela 🎙️
        </button>
      </div>
    );
  }

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

        <div style={{ background: '#fef9c3', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.2rem' }}>🎧</span>
          <div style={{ fontSize: '0.82rem', color: '#854d0e', lineHeight: 1.6 }}>
            <strong>Use earphones for best results.</strong> Without them, Isabela's voice may be picked up by the mic and appear as random words.
            {IS_MOBILE && <> Speaker volume is automatically limited to prevent echo.</>}
          </div>
        </div>

        {micStatus === 'requesting' && (
          <div style={styles.statusBox('#f1f5f9', '#475569')}>
            ⏳ Waiting for microphone permission — click <strong>Allow</strong> in the browser popup.
          </div>
        )}

        {micStatus === 'denied' && (
          <div style={styles.statusBox('#fee2e2', '#991b1b')}>
            <strong>🚫 Microphone access was denied.</strong>
            <div style={{ marginTop: 8, fontSize: '0.8rem', lineHeight: 1.6 }}>
              <strong>Chrome:</strong> Click the 🔒 icon → Microphone → Allow → Refresh.<br />
              <strong>iPhone/Safari:</strong> Settings → Safari → Microphone → Allow → Come back here.<br />
              <strong>Android:</strong> Tap the 🔒 icon → Permissions → Microphone → Allow.
            </div>
            <button onClick={() => requestMic()}
              style={{ ...styles.primaryBtn, marginTop: 12, padding: '10px 20px', width: 'auto' }}>
              Try again
            </button>
          </div>
        )}

        {micStatus === 'granted' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>Microphone connected</span>
            </div>

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

            {micDevices.length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <select
                  value={selectedDevice}
                  onChange={e => {
                    setSelectedDevice(e.target.value);
                    requestMic(e.target.value);
                    setMicEverSpoke(false);
                  }}
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

        <button
          onClick={handleStartClick}
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

        {showVolumeWarning && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            <div style={{
              background: 'white', borderRadius: 20, padding: '28px 24px',
              maxWidth: 360, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'popIn 0.25s ease-out',
            }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>🔉</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', margin: '0 0 10px' }}>
                  Lower your device volume
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  We recommend setting your phone's volume to <strong style={{ color: '#14532d' }}>50% or lower</strong> for the best experience. Higher volume causes echo and Isabela may hear her own voice.
                </p>
              </div>

              <div style={{
                background: '#f0fdf4', borderRadius: 12, padding: '12px 16px',
                marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.1rem' }}>🎧</span>
                <p style={{ fontSize: '0.82rem', color: '#14532d', margin: 0, lineHeight: 1.6 }}>
                  <strong>Using earphones?</strong> Then you're all set — no volume limit needed!
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handleStart}
                  style={{ ...styles.primaryBtn, padding: 14, fontSize: '0.95rem', margin: 0 }}
                >
                  Got it, let's go! →
                </button>
                <button
                  onClick={() => setShowVolumeWarning(false)}
                  style={{
                    background: 'none', border: '1px solid #e2e8f0',
                    borderRadius: 12, padding: '10px 16px',
                    color: '#64748b', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Parse feedback into structured sections (no regex to avoid TS errors)
  const parseFeedback = (text: string) => {
    let ratingScore = '';
    let ratingComment = '';
    const allLines = text.split('\n');
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      if (line.includes('/10')) {
        const parts = line.split('/10')[0].split(' ');
        const num = parts[parts.length - 1].replace(/[^0-9]/g, '');
        if (num) {
          ratingScore = num;
          if (i + 1 < allLines.length) ratingComment = allLines[i + 1].trim();
        }
      }
    }
    const upper = text.toUpperCase();
    const getSectionContent = (startKey: string, endKey: string): string => {
      const s = upper.indexOf(startKey);
      if (s === -1) return '';
      const e = endKey ? upper.indexOf(endKey, s + 1) : -1;
      return e === -1 ? text.slice(s) : text.slice(s, e);
    };
    const wellMatch = getSectionContent('WHAT WENT WELL', 'MISTAKES TO CORRECT');
    const mistakesMatch = getSectionContent('MISTAKES TO CORRECT', 'FOCUS FOR NEXT SESSION');
    const focusMatch = getSectionContent('FOCUS FOR NEXT SESSION', '');
    const parsePoints = (section: string): string[] =>
      section.split('\n- ').slice(1).map((s: string) => s.trim()).filter(Boolean);
    return {
      ratingScore,
      ratingComment,
      wellPoints: parsePoints(wellMatch),
      mistakePoints: parsePoints(mistakesMatch),
      focusPoints: parsePoints(focusMatch),
    };
  };

    const renderBold = (text: string) => {
    const parts: string[] = [];
    let remaining = text;
    while (remaining.length > 0) {
      const start = remaining.indexOf('**');
      if (start === -1) { parts.push(remaining); break; }
      if (start > 0) parts.push(remaining.slice(0, start));
      const end = remaining.indexOf('**', start + 2);
      if (end === -1) { parts.push(remaining.slice(start)); break; }
      parts.push('BOLD:' + remaining.slice(start + 2, end));
      remaining = remaining.slice(end + 2);
    }
    return parts.map((part, i) =>
      part.startsWith('BOLD:')
        ? <strong key={i} style={{ fontWeight: 700 }}>{part.slice(5)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  if (screen === 'feedback') {
    const parsed = feedback ? parseFeedback(feedback) : null;

    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 48px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '28px 0 20px' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>📊</div>
          <h2 style={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f172a', margin: '0 0 4px' }}>
            Session feedback
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Here's how your 3-minute session went
          </p>
        </div>

        {feedbackLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✨</div>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Isabela is reviewing your session...</p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>This takes about 10 seconds</p>
          </div>
        ) : parsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Rating card */}
            {parsed.ratingScore && (
              <div style={{
                background: 'linear-gradient(135deg, #14532d, #166534)',
                borderRadius: 20, padding: '24px 20px', textAlign: 'center',
                boxShadow: '0 8px 32px rgba(20,83,45,0.25)',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
                  Session Rating
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: '4rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                    {parsed.ratingScore}
                  </span>
                  <span style={{ fontSize: '1.5rem', color: '#86efac', fontWeight: 700 }}>/10</span>
                </div>
                {parsed.ratingComment && (
                  <p style={{ fontSize: '0.85rem', color: '#bbf7d0', margin: 0, lineHeight: 1.6 }}>
                    {parsed.ratingComment}
                  </p>
                )}
              </div>
            )}

            {/* What went well */}
            {parsed.wellPoints.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>What went well</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {parsed.wellPoints.map((point, i) => (
                    <div key={i} style={{
                      background: '#f0fdf4', borderRadius: 10, padding: '10px 12px',
                      fontSize: '0.82rem', color: '#166534', lineHeight: 1.6,
                      borderLeft: '3px solid #16a34a',
                    }}>
                      {renderBold(point)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mistakes */}
            {parsed.mistakePoints.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: '1.2rem' }}>🔧</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Mistakes to correct</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {parsed.mistakePoints.map((point, i) => (
                    <div key={i} style={{
                      background: '#fff7ed', borderRadius: 10, padding: '10px 12px',
                      fontSize: '0.82rem', color: '#9a3412', lineHeight: 1.6,
                      borderLeft: '3px solid #f97316',
                    }}>
                      {renderBold(point)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Focus */}
            {parsed.focusPoints.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Focus for next session</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {parsed.focusPoints.map((point, i) => (
                    <div key={i} style={{
                      background: '#eff6ff', borderRadius: 10, padding: '10px 12px',
                      fontSize: '0.82rem', color: '#1e40af', lineHeight: 1.6,
                      borderLeft: '3px solid #3b82f6',
                    }}>
                      {renderBold(point)}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {feedback}
            </div>
          </div>
        )}

        <button onClick={handleReset} style={{ ...styles.primaryBtn, marginTop: 20 }}>
          Speak with Isabela again 🎙️
        </button>
      </div>
    );
  }

  // ── CONVERSATION ──────────────────────────────────────────────
  const timerColor = timeLeft <= 30 ? '#dc2626' : timeLeft <= 60 ? '#f59e0b' : '#14532d';

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100dvh' }}>

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
            <div style={{
              fontSize: '0.68rem', fontWeight: 700,
              color: connectionStatus === 'error' ? '#dc2626'
                : isabelaSpeaking ? '#7c3aed'
                : isabelaThinking ? '#f59e0b'
                : connectionStatus === 'connecting' ? '#94a3b8'
                : '#4ade80'
            }}>
              {connectionStatus === 'error' ? '⚠️ connection error'
                : connectionStatus === 'connecting' ? '⏳ connecting...'
                : isabelaSpeaking ? '🔊 speaking'
                : isabelaThinking ? '⏳ thinking'
                : '● listening'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: timerColor, minWidth: 48, textAlign: 'center' }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={handleMuteToggle}
              style={{ background: isMuted ? '#fee2e2' : '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              {isMuted ? '🔇' : volume <= 0.15 ? '🔈' : volume <= 0.35 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              min={0}
              max={MAX_VOLUME}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={e => {
                const v = parseFloat(e.target.value);
                const clamped = clampVolume(v);
                setIsMuted(clamped === 0);
                isMutedRef.current = clamped === 0;
                safeSetVolume(clamped);
              }}
              style={{ width: IS_MOBILE ? 55 : 65, accentColor: '#14532d', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      <div ref={messagesContainerRef} style={styles.messages}>

        {connectionStatus === 'connecting' && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: '0.85rem' }}>Connecting to Isabela...</div>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div style={{ background: '#fee2e2', borderRadius: 12, padding: 16, margin: '16px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>
              ⚠️ Connection failed. Please check your internet and try again.
            </div>
            <button onClick={handleReset} style={{ ...styles.primaryBtn, marginTop: 12, fontSize: '0.85rem', padding: '10px' }}>
              Try again
            </button>
          </div>
        )}

        {displayMessages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end', gap: 8
          }}>
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

        {liveIsabelaText && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={styles.avatarTiny} />
            <div style={{
              maxWidth: '75%', padding: '10px 14px',
              borderRadius: '18px 18px 18px 4px',
              background: 'white', color: '#0f172a',
              fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              border: '2px solid #e9d5ff',
            }}>
              {liveIsabelaText}
            </div>
          </div>
        )}

        {liveUserTranscript && liveUserTranscript !== '...' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              maxWidth: '75%', padding: '10px 14px',
              borderRadius: '18px 18px 4px 18px',
              background: '#dcfce7', color: '#14532d',
              fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500,
              border: '2px dashed #4ade80',
            }}>
              {liveUserTranscript}
            </div>
          </div>
        )}

        {isabelaThinking && !liveIsabelaText && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={styles.avatarTiny} />
            <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1', animation: `dot 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {sessionEndingRef.current && (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', padding: '8px 0' }}>
            Time's up — Isabela is wrapping up...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={styles.statusBar}>
        {isabelaSpeaking ? (
          <button
            onClick={handleInterrupt}
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
            {isabelaThinking ? '⏳ Isabela is thinking...'
              : sessionEndingRef.current ? '⏱️ Finishing up...'
              : connectionStatus === 'connecting' ? '⏳ Connecting...'
              : '🎙️ Listening — just speak naturally'}
          </div>
        )}
        <button
          onClick={handleReset}
          style={{
            marginTop: 10, background: 'none', border: '1px solid #e2e8f0',
            borderRadius: 20, padding: '6px 18px', color: '#94a3b8',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ✕ End session
        </button>
      </div>

      <style>{`
        @keyframes dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────
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
    position: 'sticky' as const, top: 0, zIndex: 10,
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
