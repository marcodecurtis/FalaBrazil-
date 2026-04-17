export interface PronunciationExample {
    word: string;
    phonetic: string;
    meaning: string;
  }
  
  export interface PronunciationRule {
    id: number;
    title: string;
    category: string;
    emoji: string;
    summary: string;
    explanation: string;
    tip: string;
    examples: PronunciationExample[];
  }
  
  export const PRONUNCIATION_RULES: PronunciationRule[] = [
    {
      id: 1,
      title: "The Letter A",
      category: "Vogais",
      emoji: "🅰️",
      summary: "The most common vowel — always clear and open in Brazilian Portuguese.",
      explanation: "In Brazilian Portuguese, the letter 'a' is always pronounced as a clear, open sound like the 'a' in 'father'. Unlike English, it never becomes a weak 'uh' sound. Whether stressed or unstressed, it stays strong and clear. This is one of the biggest differences from English pronunciation.",
      tip: "Think of 'a' as always sounding like 'ah'. Never swallow it like English does.",
      examples: [
        { word: "água", phonetic: "AH-gwa", meaning: "water" },
        { word: "casa", phonetic: "KAH-za", meaning: "house" },
        { word: "banana", phonetic: "ba-NAH-na", meaning: "banana" },
        { word: "falar", phonetic: "fa-LAR", meaning: "to speak" },
        { word: "trabalhar", phonetic: "tra-ba-LYAR", meaning: "to work" },
      ]
    },
    {
      id: 2,
      title: "The Letter E",
      category: "Vogais",
      emoji: "🔤",
      summary: "The letter E has two sounds in Brazilian Portuguese — open and closed.",
      explanation: "The 'e' in Brazilian Portuguese can be either open (like 'e' in 'bed') or closed (like 'e' in 'they'). When stressed and followed by certain consonants it opens up. At the end of words, Brazilian Portuguese pronounces 'e' clearly, unlike European Portuguese which often drops it entirely. This is a key difference!",
      tip: "Brazilian Portuguese always pronounces the final 'e' — 'leite' is 'LAY-chee', not 'layt'.",
      examples: [
        { word: "leite", phonetic: "LAY-chee", meaning: "milk" },
        { word: "verde", phonetic: "VER-jee", meaning: "green" },
        { word: "noite", phonetic: "NOY-chee", meaning: "night" },
        { word: "sede", phonetic: "SEH-jee", meaning: "thirst / headquarters" },
        { word: "ele", phonetic: "EH-lee", meaning: "he" },
      ]
    },
    {
      id: 3,
      title: "The Letter O",
      category: "Vogais",
      emoji: "⭕",
      summary: "O has open and closed forms, and sounds different at the end of words.",
      explanation: "Like 'e', the letter 'o' in Brazilian Portuguese has open and closed pronunciations. When stressed it is often open like 'aw' in 'saw'. When unstressed at the end of a word, Brazilian Portuguese pronounces it as 'oo' — this is very different from European Portuguese. So 'livro' ends in 'oo', not a swallowed sound.",
      tip: "Final 'o' in Brazilian Portuguese sounds like 'oo' — 'livro' = 'LEE-vroo', 'banco' = 'BAN-koo'.",
      examples: [
        { word: "livro", phonetic: "LEE-vroo", meaning: "book" },
        { word: "banco", phonetic: "BAN-koo", meaning: "bank" },
        { word: "fogo", phonetic: "FOH-goo", meaning: "fire" },
        { word: "ônibus", phonetic: "OH-nee-boos", meaning: "bus" },
        { word: "porto", phonetic: "POR-too", meaning: "port" },
      ]
    },
    {
      id: 4,
      title: "Nasal Vowels — ã, em, im, om, um",
      category: "Vogais Nasais",
      emoji: "👃",
      summary: "Brazilian Portuguese has nasal vowels that resonate through the nose.",
      explanation: "Nasal vowels are one of the most distinctive features of Portuguese. They occur when a vowel is followed by 'm' or 'n' within the same syllable, or when marked with a tilde (~). The sound resonates through the nose, similar to French nasal vowels. The tilde (~) over ã or õ always signals a nasal sound.",
      tip: "For nasal vowels, let the sound hum through your nose at the end. 'ão' sounds like 'owng' with a nasal buzz.",
      examples: [
        { word: "pão", phonetic: "powng", meaning: "bread" },
        { word: "mão", phonetic: "mowng", meaning: "hand" },
        { word: "também", phonetic: "tam-BENG", meaning: "also" },
        { word: "sim", phonetic: "seeng", meaning: "yes" },
        { word: "bom", phonetic: "bong", meaning: "good" },
      ]
    },
    {
      id: 5,
      title: "The Letter R",
      category: "Consoantes",
      emoji: "🌀",
      summary: "The most challenging consonant — R sounds very different from English.",
      explanation: "In Brazilian Portuguese, the letter 'r' has two main sounds. A single 'r' between vowels is a soft flap, like the 'd' in the American English word 'butter'. A double 'rr' or 'r' at the start of a word is pronounced as a strong guttural sound from the back of the throat — similar to the Spanish 'j' or the French 'r'. This is one of the hardest sounds for English speakers.",
      tip: "Single 'r' between vowels = soft tap. Double 'rr' or initial 'r' = strong guttural sound from the throat.",
      examples: [
        { word: "caro", phonetic: "KAH-roo (soft r)", meaning: "expensive" },
        { word: "carro", phonetic: "KAH-hoo (strong r)", meaning: "car" },
        { word: "Rio", phonetic: "HEE-oo", meaning: "River / Rio de Janeiro" },
        { word: "Brasil", phonetic: "bra-ZEEL", meaning: "Brazil" },
        { word: "amor", phonetic: "a-MOR (strong final r)", meaning: "love" },
      ]
    },
    {
      id: 6,
      title: "The Letter S",
      category: "Consoantes",
      emoji: "🐍",
      summary: "S can sound like 'ss', 'z', or 'sh' depending on position.",
      explanation: "The letter 's' in Brazilian Portuguese changes sound based on its position. At the start of a word or after a consonant it sounds like the English 'ss'. Between two vowels it sounds like 'z'. In Rio de Janeiro and some coastal areas, 's' before consonants or at the end of words can sound like 'sh' — this is the famous carioca accent. In São Paulo it usually stays as 'ss'.",
      tip: "Between vowels, 's' becomes 'z' — 'casa' = 'KAH-za', not 'KAH-sa'.",
      examples: [
        { word: "sol", phonetic: "sol", meaning: "sun (ss sound)" },
        { word: "casa", phonetic: "KAH-za", meaning: "house (z sound)" },
        { word: "Brasil", phonetic: "bra-ZEEL", meaning: "Brazil (z sound)" },
        { word: "festa", phonetic: "FES-ta", meaning: "party" },
        { word: "mesmo", phonetic: "MEZ-moo", meaning: "same (z sound)" },
      ]
    },
    {
      id: 7,
      title: "The Letters T and D",
      category: "Consoantes",
      emoji: "🦷",
      summary: "Before 'i' or 'e', T sounds like 'ch' and D sounds like 'j'.",
      explanation: "This is a distinctly Brazilian feature! In Brazilian Portuguese, when 't' comes before 'i' or an unstressed 'e', it is pronounced like 'ch' in 'cheese'. When 'd' comes before 'i' or unstressed 'e', it sounds like 'j' in 'jump'. This palatalisation is very strong in São Paulo and most of Brazil, making Brazilian Portuguese immediately recognisable.",
      tip: "ti = 'chee', di = 'jee'. So 'dia' = 'JEE-a', 'tio' = 'CHEE-oo'. This is very Brazilian!",
      examples: [
        { word: "dia", phonetic: "JEE-a", meaning: "day" },
        { word: "tio", phonetic: "CHEE-oo", meaning: "uncle" },
        { word: "tarde", phonetic: "TAR-jee", meaning: "afternoon" },
        { word: "noite", phonetic: "NOY-chee", meaning: "night" },
        { word: "dividir", phonetic: "jee-vee-JEER", meaning: "to divide" },
      ]
    },
    {
      id: 8,
      title: "The Letter L",
      category: "Consoantes",
      emoji: "🌊",
      summary: "At the end of a syllable, L becomes a 'w' sound in Brazilian Portuguese.",
      explanation: "In Brazilian Portuguese, 'l' at the end of a syllable — called a 'dark l' — is pronounced like the English 'w' or 'u'. This is called vocalisation of L and is very strong in Brazilian Portuguese. So 'Brasil' sounds like 'bra-ZEEW', 'animal' sounds like 'ani-MAW', and 'sol' sounds like 'sow'.",
      tip: "Final 'l' sounds like 'w' — 'Brasil' = 'bra-ZEEW', 'sol' = 'sow', 'mal' = 'maw'.",
      examples: [
        { word: "Brasil", phonetic: "bra-ZEEW", meaning: "Brazil" },
        { word: "sol", phonetic: "sow", meaning: "sun" },
        { word: "animal", phonetic: "ani-MAW", meaning: "animal" },
        { word: "mil", phonetic: "meew", meaning: "thousand" },
        { word: "azul", phonetic: "a-ZOOW", meaning: "blue" },
      ]
    },
    {
      id: 9,
      title: "The Letter X",
      category: "Consoantes",
      emoji: "❌",
      summary: "X is one of the most unpredictable letters — it has four different sounds!",
      explanation: "The letter X in Portuguese can sound like: 'sh' (most common), 'ks', 'z', or 's'. Unfortunately there are no simple rules — you often need to learn the pronunciation of each word. The 'sh' sound is most common. 'Ks' appears in words of Latin/Greek origin. Some words use 'z' and others use 's'. It takes time to learn!",
      tip: "When in doubt, try 'sh' first — it's the most common X sound in Brazilian Portuguese.",
      examples: [
        { word: "xícara", phonetic: "SHEE-ka-ra (sh)", meaning: "cup" },
        { word: "táxi", phonetic: "TAK-see (ks)", meaning: "taxi" },
        { word: "próximo", phonetic: "PROH-see-moo (s)", meaning: "next" },
        { word: "exemplo", phonetic: "e-ZEM-ploo (z)", meaning: "example" },
        { word: "caixinha", phonetic: "ka-SHEE-nya", meaning: "small box" },
      ]
    },
    {
      id: 10,
      title: "The Letter LH",
      category: "Dígrafos",
      emoji: "🎸",
      summary: "LH is a special digraph that sounds like the 'lli' in 'million'.",
      explanation: "The combination 'lh' in Portuguese is a palatal lateral sound — it does not exist in English. The closest equivalent is the 'll' in the English word 'million' or the 'gli' in Italian 'figlio'. Your tongue touches the roof of your mouth further back than a normal 'l'. It is found in many common Portuguese words.",
      tip: "LH sounds like 'ly' — 'trabalho' = 'tra-BAH-lyoo', 'filho' = 'FEEL-yoo'.",
      examples: [
        { word: "trabalho", phonetic: "tra-BAH-lyoo", meaning: "work / I work" },
        { word: "filho", phonetic: "FEEL-yoo", meaning: "son" },
        { word: "melhor", phonetic: "me-LYOR", meaning: "better" },
        { word: "mulher", phonetic: "moo-LYER", meaning: "woman" },
        { word: "olho", phonetic: "OH-lyoo", meaning: "eye" },
      ]
    },
    {
      id: 11,
      title: "The Letter NH",
      category: "Dígrafos",
      emoji: "🎵",
      summary: "NH sounds like the 'ny' in 'canyon' or the Spanish 'ñ'.",
      explanation: "The combination 'nh' is another palatal sound in Portuguese. It sounds exactly like the 'ny' in the English word 'canyon', or the Spanish letter 'ñ'. Your tongue presses flat against the roof of your mouth. It is very common in Brazilian Portuguese and appears in many everyday words.",
      tip: "NH = 'ny' sound. 'Manhã' = 'ma-NYAH', 'vinho' = 'VEE-nyoo'.",
      examples: [
        { word: "manhã", phonetic: "ma-NYAH", meaning: "morning" },
        { word: "vinho", phonetic: "VEE-nyoo", meaning: "wine" },
        { word: "banho", phonetic: "BA-nyoo", meaning: "bath" },
        { word: "anha", phonetic: "A-nya", meaning: "gains" },
        { word: "sonho", phonetic: "SO-nyoo", meaning: "dream" },
      ]
    },
    {
      id: 12,
      title: "Stress Rules",
      category: "Acento",
      emoji: "💪",
      summary: "Knowing which syllable to stress is key to sounding natural.",
      explanation: "In Portuguese, stress follows predictable rules. Words ending in 'a', 'e', 'o', 'am', or 'em' are stressed on the second-to-last syllable. Words ending in other consonants or 'i', 'u' are stressed on the last syllable. Accent marks (á, é, ó, ê, ô, à) always override the rules and show exactly where to stress. When in doubt, look for the accent mark!",
      tip: "Accent marks always show stress. No accent? Words ending in vowels are stressed on the second-to-last syllable.",
      examples: [
        { word: "ca-SA", phonetic: "ka-ZA (2nd to last)", meaning: "house" },
        { word: "BRA-sil", phonetic: "bra-ZEEW (last)", meaning: "Brazil" },
        { word: "á-gua", phonetic: "AH-gwa (accent = stress)", meaning: "water" },
        { word: "ca-FÉ", phonetic: "ka-FEH (accent = stress)", meaning: "coffee" },
        { word: "MÚ-si-ca", phonetic: "MOO-zee-ka", meaning: "music" },
      ]
    },
    {
      id: 13,
      title: "The Ç (C with cedilla)",
      category: "Consoantes",
      emoji: "🪝",
      summary: "Ç always makes a soft 'ss' sound, never a 'k' sound.",
      explanation: "The cedilla (ç) was invented to solve a problem: the letter 'c' before 'a', 'o', or 'u' normally sounds like 'k'. Adding a cedilla changes it to 'ss'. So ç always sounds like 'ss', no matter what vowel follows. You will never see ç before 'e' or 'i' because 'c' already makes the 'ss' sound there.",
      tip: "Ç = always 'ss'. Never 'k', never 'sh'. Simple!",
      examples: [
        { word: "açúcar", phonetic: "a-SOO-kar", meaning: "sugar" },
        { word: "caçar", phonetic: "ka-SAR", meaning: "to hunt" },
        { word: "coração", phonetic: "ko-ra-SOWNG", meaning: "heart" },
        { word: "praça", phonetic: "PRA-sa", meaning: "square / plaza" },
        { word: "França", phonetic: "FRAN-sa", meaning: "France" },
      ]
    },
    {
      id: 14,
      title: "The Letters G and J",
      category: "Consoantes",
      emoji: "🎯",
      summary: "G before E or I, and J, both make a soft 'zh' sound like the 's' in 'treasure'.",
      explanation: "In Portuguese, 'g' before 'e' or 'i' sounds like the 's' in 'treasure' or the 'g' in French 'genre'. The letter 'j' always makes this same sound regardless of the vowel that follows. This 'zh' sound is somewhere between 'sh' and 'z'. Before 'a', 'o', or 'u', the letter 'g' sounds like the English 'g' in 'go'.",
      tip: "J and G before E/I = 'zh' (like the 's' in 'treasure'). G before A/O/U = hard 'g'.",
      examples: [
        { word: "gente", phonetic: "ZHEN-chee", meaning: "people" },
        { word: "hoje", phonetic: "OH-zhee", meaning: "today" },
        { word: "viagem", phonetic: "vee-AH-zheng", meaning: "trip" },
        { word: "janela", phonetic: "zha-NEH-la", meaning: "window" },
        { word: "girafa", phonetic: "zhee-RAF-a", meaning: "giraffe" },
      ]
    },
    {
      id: 15,
      title: "The Diphthongs — ão, ãe, ei, ou",
      category: "Ditongos",
      emoji: "🎶",
      summary: "Diphthongs are two vowel sounds blended together in one syllable.",
      explanation: "Portuguese has many diphthongs — combinations of two vowels in a single syllable. The most common are: 'ão' (owng), 'ãe' (ayng), 'ei' (ay), and 'ou' (oh). In Brazilian Portuguese, 'ou' is often reduced to just 'oh', so 'ouro' sounds like 'OH-roo'. The nasal diphthongs 'ão' and 'ãe' are very characteristic of Portuguese.",
      tip: "OU in Brazilian Portuguese often becomes just 'OH'. 'Ouro' (gold) = OH-roo, not 'OW-roo'.",
      examples: [
        { word: "pão", phonetic: "powng", meaning: "bread (ão)" },
        { word: "mãe", phonetic: "mayng", meaning: "mother (ãe)" },
        { word: "lei", phonetic: "lay", meaning: "law (ei)" },
        { word: "ouro", phonetic: "OH-roo", meaning: "gold (ou→o)" },
        { word: "saudade", phonetic: "saw-DAH-jee", meaning: "longing" },
      ]
    },
    {
      id: 16,
      title: "Silent Letters and Reductions",
      category: "Sons Especiais",
      emoji: "🤫",
      summary: "Some letters in Brazilian Portuguese are weakened or swallowed in speech.",
      explanation: "In natural spoken Brazilian Portuguese, certain sounds are reduced or dropped entirely. The 'd' in '-ando' verb endings is often dropped in casual speech ('falando' becomes 'falanno'). The 'r' at the end of infinitives is often not pronounced in casual speech. Unstressed 'e' and 'o' at the end of words are reduced. This is normal — it makes speech flow faster.",
      tip: "In casual speech, Brazilians often drop the final 'r' of verbs: 'falar' sounds like 'falá'.",
      examples: [
        { word: "falando", phonetic: "fa-LAN-doo / fa-LAN-noo", meaning: "speaking (casual)" },
        { word: "para", phonetic: "PA-ra / pra", meaning: "for (reduced to 'pra')" },
        { word: "está", phonetic: "es-TAH / tá", meaning: "is (reduced to 'tá')" },
        { word: "você", phonetic: "vo-SEH / cê", meaning: "you (reduced to 'cê')" },
        { word: "falar", phonetic: "fa-LAR / fa-LÁ", meaning: "to speak (casual)" },
      ]
    },
    {
      id: 17,
      title: "The Carioca Accent (Rio)",
      category: "Sotaques",
      emoji: "🏖️",
      summary: "Rio de Janeiro has a distinctive accent with softer S sounds.",
      explanation: "The accent from Rio de Janeiro — called carioca — is one of the most recognised in Brazil. The main feature is the pronunciation of 's' and 'z' before consonants or at the end of words as 'sh' or 'zh'. So 'mesmo' sounds like 'MEZHmoo' and 'mas' sounds like 'mash'. Rio Portuguese sounds more like European Portuguese in this regard, and many foreigners find it beautiful.",
      tip: "In Rio, 'S' before consonants or at word ends sounds like 'SH'. 'Dois' = 'doysh'.",
      examples: [
        { word: "mesmo", phonetic: "MEZHmoo (Rio)", meaning: "same" },
        { word: "dois", phonetic: "doysh (Rio)", meaning: "two" },
        { word: "mas", phonetic: "mash (Rio)", meaning: "but" },
        { word: "festa", phonetic: "FESH-ta (Rio)", meaning: "party" },
        { word: "gostoso", phonetic: "gosh-TOH-zoo (Rio)", meaning: "delicious" },
      ]
    },
    {
      id: 18,
      title: "Rhythm and Flow",
      category: "Ritmo",
      emoji: "🎵",
      summary: "Brazilian Portuguese has a musical, syllable-timed rhythm.",
      explanation: "One of the most beautiful aspects of Brazilian Portuguese is its musical rhythm. Unlike English which is stress-timed (some syllables long, some very short), Brazilian Portuguese is more syllable-timed — each syllable gets relatively equal time. This gives it a flowing, melodic quality. Brazilians also tend to open vowels wide and speak with a lot of oral movement, giving the language warmth.",
      tip: "Give each syllable roughly equal time. Open your mouth wider than you do in English. Let it flow!",
      examples: [
        { word: "obrigado", phonetic: "oh-bree-GAH-doo", meaning: "thank you" },
        { word: "saudade", phonetic: "saw-DAH-jee", meaning: "longing" },
        { word: "maravilhoso", phonetic: "ma-ra-vee-LYOH-zoo", meaning: "marvellous" },
        { word: "felicidade", phonetic: "fe-lee-see-DAH-jee", meaning: "happiness" },
        { word: "brasileiro", phonetic: "bra-zee-LAY-roo", meaning: "Brazilian" },
      ]
    },
    {
      id: 19,
      title: "Common Greetings Pronunciation",
      category: "Expressões",
      emoji: "👋",
      summary: "Master the pronunciation of the most used Brazilian greetings.",
      explanation: "Getting greetings right is the first step to sounding natural. Brazilian greetings are warm and often reduced in casual speech. 'Tudo bem?' (how are you?) is often said very quickly. 'Oi' is the most casual hello. 'Olá' is slightly more formal. 'Obrigado' (thank you, masculine) and 'obrigada' (feminine) are essential. Brazilians appreciate any effort to speak Portuguese!",
      tip: "Brazilians love warmth! Even imperfect Portuguese with a smile goes a long way.",
      examples: [
        { word: "Oi!", phonetic: "oy", meaning: "Hi! (very casual)" },
        { word: "Olá!", phonetic: "oh-LAH", meaning: "Hello!" },
        { word: "Tudo bem?", phonetic: "TOO-doo beng", meaning: "Everything good?" },
        { word: "Obrigado", phonetic: "oh-bree-GAH-doo", meaning: "Thank you (masc.)" },
        { word: "Com licença", phonetic: "kong lee-SEN-sa", meaning: "Excuse me" },
      ]
    },
    {
      id: 20,
      title: "Numbers Pronunciation",
      category: "Expressões",
      emoji: "🔢",
      summary: "Pronounce Brazilian Portuguese numbers correctly from 1 to 10.",
      explanation: "Numbers are used constantly in daily life — for prices, addresses, phone numbers and more. The numbers 1 and 2 change form depending on gender: 'um/uma' and 'dois/duas'. The number 3 has a nasal sound. From 1 to 10, the rhythm follows the syllable-timed pattern of Brazilian Portuguese. Pay special attention to the nasal vowels in 'um', 'três', 'sem'.",
      tip: "Um (oong), dois (doyss), três (trayss). The nasal sounds in numbers take practice!",
      examples: [
        { word: "um / uma", phonetic: "oong / OO-ma", meaning: "one (masc/fem)" },
        { word: "dois / duas", phonetic: "doyss / DOO-as", meaning: "two (masc/fem)" },
        { word: "três", phonetic: "trayss", meaning: "three" },
        { word: "quatro", phonetic: "KWA-troo", meaning: "four" },
        { word: "cinco", phonetic: "SEENG-koo", meaning: "five" },
      ]
    },
  ];
  