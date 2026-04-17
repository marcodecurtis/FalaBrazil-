export interface GrammarExample {
    pt: string;
    en: string;
  }
  
  export interface GrammarRule {
    id: number;
    title: string;
    level: "A1" | "A2" | "B1" | "B2";
    summary: string;
    explanation: string;
    examples: GrammarExample[];
  }
  
  export const GRAMMAR_RULES: GrammarRule[] = [
    {
      id: 1,
      title: "Ser vs. Estar",
      level: "A2",
      summary: "Two verbs both mean 'to be' but are used in very different situations.",
      explanation: "Use 'ser' for permanent or defining characteristics: identity, nationality, profession, origin. Use 'estar' for temporary states: feelings, location, conditions that can change.",
      examples: [
        { pt: "Eu sou português.", en: "I am Portuguese. (permanent identity)" },
        { pt: "Eu estou cansado.", en: "I am tired. (temporary state)" },
        { pt: "Ela é médica.", en: "She is a doctor. (profession — use ser)" },
        { pt: "Ela está no hospital.", en: "She is at the hospital. (location — use estar)" },
        { pt: "O café é quente.", en: "Coffee is hot. (inherent property — ser)" },
        { pt: "O café está frio.", en: "The coffee is cold. (current state — estar)" },
      ]
    },
    {
      id: 2,
      title: "Definite Articles: o, a, os, as",
      level: "A1",
      summary: "Portuguese nouns always have a gender (masculine or feminine) and articles must agree.",
      explanation: "Every noun in Portuguese is either masculine or feminine. 'o' is used before singular masculine nouns, 'a' before singular feminine nouns. 'os' and 'as' are their plural forms. Most nouns ending in -o are masculine; most ending in -a are feminine.",
      examples: [
        { pt: "o livro", en: "the book (masculine singular)" },
        { pt: "a casa", en: "the house (feminine singular)" },
        { pt: "os livros", en: "the books (masculine plural)" },
        { pt: "as casas", en: "the houses (feminine plural)" },
        { pt: "O cão é grande.", en: "The dog is big." },
        { pt: "A gata dorme.", en: "The cat sleeps." },
      ]
    },
    {
      id: 3,
      title: "Indefinite Articles: um, uma, uns, umas",
      level: "A1",
      summary: "The equivalent of 'a/an' in English, with gender and number agreement.",
      explanation: "'um' is used for masculine singular nouns and 'uma' for feminine singular. Their plurals 'uns' and 'umas' mean 'some'. Like all articles, they must match the gender of the noun they describe.",
      examples: [
        { pt: "um carro", en: "a car (masculine)" },
        { pt: "uma cidade", en: "a city (feminine)" },
        { pt: "uns amigos", en: "some friends (masculine plural)" },
        { pt: "umas flores", en: "some flowers (feminine plural)" },
        { pt: "Quero um café.", en: "I want a coffee." },
        { pt: "Ela tem uma ideia.", en: "She has an idea." },
      ]
    },
    {
      id: 4,
      title: "Present Tense (Presente do Indicativo)",
      level: "A1",
      summary: "The most common tense — used for habits, facts, and things happening now.",
      explanation: "Regular verbs follow predictable patterns based on their ending: -ar, -er, or -ir. The stem is found by removing the infinitive ending, then you add the correct ending for each person. Irregular verbs like ser, ter, ir must be memorised separately.",
      examples: [
        { pt: "Eu falo português.", en: "I speak Portuguese." },
        { pt: "Tu comes arroz.", en: "You eat rice." },
        { pt: "Ele bebe água.", en: "He drinks water." },
        { pt: "Nós trabalhamos muito.", en: "We work a lot." },
        { pt: "Eles vivem em Lisboa.", en: "They live in Lisbon." },
        { pt: "Eu tenho um irmão.", en: "I have a brother. (irregular)" },
      ]
    },
    {
      id: 5,
      title: "Pretérito Perfeito (Simple Past)",
      level: "A2",
      summary: "Used for completed actions in the past — equivalent to 'I did' or 'I have done'.",
      explanation: "This tense describes actions that are finished. For -ar verbs the endings are: -ei, -aste, -ou, -ámos, -astes, -aram. For -er and -ir verbs: -i, -este, -eu/-iu, -emos/-imos, -estes/-istes, -eram/-iram. Many common verbs are irregular.",
      examples: [
        { pt: "Eu falei com ela ontem.", en: "I spoke with her yesterday." },
        { pt: "Nós comemos pizza.", en: "We ate pizza." },
        { pt: "Ele foi ao mercado.", en: "He went to the market. (irregular)" },
        { pt: "Eu tive uma ideia.", en: "I had an idea. (irregular)" },
        { pt: "Elas chegaram tarde.", en: "They arrived late." },
        { pt: "Tu bebeste o quê?", en: "You drank what?" },
      ]
    },
    {
      id: 6,
      title: "Pretérito Imperfeito (Imperfect Past)",
      level: "A2",
      summary: "Used for past habits, ongoing states, and background descriptions.",
      explanation: "Unlike the Pretérito Perfeito which describes completed events, the Imperfeito describes what used to happen regularly or what was happening as a background. Think of it as 'I used to...' or 'I was ...ing'. It is mostly regular and easier than the Perfeito.",
      examples: [
        { pt: "Quando era criança, brincava muito.", en: "When I was a child, I used to play a lot." },
        { pt: "Ela trabalhava num banco.", en: "She used to work in a bank." },
        { pt: "Eu lia todos os dias.", en: "I used to read every day." },
        { pt: "Eles moravam em Porto.", en: "They used to live in Porto." },
        { pt: "Chovia muito naquele inverno.", en: "It rained a lot that winter." },
        { pt: "Tu sempre chegavas atrasado.", en: "You always arrived late." },
      ]
    },
    {
      id: 7,
      title: "Futuro (Future Tense)",
      level: "B1",
      summary: "Used to talk about what will happen. Formed by adding endings to the full infinitive.",
      explanation: "The future tense in Portuguese is formed by taking the infinitive and adding: -ei, -ás, -á, -emos, -eis, -ão. A few verbs (fazer, dizer, trazer) have irregular stems. In spoken language, the construction 'ir + infinitive' is often preferred instead.",
      examples: [
        { pt: "Eu falarei com ele amanhã.", en: "I will speak with him tomorrow." },
        { pt: "Ela viajará para o Brasil.", en: "She will travel to Brazil." },
        { pt: "Nós comeremos juntos.", en: "We will eat together." },
        { pt: "Eu farei o trabalho. (irregular)", en: "I will do the work." },
        { pt: "Eles virão mais tarde.", en: "They will come later." },
        { pt: "Tu terás tempo.", en: "You will have time." },
      ]
    },
    {
      id: 8,
      title: "Ir + Infinitive (Near Future)",
      level: "A2",
      summary: "The most common way to express the future in spoken Portuguese.",
      explanation: "Just like English 'going to', Portuguese uses the verb 'ir' (to go) conjugated in the present, followed by the infinitive of the main verb. This structure is used far more commonly in everyday speech than the formal future tense.",
      examples: [
        { pt: "Eu vou estudar hoje.", en: "I am going to study today." },
        { pt: "Ela vai cozinhar jantar.", en: "She is going to cook dinner." },
        { pt: "Nós vamos viajar amanhã.", en: "We are going to travel tomorrow." },
        { pt: "Tu vais falar com ele?", en: "Are you going to talk to him?" },
        { pt: "Eles vão chegar tarde.", en: "They are going to arrive late." },
        { pt: "O que vais fazer?", en: "What are you going to do?" },
      ]
    },
    {
      id: 9,
      title: "Conjuntivo (Subjunctive Mood)",
      level: "B2",
      summary: "Expresses doubt, desire, emotion, or hypothetical situations.",
      explanation: "The subjunctive is triggered by certain expressions and conjunctions: esperar que, querer que, é importante que, embora, para que, se (in hypotheticals). It has its own set of endings based on the opposite vowel pattern of the indicative: -ar verbs take -e endings, -er/-ir verbs take -a endings.",
      examples: [
        { pt: "Espero que ele venha.", en: "I hope that he comes." },
        { pt: "É importante que tu estudes.", en: "It is important that you study." },
        { pt: "Quero que ela fique.", en: "I want her to stay." },
        { pt: "Embora seja difícil, vou tentar.", en: "Although it is difficult, I will try." },
        { pt: "Para que possas aprender, pratica.", en: "So that you can learn, practise." },
        { pt: "Duvido que ele saiba.", en: "I doubt that he knows." },
      ]
    },
    {
      id: 10,
      title: "Condicional (Conditional Tense)",
      level: "B1",
      summary: "Used for hypothetical situations — equivalent to 'would' in English.",
      explanation: "The conditional is formed just like the future: add endings to the full infinitive. But the endings are different: -ia, -ias, -ia, -íamos, -íeis, -iam. It expresses what would happen under certain conditions and is often paired with 'se' (if) clauses.",
      examples: [
        { pt: "Eu compraria a casa se tivesse dinheiro.", en: "I would buy the house if I had money." },
        { pt: "Ela viajaria mais.", en: "She would travel more." },
        { pt: "Nós iríamos contigo.", en: "We would go with you." },
        { pt: "Tu gostarias disto.", en: "You would like this." },
        { pt: "Seria ótimo!", en: "It would be great!" },
        { pt: "O que farias nessa situação?", en: "What would you do in that situation?" },
      ]
    },
    {
      id: 11,
      title: "Noun Gender & Agreement",
      level: "A1",
      summary: "All Portuguese nouns are masculine or feminine, and adjectives must match.",
      explanation: "Gender is a grammatical feature — not always logical. Generally nouns ending in -o are masculine and -a are feminine, but there are exceptions. Adjectives must agree in gender AND number with the noun they describe. Many adjectives simply swap -o for -a for the feminine form.",
      examples: [
        { pt: "o livro bonito", en: "the beautiful book (masculine)" },
        { pt: "a flor bonita", en: "the beautiful flower (feminine)" },
        { pt: "um homem alto", en: "a tall man" },
        { pt: "uma mulher alta", en: "a tall woman" },
        { pt: "os carros novos", en: "the new cars (masculine plural)" },
        { pt: "as casas novas", en: "the new houses (feminine plural)" },
      ]
    },
    {
      id: 12,
      title: "Personal Pronouns",
      level: "A1",
      summary: "Subject pronouns tell you who is performing the action.",
      explanation: "Portuguese has six persons: eu (I), tu (you informal), ele/ela/você (he/she/you formal), nós (we), vós (you all — rare/formal), eles/elas/vocês (they/you all). In practice, subject pronouns are often dropped because the verb ending already tells you the person.",
      examples: [
        { pt: "Eu falo português.", en: "I speak Portuguese." },
        { pt: "Tu falas muito!", en: "You talk a lot!" },
        { pt: "Ele gosta de música.", en: "He likes music." },
        { pt: "Nós somos amigos.", en: "We are friends." },
        { pt: "Elas trabalham juntas.", en: "They work together. (feminine)" },
        { pt: "Falo português. (pronoun dropped)", en: "I speak Portuguese." },
      ]
    },
    {
      id: 13,
      title: "Contractions with Prepositions",
      level: "A2",
      summary: "Prepositions contract with articles and pronouns in mandatory combinations.",
      explanation: "Several prepositions must contract when followed by an article or certain pronouns. The most important: de + o = do, de + a = da, em + o = no, em + a = na, a + o = ao, a + a = à. These contractions are not optional — they are required in standard Portuguese.",
      examples: [
        { pt: "Venho do Brasil.", en: "I come from Brazil. (de + o)" },
        { pt: "Ela é da França.", en: "She is from France. (de + a)" },
        { pt: "Estou no quarto.", en: "I am in the room. (em + o)" },
        { pt: "Vamos à praia.", en: "We are going to the beach. (a + a)" },
        { pt: "Falo do problema.", en: "I am speaking about the problem." },
        { pt: "Ele mora na cidade.", en: "He lives in the city. (em + a)" },
      ]
    },
    {
      id: 14,
      title: "Object Pronouns",
      level: "B1",
      summary: "Pronouns that replace the object of a sentence to avoid repetition.",
      explanation: "Direct object pronouns (me, te, o/a, nos, vos, os/as) replace the noun receiving the action. In European Portuguese they are typically placed after the verb with a hyphen. In Brazilian Portuguese they usually come before. Indirect object pronouns (me, te, lhe, nos, vos, lhes) indicate to whom the action is directed.",
      examples: [
        { pt: "Eu vi-o ontem.", en: "I saw him yesterday. (European)" },
        { pt: "Eu o vi ontem.", en: "I saw him yesterday. (Brazilian)" },
        { pt: "Ela deu-me um livro.", en: "She gave me a book." },
        { pt: "Ele ajudou-nos.", en: "He helped us." },
        { pt: "Compra-a para mim.", en: "Buy it (fem.) for me." },
        { pt: "Vou dizer-lhe a verdade.", en: "I am going to tell him/her the truth." },
      ]
    },
    {
      id: 15,
      title: "Reflexive Verbs",
      level: "A2",
      summary: "Verbs where the subject performs the action on themselves.",
      explanation: "Reflexive verbs use reflexive pronouns: me, te, se, nos, vos, se. They are used when the subject and object are the same person. Many daily routine verbs are reflexive in Portuguese: chamar-se (to be called), levantar-se (to get up), lembrar-se (to remember).",
      examples: [
        { pt: "Eu chamo-me Ana.", en: "My name is Ana. (I call myself Ana)" },
        { pt: "Ele levanta-se cedo.", en: "He gets up early." },
        { pt: "Nós vestimo-nos rapidamente.", en: "We get dressed quickly." },
        { pt: "Ela lembra-se de ti.", en: "She remembers you." },
        { pt: "Eles sentam-se aqui.", en: "They sit down here." },
        { pt: "Tu deitas-te tarde?", en: "Do you go to bed late?" },
      ]
    },
    {
      id: 16,
      title: "Comparative & Superlative",
      level: "B1",
      summary: "Used to compare two things or express the highest/lowest degree of a quality.",
      explanation: "To compare, use 'mais ... do que' (more ... than) or 'menos ... do que' (less ... than). For equality use 'tão ... como' (as ... as). The superlative uses 'o/a mais' (the most) or 'o/a menos' (the least). A few adjectives have irregular comparatives: bom → melhor, mau → pior, grande → maior.",
      examples: [
        { pt: "Ela é mais alta do que ele.", en: "She is taller than him." },
        { pt: "Este livro é menos interessante.", en: "This book is less interesting." },
        { pt: "Sou tão rápido como tu.", en: "I am as fast as you." },
        { pt: "É o melhor restaurante da cidade.", en: "It is the best restaurant in the city." },
        { pt: "Esta é a solução mais simples.", en: "This is the simplest solution." },
        { pt: "O inverno é pior do que o outono.", en: "Winter is worse than autumn." },
      ]
    },
    {
      id: 17,
      title: "Imperativo (Imperative / Commands)",
      level: "B1",
      summary: "Used to give orders, instructions, requests, or advice.",
      explanation: "The imperative has affirmative and negative forms. For affirmative commands to 'tu', use the third person singular of the present indicative. For negative commands and all commands with 'você', use the present subjunctive forms. Reflexive pronouns attach after affirmative imperatives.",
      examples: [
        { pt: "Fala mais devagar!", en: "Speak more slowly! (tu)" },
        { pt: "Come a sopa.", en: "Eat the soup. (tu)" },
        { pt: "Não fales assim!", en: "Don't speak like that! (negative tu)" },
        { pt: "Fale mais alto, por favor.", en: "Please speak louder. (você)" },
        { pt: "Senta-te aqui.", en: "Sit down here. (reflexive)" },
        { pt: "Não se preocupe.", en: "Don't worry. (você)" },
      ]
    },
    {
      id: 18,
      title: "Prepositions of Place",
      level: "A1",
      summary: "Words that describe where something or someone is located.",
      explanation: "The most common prepositions of place are: em (in/at/on), sobre (on top of/about), debaixo de (under), ao lado de (next to), atrás de (behind), à frente de (in front of), entre (between), perto de (near), longe de (far from). Remember that 'em' contracts with articles.",
      examples: [
        { pt: "O gato está debaixo da mesa.", en: "The cat is under the table." },
        { pt: "O livro está sobre a cadeira.", en: "The book is on the chair." },
        { pt: "Ela mora perto da escola.", en: "She lives near the school." },
        { pt: "O banco fica ao lado do correio.", en: "The bank is next to the post office." },
        { pt: "Estou entre dois amigos.", en: "I am between two friends." },
        { pt: "A chave está atrás da porta.", en: "The key is behind the door." },
      ]
    },
    {
      id: 19,
      title: "Negation",
      level: "A1",
      summary: "How to make sentences negative in Portuguese.",
      explanation: "The most common way to negate a sentence is to place 'não' directly before the verb. Portuguese also uses double negation naturally: 'não ... nunca' (never), 'não ... nada' (nothing), 'não ... ninguém' (nobody), 'não ... nenhum' (none). Unlike English, double negation is grammatically correct.",
      examples: [
        { pt: "Eu não falo inglês.", en: "I don't speak English." },
        { pt: "Não tenho tempo.", en: "I don't have time." },
        { pt: "Ele não come carne nunca.", en: "He never eats meat. (double negation)" },
        { pt: "Não vi ninguém.", en: "I didn't see anyone." },
        { pt: "Não tenho nada para dizer.", en: "I have nothing to say." },
        { pt: "Não gosto nada disto.", en: "I don't like this at all." },
      ]
    },
    {
      id: 20,
      title: "Relative Clauses with 'que'",
      level: "B1",
      summary: "Connecting two ideas using 'que' — equivalent to 'that', 'which', or 'who' in English.",
      explanation: "'Que' is the most versatile relative pronoun in Portuguese. It can refer to people or things, subjects or objects. It is never omitted, unlike in English where 'that' can be dropped. For preposition + relative pronoun combinations, 'que' is replaced by 'quem' (for people) or 'o qual/a qual' (for things) after a preposition.",
      examples: [
        { pt: "O livro que comprei é bom.", en: "The book that I bought is good." },
        { pt: "A pessoa que telefonou é minha amiga.", en: "The person who called is my friend." },
        { pt: "Isto é o que quero.", en: "This is what I want." },
        { pt: "O filme que vimos foi incrível.", en: "The film we watched was incredible." },
        { pt: "A casa que ele comprou é grande.", en: "The house he bought is big." },
        { pt: "O professor de quem falo é simpático.", en: "The teacher I'm talking about is nice." },
      ]
    }
  ];
  