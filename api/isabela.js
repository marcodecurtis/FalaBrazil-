export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { messages, systemPrompt } = req.body;
  
    if (!messages || !systemPrompt) {
      return res.status(400).json({ error: 'Missing messages or systemPrompt' });
    }
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: systemPrompt,
          messages: messages.length > 0 ? messages : [{ role: 'user', content: 'Começa a conversa.' }],
        }),
      });
  
      const data = await response.json();
      const text = data.content?.[0]?.text || 'Desculpa, houve um erro.';
      return res.status(200).json({ text });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to contact Claude API' });
    }
  }