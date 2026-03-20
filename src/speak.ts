const API_KEY  = import.meta.env.VITE_ELEVENLABS_API_KEY  as string;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string;

// Cache so the same word never triggers a second API call
const audioCache = new Map<string, string>();

let currentAudio: HTMLAudioElement | null = null;

export const speak = async (text: string): Promise<void> => {
  // Stop anything currently playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  // Serve from cache if available
  if (audioCache.has(text)) {
    const audio = new Audio(audioCache.get(text)!);
    currentAudio = audio;
    audio.play();
    return;
  }

  // Fallback to browser TTS if env vars are missing (dev safety net)
  if (!API_KEY || !VOICE_ID) {
    console.warn('ElevenLabs env vars not set — falling back to browser TTS');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'pt-BR';
    utterance.rate  = 0.85;
    window.speechSynthesis.speak(utterance);
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key':   API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_flash_v2_5',   // lowest latency model
          voice_settings: {
            stability:        0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }

    const blob      = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    // Cache for instant replay
    audioCache.set(text, objectUrl);

    const audio = new Audio(objectUrl);
    currentAudio = audio;
    audio.play();

  } catch (err) {
    console.error('ElevenLabs speak failed:', err);
    // Silent fallback — don't crash the UI
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'pt-BR';
    utterance.rate  = 0.85;
    window.speechSynthesis.speak(utterance);
  }
};
