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
        { pt: "O Carnaval do Rio de Janeiro é considerado o maior e mais famoso carnaval do mundo. Todos os anos, milhões de pessoas de todos os cantos do planeta viajam ao Brasil para participar desta festa extraordinária. As ruas da cidade se transformam num mar de cores, músicas e alegria durante quatro dias de celebração intensa.", en: "The Rio de Janeiro Carnival is considered the largest and most famous carnival in the world. Every year, millions of people from all corners of the globe travel to Brazil to take part in this extraordinary celebration. The city's streets transform into a sea of colours, music and joy during four days of intense celebration." },
        { pt: "O coração do Carnaval carioca é o Sambódromo, uma passarela especial construída para os desfiles das escolas de samba. Cada escola passa meses preparando o seu desfile, que inclui fantasias elaboradas, carros alegóricos gigantes e centenas de sambistas dançando ao ritmo do samba-enredo.", en: "The heart of Rio's Carnival is the Sambadrome, a special avenue built for the samba school parades. Each school spends months preparing its parade, which includes elaborate costumes, giant floats and hundreds of samba dancers moving to the rhythm of the samba-enredo." },
        { pt: "Além dos desfiles oficiais, o Carnaval também acontece nas ruas da cidade através dos blocos de rua. Existem centenas de blocos espalhados por todos os bairros do Rio, cada um com o seu próprio estilo musical e personalidade. Qualquer pessoa pode participar — é só aparecer e dançar.", en: "Beyond the official parades, Carnival also takes place in the city's streets through the street blocos. There are hundreds of blocos spread across all of Rio's neighbourhoods, each with its own musical style and personality. Anyone can take part — just show up and dance." },
        { pt: "A rainha do Carnaval é uma figura central na cultura da festa, representando o glamour e a beleza do evento. Ser rainha do Carnaval é um dos maiores títulos que uma mulher pode receber no mundo do samba.", en: "The Carnival queen is a central figure in the culture of the celebration, representing the glamour and beauty of the event. Being Carnival queen is one of the greatest titles a woman can receive in the world of samba." },
        { pt: "Mas o Carnaval é muito mais do que uma festa. Para muitos brasileiros, é uma forma de expressão cultural e política. Os compositores dos sambas-enredo passam o ano inteiro escrevendo letras e melodias que emocionam o público. O Carnaval é a alma do Brasil exposta ao mundo inteiro.", en: "But Carnival is much more than a party. For many Brazilians, it is a form of cultural and political expression. The composers of the samba-enredo spend the entire year writing lyrics and melodies that move the audience. Carnival is the soul of Brazil exposed to the entire world." },
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
        { pt: "A culinária brasileira é um reflexo da história do país — uma mistura rica e complexa de influências indígenas, africanas, portuguesas e de imigrantes europeus e asiáticos. Cada região do Brasil tem os seus próprios pratos típicos e tradições gastronómicas únicas.", en: "Brazilian cuisine is a reflection of the country's history — a rich and complex blend of indigenous, African, Portuguese and European and Asian immigrant influences. Each region of Brazil has its own typical dishes and unique gastronomic traditions." },
        { pt: "A feijoada é considerada o prato nacional do Brasil. É um cozido de feijão preto com diversas carnes de porco, servido com arroz branco, couve refogada, laranja e farinha de mandioca. A feijoada tem origens humildes, pois era preparada pelos escravos africanos com os cortes de carne que os senhores não queriam.", en: "Feijoada is considered Brazil's national dish. It is a black bean stew with various pork cuts, served with white rice, sautéed kale, orange and manioc flour. Feijoada has humble origins, as it was prepared by African slaves using the cuts of meat that their masters did not want." },
        { pt: "O acarajé é um bolinho típico da Bahia, feito de massa de feijão-fradinho frito no azeite de dendê. É recheado com vatapá, caruru, camarão seco e pimenta. Na Bahia, o acarajé é vendido nas ruas pelas baianas, mulheres vestidas com trajes brancos tradicionais.", en: "Acarajé is a typical snack from Bahia, made from black-eyed pea batter fried in dendê oil. It is filled with vatapá, caruru, dried shrimp and chilli pepper. In Bahia, acarajé is sold on the streets by baianas, women dressed in traditional white garments." },
        { pt: "O churrasco brasileiro é famoso no mundo inteiro. Os cortes mais populares incluem a picanha — considerada a rainha do churrasco. No sul do Brasil, especialmente no Rio Grande do Sul, o churrasco é uma tradição cultural profunda, quase um ritual social.", en: "Brazilian churrasco is famous around the world. The most popular cuts include picanha — considered the queen of the barbecue. In southern Brazil, especially in Rio Grande do Sul, churrasco is a deep cultural tradition, almost a social ritual." },
        { pt: "Para além dos pratos principais, o Brasil tem uma cultura de snacks de rua extraordinária. O coxinha, o pão de queijo e o açaí tornaram-se fenómenos globais. A cozinha brasileira é uma viagem de sabores que nunca termina.", en: "Beyond the main dishes, Brazil has an extraordinary street snack culture. Coxinha, pão de queijo and açaí have become global phenomena. Brazilian cuisine is a journey of flavours that never ends." },
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
        { pt: "O futebol é parte da identidade nacional brasileira, presente na linguagem, na cultura e nos sonhos de milhões de crianças. O Brasil é a única nação do mundo que participou em todas as edições da Copa do Mundo FIFA — e ganhou o torneio cinco vezes, mais do que qualquer outro país.", en: "Football is part of Brazil's national identity, present in the language, culture and dreams of millions of children. Brazil is the only nation in the world to have participated in every edition of the FIFA World Cup — and has won the tournament five times, more than any other country." },
        { pt: "A história do futebol brasileiro está ligada a nomes lendários. Pelé, considerado por muitos o maior jogador de todos os tempos, marcou mais de mil gols em toda a sua carreira. Garrincha encantava os adversários com dribles impossíveis. Ronaldo, Ronaldinho Gaúcho e Zico são outros nomes imortais.", en: "The history of Brazilian football is tied to legendary names. Pelé, considered by many the greatest player of all time, scored over a thousand goals throughout his career. Garrincha enchanted opponents with impossible dribbles. Ronaldo, Ronaldinho Gaúcho and Zico are other immortal names." },
        { pt: "O Maracanã, no Rio de Janeiro, é um dos estádios mais icónicos do mundo. Foi construído para a Copa do Mundo de 1950 e chegou a ter capacidade para mais de 200.000 pessoas. Para os brasileiros, entrar no Maracanã é como entrar numa catedral.", en: "The Maracanã, in Rio de Janeiro, is one of the most iconic stadiums in the world. It was built for the 1950 World Cup and once had capacity for over 200,000 people. For Brazilians, entering the Maracanã is like entering a cathedral." },
        { pt: "O futebol brasileiro tem um estilo próprio chamado de 'jogo bonito', caracterizado pela criatividade, a improvisação e a alegria com que os jogadores atuam. Este estilo nasceu nas praias e ruas do Brasil, onde as crianças aprendem a jogar em espaços pequenos.", en: "Brazilian football has its own style called 'the beautiful game', characterised by creativity, improvisation and the joy with which the players perform. This style was born on the beaches and streets of Brazil, where children learn to play in small spaces." },
        { pt: "O futebol no Brasil também tem os seus momentos de dor. O 'Maracanazo' de 1950 e o '7 a 1' da Copa de 2014 ainda são lembrados como tragédias nacionais. Mas é exatamente por esses altos e baixos que o futebol brasileiro é tão apaixonante.", en: "Football in Brazil also has its moments of pain. The 'Maracanazo' of 1950 and the '7-1' of the 2014 World Cup are still remembered as national tragedies. But it is precisely because of these highs and lows that Brazilian football is so passionate." },
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
        { pt: "A Floresta Amazónica é o maior ecossistema tropical do mundo. Com uma área de aproximadamente 5,5 milhões de quilómetros quadrados, a Amazónia cobre cerca de 60% do território brasileiro. A floresta abriga cerca de 10% de todas as espécies de vida na Terra.", en: "The Amazon Rainforest is the world's largest tropical ecosystem. With an area of approximately 5.5 million square kilometres, the Amazon covers around 60% of Brazilian territory. The forest is home to around 10% of all species of life on Earth." },
        { pt: "O Rio Amazonas é o maior rio do mundo em volume de água. Ele nasce nos Andes peruanos e percorre mais de 6.400 quilómetros antes de desaguar no Oceano Atlântico. Durante a época das chuvas, o rio pode subir até 15 metros, inundando milhões de hectares de floresta.", en: "The Amazon River is the world's largest river by volume of water. It rises in the Peruvian Andes and travels more than 6,400 kilometres before emptying into the Atlantic Ocean. During the rainy season, the river can rise up to 15 metres, flooding millions of hectares of forest." },
        { pt: "A biodiversidade da Amazónia é de tirar o fôlego. A floresta abriga mais de 40.000 espécies de plantas, 1.300 espécies de aves e 3.000 espécies de peixes de água doce. Entre os animais mais emblemáticos estão a onça-pintada, o boto-cor-de-rosa e o tamanduá-bandeira.", en: "The biodiversity of the Amazon is breathtaking. The forest is home to more than 40,000 plant species, 1,300 bird species and 3,000 freshwater fish species. Among the most emblematic animals are the jaguar, the pink river dolphin and the giant anteater." },
        { pt: "Os povos indígenas que habitam a Amazónia há milénios têm um conhecimento profundo da floresta. Existem mais de 400 grupos étnicos indígenas no Brasil. Proteger os direitos destes povos é inseparável de proteger a própria floresta.", en: "The indigenous peoples who have inhabited the Amazon for millennia have a deep knowledge of the forest. There are more than 400 indigenous ethnic groups in Brazil. Protecting the rights of these peoples is inseparable from protecting the forest itself." },
        { pt: "A Amazónia enfrenta hoje uma ameaça sem precedentes: o desmatamento. Os cientistas alertam que se a destruição continuar, a floresta pode atingir um ponto de não retorno. A proteção da Amazónia não é apenas uma questão brasileira — é uma responsabilidade global.", en: "The Amazon faces an unprecedented threat today: deforestation. Scientists warn that if destruction continues, the forest may reach a point of no return. Protecting the Amazon is not just a Brazilian issue — it is a global responsibility." },
      ]
    },
    {
      id: 5,
      title: "A Música Brasileira",
      titleEn: "Brazilian Music",
      topic: "Cultura Brasileira",
      emoji: "🎵",
      level: "A2",
      intro: "Do samba à bossa nova — a música que conquistou o mundo.",
      paragraphs: [
        { pt: "A música brasileira é uma das mais ricas e diversas do mundo. Nascida da mistura de culturas indígenas, africanas e europeias, criou géneros únicos que conquistaram plateias em todos os continentes. O Brasil exporta ritmos, melodias e emoções que tocam o coração de pessoas de culturas completamente diferentes.", en: "Brazilian music is one of the richest and most diverse in the world. Born from the mixture of indigenous, African and European cultures, it created unique genres that have won over audiences on every continent. Brazil exports rhythms, melodies and emotions that touch the hearts of people from completely different cultures." },
        { pt: "O samba é o ritmo mais emblemático do Brasil. Nasceu no início do século XX nos morros do Rio de Janeiro, fortemente influenciado pela cultura africana. O samba tem um ritmo sincopado inconfundível e letras que falam de amor, saudade e vida cotidiana.", en: "Samba is Brazil's most emblematic rhythm. It was born in the early 20th century in the hills of Rio de Janeiro, strongly influenced by African culture. Samba has an unmistakable syncopated rhythm and lyrics that speak of love, longing and everyday life." },
        { pt: "A bossa nova surgiu no final da década de 1950 no Rio de Janeiro. É uma fusão sofisticada de samba com jazz americano, com harmonias complexas e letras poéticas. João Gilberto, Tom Jobim e Vinícius de Moraes criaram clássicos como 'Garota de Ipanema' que são conhecidos em todo o mundo.", en: "Bossa nova emerged in the late 1950s in Rio de Janeiro. It is a sophisticated fusion of samba with American jazz, with complex harmonies and poetic lyrics. João Gilberto, Tom Jobim and Vinícius de Moraes created classics like 'The Girl from Ipanema' that are known throughout the world." },
        { pt: "O forró é um género musical do Nordeste do Brasil, dançado em pares com movimentos íntimos e alegres. A sanfona, o triângulo e o zabumba são os instrumentos tradicionais. Luiz Gonzaga popularizou este estilo em todo o Brasil nas décadas de 1940 e 1950.", en: "Forró is a musical genre from Northeast Brazil, danced in pairs with intimate and joyful movements. The accordion, triangle and zabumba are the traditional instruments. Luiz Gonzaga popularised this style throughout Brazil in the 1940s and 1950s." },
        { pt: "O Brasil continua a produzir artistas extraordinários. Caetano Veloso, Gilberto Gil, Milton Nascimento e Ivete Sangalo levaram a música brasileira ao mundo inteiro. Hoje, o funk carioca e o sertanejo dominam as paradas de sucesso, provando que a criatividade musical brasileira nunca para.", en: "Brazil continues to produce extraordinary artists. Caetano Veloso, Gilberto Gil, Milton Nascimento and Ivete Sangalo have taken Brazilian music to the entire world. Today, funk carioca and sertanejo dominate the charts, proving that Brazilian musical creativity never stops." },
      ]
    },
    {
      id: 6,
      title: "As Praias do Brasil",
      titleEn: "The Beaches of Brazil",
      topic: "Viagem & Natureza",
      emoji: "🏖️",
      level: "A2",
      intro: "Mais de 7.000 quilómetros de costa com algumas das praias mais belas do mundo.",
      paragraphs: [
        { pt: "O Brasil possui uma das maiores linhas costeiras do mundo, com mais de 7.000 quilómetros de praias. Esta costa enorme oferece uma variedade extraordinária de paisagens: praias de areia branca com água turquesa, praias com ondas perfeitas para o surf, e praias protegidas em baías tranquilas.", en: "Brazil has one of the largest coastlines in the world, with over 7,000 kilometres of beaches. This enormous coast offers an extraordinary variety of landscapes: white sand beaches with turquoise water, beaches with perfect waves for surfing, and sheltered beaches in tranquil bays." },
        { pt: "Copacabana e Ipanema, no Rio de Janeiro, são talvez as praias mais famosas do mundo. Copacabana tem quatro quilómetros de extensão e é conhecida pelo seu calçadão de pedra portuguesa. Ipanema é considerada uma das praias mais bonitas do mundo e ficou imortalizada na bossa nova.", en: "Copacabana and Ipanema, in Rio de Janeiro, are perhaps the most famous beaches in the world. Copacabana stretches four kilometres and is known for its Portuguese stone promenade. Ipanema is considered one of the most beautiful beaches in the world and was immortalised in bossa nova." },
        { pt: "Fernando de Noronha é um arquipélago no Oceano Atlântico considerado um dos destinos de mergulho mais bonitos do mundo. As suas águas cristalinas e a rica vida marinha atraem turistas de todo o planeta. O acesso é limitado para proteger o ecossistema.", en: "Fernando de Noronha is an archipelago in the Atlantic Ocean considered one of the most beautiful diving destinations in the world. Its crystal clear waters and rich marine life attract tourists from all over the planet. Access is limited to protect the ecosystem." },
        { pt: "As praias do Nordeste são famosas pela água quente e as dunas de areia. Jericoacoara, no Ceará, é considerada uma das dez praias mais bonitas do mundo. Os Lençóis Maranhenses oferecem uma paisagem surrealista de dunas brancas com lagoas de água doce.", en: "The beaches of the Northeast are famous for their warm water and sand dunes. Jericoacoara, in Ceará, is considered one of the ten most beautiful beaches in the world. The Lençóis Maranhenses offer a surreal landscape of white dunes with freshwater lagoons." },
        { pt: "A cultura de praia no Brasil é muito mais do que nadar e tomar sol. As praias são espaços sociais onde as pessoas jogam vôlei e futevôlei. Os vendedores ambulantes passam com bebidas frescas, queijos e camarão. Uma tarde numa praia brasileira é uma experiência cultural completa.", en: "Beach culture in Brazil is much more than swimming and sunbathing. Beaches are social spaces where people play volleyball and footvolley. Street vendors pass by with cold drinks, cheese and shrimp. An afternoon on a Brazilian beach is a complete cultural experience." },
      ]
    },
    {
      id: 7,
      title: "São Paulo — A Megacidade",
      titleEn: "São Paulo — The Megacity",
      topic: "Cidades Brasileiras",
      emoji: "🏙️",
      level: "B1",
      intro: "A maior cidade do hemisfério sul e o coração económico do Brasil.",
      paragraphs: [
        { pt: "São Paulo é a maior cidade do Brasil e uma das maiores do mundo, com mais de 12 milhões de habitantes na cidade e mais de 22 milhões na região metropolitana. É o motor económico do Brasil, responsável por cerca de 10% do PIB nacional. A cidade nunca dorme.", en: "São Paulo is the largest city in Brazil and one of the largest in the world, with over 12 million inhabitants in the city and more than 22 million in the metropolitan region. It is Brazil's economic engine, responsible for around 10% of national GDP. The city never sleeps." },
        { pt: "São Paulo é famosa pela sua diversidade cultural e gastronómica. A cidade recebeu imigrantes de mais de 70 países, incluindo italianos, japoneses, libaneses e portugueses. Esta mistura criou uma cena culinária extraordinária — São Paulo é considerada uma das melhores cidades do mundo para comer.", en: "São Paulo is famous for its cultural and gastronomic diversity. The city has received immigrants from over 70 countries, including Italians, Japanese, Lebanese and Portuguese. This mixture has created an extraordinary culinary scene — São Paulo is considered one of the best cities in the world for food." },
        { pt: "A Avenida Paulista é o coração de São Paulo. Esta avenida de três quilómetros alberga bancos, museus e centros culturais. Ao domingo, é fechada ao trânsito e transformada num espaço de lazer com ciclistas, músicos e artistas de rua.", en: "Avenida Paulista is the heart of São Paulo. This three-kilometre avenue houses banks, museums and cultural centres. On Sundays, it is closed to traffic and transformed into a leisure space with cyclists, musicians and street artists." },
        { pt: "São Paulo tem uma das maiores comunidades japonesas fora do Japão. O bairro da Liberdade é o centro desta comunidade e está cheio de restaurantes japoneses e lojas de produtos asiáticos. Nos fins de semana, o mercado da Liberdade atrai milhares de visitantes.", en: "São Paulo has one of the largest Japanese communities outside Japan. The Liberdade neighbourhood is the centre of this community and is full of Japanese restaurants and Asian product shops. At weekends, the Liberdade market attracts thousands of visitors." },
        { pt: "Apesar de ser uma cidade de oportunidades, São Paulo enfrenta desafios urbanos sérios como o trânsito e a desigualdade social. Mas São Paulo é também uma cidade de resiliência, criatividade e energia sem igual.", en: "Despite being a city of opportunity, São Paulo faces serious urban challenges such as traffic and social inequality. But São Paulo is also a city of resilience, creativity and unmatched energy." },
      ]
    },
    {
      id: 8,
      title: "A Capoeira",
      titleEn: "Capoeira",
      topic: "Cultura Brasileira",
      emoji: "🥋",
      level: "B1",
      intro: "A arte marcial brasileira que mistura luta, dança e música.",
      paragraphs: [
        { pt: "A capoeira é uma arte marcial brasileira única no mundo — uma combinação de luta, dança, acrobacia e música. Foi criada pelos escravos africanos no Brasil entre os séculos XVI e XIX como forma de resistência e autodefesa. Hoje é praticada em mais de 150 países e foi reconhecida pela UNESCO como Património Cultural Imaterial da Humanidade em 2014.", en: "Capoeira is a uniquely Brazilian martial art — a combination of fighting, dance, acrobatics and music. It was created by African slaves in Brazil between the 16th and 19th centuries as a form of resistance and self-defence. Today it is practised in over 150 countries and was recognised by UNESCO as an Intangible Cultural Heritage of Humanity in 2014." },
        { pt: "Os praticantes de capoeira são chamados de capoeiristas. Eles lutam dentro de um círculo chamado roda, acompanhados por músicos que tocam o berimbau, o pandeiro e o atabaque. O berimbau dita o ritmo e a velocidade do jogo. A música é inseparável da capoeira.", en: "Capoeira practitioners are called capoeiristas. They fight inside a circle called a roda, accompanied by musicians who play the berimbau, pandeiro and atabaque. The berimbau dictates the rhythm and speed of the game. Music is inseparable from capoeira." },
        { pt: "Existem duas principais escolas de capoeira: a Capoeira Angola, que é mais lenta e tradicional, e a Capoeira Regional, criada por Mestre Bimba no século XX, que é mais rápida. Mestre Bimba foi fundamental para a legitimação e popularização da capoeira no Brasil.", en: "There are two main schools of capoeira: Capoeira Angola, which is slower and more traditional, and Capoeira Regional, created by Mestre Bimba in the 20th century, which is faster. Mestre Bimba was fundamental in the legitimisation and popularisation of capoeira in Brazil." },
        { pt: "A filosofia da capoeira vai muito além da luta. Os mestres ensinam valores como disciplina, respeito e comunidade. A roda de capoeira é um espaço democrático onde pessoas de todas as idades e origens participam juntas.", en: "The philosophy of capoeira goes far beyond fighting. Masters teach values such as discipline, respect and community. The capoeira roda is a democratic space where people of all ages and backgrounds participate together." },
        { pt: "Aprender capoeira é aprender sobre a história e a resistência do povo africano no Brasil. É uma forma de preservar uma memória dolorosa e transformá-la em beleza e arte. Ver ou participar numa roda de capoeira é uma das experiências mais autênticas que o Brasil tem para oferecer.", en: "Learning capoeira is learning about the history and resistance of the African people in Brazil. It is a way of preserving a painful memory and transforming it into beauty and art. Seeing or participating in a capoeira roda is one of the most authentic experiences Brazil has to offer." },
      ]
    },
    {
      id: 9,
      title: "O Rio de Janeiro",
      titleEn: "Rio de Janeiro",
      topic: "Cidades Brasileiras",
      emoji: "🗻",
      level: "A2",
      intro: "A Cidade Maravilhosa — onde a natureza e a cidade se encontram.",
      paragraphs: [
        { pt: "O Rio de Janeiro é conhecido em todo o mundo como a Cidade Maravilhosa. Com a sua combinação única de montanhas, florestas e praias dentro de uma cidade grande, o Rio oferece uma experiência urbana sem igual. Foi capital do Brasil durante mais de um século.", en: "Rio de Janeiro is known throughout the world as the Marvellous City. With its unique combination of mountains, forests and beaches within a large city, Rio offers an unparalleled urban experience. It was Brazil's capital for over a century." },
        { pt: "O Cristo Redentor, no topo do Morro do Corcovado, é um dos símbolos mais reconhecíveis do mundo. Esta estátua de 38 metros é considerada uma das Sete Maravilhas do Mundo Moderno. Do alto do Corcovado, a vista panorâmica do Rio é de tirar o fôlego.", en: "Christ the Redeemer, on top of Corcovado Mountain, is one of the most recognisable symbols in the world. This 38-metre statue is considered one of the Seven Wonders of the Modern World. From the top of Corcovado, the panoramic view of Rio is breathtaking." },
        { pt: "O Pão de Açúcar é outro ícone do Rio. Este morro de granito de 396 metros fica na entrada da Baía de Guanabara. Para chegar ao topo, os visitantes apanham um teleférico. A vista do pôr do sol a partir do Pão de Açúcar é uma das experiências mais memoráveis do Brasil.", en: "Sugarloaf Mountain is another icon of Rio. This 396-metre granite hill stands at the entrance to Guanabara Bay. To reach the top, visitors take a cable car. The sunset view from Sugarloaf Mountain is one of Brazil's most memorable experiences." },
        { pt: "A Floresta da Tijuca é a maior floresta urbana do mundo e fica dentro da cidade do Rio. Esta floresta foi replantada no século XIX depois de ter sido devastada pela agricultura. Hoje oferece trilhos de caminhada, cachoeiras e uma biodiversidade surpreendente.", en: "The Tijuca Forest is the largest urban forest in the world and is located within the city of Rio. This forest was replanted in the 19th century after being devastated by agriculture. Today it offers hiking trails, waterfalls and surprising biodiversity." },
        { pt: "O Rio é uma cidade de contrastes onde a beleza e a desigualdade vivem lado a lado. Os morros são ocupados pelas favelas, comunidades com uma cultura, solidariedade e criatividade extraordinárias. O funk, o samba e muitas outras expressões culturais nasceram nestas comunidades.", en: "Rio is a city of contrasts where beauty and inequality live side by side. The hills are occupied by favelas, communities with extraordinary culture, solidarity and creativity. Funk, samba and many other cultural expressions were born in these communities." },
      ]
    },
    {
      id: 10,
      title: "A Língua Portuguesa no Mundo",
      titleEn: "The Portuguese Language in the World",
      topic: "Língua & Cultura",
      emoji: "🌍",
      level: "B1",
      intro: "O português é a quinta língua mais falada do mundo — e o Brasil é o seu maior país.",
      paragraphs: [
        { pt: "O português é a quinta língua mais falada no mundo, com mais de 250 milhões de falantes nativos. É a língua oficial de oito países em quatro continentes: Portugal, Brasil, Angola, Moçambique, Cabo Verde, São Tomé e Príncipe, Guiné-Bissau e Timor-Leste. É também falado por comunidades significativas nos Estados Unidos, Europa e Japão.", en: "Portuguese is the fifth most spoken language in the world, with over 250 million native speakers. It is the official language of eight countries on four continents: Portugal, Brazil, Angola, Mozambique, Cape Verde, São Tomé and Príncipe, Guinea-Bissau and Timor-Leste. It is also spoken by significant communities in the United States, Europe and Japan." },
        { pt: "O Brasil é responsável por mais de 200 milhões desses falantes, tornando o português brasileiro a variante dominante da língua. O português brasileiro e o europeu diferem significativamente na pronúncia, vocabulário e até gramática. Algumas palavras têm significados completamente diferentes nos dois países.", en: "Brazil accounts for over 200 million of those speakers, making Brazilian Portuguese the dominant variant of the language. Brazilian and European Portuguese differ significantly in pronunciation, vocabulary and even grammar. Some words have completely different meanings in the two countries." },
        { pt: "A língua portuguesa chegou ao Brasil com os colonizadores portugueses no século XVI. Ao longo dos séculos, misturou-se com as línguas indígenas e africanas, criando o português brasileiro que conhecemos hoje. Muitas palavras do vocabulário brasileiro têm origem tupi, a língua dos povos indígenas mais numerosos.", en: "The Portuguese language arrived in Brazil with Portuguese colonisers in the 16th century. Over the centuries, it mixed with indigenous and African languages, creating the Brazilian Portuguese we know today. Many words in Brazilian vocabulary have Tupi origins, the language of the most numerous indigenous peoples." },
        { pt: "O português é uma língua em expansão. Prevê-se que até 2050 seja falado por mais de 400 milhões de pessoas, principalmente devido ao crescimento demográfico em África. Países como Angola e Moçambique têm economias em rápido crescimento e populações jovens, o que tornará o português cada vez mais importante no mundo dos negócios.", en: "Portuguese is an expanding language. It is predicted that by 2050 it will be spoken by over 400 million people, mainly due to demographic growth in Africa. Countries like Angola and Mozambique have rapidly growing economies and young populations, which will make Portuguese increasingly important in the business world." },
        { pt: "Aprender português é abrir uma porta para um mundo enorme de cultura, literatura e oportunidades. A literatura brasileira produziu gigantes como Machado de Assis, Clarice Lispector e Jorge Amado. A língua portuguesa é uma das maiores heranças culturais da humanidade.", en: "Learning Portuguese is opening a door to an enormous world of culture, literature and opportunities. Brazilian literature has produced giants like Machado de Assis, Clarice Lispector and Jorge Amado. The Portuguese language is one of humanity's greatest cultural heritages." },
      ]
    },
  ];
  