export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
   
    const { level, dayNumber, timePreference, learningGoal } = req.body;
   
    if (!level || !dayNumber) {
      return res.status(400).json({ error: 'Missing level or dayNumber' });
    }
   
    const time    = timePreference || '30';
    const goal    = learningGoal   || 'conversation';
    const day     = parseInt(dayNumber) || 1;
   
    // ── Build blocks based on time preference ──────────────────────
    let blocksInstruction = '';
    let totalMinutes = 0;
   
    if (time === '5') {
      totalMinutes = 5;
      blocksInstruction = `Return exactly 2 blocks:
  1. vocabulary (5 new words, 3 minutes)
  2. mini_exercise (quick recall exercise, 2 minutes)`;
    } else if (time === '15') {
      totalMinutes = 15;
      blocksInstruction = `Return exactly 3 blocks:
  1. vocabulary (8 new words, 5 minutes)
  2. grammar (one grammar point, 5 minutes)
  3. exercise (practice exercise, 5 minutes)`;
    } else {
      totalMinutes = 30;
      blocksInstruction = `Return exactly 4 blocks:
  1. vocabulary (10 new words, 5 minutes)
  2. grammar (one grammar point, 5 minutes)
  3. reading (short reading passage, 10 minutes)
  4. isabela (speaking practice topic, 10 minutes)`;
    }
   
    // ── Goal context ────────────────────────────────────────────────
    const goalContext = {
        conversation: 'Focus on everyday conversational Portuguese — greetings, opinions, storytelling, daily life.',
      tv_movies:    'Focus on vocabulary and expressions commonly used in Brazilian TV shows, telenovelas and films.',
      travel:       'Focus on practical travel vocabulary — transport, accommodation, restaurants, directions.',
      business:     'Focus on professional and formal Portuguese — meetings, emails, presentations.',
    };
   
    const goalDesc = goalContext[goal] || goalContext['conversation'];
   
    // ── Level context ───────────────────────────────────────────────
    const levelContext = {
      A1: 'Complete beginner. Use only present tense. Maximum 6 words per sentence. Very common everyday vocabulary only.',
      A2: 'Elementary. Use present and simple past tense. Short sentences. Basic connectors.',
      B1: 'Intermediate. Natural present, past and future. Some idioms. Simple subjunctive occasionally.',
      B2: 'Upper intermediate. Varied tenses including subjunctive. Brazilian idioms freely. Nuanced ideas.',
      C1: 'Advanced. Full native-like complexity. Idiomatic expressions, colloquialisms, cultural references.',
      C2: 'Proficient. Native level. Slang, regional expressions, complex grammar, cultural nuances.',
    };
   
    const levelDesc = levelContext[level] || levelContext['B1'];
   
    // ── Theme cycling based on day number ──────────────────────────
    const themes = [
      'greetings and introductions',
      'numbers and time',
      'family and relationships',
      'food and drink',
      'daily routines',
      'home and living',
      'work and professions',
      'travel and transport',
      'health and body',
      'weather and nature',
      'shopping and money',
      'hobbies and free time',
      'Brazilian culture and traditions',
      'music and entertainment',
      'sports especially football',
      'cities and geography of Brazil',
      'emotions and feelings',
      'technology and social media',
      'education and learning',
      'environment and sustainability',
    ];
   
    const theme = themes[(day - 1) % themes.length];
   
    const systemPrompt = `You are a Brazilian Portuguese curriculum designer. You create precise, structured daily lesson plans for language learners. Always return valid JSON only — no markdown, no explanation, no extra text.`;
   
    const userPrompt = `Create a Day ${day} lesson plan for a ${level} level Brazilian Portuguese learner.
   
  LEARNER PROFILE:
  - Level: ${level} — ${levelDesc}
  - Session time: ${totalMinutes} minutes
  - Main goal: ${goalDesc}
  - Day number: ${day}
  - Theme for today: ${theme}
   
  BLOCKS REQUIRED:
  ${blocksInstruction}
   
  Return ONLY this JSON structure with no extra text:
  {
    "day": ${day},
    "theme": "<theme name, 2-4 words>",
    "themeEmoji": "<single relevant emoji>",
    "totalMinutes": ${totalMinutes},
    "xpAvailable": <number — 30 XP per minute, so ${totalMinutes * 30} total>,
    "blocks": [
      {
        "type": "<vocabulary|grammar|reading|isabela|exercise|mini_exercise>",
        "title": "<short title, max 5 words>",
        "description": "<one sentence describing what the learner will do>",
        "duration": <minutes as number>,
        "xp": <XP for this block>,
        "content": {
          <for vocabulary: "words": [{"word": "...", "translation": "...", "example": "..."}]>
          <for grammar: "point": "...", "explanation": "...", "examples": ["...", "..."]>
          <for reading: "title": "...", "text": "...", "questions": ["...", "..."]>
          <for isabela: "topic": "...", "suggestedPhrases": ["...", "..."]>
          <for exercise: "type": "fill_blank|multiple_choice", "items": [{"question": "...", "answer": "..."}]>
          <for mini_exercise: "type": "recall", "items": [{"word": "...", "translation": "..."}]>
        }
      }
    ]
  }`;
   
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
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
   
      const data = await response.json();
      const raw  = data.content?.[0]?.text || '';
      const clean = raw.replace(/```json|```/g, '').trim();
   
      let lesson;
      try {
        lesson = JSON.parse(clean);
      } catch {
        return res.status(500).json({ error: 'Failed to parse lesson JSON', raw: clean });
      }
   
      return res.status(200).json(lesson);
   
    } catch (error) {
      return res.status(500).json({ error: 'Failed to generate lesson' });
    }
  }