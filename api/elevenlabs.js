// api/elevenlabs.js
// Changed: model_id switched from eleven_multilingual_v2 to eleven_flash_v2_5
// eleven_flash_v2_5 = 75ms model time vs ~300ms — same voice, much faster
// Everything else identical to your original file
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text' });
 
  const VOICE_ID = '33B4UnXyTNbgLmdEDh5P'; // unchanged — Isabela's voice
  const API_KEY  = process.env.ELEVENLABS_API_KEY;
 
  if (!API_KEY) {
    return res.status(500).json({ error: 'ElevenLabs API key not configured' });
  }
 
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_flash_v2_5', // ← only change: was eleven_multilingual_v2
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );
 
    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return res.status(500).json({ error: 'ElevenLabs TTS failed', details: err });
    }
 
    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.send(Buffer.from(audioBuffer));
 
  } catch (error) {
    console.error('ElevenLabs proxy error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
}