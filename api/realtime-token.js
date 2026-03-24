// api/realtime-token.js
// Creates a short-lived ephemeral token for the OpenAI Realtime API
 
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
   
    try {
      const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          voice: 'shimmer',
        }),
      });
   
      if (!response.ok) {
        const err = await response.text();
        console.error('OpenAI realtime session error:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }
   
      const data = await response.json();
      return res.status(200).json(data);
   
    } catch (err) {
      console.error('Realtime token error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }