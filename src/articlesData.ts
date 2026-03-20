export interface ArticleParagraph {
    pt: string;
    en: string;
  }
  
  export interface Article {
    id: number;
    title: string;
    titleEn: string;
    topic: string;
    emoji: string;
    level: "A2" | "B1" | "B2";
    intro: string;
    paragraphs: ArticleParagraph[];
  }
  
  export const ARTICLES: Article[] = [
    {
      id: 1,
      title: "O Carnaval do Rio de Janeiro",
      titleEn: "The Rio de Janeiro Carnival",
      topic: "Cultura Brasileira",
      emoji: "🎭",
      level: "B1",
      intro: "O maior espetáculo da Terra acontece todos os anos no Brasil.",
      paragraphs: [
        {
          pt: "O Carnaval do Rio de Janeiro é considerado o maior e mais famoso carnaval do mundo. Todos os anos, milhões de pessoas de todos os cantos do planeta viajam ao Brasil para participar desta festa extraordinária. As ruas da cidade se transformam num mar de cores, músicas e alegria durante quatro dias de celebração intensa. O evento acontece sempre nos dias que antecedem a Quarta-Feira de Cinzas, o início da Quaresma no calendário cristão.",
          en: "The Rio de Janeiro Carnival is considered the largest and most famous carnival in the world. Every year, millions of people from all corners of the globe travel to Brazil to take part in this extraordinary celebration. The city's streets transform into a sea of colours, music and joy during four days of intense celebration. The event always takes place in the days leading up to Ash Wednesday, the beginning of Lent in the Christian calendar."
        },
        {
          pt: "O coração do Carnaval carioca é o Sambódromo, uma passarela especial construída para as desfiles das escolas de samba. Cada escola passa meses preparando o seu desfile, que inclui fantasias elaboradas, carros alegóricos gigantes e centenas de sambistas dançando ao ritmo do samba-enredo. O tema de cada desfile conta uma história — pode ser sobre a história do Brasil, uma homenagem a um artista famoso, ou uma crítica social apresentada de forma artística.",
          en: "The heart of Rio's Carnival is the Sambadrome, a special avenue built for the samba school parades. Each school spends months preparing its parade, which includes elaborate costumes, giant floats and hundreds of samba dancers moving to the rhythm of the samba-enredo. The theme of each parade tells a story — it can be about Brazilian history, a tribute to a famous artist, or a social critique presented in an artistic way."
        },
        {
          pt: "Além dos desfiles oficiais, o Carnaval também acontece nas ruas da cidade através dos blocos de rua. Existem centenas de blocos espalhados por todos os bairros do Rio, cada um com o seu próprio estilo musical e personalidade. Alguns blocos têm nomes engraçados e temáticas irreverentes, outros focam em géneros musicais específicos como o samba, o frevo ou o axé. Qualquer pessoa pode participar — é só aparecer e dançar.",
          en: "Beyond the official parades, Carnival also takes place in the city's streets through the street blocos. There are hundreds of blocos spread across all of Rio's neighbourhoods, each with its own musical style and personality. Some blocos have funny names and irreverent themes, others focus on specific musical genres like samba, frevo or axé. Anyone can take part — just show up and dance."
        },
        {
          pt: "A rainha do Carnaval é uma figura central na cultura da festa. Ela é escolhida com meses de antecedência e representa o glamour e a beleza do evento. A rainha aparece no carro de abertura do desfile da sua escola, saudando o público com movimentos graciosos e uma fantasia deslumbrante. Ser rainha do Carnaval é um dos maiores títulos que uma mulher pode receber no mundo do samba.",
          en: "The Carnival queen is a central figure in the culture of the celebration. She is chosen months in advance and represents the glamour and beauty of the event. The queen appears on the opening float of her school's parade, greeting the audience with graceful movements and a stunning costume. Being Carnival queen is one of the greatest titles a woman can receive in the world of samba."
        },
        {
          pt: "Mas o Carnaval é muito mais do que uma festa. Para muitos brasileiros, é uma forma de expressão cultural e política, uma oportunidade de falar sobre problemas sociais através da arte e da música. Os compositores dos sambas-enredo passam o ano inteiro escrevendo as letras e as melodias que vão emocionar o público. Cada palavra é escolhida com cuidado, cada nota musical é pensada para criar emoção. O Carnaval é a alma do Brasil exposta ao mundo inteiro.",
          en: "But Carnival is much more than a party. For many Brazilians, it is a form of cultural and political expression, an opportunity to speak about social problems through art and music. The composers of the samba-enredo spend the entire year writing the lyrics and melodies that will move the audience. Each word is chosen with care, each musical note is crafted to create emotion. Carnival is the soul of Brazil exposed to the entire world."
        },
      ]
    },
    {
      id: 2,
      title: "A Cozinha Brasileira",
      titleEn: "Brazilian Cuisine",
      topic: "Comida & Gastronomia",
      emoji: "🍽️",
      level: "A2",
      intro: "Uma viagem pelos sabores mais autênticos do Brasil.",
      paragraphs: [
        {
          pt: "A culinária brasileira é um reflexo da história do país — uma mistura rica e complexa de influências indígenas, africanas, portuguesas e de imigrantes europeus e asiáticos. Cada região do Brasil tem os seus próprios pratos típicos, ingredientes característicos e tradições gastronómicas únicas. Conhecer a comida brasileira é uma forma de entender a alma do povo que a criou ao longo de séculos.",
          en: "Brazilian cuisine is a reflection of the country's history — a rich and complex blend of indigenous, African, Portuguese and European and Asian immigrant influences. Each region of Brazil has its own typical dishes, characteristic ingredients and unique gastronomic traditions. Getting to know Brazilian food is a way of understanding the soul of the people who created it over centuries."
        },
        {
          pt: "A feijoada é considerada o prato nacional do Brasil. É um cozido de feijão preto com diversas carnes de porco — incluindo orelha, rabo, pé e linguiça — servido com arroz branco, couve refogada, laranja e farinha de mandioca. A feijoada tem origens humildes, pois era preparada pelos escravos africanos com os cortes de carne que os senhores não queriam. Hoje é servida nos melhores restaurantes do país e adorada por todos os brasileiros.",
          en: "Feijoada is considered Brazil's national dish. It is a black bean stew with various pork cuts — including ear, tail, trotter and sausage — served with white rice, sautéed kale, orange and manioc flour. Feijoada has humble origins, as it was prepared by African slaves using the cuts of meat that their masters did not want. Today it is served in the best restaurants in the country and loved by all Brazilians."
        },
        {
          pt: "O acarajé é um bolinho típico da Bahia, feito de massa de feijão-fradinho frito no azeite de dendê — o óleo de palma que dá à cozinha baiana o seu sabor e cor característicos. É recheado com vatapá, caruru, camarão seco e pimenta. Na Bahia, o acarajé é vendido nas ruas pelas baianas, mulheres vestidas com trajes brancos tradicionais. Em 2005, o modo de fazer e vender acarajé foi reconhecido como Património Cultural Imaterial do Brasil.",
          en: "Acarajé is a typical snack from Bahia, made from black-eyed pea batter fried in dendê oil — the palm oil that gives Bahian cuisine its characteristic flavour and colour. It is filled with vatapá, caruru, dried shrimp and chilli pepper. In Bahia, acarajé is sold on the streets by baianas, women dressed in traditional white garments. In 2005, the way of making and selling acarajé was recognised as Intangible Cultural Heritage of Brazil."
        },
        {
          pt: "O churrasco brasileiro é famoso no mundo inteiro. Diferente do churrasco de outros países, o churrasco brasileiro usa grandes espetos de metal onde as carnes são assadas lentamente sobre brasa. Os cortes mais populares incluem a picanha — considerada a rainha do churrasco —, o fraldinha, a maminha e as linguiças. No sul do Brasil, especialmente no Rio Grande do Sul, o churrasco é uma tradição cultural profunda, quase um ritual social que reúne famílias e amigos.",
          en: "Brazilian churrasco is famous around the world. Unlike barbecue in other countries, Brazilian churrasco uses large metal skewers on which meats are slowly grilled over charcoal. The most popular cuts include picanha — considered the queen of the barbecue —, fraldinha, maminha and sausages. In southern Brazil, especially in Rio Grande do Sul, churrasco is a deep cultural tradition, almost a social ritual that brings together families and friends."
        },
        {
          pt: "Para além dos pratos principais, o Brasil tem uma cultura de snacks de rua extraordinária. O coxinha — uma massa de frango desfiado em forma de coxa de galinha, empanado e frito — é um dos snacks mais amados do país. O pão de queijo, feito com polvilho e queijo minas, é consumido a todas as horas do dia. E o açaí, a fruta da Amazónia servida em tigela com granola e banana, tornou-se um fenómeno global. A cozinha brasileira é uma viagem de sabores que nunca termina.",
          en: "Beyond the main dishes, Brazil has an extraordinary street snack culture. Coxinha — a shredded chicken dough shaped like a chicken thigh, breaded and fried — is one of the country's most beloved snacks. Pão de queijo, made with cassava starch and minas cheese, is consumed at all hours of the day. And açaí, the Amazonian fruit served in a bowl with granola and banana, has become a global phenomenon. Brazilian cuisine is a journey of flavours that never ends."
        },
      ]
    },
    {
      id: 3,
      title: "O Futebol e a Alma do Brasil",
      titleEn: "Football and the Soul of Brazil",
      topic: "Futebol & Desporto",
      emoji: "⚽",
      level: "B1",
      intro: "No Brasil, o futebol não é apenas um desporto — é uma religião.",
      paragraphs: [
        {
          pt: "Dizer que o futebol é importante para o Brasil é um eufemismo. O futebol é parte da identidade nacional, está presente na linguagem, na cultura, nas conversas do dia a dia e nos sonhos de milhões de crianças que crescem chutando bolas nas ruas e praias do país. O Brasil é a única nação do mundo que participou em todas as edições da Copa do Mundo FIFA — e ganhou o torneio cinco vezes, mais do que qualquer outro país.",
          en: "To say that football is important to Brazil is an understatement. Football is part of the national identity, present in the language, culture, daily conversations and dreams of millions of children who grow up kicking balls on the country's streets and beaches. Brazil is the only nation in the world to have participated in every edition of the FIFA World Cup — and has won the tournament five times, more than any other country."
        },
        {
          pt: "A história do futebol brasileiro está ligada a nomes lendários. Pelé, considerado por muitos o maior jogador de todos os tempos, marcou 1281 gols em toda a sua carreira e ganhou três Copas do Mundo com a Seleção Brasileira. Garrincha, o craque das pernas tortas, encantava os adversários com dribles impossíveis. Ronaldo, Ronaldinho Gaúcho, Zico, Romário — o Brasil produziu uma lista interminável de génios do futebol que deixaram o mundo de boca aberta.",
          en: "The history of Brazilian football is tied to legendary names. Pelé, considered by many the greatest player of all time, scored 1,281 goals throughout his career and won three World Cups with the Brazilian national team. Garrincha, the maestro with crooked legs, enchanted opponents with impossible dribbles. Ronaldo, Ronaldinho Gaúcho, Zico, Romário — Brazil has produced an endless list of football geniuses who left the world speechless."
        },
        {
          pt: "O Maracanã, no Rio de Janeiro, é um dos estádios mais icónicos do mundo. Foi construído para a Copa do Mundo de 1950 e chegou a ter capacidade para mais de 200.000 pessoas — o maior estádio do mundo à época. O Maracanã foi palco de momentos históricos: o gol de Pelé ao Fluminense, o último jogo de Zico pelo Flamengo, a final da Copa de 2014. Para os brasileiros, entrar no Maracanã é como entrar numa catedral.",
          en: "The Maracanã, in Rio de Janeiro, is one of the most iconic stadiums in the world. It was built for the 1950 World Cup and once had capacity for over 200,000 people — the largest stadium in the world at the time. The Maracanã has been the stage for historic moments: Pelé's goal against Fluminense, Zico's last game for Flamengo, the 2014 World Cup final. For Brazilians, entering the Maracanã is like entering a cathedral."
        },
        {
          pt: "O futebol brasileiro tem um estilo próprio que o distingue do resto do mundo. Chamado de 'jogo bonito', é caracterizado pela criatividade, a improvisação, o drible, o toque suave na bola e a alegria com que os jogadores atuam. Este estilo nasceu nas praias e ruas do Brasil, onde as crianças aprendem a jogar em espaços pequenos, desenvolvendo habilidade técnica e raciocínio rápido. O futsal — futebol de salão — também foi fundamental na formação de muitos craques brasileiros.",
          en: "Brazilian football has its own style that distinguishes it from the rest of the world. Called 'the beautiful game', it is characterised by creativity, improvisation, dribbling, a soft touch on the ball and the joy with which the players perform. This style was born on the beaches and streets of Brazil, where children learn to play in small spaces, developing technical skill and quick thinking. Futsal — indoor football — was also fundamental in the formation of many Brazilian stars."
        },
        {
          pt: "Mas o futebol no Brasil também tem os seus momentos de dor. O 'Maracanazo' de 1950, quando o Uruguai derrotou o Brasil por 2-1 na final da Copa do Mundo diante de 200.000 torcedores no Maracanã, ainda é lembrado como uma das maiores tragédias esportivas da história. E o '7 a 1', a goleada sofrida pela Alemanha na semifinal da Copa de 2014, em casa, deixou o país em estado de choque. Mas é exatamente por esses altos e baixos que o futebol brasileiro é tão apaixonante.",
          en: "But football in Brazil also has its moments of pain. The 'Maracanazo' of 1950, when Uruguay defeated Brazil 2-1 in the World Cup final in front of 200,000 fans at the Maracanã, is still remembered as one of the greatest sporting tragedies in history. And the '7-1', the thrashing by Germany in the semi-final of the 2014 World Cup on home soil, left the country in a state of shock. But it is precisely because of these highs and lows that Brazilian football is so passionate."
        },
      ]
    },
    {
      id: 4,
      title: "A Floresta Amazónica",
      titleEn: "The Amazon Rainforest",
      topic: "Natureza & Amazónia",
      emoji: "🌿",
      level: "B2",
      intro: "O pulmão do planeta e o maior tesouro natural do Brasil.",
      paragraphs: [
        {
          pt: "A Floresta Amazónica é o maior ecossistema tropical do mundo. Com uma área de aproximadamente 5,5 milhões de quilómetros quadrados, a Amazónia cobre cerca de 60% do território brasileiro e se estende por outros oito países da América do Sul. A floresta abriga cerca de 10% de todas as espécies de vida na Terra, muitas das quais ainda não foram descobertas pela ciência. Cada ano que passa, os investigadores identificam novas plantas, insetos, aves e mamíferos que habitam este ecossistema extraordinário.",
          en: "The Amazon Rainforest is the world's largest tropical ecosystem. With an area of approximately 5.5 million square kilometres, the Amazon covers around 60% of Brazilian territory and extends across eight other South American countries. The forest is home to around 10% of all species of life on Earth, many of which have not yet been discovered by science. Each passing year, researchers identify new plants, insects, birds and mammals that inhabit this extraordinary ecosystem."
        },
        {
          pt: "O Rio Amazonas, que atravessa a floresta, é o maior rio do mundo em volume de água. Ele nasce nos Andes peruanos e percorre mais de 6.400 quilómetros antes de desaguar no Oceano Atlântico, no norte do Brasil. A descarga de água do Rio Amazonas no oceano é tão grande que altera a salinidade do mar numa área de centenas de quilómetros. Durante a época das chuvas, o rio pode subir até 15 metros, inundando milhões de hectares de floresta e criando o que os brasileiros chamam de 'várzea' — a floresta alagada.",
          en: "The Amazon River, which flows through the forest, is the world's largest river by volume of water. It rises in the Peruvian Andes and travels more than 6,400 kilometres before emptying into the Atlantic Ocean in northern Brazil. The Amazon River's discharge of water into the ocean is so great that it alters the salinity of the sea over an area of hundreds of kilometres. During the rainy season, the river can rise up to 15 metres, flooding millions of hectares of forest and creating what Brazilians call 'várzea' — the flooded forest."
        },
        {
          pt: "A biodiversidade da Amazónia é de tirar o fôlego. A floresta abriga mais de 40.000 espécies de plantas, 1.300 espécies de aves, 3.000 espécies de peixes de água doce e 430 espécies de mamíferos. Entre os animais mais emblemáticos estão a onça-pintada — o maior felino das Américas —, o boto-cor-de-rosa, o jacaré-açu, o tamanduá-bandeira e centenas de espécies de primatas. A riqueza da vida selvagem amazónica não tem paralelo em nenhum outro lugar do planeta.",
          en: "The biodiversity of the Amazon is breathtaking. The forest is home to more than 40,000 plant species, 1,300 bird species, 3,000 freshwater fish species and 430 mammal species. Among the most emblematic animals are the jaguar — the largest feline in the Americas —, the pink river dolphin, the black caiman, the giant anteater and hundreds of primate species. The richness of Amazonian wildlife has no parallel anywhere else on the planet."
        },
        {
          pt: "Os povos indígenas que habitam a Amazónia há milénios têm um conhecimento profundo da floresta. Existem mais de 400 grupos étnicos indígenas no Brasil, muitos dos quais vivem na Amazónia. Estes povos desenvolveram ao longo de gerações um entendimento sofisticado das plantas medicinais, dos ciclos naturais e dos sistemas ecológicos da floresta. Muitos medicamentos modernos foram desenvolvidos a partir do conhecimento indígena sobre plantas amazónicas. Proteger os direitos destes povos é inseparável de proteger a própria floresta.",
          en: "The indigenous peoples who have inhabited the Amazon for millennia have a deep knowledge of the forest. There are more than 400 indigenous ethnic groups in Brazil, many of which live in the Amazon. These peoples have developed over generations a sophisticated understanding of medicinal plants, natural cycles and the forest's ecological systems. Many modern medicines were developed from indigenous knowledge of Amazonian plants. Protecting the rights of these peoples is inseparable from protecting the forest itself."
        },
        {
          pt: "A Amazónia enfrenta hoje uma ameaça sem precedentes: o desmatamento. Nos últimos 50 anos, cerca de 17% da floresta já foi destruída, principalmente para dar lugar à pecuária e à agricultura intensiva. Os cientistas alertam que se a destruição continuar ao ritmo atual, a floresta pode atingir um 'ponto de não retorno' a partir do qual não se consegue recuperar naturalmente. A proteção da Amazónia não é apenas uma questão brasileira — é uma responsabilidade global, pois a floresta regula o clima, absorve carbono e produz o oxigênio que todos respiramos.",
          en: "The Amazon faces an unprecedented threat today: deforestation. In the last 50 years, around 17% of the forest has already been destroyed, mainly to make way for livestock farming and intensive agriculture. Scientists warn that if destruction continues at the current rate, the forest may reach a 'point of no return' from which it cannot naturally recover. Protecting the Amazon is not just a Brazilian issue — it is a global responsibility, as the forest regulates the climate, absorbs carbon and produces the oxygen that we all breathe."
        },
      ]
    }
  ];
  