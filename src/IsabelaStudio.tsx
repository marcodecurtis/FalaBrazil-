// src/components/IsabelaStudio.tsx
// Rewritten to use OpenAI Realtime API
// STT + AI + TTS all in one WebSocket — works natively on iOS Safari + Android
// Post-session feedback still uses Claude Sonnet

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Level } from './App';

// ── Feedback parser ───────────────────────────────────────────────
interface ParsedFeedback {
  rating: number | null;
  ratingNote: string;
  well: string;
  mistakes: string;
  focus: string;
}

function parseFeedback(text: string): ParsedFeedback {
  const ratingMatch = text.match(/⭐\s*Session rating:\s*(\d+)\/10[^\n]*\n([^\n]*)/i);
  const rating = ratingMatch ? parseInt(ratingMatch[1]) : null;
  const ratingNote = ratingMatch ? ratingMatch[2].trim() : '';

  const extract = (pattern: RegExp) => {
    const m = text.match(pattern);
    return m ? m[1].trim() : '';
  };

  return {
    rating,
    ratingNote,
    well:     extract(/1\.\s*WHAT WENT WELL\s*([\s\S]*?)(?=2\.\s*MISTAKES|$)/i),
    mistakes: extract(/2\.\s*MISTAKES TO CORRECT\s*([\s\S]*?)(?=3\.\s*FOCUS|$)/i),
    focus:    extract(/3\.\s*FOCUS FOR NEXT SESSION\s*([\s\S]*?)$/i),
  };
}

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

export default function IsabelaStudio({ onBack, userLevel }: Props) {
  const level = userLevel || 'B1';

  const [screen, setScreen] = useState<Screen>('intro');

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
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const defaultVolume = isMobile ? 0.38 : 1.0;
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Timer
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_SECONDS);
  const [timerActive, setTimerActive] = useState(false);

  // Session ending
  const sessionEndingRef = useRef(false);
  const closingLinePlayedRef = useRef(false);

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
  const isMutedRef = useRef(false);
  const micUnmuteTimerRef = useRef<number | null>(null);
  const isabelaSpeakingRef = useRef(false);
  const isabelaThinkingRef = useRef(false);

  // Output audio analysis — used to detect when Isabela's voice actually goes silent
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const silenceRafRef = useRef<number | null>(null);

  // Accumulate streaming text
  const isabelaStreamRef = useRef('');
  const userStreamRef = useRef('');

  useEffect(() => { displayMessagesRef.current = displayMessages; }, [displayMessages]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isabelaSpeakingRef.current = isabelaSpeaking; }, [isabelaSpeaking]);
  useEffect(() => { isabelaThinkingRef.current = isabelaThinking; }, [isabelaThinking]);

  const clearMicUnmuteTimer = () => {
    if (micUnmuteTimerRef.current != null) {
      clearTimeout(micUnmuteTimerRef.current);
      micUnmuteTimerRef.current = null;
    }
  };

  const cancelSilenceDetection = () => {
    if (silenceRafRef.current !== null) {
      cancelAnimationFrame(silenceRafRef.current);
      silenceRafRef.current = null;
    }
  };

  const doEnableMic = () => {
    if (micStreamRef.current && !isMutedRef.current) {
      micStreamRef.current.getAudioTracks().forEach(t => { t.enabled = true; });
    }
  };

  /**
   * Re-enables the mic only after Isabela's audio output has gone silent.
   * Uses a Web Audio AnalyserNode on the output element to detect true silence,
   * rather than a fixed timer that can fire while audio is still playing.
   * Falls back to a fixed delay if the analyser is not available.
   */
  const enableMicAfterPlayback = () => {
    clearMicUnmuteTimer();
    cancelSilenceDetection();

    const analyser = outputAnalyserRef.current;
    const tailMs = isMobile ? 400 : 150;
    const maxWaitMs = isMobile ? 8000 : 5000;

    if (!analyser) {
      // Fallback: generous fixed delay when analyser isn't set up
      micUnmuteTimerRef.current = window.setTimeout(() => {
        micUnmuteTimerRef.current = null;
        doEnableMic();
      }, isMobile ? 3500 : 1500);
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    let silenceFrames = 0;
    const SILENCE_THRESHOLD = 4; // out of 255 — near-zero output energy
    const REQUIRED_FRAMES = isMobile ? 8 : 4; // ~130ms / 65ms of consecutive silence

    // Safety timeout: force-enable mic if silence is never detected (background noise etc.)
    micUnmuteTimerRef.current = window.setTimeout(() => {
      micUnmuteTimerRef.current = null;
      cancelSilenceDetection();
      doEnableMic();
    }, maxWaitMs);

    const checkSilence = () => {
      analyser.getByteFrequencyData(data);
      let peak = 0;
      for (let i = 0; i < data.length; i++) { if (data[i] > peak) peak = data[i]; }

      if (peak < SILENCE_THRESHOLD) {
        silenceFrames++;
        if (silenceFrames >= REQUIRED_FRAMES) {
          // Audio has gone silent — clear safety timeout and re-enable mic after tail
          clearMicUnmuteTimer();
          micUnmuteTimerRef.current = window.setTimeout(() => {
            micUnmuteTimerRef.current = null;
            doEnableMic();
          }, tailMs);
          return; // stop RAF loop
        }
      } else {
        silenceFrames = 0;
      }
      silenceRafRef.current = requestAnimationFrame(checkSilence);
    };
    silenceRafRef.current = requestAnimationFrame(checkSilence);
  };

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);

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
    return () => {
      cleanup();
    };
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
    // If Isabela is currently speaking or thinking, response.done will call sendGoodbye().
    // If she is in listening mode (between turns), response.done never fires —
    // so we must trigger the goodbye immediately.
    if (!isabelaSpeakingRef.current && !isabelaThinkingRef.current) {
      sendGoodbye();
    }
  };

  const sendGoodbye = () => {
    // Cancel any ongoing response first
    sendDataChannelMessage({ type: 'response.cancel' });
    setTimeout(() => {
      sendDataChannelMessage({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{
            type: 'input_text',
            text: '[SYSTEM: The practice session has now ended. Wrap up the conversation warmly and naturally — as a real Brazilian friend would. Compliment the student on something specific they did well today, encourage them to keep practising, and say a warm goodbye. Take 3–4 natural sentences. Do not ask any more questions. Do not sound abrupt.]'
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
    cancelSilenceDetection();
    clearMicUnmuteTimer();
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    outputAnalyserRef.current = null;
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    dcRef.current = null;
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
          ? {
              deviceId: { exact: deviceId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
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

      // Get ephemeral token from your backend
      const tokenRes = await fetch('/api/realtime-token', { method: 'POST' });
      const { client_secret } = await tokenRes.json();
      if (!client_secret?.value) throw new Error('No realtime token');

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Audio output element — WebRTC handles iOS audio natively
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      audioElRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        // On mobile, start at 50% volume to prevent mic echo from speaker bleed
        audioEl.volume = defaultVolume;

        // Tap the raw WebRTC stream with a Web Audio analyser so we can detect
        // when Isabela's voice truly goes silent. Using createMediaStreamSource
        // (not createMediaElementSource) so the analyser reads the raw signal
        // independently — this avoids any interaction with audioEl.volume/mute.
        // Audio still plays normally through the audio element.
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          outputAudioCtxRef.current = ctx;
          const src = ctx.createMediaStreamSource(e.streams[0]);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.3;
          src.connect(analyser);
          // Do NOT connect to ctx.destination — audio plays through audioEl, not here
          outputAnalyserRef.current = analyser;
        } catch (err) {
          console.warn('Output analyser setup failed, using fixed-delay fallback:', err);
          outputAnalyserRef.current = null;
        }
      };

      // Add mic track
      const stream = micStreamRef.current;
      if (!stream) throw new Error('No mic stream');
      // ── Mute mic BEFORE adding tracks so we don't feed back
      //    Isabela's opening greeting into the model ──────────
      stream.getAudioTracks().forEach(track => {
        track.enabled = false;  // start muted
        pc.addTrack(track, stream);
      });

      // Data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        setConnectionStatus('connected');

        // Configure the session
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
              // Higher threshold + longer silence on mobile — speaker bleed is
              // picked up as "user speech" without headphones
              threshold: isMobile ? 0.82 : 0.5,
              prefix_padding_ms: isMobile ? 400 : 300,
              silence_duration_ms: isMobile ? 1200 : 700,
            },
            instructions: ISABELA_SYSTEM_PROMPT.replace('STUDENT_LEVEL', level),
          }
        });

        // Trigger Isabela's opening line
        sendDataChannelMessage({ type: 'response.create' });

        // ── Keep mic muted for first 800ms so echo cancellation
        //    can calibrate before we start listening ───────────
        // The mic will be unmuted in response.done after Isabela's
        // first greeting finishes playing.
      };

      dc.onmessage = (e) => {
        handleRealtimeEvent(JSON.parse(e.data));
      };

      dc.onerror = () => setConnectionStatus('error');

      // WebRTC offer/answer
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

      // Isabela starts speaking
      case 'response.audio.delta':
        setIsabelaThinking(false);
        setIsabelaSpeaking(true);
        clearMicUnmuteTimer();
        // Mute mic whenever audio is actively streaming
        if (micStreamRef.current) {
          micStreamRef.current.getAudioTracks().forEach(t => { t.enabled = false; });
        }
        if (isMutedRef.current && audioElRef.current) {
          audioElRef.current.volume = 0;
        } else if (audioElRef.current) {
          audioElRef.current.volume = defaultVolume;
        }
        break;

      // Isabela's text streaming
      case 'response.audio_transcript.delta':
        isabelaStreamRef.current += event.delta || '';
        setLiveIsabelaText(isabelaStreamRef.current);
        setIsabelaThinking(false);
        setIsabelaSpeaking(true);
        break;

      // Isabela finished one response
      case 'response.audio_transcript.done':
      case 'response.text.done': {
        const fullText = event.transcript || event.text || isabelaStreamRef.current;
        if (fullText.trim()) {
          // Add to display messages
          setDisplayMessages(prev => [
            ...prev,
            { role: 'isabela', text: fullText.trim() }
          ]);
          // Add to transcript log for feedback
          transcriptLogRef.current.push({ role: 'assistant', content: fullText.trim() });
        }
        isabelaStreamRef.current = '';
        setLiveIsabelaText('');
        break;
      }

      // Server finished sending audio chunks — start silence detection to know
      // when the device has actually finished playing the audio
      case 'response.audio.done':
        enableMicAfterPlayback();
        break;

      // Isabela's full response is done — handle session ending logic only.
      // Mic re-enable is handled by response.audio.done → enableMicAfterPlayback().
      case 'response.done':
        setIsabelaSpeaking(false);
        setIsabelaThinking(false);

        if (sessionEndingRef.current) {
          if (!closingLinePlayedRef.current) {
            // Isabela just finished her current sentence — now send goodbye
            closingLinePlayedRef.current = true;
            sendGoodbye();
          } else {
            // Goodbye text is done — wait generously for audio to finish
            // iOS Safari 'ended' event is unreliable so we use a safe timeout
            // 4 seconds is enough for a 2-sentence goodbye at normal speech rate
            setTimeout(() => generateFeedback(), 6000);
          }
        }
        break;

      // Response was cancelled (e.g. user tapped interrupt)
      case 'response.cancelled':
        setIsabelaSpeaking(false);
        setIsabelaThinking(false);
        break;

      // User started speaking — re-enable mic
      case 'input_audio_buffer.speech_started':
        setLiveUserTranscript('...');
        userStreamRef.current = '';
        // Don't re-enable mic here — it creates a feedback loop
        // Mic re-enables after response.done with a delay
        setIsabelaSpeaking(false);
        setLiveIsabelaText('');
        isabelaStreamRef.current = '';
        break;

      // User transcript streaming
      case 'conversation.item.input_audio_transcription.delta':
        userStreamRef.current += event.delta || '';
        setLiveUserTranscript(userStreamRef.current);
        break;

      // User finished speaking — transcript complete
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

      // Isabela is generating a response — mute mic immediately and cancel any
      // in-flight silence detection from a previous response
      case 'response.created':
        setIsabelaThinking(true);
        cancelSilenceDetection();
        clearMicUnmuteTimer();
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
  const handleStart = async () => {
    setScreen('conversation');
    setDisplayMessages([]);
    setTimeLeft(SESSION_DURATION_SECONDS);
    sessionEndingRef.current = false;
    closingLinePlayedRef.current = false;
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
        body: JSON.stringify({
          messages: transcriptLogRef.current,
          level,
        }),
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
    transcriptLogRef.current = [];
  };

  // ── Mute toggle ───────────────────────────────────────────────
  const handleMuteToggle = () => {
    setIsMuted(m => {
      const nowMuted = !m;
      if (audioElRef.current) {
        audioElRef.current.volume = nowMuted ? 0 : defaultVolume;
      }
      return nowMuted;
    });
  };

  // ── Interrupt ─────────────────────────────────────────────────
  const handleInterrupt = () => {
    sendDataChannelMessage({ type: 'response.cancel' });
    setIsabelaSpeaking(false);
    setLiveIsabelaText('');
    isabelaStreamRef.current = '';
    // Cancel any pending silence detection and unmute timers, then re-enable mic
    // quickly — audio stops almost immediately after cancel
    cancelSilenceDetection();
    clearMicUnmuteTimer();
    micUnmuteTimerRef.current = window.setTimeout(() => {
      micUnmuteTimerRef.current = null;
      doEnableMic();
    }, isMobile ? 500 : 200);
  };

  // ─────────────────────────────────────────────────────────────
  // SCREENS
  // ─────────────────────────────────────────────────────────────

  // ── INTRO ─────────────────────────────────────────────────────
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

        <button
          onClick={() => requestMic().then(() => setScreen('mic-setup'))}
          style={styles.primaryBtn}
        >
          Speak with Isabela 🎙️
        </button>
      </div>
    );
  }

  // ── MIC SETUP ─────────────────────────────────────────────────
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

        {/* Earphones notice */}
        <div style={{ background: '#fef9c3', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.2rem' }}>🎧</span>
          <div style={{ fontSize: '0.82rem', color: '#854d0e', lineHeight: 1.6 }}>
            <strong>Use earphones for best results.</strong> Without them, Isabela's voice may be picked up by the mic and appear as random words.
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

  // ── FEEDBACK ──────────────────────────────────────────────────
  if (screen === 'feedback') {
    const parsed = feedback ? parseFeedback(feedback) : null;

    const FeedbackCard = ({ emoji, title, content, bg, border, textColor, titleColor }: {
      emoji: string; title: string; content: string;
      bg: string; border: string; textColor: string; titleColor: string;
    }) => (
      <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 16, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: titleColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: textColor, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{content}</div>
      </div>
    );

    return (
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh', background: '#f8fafc' }}>

        {/* Green header banner */}
        <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', padding: '28px 20px 24px', textAlign: 'center' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', margin: '0 auto 12px',
            overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)',
          }}>
            <img src="/isabela.png" alt="Isabela"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.35rem', margin: '0 0 4px' }}>Session Complete!</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', margin: 0 }}>Here's Isabela's feedback on your practice</p>
        </div>

        <div style={{ padding: '20px 16px 48px' }}>

          {feedbackLoading ? (
            <div style={{ textAlign: 'center', padding: '56px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'white', margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}>⏳</div>
              <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px' }}>Isabela is reviewing your session...</p>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>This usually takes a few seconds</p>
            </div>

          ) : parsed ? (
            <>
              {/* Star rating card */}
              {parsed.rating !== null && (
                <div style={{
                  background: 'white', borderRadius: 16, padding: '20px 20px 18px',
                  marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                    {parsed.rating}
                    <span style={{ fontSize: '1.3rem', color: '#94a3b8', fontWeight: 700 }}>/10</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '10px 0 8px' }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i} style={{ fontSize: '1.1rem', color: i < parsed.rating! ? '#f59e0b' : '#e2e8f0' }}>★</span>
                    ))}
                  </div>
                  {parsed.ratingNote && (
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{parsed.ratingNote}</p>
                  )}
                </div>
              )}

              {parsed.well && (
                <FeedbackCard
                  emoji="✅" title="What went well"
                  content={parsed.well}
                  bg="#f0fdf4" border="#bbf7d0" titleColor="#15803d" textColor="#166534"
                />
              )}

              {parsed.mistakes && (
                <FeedbackCard
                  emoji="📝" title="Corrections"
                  content={parsed.mistakes}
                  bg="#fefce8" border="#fde68a" titleColor="#a16207" textColor="#92400e"
                />
              )}

              {parsed.focus && (
                <FeedbackCard
                  emoji="🎯" title="Focus for next session"
                  content={parsed.focus}
                  bg="#eef2ff" border="#c7d2fe" titleColor="#4338ca" textColor="#3730a3"
                />
              )}
            </>

          ) : feedback ? (
            // Fallback: couldn't parse, show raw text nicely
            <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{feedback}</div>
            </div>
          ) : null}

          <button onClick={handleReset} style={{ ...styles.primaryBtn, marginTop: 8 }}>
            🎙️ Practice with Isabela again
          </button>
        </div>
      </div>
    );
  }

  // ── CONVERSATION ──────────────────────────────────────────────
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
          <div style={{
            background: timeLeft <= 30 ? '#fee2e2' : timeLeft <= 60 ? '#fef9c3' : '#f0fdf4',
            border: `1.5px solid ${timeLeft <= 30 ? '#fca5a5' : timeLeft <= 60 ? '#fde68a' : '#bbf7d0'}`,
            borderRadius: 20, padding: '3px 12px',
            fontWeight: 800, fontSize: '0.9rem',
            color: timerColor,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.02em',
          }}>
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={handleMuteToggle}
            style={{ background: isMuted ? '#fee2e2' : '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {isMuted ? '🔇' : isMobile ? '🔉' : '🔊'}
          </button>
        </div>
      </div>

      {/* Messages */}
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

        {/* Live Isabela text streaming */}
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

        {/* Live user transcript */}
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

        {/* Thinking dots */}
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

      {/* Status bar */}
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
        {/* End button always visible at bottom — no need to scroll up */}
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
