const LEVEL_CONTEXT = {
  A1: 'The user is a complete beginner. Use very simple present tense only. Maximum 6 words per sentence. Speak extremely slowly and clearly. Use only the most common 500 words.',
  A2: 'The user is elementary level. Use present and simple past tense. Short simple sentences. Basic vocabulary.',
  B1: 'The user is intermediate. Use natural present, past and future. Some idioms are fine. Moderate complexity.',
  B2: 'The user is upper intermediate. Use varied tenses. Brazilian idioms and expressions welcome. Natural conversation.',
  C1: 'The user is advanced. Speak naturally at native speed. Use colloquialisms, slang and cultural references freely.',
  C2: 'The user is proficient/native level. Full native complexity, regional expressions, nuance.',
};
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { messages, level } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });
 
  const levelDesc = LEVEL_CONTEXT[level] || LEVEL_CONTEXT['B1'];
 
  const systemPrompt = `You are Isabela, a warm, funny and encouraging Brazilian Portuguese conversation partner. You are helping someone practice speaking Brazilian Portuguese.
 
RULES — follow these strictly:
- Always respond in Brazilian Portuguese ONLY — never switch to English
- Keep responses SHORT: maximum 2-3 sentences
- Be warm, natural and encouraging — like a real Brazilian friend
- If the user makes a grammar mistake, gently correct it naturally woven into your reply (don't make it awkward)
- Always end with a follow-up question to keep the conversation going
- ${levelDesc}
- Never break character or mention that you are an AI`;
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: systemPrompt,
        messages,
      }),
    });
 
    const data = await response.json();
    const text = data.content?.[0]?.text || 'Desculpa, não entendi. Pode repetir?';
    return res.status(200).json({ text });
 
  } catch (error) {
    console.error('Isabela API error:', error);
    return res.status(500).json({ error: 'Failed to get response from Isabela' });
  }
}