// api/feedback.js
// Called once at the end of a session with the full conversation transcript
// Uses Claude Sonnet (not Haiku) because quality matters here, not speed
 
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
   
    const { messages, level } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Missing conversation messages' });
    }
   
    // Build a readable transcript from the conversation history
    const transcript = messages
      .map(m => `${m.role === 'user' ? 'Student' : 'Isabela'}: ${m.content}`)
      .join('\n');
   
    const feedbackPrompt = `You are an expert Brazilian Portuguese language tutor reviewing a student's conversation practice session.
   
  The student is at level ${level || 'B1'}.
   
  Here is the full conversation transcript:
  ---
  ${transcript}
  ---
   
  Please provide structured feedback in English with exactly these three sections:
   
  1. WHAT WENT WELL
  List 2-3 specific things the student did well — vocabulary used correctly, good sentence structures, brave attempts at complex phrases. Be specific, reference actual things they said.
   
  2. MISTAKES TO CORRECT
  List each mistake with this format:
  - They said: "[exact wrong phrase]"
    Correct: "[correct version]"
    Why: [one sentence explanation]
   
  Only include real mistakes from the transcript. Maximum 5 corrections.
   
  3. FOCUS FOR NEXT SESSION
  Give 2-3 specific, actionable things to practise before the next session. Be concrete — not "practise verbs" but "practise the difference between ser and estar with adjectives."
   
  Keep the tone warm and encouraging throughout. The student should feel motivated, not criticised.`;
   
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6', // Sonnet for quality feedback, not Haiku
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: feedbackPrompt,
            },
          ],
        }),
      });
   
      const data = await response.json();
      const text = data.content?.[0]?.text || 'Unable to generate feedback.';
      return res.status(200).json({ feedback: text });
   
    } catch (error) {
      console.error('Feedback API error:', error);
      return res.status(500).json({ error: 'Failed to generate feedback' });
    }
  }