export interface Expression {
    pt: string;
    en: string;
    example: string;
    exampleEn: string;
  }
  
  export interface ExpressionCategory {
    id: number;
    title: string;
    emoji: string;
    color: string;
    description: string;
    expressions: Expression[];
  }
  
  export const EXPRESSION_CATEGORIES: ExpressionCategory[] = [
    {
      id: 1, title: "Cumprimentos", emoji: "👋", color: "#e63946",
      description: "How to greet people in Brazil",
      expressions: [
        { pt: "Oi!", en: "Hi!", example: "Oi! Tudo bem com você?", exampleEn: "Hi! Are you doing well?" },
        { pt: "Olá!", en: "Hello!", example: "Olá! Prazer em conhecê-lo.", exampleEn: "Hello! Nice to meet you." },
        { pt: "Bom dia!", en: "Good morning!", example: "Bom dia! Como você está?", exampleEn: "Good morning! How are you?" },
        { pt: "Boa tarde!", en: "Good afternoon!", example: "Boa tarde! Que calor hoje, não é?", exampleEn: "Good afternoon! It's hot today, isn't it?" },
        { pt: "Boa noite!", en: "Good evening!", example: "Boa noite a todos!", exampleEn: "Good evening everyone!" },
        { pt: "Tudo bem?", en: "How are you?", example: "Oi, tudo bem? Faz tempo que não te vejo!", exampleEn: "Hi, how are you? Haven't seen you in a while!" },
        { pt: "Tudo bom!", en: "Everything's good!", example: "Tudo bom, obrigado. E você?", exampleEn: "Everything's good, thanks. And you?" },
        { pt: "Que saudade!", en: "I've missed you!", example: "Que saudade! Faz meses que não nos vemos.", exampleEn: "I've missed you! It's been months since we last saw each other." },
        { pt: "Prazer!", en: "Pleased to meet you!", example: "Eu me chamo Marco. Prazer!", exampleEn: "My name is Marco. Pleased to meet you!" },
        { pt: "Seja bem-vindo!", en: "Welcome!", example: "Seja bem-vindo ao Brasil! Aproveite muito.", exampleEn: "Welcome to Brazil! Enjoy it to the fullest." },
      ]
    },
    {
      id: 2, title: "Despedidas", emoji: "🤝", color: "#f4a261",
      description: "How to say goodbye in Brazil",
      expressions: [
        { pt: "Tchau!", en: "Bye!", example: "Tchau! Foi um prazer!", exampleEn: "Bye! It was a pleasure!" },
        { pt: "Até logo!", en: "See you soon!", example: "Até logo! Cuida-se.", exampleEn: "See you soon! Take care." },
        { pt: "Até mais!", en: "See you later!", example: "Até mais! Boa sorte no trabalho.", exampleEn: "See you later! Good luck at work." },
        { pt: "Até amanhã!", en: "See you tomorrow!", example: "Até amanhã! Boa noite.", exampleEn: "See you tomorrow! Good night." },
        { pt: "Cuida-se!", en: "Take care!", example: "Cuida-se e manda notícias!", exampleEn: "Take care and keep in touch!" },
        { pt: "Boa sorte!", en: "Good luck!", example: "Boa sorte no exame! Você vai arrasar.", exampleEn: "Good luck on the exam! You're going to crush it." },
        { pt: "Vai com Deus!", en: "Safe travels!", example: "Vai com Deus! Tenha uma boa viagem.", exampleEn: "Safe travels! Have a good trip." },
        { pt: "Saudades de você!", en: "I'll miss you!", example: "Saudades de você já! Volta logo.", exampleEn: "I'll miss you already! Come back soon." },
        { pt: "Um abraço!", en: "A big hug!", example: "Um grande abraço para toda a família!", exampleEn: "A big hug to the whole family!" },
        { pt: "Falou!", en: "Later! / Understood!", example: "Então está combinado. Falou!", exampleEn: "So it's settled. Later!" },
      ]
    },
    {
      id: 3, title: "Agradecimentos", emoji: "🙏", color: "#2a9d8f",
      description: "Saying thank you and sorry in Brazilian Portuguese",
      expressions: [
        { pt: "Obrigado! / Obrigada!", en: "Thank you!", example: "Muito obrigado pela ajuda!", exampleEn: "Thank you very much for the help!" },
        { pt: "De nada!", en: "You're welcome!", example: "Obrigado! — De nada, foi um prazer.", exampleEn: "Thank you! — You're welcome, it was a pleasure." },
        { pt: "Por favor!", en: "Please!", example: "Um café, por favor.", exampleEn: "A coffee, please." },
        { pt: "Com licença!", en: "Excuse me!", example: "Com licença! Posso passar?", exampleEn: "Excuse me! May I get through?" },
        { pt: "Desculpe!", en: "Sorry!", example: "Desculpe o atraso, o trânsito estava terrível.", exampleEn: "Sorry for being late, the traffic was terrible." },
        { pt: "Me desculpa!", en: "Sorry! (casual)", example: "Me desculpa, não foi minha intenção.", exampleEn: "Sorry, that wasn't my intention." },
        { pt: "Que pena!", en: "What a shame!", example: "Que pena que você não pode vir à festa!", exampleEn: "What a shame you can't come to the party!" },
        { pt: "Faz favor!", en: "Excuse me! (for attention)", example: "Faz favor, onde fica o banheiro?", exampleEn: "Excuse me, where is the bathroom?" },
        { pt: "Imagina!", en: "Don't mention it!", example: "Obrigada pela carona! — Imagina, foi um prazer!", exampleEn: "Thanks for the lift! — Don't mention it!" },
        { pt: "Fico feliz!", en: "I'm glad!", example: "Fico feliz que você gostou do presente.", exampleEn: "I'm glad you liked the present." },
      ]
    },
    {
      id: 4, title: "No Restaurante", emoji: "🍽️", color: "#e07b39",
      description: "Essential phrases for eating out in Brazil",
      expressions: [
        { pt: "Uma mesa para dois, por favor.", en: "A table for two, please.", example: "Boa noite! Uma mesa para dois, por favor.", exampleEn: "Good evening! A table for two, please." },
        { pt: "Qual é o prato do dia?", en: "What is the dish of the day?", example: "Com licença, qual é o prato do dia?", exampleEn: "Excuse me, what is the dish of the day?" },
        { pt: "Vou querer...", en: "I'll have...", example: "Vou querer uma feijoada e uma caipirinha.", exampleEn: "I'll have a feijoada and a caipirinha." },
        { pt: "Está delicioso!", en: "It's delicious!", example: "Nossa, está delicioso! Parabéns ao cozinheiro.", exampleEn: "Wow, it's delicious! Compliments to the chef." },
        { pt: "A conta, por favor.", en: "The bill, please.", example: "Pode trazer a conta, por favor?", exampleEn: "Could you bring the bill, please?" },
        { pt: "Está incluído o serviço?", en: "Is service included?", example: "A conta, por favor. Está incluído o serviço?", exampleEn: "The bill, please. Is service included?" },
        { pt: "Pode repetir o pedido?", en: "Can you repeat the order?", example: "Desculpe, pode repetir o pedido?", exampleEn: "Sorry, can you repeat the order?" },
        { pt: "Sou alérgico a...", en: "I'm allergic to...", example: "Sou alérgico a amendoim. Tem esse ingrediente?", exampleEn: "I'm allergic to peanuts. Does this contain that ingredient?" },
        { pt: "Sem açúcar, por favor.", en: "Without sugar, please.", example: "Um café sem açúcar, por favor.", exampleEn: "A coffee without sugar, please." },
        { pt: "Muito bom! Recomendo.", en: "Very good! I recommend it.", example: "Esse restaurante é muito bom! Recomendo a todos.", exampleEn: "This restaurant is very good! I recommend it to everyone." },
      ]
    },
    {
      id: 5, title: "Pedindo Ajuda", emoji: "🆘", color: "#9c4fd6",
      description: "Asking for help and directions in Brazil",
      expressions: [
        { pt: "Pode me ajudar?", en: "Can you help me?", example: "Com licença, pode me ajudar? Estou perdido.", exampleEn: "Excuse me, can you help me? I'm lost." },
        { pt: "Onde fica...?", en: "Where is...?", example: "Onde fica o metrô mais próximo?", exampleEn: "Where is the nearest metro station?" },
        { pt: "Como chego a...?", en: "How do I get to...?", example: "Como chego ao centro histórico?", exampleEn: "How do I get to the historic centre?" },
        { pt: "É longe daqui?", en: "Is it far from here?", example: "A praia é longe daqui? Posso ir a pé?", exampleEn: "Is the beach far from here? Can I walk?" },
        { pt: "Fala inglês?", en: "Do you speak English?", example: "Com licença, você fala inglês?", exampleEn: "Excuse me, do you speak English?" },
        { pt: "Pode falar mais devagar?", en: "Can you speak more slowly?", example: "Pode falar mais devagar? Estou aprendendo português.", exampleEn: "Can you speak more slowly? I'm learning Portuguese." },
        { pt: "Não entendi.", en: "I didn't understand.", example: "Não entendi. Pode repetir, por favor?", exampleEn: "I didn't understand. Can you repeat that, please?" },
        { pt: "Quanto custa?", en: "How much does it cost?", example: "Quanto custa esse passeio turístico?", exampleEn: "How much does this tourist tour cost?" },
        { pt: "Preciso de ajuda!", en: "I need help!", example: "Preciso de ajuda! Perdi o meu passaporte.", exampleEn: "I need help! I've lost my passport." },
        { pt: "Pode me indicar...?", en: "Can you point me to...?", example: "Pode me indicar um bom restaurante?", exampleEn: "Can you point me to a good restaurant?" },
      ]
    },
    {
      id: 6, title: "Dia a Dia", emoji: "☀️", color: "#14532d",
      description: "Common everyday Brazilian expressions",
      expressions: [
        { pt: "Que legal!", en: "How cool!", example: "Você vai ao Brasil? Que legal!", exampleEn: "You're going to Brazil? How cool!" },
        { pt: "Nossa!", en: "Wow! / Oh my!", example: "Nossa, que calor hoje!", exampleEn: "Wow, it's so hot today!" },
        { pt: "Tá bom!", en: "Ok! / Alright!", example: "Então nos vemos às seis. Tá bom!", exampleEn: "So we'll meet at six. Alright!" },
        { pt: "Com certeza!", en: "Of course!", example: "Você vai ao Carnaval? Com certeza!", exampleEn: "Are you going to Carnival? Of course!" },
        { pt: "Que absurdo!", en: "That's outrageous!", example: "Que absurdo esse preço! Muito caro.", exampleEn: "That price is outrageous! Very expensive." },
        { pt: "Vai dar certo!", en: "It'll work out!", example: "Não se preocupe. Vai dar certo!", exampleEn: "Don't worry. It'll work out!" },
        { pt: "Sem querer.", en: "By accident.", example: "Desculpa, esbarrei em você sem querer.", exampleEn: "Sorry, I bumped into you by accident." },
        { pt: "Por acaso...", en: "By any chance...", example: "Por acaso você sabe onde fica o hotel?", exampleEn: "By any chance, do you know where the hotel is?" },
        { pt: "Pode crer!", en: "You can believe it!", example: "O Brasil é incrível! — Pode crer!", exampleEn: "Brazil is incredible! — You can believe it!" },
        { pt: "Que saudade do Brasil!", en: "I really miss Brazil!", example: "Que saudade do Brasil! Quero voltar logo.", exampleEn: "I really miss Brazil! I want to go back soon." },
      ]
    },
    {
      id: 7, title: "Emoções", emoji: "❤️", color: "#c77dff",
      description: "Expressing feelings and emotions in Brazilian Portuguese",
      expressions: [
        { pt: "Que maravilha!", en: "How wonderful!", example: "Você ganhou o prêmio? Que maravilha!", exampleEn: "You won the prize? How wonderful!" },
        { pt: "Estou animado!", en: "I'm excited!", example: "Estou muito animado para a viagem ao Brasil!", exampleEn: "I'm very excited about the trip to Brazil!" },
        { pt: "Estou com medo.", en: "I'm scared.", example: "Estou com medo de falar português com nativos.", exampleEn: "I'm scared of speaking Portuguese with natives." },
        { pt: "Que surpresa!", en: "What a surprise!", example: "Que surpresa boa te ver aqui!", exampleEn: "What a nice surprise to see you here!" },
        { pt: "Estou orgulhoso.", en: "I'm proud.", example: "Estou muito orgulhoso do meu progresso em português.", exampleEn: "I'm very proud of my progress in Portuguese." },
        { pt: "Que engraçado!", en: "How funny!", example: "Que engraçado! Não consigo parar de rir.", exampleEn: "How funny! I can't stop laughing." },
        { pt: "Adorei!", en: "I loved it!", example: "Adorei a comida brasileira! É incrível.", exampleEn: "I loved the Brazilian food! It's incredible." },
        { pt: "Estou emocionado.", en: "I'm moved / emotional.", example: "Estou emocionado com essa música.", exampleEn: "I'm moved by this music." },
        { pt: "Que alívio!", en: "What a relief!", example: "Encontrei meu passaporte! Que alívio!", exampleEn: "I found my passport! What a relief!" },
        { pt: "Estou com saudade.", en: "I'm missing someone.", example: "Estou com muita saudade da minha família.", exampleEn: "I really miss my family." },
      ]
    },
    {
      id: 8, title: "No Trabalho", emoji: "💼", color: "#2196b5",
      description: "Professional phrases used in Brazilian workplaces",
      expressions: [
        { pt: "Vamos começar a reunião?", en: "Shall we start the meeting?", example: "Bom dia a todos. Vamos começar a reunião?", exampleEn: "Good morning everyone. Shall we start the meeting?" },
        { pt: "Fica à vontade.", en: "Feel free / Make yourself comfortable.", example: "Entre, fica à vontade.", exampleEn: "Come in, make yourself comfortable." },
        { pt: "Vou dar um retorno.", en: "I'll get back to you.", example: "Deixa eu verificar e vou te dar um retorno.", exampleEn: "Let me check and I'll get back to you." },
        { pt: "Precisa de mais prazo?", en: "Do you need more time?", example: "Precisa de mais prazo para entregar o relatório?", exampleEn: "Do you need more time to submit the report?" },
        { pt: "Combinado!", en: "Agreed! / It's a deal!", example: "Então nos encontramos sexta-feira. Combinado!", exampleEn: "So we'll meet on Friday. Agreed!" },
        { pt: "Pode deixar comigo.", en: "Leave it to me.", example: "Precisa de ajuda? Pode deixar comigo.", exampleEn: "Do you need help? Leave it to me." },
        { pt: "Vamos nessa!", en: "Let's do it!", example: "Todos prontos? Vamos nessa!", exampleEn: "Everyone ready? Let's do it!" },
        { pt: "Em dia!", en: "Up to date!", example: "Todos os projetos estão em dia.", exampleEn: "All projects are up to date." },
        { pt: "Força!", en: "You can do it!", example: "O projeto está difícil mas força, você consegue!", exampleEn: "The project is tough but keep going, you can do it!" },
        { pt: "Parabéns pelo trabalho!", en: "Well done on the work!", example: "Parabéns pelo trabalho! Ficou excelente.", exampleEn: "Well done on the work! It turned out excellent." },
      ]
    },
    {
      id: 9, title: "Gírias", emoji: "😎", color: "#06d6a0",
      description: "Popular Brazilian slang you'll hear every day",
      expressions: [
        { pt: "Cara!", en: "Dude! / Man!", example: "Cara, você viu o jogo ontem?", exampleEn: "Dude, did you see the game yesterday?" },
        { pt: "Mano!", en: "Bro! / Mate!", example: "Mano, que situação difícil essa!", exampleEn: "Bro, what a tough situation!" },
        { pt: "Valeu!", en: "Thanks! / Cheers!", example: "Valeu pela ajuda, cara!", exampleEn: "Thanks for the help, mate!" },
        { pt: "Top!", en: "Awesome!", example: "Esse restaurante é top demais!", exampleEn: "This restaurant is absolutely awesome!" },
        { pt: "Massa!", en: "Cool! (Northeastern)", example: "Que massa essa viagem que você fez!", exampleEn: "That trip you took was so cool!" },
        { pt: "Sai fora!", en: "No way! / Get out of here!", example: "Você ganhou na loteria? Sai fora!", exampleEn: "You won the lottery? No way!" },
        { pt: "Que mico!", en: "How embarrassing!", example: "Chamei a professora de mãe. Que mico!", exampleEn: "I called the teacher 'mum'. How embarrassing!" },
        { pt: "Bater um papo.", en: "To have a chat.", example: "Vem cá bater um papo comigo!", exampleEn: "Come here and have a chat with me!" },
        { pt: "Tá ligado?", en: "You know? / Get it?", example: "A vida é curta, tá ligado? Aproveita.", exampleEn: "Life is short, you know? Enjoy it." },
        { pt: "Arrasou!", en: "You nailed it!", example: "Sua apresentação foi incrível. Arrasou!", exampleEn: "Your presentation was incredible. You nailed it!" },
      ]
    },
    {
      id: 10, title: "Tempo e Clima", emoji: "🌤️", color: "#e9c46a",
      description: "Talking about the weather and time in Portuguese",
      expressions: [
        { pt: "Que calor!", en: "It's so hot!", example: "Que calor! Preciso de uma água gelada.", exampleEn: "It's so hot! I need a cold water." },
        { pt: "Está chovendo muito.", en: "It's raining a lot.", example: "Não vou sair, está chovendo muito.", exampleEn: "I'm not going out, it's raining a lot." },
        { pt: "Vai fazer sol?", en: "Is it going to be sunny?", example: "Amanhã vai fazer sol? Quero ir à praia.", exampleEn: "Is it going to be sunny tomorrow? I want to go to the beach." },
        { pt: "Que frio!", en: "It's so cold!", example: "Que frio hoje! Vou buscar um casaco.", exampleEn: "It's so cold today! I'm going to get a jacket." },
        { pt: "Que tempestade!", en: "What a storm!", example: "Que tempestade! Nunca vi tanta chuva.", exampleEn: "What a storm! I've never seen so much rain." },
        { pt: "Já está escurecendo.", en: "It's getting dark.", example: "Já está escurecendo, vamos voltar para casa.", exampleEn: "It's getting dark, let's go back home." },
        { pt: "Que dia lindo!", en: "What a beautiful day!", example: "Que dia lindo! Perfeito para ir à praia.", exampleEn: "What a beautiful day! Perfect for going to the beach." },
        { pt: "Está abafado.", en: "It's muggy / stuffy.", example: "Está muito abafado aqui. Posso abrir a janela?", exampleEn: "It's very muggy here. Can I open the window?" },
        { pt: "Ontem choveu o dia todo.", en: "Yesterday it rained all day.", example: "Ontem choveu o dia todo. Fiquei em casa.", exampleEn: "Yesterday it rained all day. I stayed at home." },
        { pt: "No verão faz muito calor.", en: "In summer it's very hot.", example: "No verão do Brasil faz muito calor, mas é maravilhoso.", exampleEn: "In the Brazilian summer it's very hot, but it's wonderful." },
      ]
    },
  ];
  