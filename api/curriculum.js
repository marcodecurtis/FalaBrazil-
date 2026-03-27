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
  const dayNumber = req.body.dayNumber || 1;

  if (type === 'daily') {
    return generateDailyLessons(level, time, goal, dayNumber, res);
  }

  // ── Backward compatibility: single lesson ──
  const themes = [
    'greetings and introductions','numbers and time','family and relationships',
    'food and drink','daily routines','home and living','work and professions',
    'travel and transport','health and body','weather and nature','shopping and money',
    'hobbies and free time','Brazilian culture and traditions','music and entertainment',
    'sports especially football','cities and geography of Brazil','emotions and feelings',
    'technology and social media','education and learning','environment and sustainability',
  ];

  const themeVerbs = [
    'ser (to be)','ter (to have)','amar (to love)','comer (to eat)','fazer (to do/make)',
    'morar (to live)','trabalhar (to work)','viajar (to travel)','sentir (to feel)',
    'chover (to rain)','comprar (to buy)','gostar (to like)','dançar (to dance)',
    'ouvir (to listen)','jogar (to play)','visitar (to visit)','falar (to speak)',
    'usar (to use)','aprender (to learn)','ajudar (to help)',
  ];

  const theme    = themes[(dayNumber - 1) % themes.length];
  const themeVerb = themeVerbs[(dayNumber - 1) % themeVerbs.length];

  let blocksInstruction = '';
  let totalMinutes = 0;

  if (time === '5') {
    totalMinutes = 5;
    blocksInstruction = `Return exactly 2 blocks:\n1. vocabulary (5 new words, 3 minutes)\n2. mini_exercise (quick recall exercise on those words, 2 minutes)`;
  } else if (time === '15') {
    totalMinutes = 15;
    blocksInstruction = `Return exactly 3 blocks:\n1. vocabulary (8 new words related to today's theme, 5 minutes)\n2. verb (one verb conjugation in present tense with full conjugation table, 5 minutes)\n3. reading (a short 3-4 sentence passage using today's vocabulary and verb, with 1 comprehension question, 5 minutes)`;
  } else {
    totalMinutes = 30;
    blocksInstruction = `Return exactly 4 blocks:\n1. vocabulary (10 new words related to today's theme, 5 minutes)\n2. verb (one essential verb conjugation with full present tense table and 2 example sentences, 5 minutes)\n3. reading (a short paragraph in Brazilian Portuguese using today's vocabulary and verb, with 2 comprehension questions, 10 minutes)\n4. isabela (speaking practice topic related to today's theme, 10 minutes)`;
  }

  const systemPrompt = `You are a Brazilian Portuguese curriculum designer. Always return valid JSON only — no markdown, no explanation, no extra text.`;
  const userPrompt = buildUserPrompt(level, time, goal, dayNumber, theme, themeVerb, totalMinutes, blocksInstruction);

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
    const data  = await response.json();
    const raw   = data.content?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    let lesson;
    try { lesson = JSON.parse(clean); } catch { return res.status(500).json({ error: 'Failed to parse lesson JSON', raw: clean }); }
    return res.status(200).json(lesson);
  } catch {
    return res.status(500).json({ error: 'Failed to generate lesson' });
  }
}

function buildUserPrompt(level, time, goal, dayNumber, theme, themeVerb, totalMinutes, blocksInstruction) {
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
  return `Create a Day ${dayNumber} lesson plan for a ${level} level Brazilian Portuguese learner.
LEARNER PROFILE:
- Level: ${level} — ${levelContext[level] || levelContext['B1']}
- Session time: ${totalMinutes} minutes
- Main goal: ${goalContext[goal] || goalContext['conversation']}
- Theme: ${theme}
- Featured verb: ${themeVerb}
BLOCKS REQUIRED:
${blocksInstruction}
Return ONLY valid JSON. Use exact field names as specified. No markdown.
{
  "day": ${dayNumber}, "theme": "<theme>", "themeEmoji": "<emoji>",
  "totalMinutes": ${totalMinutes}, "xpAvailable": ${totalMinutes * 30},
  "blocks": [{ "type": "...", "title": "...", "description": "...", "duration": 0, "xp": 0, "content": {} }]
}`;
}

// ── LESSON TYPE DEFINITIONS ───────────────────────────────────────
// Each available lesson has a distinct focus so they feel different
const LESSON_TYPES = [
  {
    // Lesson 1 — Required: balanced vocabulary + verb + reading
    label: 'Today\'s Lesson',
    getBlocks: (time) => {
      if (time === '5')  return `Return exactly 2 blocks:\n1. vocabulary (5 new words, 3 minutes)\n2. mini_exercise (quick recall on those words, 2 minutes)`;
      if (time === '15') return `Return exactly 3 blocks:\n1. vocabulary (8 new words related to the theme, 5 minutes)\n2. verb (one verb with full conjugation table, 5 minutes)\n3. reading (a 3-4 sentence passage with 1 comprehension question, 5 minutes)`;
      return `Return exactly 4 blocks:\n1. vocabulary (10 new words, 5 minutes)\n2. verb (one verb with full conjugation table and 2 example sentences, 5 minutes)\n3. reading (a paragraph with 2 comprehension questions, 10 minutes)\n4. isabela (speaking practice on today's theme, 10 minutes)`;
    },
  },
  {
    // Lesson 2 — Grammar focused
    label: 'Grammar Focus',
    getBlocks: (time) => {
      if (time === '5')  return `Return exactly 2 blocks:\n1. grammar (one key grammar rule with 3 examples, 3 minutes)\n2. mini_exercise (2 fill-in-the-blank sentences testing that grammar rule, 2 minutes)`;
      if (time === '15') return `Return exactly 3 blocks:\n1. grammar (one essential grammar point with clear explanation and 4 examples, 6 minutes)\n2. mini_exercise (3 fill-in-the-blank exercises testing that grammar rule, 4 minutes)\n3. reading (a short passage that naturally uses the grammar point, with 1 comprehension question, 5 minutes)`;
      return `Return exactly 4 blocks:\n1. grammar (one essential grammar point with clear explanation and 5 examples, 8 minutes)\n2. mini_exercise (4 fill-in-the-blank exercises testing that grammar rule, 7 minutes)\n3. reading (a passage that naturally uses the grammar point, with 2 comprehension questions, 10 minutes)\n4. isabela (short speaking exercise using the grammar point, 5 minutes)`;
    },
  },
  {
    // Lesson 3 — Culture + Vocabulary
    label: 'Culture & Vocab',
    getBlocks: (time) => {
      if (time === '5')  return `Return exactly 2 blocks:\n1. vocabulary (5 culture-related words specific to Brazilian life, 3 minutes)\n2. mini_exercise (quick recall on those words, 2 minutes)`;
      if (time === '15') return `Return exactly 3 blocks:\n1. vocabulary (8 culture-specific Brazilian words or expressions, 5 minutes)\n2. reading (a short cultural text about Brazil related to the theme — festivals, food, music, football — with 2 comprehension questions, 10 minutes)`;
      return `Return exactly 4 blocks:\n1. vocabulary (10 culture-specific Brazilian words or expressions, 5 minutes)\n2. reading (a rich cultural text about Brazil related to the theme with 3 comprehension questions, 15 minutes)\n3. verb (a verb commonly used in the cultural context, with full conjugation, 5 minutes)\n4. isabela (discuss the cultural topic in Portuguese, 5 minutes)`;
    },
  },
  {
    // Lesson 4 — Verb deep-dive
    label: 'Verb Deep-Dive',
    getBlocks: (time) => {
      if (time === '5')  return `Return exactly 2 blocks:\n1. verb (one verb with full present tense conjugation, 3 minutes)\n2. mini_exercise (fill-in-the-blank sentences using that verb, 2 minutes)`;
      if (time === '15') return `Return exactly 3 blocks:\n1. verb (one essential verb with full present AND past tense conjugation, 6 minutes)\n2. mini_exercise (4 sentences testing both present and past forms of the verb, 4 minutes)\n3. reading (a short passage using the verb in different tenses, with 1 comprehension question, 5 minutes)`;
      return `Return exactly 4 blocks:\n1. verb (one essential verb with present, past and future conjugation tables, 8 minutes)\n2. mini_exercise (5 sentences testing all tenses of the verb, 7 minutes)\n3. reading (a passage using the verb in multiple tenses, with 2 comprehension questions, 10 minutes)\n4. isabela (use the verb in a real conversation, 5 minutes)`;
    },
  },
];

async function generateDailyLessons(level, time, goal, dayNumber, res) {
  const themes = [
    'greetings and introductions','numbers and time','family and relationships',
    'food and drink','daily routines','home and living','work and professions',
    'travel and transport','health and body','weather and nature','shopping and money',
    'hobbies and free time','Brazilian culture and traditions','music and entertainment',
    'sports especially football','cities and geography of Brazil','emotions and feelings',
    'technology and social media','education and learning','environment and sustainability',
  ];

  // Start at a sensible theme offset based on level — beginners start at 0,
  // intermediate/advanced users skip the basics they already know
  const levelThemeOffset = { A1: 0, A2: 4, B1: 8, B2: 12, C1: 16, C2: 18 };
  const startOffset = levelThemeOffset[level] || 0;

  const lessons = [];

  for (let i = 0; i < 4; i++) {
    const themeIndex = (startOffset + dayNumber - 1 + i) % themes.length;
    const theme      = themes[themeIndex];
    const lessonType = LESSON_TYPES[i];
    const isRequired = i === 0;

    try {
      const lesson = await generateSingleLesson(level, time, goal, dayNumber + i, theme, lessonType);
      lessons.push({
        ...lesson,
        id: `lesson-${level}-${dayNumber + i}-type${i}`,
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
    requiredLesson:   lessons[0],
    availableLessons: lessons.slice(1),
  });
}

async function generateSingleLesson(level, time, goal, dayNumber, theme, lessonType) {
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

  const totalMinutes = time === '5' ? 5 : time === '15' ? 15 : 30;
  const blocksInstruction = lessonType.getBlocks(time);

  const systemPrompt = `You are a Brazilian Portuguese curriculum designer. Always return valid JSON only — no markdown, no explanation, no extra text.`;

  const userPrompt = `Create a "${lessonType.label}" lesson for a ${level} level Brazilian Portuguese learner.

LEARNER PROFILE:
- Level: ${level} — ${levelContext[level] || levelContext['B1']}
- Session time: ${totalMinutes} minutes
- Main goal: ${goalContext[goal] || goalContext['conversation']}
- Theme: ${theme}

BLOCKS REQUIRED:
${blocksInstruction}

CRITICAL FIELD NAMES — the app breaks if you use different names:
- vocabulary blocks: "words": [{"word": "...", "translation": "...", "example": "..."}]
- verb blocks: "verb": "...", "translation": "...", "conjugation": {"eu":"...","você":"...","ele/ela":"...","nós":"...","vocês":"...","eles/elas":"..."}, "examples": ["..."]
- grammar blocks: "point": "...", "explanation": "...", "examples": ["..."], "items": [{"question": "...", "answer": "..."}]
- reading blocks: "title": "...", "text": "...", "questions": [{"question":"...","options":["...","...","...","..."],"correctAnswer":"<must exactly match one option>"}]
- isabela blocks: "topic": "...", "suggestedPhrases": ["...", "...", "..."]
- mini_exercise blocks: "words": [{"word": "...", "translation": "...", "example": "..."}]

Return ONLY this JSON — no extra text:
{
  "title": "<lesson title 2-4 words>",
  "themeEmoji": "<single emoji>",
  "totalMinutes": ${totalMinutes},
  "xpAvailable": ${totalMinutes * 30},
  "blocks": [
    {
      "type": "<vocabulary|verb|grammar|reading|isabela|mini_exercise>",
      "title": "<short title max 5 words>",
      "description": "<one sentence>",
      "duration": <number>,
      "xp": <number>,
      "content": {}
    }
  ]
}`;

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

  const data  = await response.json();
  const raw   = data.content?.[0]?.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
