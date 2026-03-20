import Anthropic from "@anthropic-ai/sdk";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ── Load .env manually ─────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(join(__dirname, ".env"), "utf8");
const env = {};
envFile.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) return;
  const key = trimmed.slice(0, eqIndex).trim();
  let val = trimmed.slice(eqIndex + 1).trim();
  // Remove surrounding quotes if present
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  // Fix Windows \n in private key
  val = val.replace(/\\n/g, "\n");
  env[key] = val;
});

const ANTHROPIC_KEY = env["ANTHROPIC_API_KEY"];
const PROJECT_ID    = env["VITE_FIREBASE_PROJECT_ID"];
const CLIENT_EMAIL  = env["FIREBASE_CLIENT_EMAIL"];
const PRIVATE_KEY   = env["FIREBASE_PRIVATE_KEY"];

if (!ANTHROPIC_KEY) throw new Error("Missing ANTHROPIC_API_KEY in .env");
if (!PROJECT_ID)    throw new Error("Missing VITE_FIREBASE_PROJECT_ID in .env");
if (!CLIENT_EMAIL)  throw new Error("Missing FIREBASE_CLIENT_EMAIL in .env");
if (!PRIVATE_KEY)   throw new Error("Missing FIREBASE_PRIVATE_KEY in .env");

console.log("✅ Credentials loaded");
console.log("   Project:", PROJECT_ID);
console.log("   Email:", CLIENT_EMAIL);

// ── Init Firebase Admin ────────────────────────────
initializeApp({
  credential: cert({ projectId: PROJECT_ID, clientEmail: CLIENT_EMAIL, privateKey: PRIVATE_KEY }),
});
const db = getFirestore();
console.log("✅ Firebase connected\n");

// ── Init Anthropic ─────────────────────────────────
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const ITEMS_PER_LEVEL = 10;

const VOCAB_TOPICS = {
  A1: ["greetings","numbers","colors","family","food","animals","house","body","clothes","weather"],
  A2: ["shopping","transport","hobbies","school","health","time","city","nature","jobs","emotions"],
  B1: ["travel","technology","environment","culture","sports","media","relationships","money","education","work"],
  B2: ["politics","economy","science","art","literature","society","history","philosophy","business","psychology"],
  C1: ["diplomacy","jurisprudence","urbanisation","biotechnology","geopolitics","neuroscience","macroeconomics","semiotics","anthropology","rhetoric"],
  C2: ["epistemology","phenomenology","hermeneutics","ontology","axiomatics","dialectics","postmodernism","structuralism","deconstruction","pragmatics"],
};

const GRAMMAR_TOPICS = {
  A1: ["articles","subject pronouns","present tense ser/estar","numbers 1-100","simple questions","negation","gender of nouns","plural nouns","basic prepositions","greetings phrases"],
  A2: ["past tense perfeito","past tense imperfeito","reflexive verbs","direct object pronouns","comparatives","superlatives","possessive pronouns","future with ir+infinitive","time expressions","conjunctions"],
  B1: ["subjunctive mood intro","conditional tense","passive voice","indirect speech","relative clauses","gerund","personal infinitive","por vs para","although/despite clauses","impersonal verbs"],
  B2: ["subjunctive past","future perfect","pluperfect","nominalization","cleft sentences","inversion","complex conditionals","discourse markers","register formal vs informal","idiomatic expressions"],
  C1: ["subjunctive imperfect in conditionals","concessive clauses","resultative constructions","aspectual verbs","epistemic modality","anaphoric reference","ellipsis","focus constructions","lexical collocations","complex nominalization"],
  C2: ["pragmatic inference","register switching","metadiscourse markers","rhetorical devices","syntactic ambiguity","presupposition","speech acts","hedging language","academic register","advanced cohesion"],
};

const READING_TOPICS = {
  A1: ["my daily routine","my family","my house","my city","Brazilian food","popular animals","the weather","going shopping","my hobbies","greetings in Brazil"],
  A2: ["a trip to Rio","Brazilian carnival","football in Brazil","Brazilian music","markets in Brazil","public transport","a Brazilian school","a typical week","seasons in Brazil","popular sports"],
  B1: ["the Amazon rainforest","Carnival history","Brazil's diverse culture","São Paulo city life","the caipirinha tradition","Brazilian cinema","street art in Brazil","the role of football","regional accents","food markets"],
  B2: ["Brazil's political landscape","economic inequality","the tech startup scene","environmental challenges","Afro-Brazilian culture","the favela art movement","Brazil's foreign policy","urban migration","women in Brazil","religious diversity"],
  C1: ["deforestation policy debate","Brazilian literature movements","structural racism","the informal economy","colonial legacy","press freedom","public health challenges","indigenous rights","digital divide","social mobility"],
  C2: ["epistemology of Brazilian identity","postcolonial discourse","sociolinguistic variation","political polarisation","neoliberal reform critique","cultural hybridity theory","subaltern voices","media hegemony","ecological justice","democratic backsliding"],
};

async function callClaude(prompt) {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });
  const text = msg.content.map((b) => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function generateVocab(level, topic) {
  const complexity = {
    A1: "extremely simple everyday words a complete beginner needs",
    A2: "basic words for common situations",
    B1: "intermediate vocabulary for general topics",
    B2: "upper-intermediate vocabulary including some idiomatic expressions",
    C1: "advanced vocabulary including formal and academic register",
    C2: "sophisticated vocabulary including rare technical and nuanced terms",
  }[level];

  return callClaude(`Generate a Portuguese vocabulary lesson for a ${level} CEFR level English speaker learning Brazilian Portuguese.
Topic: ${topic}
Complexity: ${complexity}

Return ONLY valid JSON, no markdown, no explanation:
{
  "topic": "${topic}",
  "level": "${level}",
  "words": [
    {"word": "Portuguese word", "translation": "English translation", "example_pt": "Example sentence in Portuguese at ${level} level", "example_en": "English translation of the example"}
  ]
}
Include exactly 8 words.`);
}

async function generateGrammar(level, topic) {
  return callClaude(`Generate a Portuguese grammar lesson for a ${level} CEFR level English speaker learning Brazilian Portuguese.
Topic: ${topic}

Return ONLY valid JSON, no markdown, no explanation:
{
  "rule": "Short name of the grammar rule",
  "level": "${level}",
  "topic": "${topic}",
  "explanation": "Clear explanation in English for ${level} level (2-3 sentences)",
  "examples": [
    {"pt": "Portuguese example", "en": "English translation"},
    {"pt": "Portuguese example", "en": "English translation"},
    {"pt": "Portuguese example", "en": "English translation"}
  ],
  "exercise": {
    "instruction": "Fill in the blank",
    "questions": [
      {"sentence_pt": "Sentence with ___ blank", "answer": "correct word", "hint_en": "English hint"},
      {"sentence_pt": "Sentence with ___ blank", "answer": "correct word", "hint_en": "English hint"},
      {"sentence_pt": "Sentence with ___ blank", "answer": "correct word", "hint_en": "English hint"}
    ]
  }
}`);
}

async function generateReading(level, topic) {
  const wordCount = { A1: 60, A2: 100, B1: 150, B2: 220, C1: 300, C2: 400 }[level];
  return callClaude(`Generate a Portuguese reading lesson for a ${level} CEFR level English speaker learning Brazilian Portuguese.
Topic: ${topic}
Text length: approximately ${wordCount} words

Return ONLY valid JSON, no markdown, no explanation:
{
  "title": "Article title in Portuguese",
  "title_en": "Article title in English",
  "level": "${level}",
  "topic": "${topic}",
  "text": "Full reading text in Portuguese at ${level} CEFR level, ${wordCount} words",
  "questions": [
    {"question_pt": "Question in Portuguese", "question_en": "Question in English", "answer": "Correct answer"},
    {"question_pt": "Question in Portuguese", "question_en": "Question in English", "answer": "Correct answer"},
    {"question_pt": "Question in Portuguese", "question_en": "Question in English", "answer": "Correct answer"}
  ],
  "vocabulary_highlight": [
    {"word": "key word from text", "translation": "English translation"},
    {"word": "key word from text", "translation": "English translation"},
    {"word": "key word from text", "translation": "English translation"},
    {"word": "key word from text", "translation": "English translation"},
    {"word": "key word from text", "translation": "English translation"}
  ]
}`);
}

async function saveToFirestore(module, level, index, data) {
  const docId = `item_${String(index + 1).padStart(2, "0")}`;
  await db.collection("content").doc(module).collection(level).doc(docId).set({
    ...data,
    index,
    createdAt: new Date().toISOString(),
  });
  console.log(`  ✅ ${module}/${level}/${docId}`);
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log("🚀 Starting content generation — 180 pieces total\n");

  for (const level of LEVELS) {
    console.log(`\n━━━ LEVEL ${level} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    console.log(`\n📚 Vocabulary`);
    for (let i = 0; i < ITEMS_PER_LEVEL; i++) {
      const topic = VOCAB_TOPICS[level][i];
      process.stdout.write(`  Generating: ${topic}... `);
      try {
        const data = await generateVocab(level, topic);
        await saveToFirestore("vocabulary", level, i, data);
        await delay(300);
      } catch (e) {
        console.error(`❌ ${e.message}`);
      }
    }

    console.log(`\n📖 Grammar`);
    for (let i = 0; i < ITEMS_PER_LEVEL; i++) {
      const topic = GRAMMAR_TOPICS[level][i];
      process.stdout.write(`  Generating: ${topic}... `);
      try {
        const data = await generateGrammar(level, topic);
        await saveToFirestore("grammar", level, i, data);
        await delay(300);
      } catch (e) {
        console.error(`❌ ${e.message}`);
      }
    }

    console.log(`\n📰 Reading`);
    for (let i = 0; i < ITEMS_PER_LEVEL; i++) {
      const topic = READING_TOPICS[level][i];
      process.stdout.write(`  Generating: ${topic}... `);
      try {
        const data = await generateReading(level, topic);
        await saveToFirestore("reading", level, i, data);
        await delay(300);
      } catch (e) {
        console.error(`❌ ${e.message}`);
      }
    }
  }

  console.log("\n\n✅ All done! 180 pieces saved to Firestore.");
}

main().catch(console.error);
