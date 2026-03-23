export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { level, type, timePreference, learningGoal } = req.body;
 
  if (!level) {
    return res.status(400).json({ error: 'Missing level' });
  }
 
  const time = timePreference || '30';
  const goal = learningGoal || 'conversation';
 
  // For backward compatibility, accept dayNumber if provided
  const dayNumber = req.body.dayNumber || 1;
 
  let blocksInstruction = '';
  let totalMinutes = 0;
 
  if (time === '5') {
    totalMinutes = 5;
    blocksInstruction = `Return exactly 2 blocks:
1. vocabulary (5 new words, 3 minutes)
2. mini_exercise (quick recall exercise on those words, 2 minutes)`;
  } else if (time === '15') {
    totalMinutes = 15;
    blocksInstruction = `Return exactly 3 blocks:
1. vocabulary (8 new words related to today's theme, 5 minutes)
2. verb (one verb conjugation in present tense with full conjugation table, 5 minutes)
3. reading (a short 3-4 sentence passage using today's vocabulary and verb, with 1 comprehension question, 5 minutes)`;
  } else {
    totalMinutes = 30;
    blocksInstruction = `Return exactly 4 blocks:
1. vocabulary (10 new words related to today's theme, 5 minutes)
2. verb (one essential verb conjugation with full present tense table and 2 example sentences, 5 minutes)
3. reading (a short paragraph in Brazilian Portuguese using today's vocabulary and verb, with 2 comprehension questions, 10 minutes)
4. isabela (speaking practice topic related to today's theme, 10 minutes)`;
  }
 
  const goalContext = {
    conversation: 'Focus on everyday conversational Portuguese — greetings, opinions, storytelling, daily life.',
    tv_movies:    'Focus on vocabulary and expressions commonly used in Brazilian TV shows, telenovelas and films.',
    travel:       'Focus on practical travel vocabulary — transport, accommodation, restaurants, directions.',
    business:     'Focus on professional and formal Portuguese — meetings, emails, presentations.',
  };
 
  const goalDesc = goalContext[goal] || goalContext['conversation'];
 
  const levelContext = {
    A1: 'Complete beginner. Use only present tense. Maximum 6 words per sentence. Very common everyday vocabulary only.',
    A2: 'Elementary. Use present and simple past tense. Short sentences. Basic connectors.',
    B1: 'Intermediate. Natural present, past and future. Some idioms. Simple subjunctive occasionally.',
    B2: 'Upper intermediate. Varied tenses including subjunctive. Brazilian idioms freely. Nuanced ideas.',
    C1: 'Advanced. Full native-like complexity. Idiomatic expressions, colloquialisms, cultural references.',
    C2: 'Proficient. Native level. Slang, regional expressions, complex grammar, cultural nuances.',
  };
 
  const levelDesc = levelContext[level] || levelContext['B1'];
 
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
 
  const themeVerbs = [
    'ser (to be)',
    'ter (to have)',
    'amar (to love)',
    'comer (to eat)',
    'fazer (to do/make)',
    'morar (to live)',
    'trabalhar (to work)',
    'viajar (to travel)',
    'sentir (to feel)',
    'chover (to rain)',
    'comprar (to buy)',
    'gostar (to like)',
    'dançar (to dance)',
    'ouvir (to listen)',
    'jogar (to play)',
    'visitar (to visit)',
    'falar (to speak)',
    'usar (to use)',
    'aprender (to learn)',
    'ajudar (to help)',
  ];
 
  // ── NEW: Support lesson-based requests ──
  if (type === 'daily') {
    return generateDailyLessons(level, time, goal, dayNumber, res);
  }
 
  // ── OLD: Support day-based requests (backward compatibility) ──
  const theme = themes[(dayNumber - 1) % themes.length];
  const themeVerb = themeVerbs[(dayNumber - 1) % themeVerbs.length];
 
  const systemPrompt = `You are a Brazilian Portuguese curriculum designer. You create precise, structured daily lesson plans for language learners. Always return valid JSON only — no markdown, no explanation, no extra text.`;
 
  const userPrompt = `Create a Day ${dayNumber} lesson plan for a ${level} level Brazilian Portuguese learner.
 
LEARNER PROFILE:
- Level: ${level} — ${levelDesc}
- Session time: ${totalMinutes} minutes
- Main goal: ${goalDesc}
- Day number: ${dayNumber}
- Theme for today: ${theme}
- Featured verb for today: ${themeVerb}
 
BLOCKS REQUIRED:
${blocksInstruction}
 
Return ONLY this JSON structure with no extra text:
{
  "day": ${dayNumber},
  "theme": "<theme name, 2-4 words>",
  "themeEmoji": "<single relevant emoji>",
  "totalMinutes": ${totalMinutes},
  "xpAvailable": ${totalMinutes * 30},
  "blocks": [
    {
      "type": "<vocabulary|verb|reading|isabela|exercise|mini_exercise>",
      "title": "<short title, max 5 words>",
      "description": "<one sentence describing what the learner will do>",
      "duration": <minutes as number>,
      "xp": <XP for this block — divide total XP evenly>,
      "content": {
        <for vocabulary: "words": [{"word": "...", "translation": "...", "example": "..."}]>,
        <for verb: "verb": "...", "translation": "...", "conjugation": {"eu": "...", "você": "...", "ele/ela": "...", "nós": "...", "vocês": "...", "eles/elas": "..."}, "examples": ["...", "..."]>,
        <for reading: "title": "...", "text": "...", "questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..."}]>,
        <for isabela: "topic": "...", "suggestedPhrases": ["...", "..."]>,
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
    const raw = data.content?.[0]?.text || '';
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
 
// ── Generate daily lessons (1 required + multiple optional) ──
async function generateDailyLessons(level, time, goal, dayNumber, res) {
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
 
  const lessonCount = 4;
  const lessons = [];
 
  for (let i = 0; i < lessonCount; i++) {
    const themeIndex = (dayNumber - 1 + i) % themes.length;
    const theme = themes[themeIndex];
    const lessonNumber = dayNumber + i;
    const isRequired = i === 0;
 
    try {
      const lesson = await generateSingleLesson(level, time, goal, lessonNumber, theme);
      lessons.push({
        ...lesson,
        id: `lesson-${level}-${lessonNumber}`,
        isRequired,
      });
    } catch (error) {
      console.error(`Failed to generate lesson ${i}:`, error);
    }
  }
 
  if (lessons.length === 0) {
    return res.status(500).json({ error: 'Failed to generate any lessons' });
  }
 
  return res.status(200).json({
    requiredLesson: lessons[0],
    availableLessons: lessons.slice(1),
  });
}
 
// ── Generate a single lesson ──
async function generateSingleLesson(level, time, goal, dayNumber, theme) {
  let blocksInstruction = '';
  let totalMinutes = 0;
 
  if (time === '5') {
    totalMinutes = 5;
    blocksInstruction = `Return exactly 2 blocks:
1. vocabulary (5 new words, 3 minutes)
2. mini_exercise (quick recall exercise on those words, 2 minutes)`;
  } else if (time === '15') {
    totalMinutes = 15;
    blocksInstruction = `Return exactly 3 blocks:
1. vocabulary (8 new words related to today's theme, 5 minutes)
2. verb (one verb conjugation in present tense with full conjugation table, 5 minutes)
3. reading (a short 3-4 sentence passage using today's vocabulary and verb, with 1 comprehension question, 5 minutes)`;
  } else {
    totalMinutes = 30;
    blocksInstruction = `Return exactly 4 blocks:
1. vocabulary (10 new words related to today's theme, 5 minutes)
2. verb (one essential verb conjugation with full present tense table and 2 example sentences, 5 minutes)
3. reading (a short paragraph in Brazilian Portuguese using today's vocabulary and verb, with 2 comprehension questions, 10 minutes)
4. isabela (speaking practice topic related to today's theme, 10 minutes)`;
  }
 
  const goalContext = {
    conversation: 'Focus on everyday conversational Portuguese — greetings, opinions, storytelling, daily life.',
    tv_movies:    'Focus on vocabulary and expressions commonly used in Brazilian TV shows, telenovelas and films.',
    travel:       'Focus on practical travel vocabulary — transport, accommodation, restaurants, directions.',
    business:     'Focus on professional and formal Portuguese — meetings, emails, presentations.',
  };
 
  const levelContext = {
    A1: 'Complete beginner. Use only present tense. Maximum 6 words per sentence. Very common everyday vocabulary only.',
    A2: 'Elementary. Use present and simple past tense. Short sentences. Basic connectors.',
    B1: 'Intermediate. Natural present, past and future. Some idioms. Simple subjunctive occasionally.',
    B2: 'Upper intermediate. Varied tenses including subjunctive. Brazilian idioms freely. Nuanced ideas.',
    C1: 'Advanced. Full native-like complexity. Idiomatic expressions, colloquialisms, cultural references.',
    C2: 'Proficient. Native level. Slang, regional expressions, complex grammar, cultural nuances.',
  };
 
  const systemPrompt = `You are a Brazilian Portuguese curriculum designer. You create precise, structured daily lesson plans for language learners. Always return valid JSON only — no markdown, no explanation, no extra text.`;
 
  const userPrompt = `Create a lesson for a ${level} level Brazilian Portuguese learner.
 
LEARNER PROFILE:
- Level: ${level} — ${levelContext[level] || levelContext['B1']}
- Session time: ${totalMinutes} minutes
- Main goal: ${goalContext[goal] || goalContext['conversation']}
- Theme: ${theme}
 
BLOCKS REQUIRED:
${blocksInstruction}
 
CRITICAL: You MUST use exactly these field names in content — the app will break if you use different names.
 
Return ONLY this JSON structure with no extra text:
{
  "title": "<lesson title, 2-4 words>",
  "themeEmoji": "<single relevant emoji>",
  "totalMinutes": ${totalMinutes},
  "xpAvailable": ${totalMinutes * 30},
  "blocks": [
    {
      "type": "<vocabulary|verb|reading|isabela|exercise|mini_exercise>",
      "title": "<short title, max 5 words>",
      "description": "<one sentence describing what the learner will do>",
      "duration": <minutes as number>,
      "xp": <XP for this block>,
      "content": {
        <for vocabulary blocks: "words": [{"word": "<Portuguese word>", "translation": "<English translation>", "example": "<example sentence in Portuguese>"}]>,
        <for verb blocks: "verb": "<infinitive>", "translation": "<English>", "conjugation": {"eu": "...", "você": "...", "ele/ela": "...", "nós": "...", "vocês": "...", "eles/elas": "..."}, "examples": ["<sentence 1>", "<sentence 2>"]>,
        <for reading blocks: "title": "<passage title>", "text": "<passage in Portuguese>", "questions": [{"question": "<question text>", "options": ["<option A>", "<option B>", "<option C>", "<option D>"], "correctAnswer": "<must exactly match one of the options>"}]>,
        <for isabela blocks: "topic": "<conversation topic>", "suggestedPhrases": ["<phrase 1>", "<phrase 2>", "<phrase 3>"]>,
        <for mini_exercise blocks: "type": "recall", "words": [{"word": "<Portuguese word>", "translation": "<English translation>", "example": "<example sentence>"}]>
      }
    }
  ]
}
 
IMPORTANT RULES:
- vocabulary content MUST use "words" array with "word", "translation", "example" keys
- mini_exercise content MUST also use "words" array with "word", "translation", "example" keys (NOT "items")
- verb content MUST include all 6 pronouns: eu, você, ele/ela, nós, vocês, eles/elas
- reading "correctAnswer" MUST be an exact copy of one of the strings in "options"
- Do NOT invent new field names`;
 
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
  const raw = data.content?.[0]?.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();
 
  const lesson = JSON.parse(clean);
  return lesson;
}
 