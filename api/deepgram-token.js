// api/deepgram-token.js
// Simplified: returns the API key directly as the token
// The browser uses it via ['token', apiKey] WebSocket subprotocol
// Key stays on the server — never hardcoded in frontend code
// This is the standard approach used in Deepgram's own browser examples
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }
 
  // Return the API key as the token
  // Works with any key role (Default, Member, Admin)
  // No need for the /auth/grant endpoint
  return res.status(200).json({ token: apiKey });
}
 