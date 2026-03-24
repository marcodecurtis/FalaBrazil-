// api/deepgram-token.js
// Generates a short-lived Deepgram token so the API key never touches the frontend
// Deploy this to your api/ folder on Vercel
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }
 
  try {
    // Ask Deepgram for a short-lived token (expires in 30 seconds)
    // This token is used by the frontend to open the WebSocket directly
    const response = await fetch('https://api.deepgram.com/v1/auth/grant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`,
      },
      body: JSON.stringify({
        ttl_seconds: 30, // fixed: was time_to_live
      }),
    });
 
    const text = await response.text();
 
    if (!response.ok) {
      console.error('Deepgram grant error:', response.status, text);
      return res.status(500).json({ error: `Deepgram error: ${text}` });
    }
 
    const data = JSON.parse(text);
    const token = data.access_token || data.key; // fixed: was data.key only
    if (!token) {
      console.error('No token in Deepgram response:', data);
      return res.status(500).json({ error: 'No token returned from Deepgram' });
    }
 
    return res.status(200).json({ token });
 
  } catch (error) {
    console.error('Deepgram token handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}