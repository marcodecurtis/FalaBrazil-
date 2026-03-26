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
    title: "Pelé — O Rei do Futebol",
    titleEn: "Pelé — The King of Football",
    topic: "Futebol",
    emoji: "⚽",
    level: "A2",
    intro: "O maior jogador de futebol de todos os tempos nasceu no Brasil.",
    paragraphs: [
      { pt: "Pelé nasceu em 1940 numa cidade pequena no estado de Minas Gerais. O seu nome verdadeiro é Edson Arantes do Nascimento. Quando era criança, era muito pobre e jogava futebol com bolas feitas de meias. Mas o seu talento era extraordinário.", en: "Pelé was born in 1940 in a small city in the state of Minas Gerais. His real name is Edson Arantes do Nascimento. As a child he was very poor and played football with balls made from socks. But his talent was extraordinary." },
      { pt: "Pelé começou a jogar no Santos Futebol Clube com apenas 15 anos. Um ano depois, estava na seleção brasileira. Com 17 anos, ganhou a sua primeira Copa do Mundo em 1958, na Suécia. Era o jogador mais jovem a ganhar uma Copa do Mundo na história.", en: "Pelé started playing for Santos Football Club at just 15 years old. One year later he was in the Brazilian national team. At 17, he won his first World Cup in 1958, in Sweden. He was the youngest player ever to win a World Cup." },
      { pt: "Ao longo da sua carreira, Pelé marcou mais de mil gols. Ganhou três Copas do Mundo — em 1958, 1962 e 1970. A Copa de 1970 é considerada por muitos a melhor equipa de futebol de todos os tempos. Pelé era o coração daquela equipa.", en: "Throughout his career, Pelé scored over a thousand goals. He won three World Cups — in 1958, 1962 and 1970. The 1970 team is considered by many the greatest football team of all time. Pelé was the heart of that team." },
      { pt: "Pelé era mais do que um jogador de futebol. Era um símbolo do Brasil para o mundo inteiro. Quando jogava, os adversários pediam o seu autógrafo depois dos jogos. Em 1967, durante a Guerra Civil da Nigéria, os dois lados pararam de lutar por 48 horas para o ver jogar.", en: "Pelé was more than a football player. He was a symbol of Brazil to the entire world. When he played, opponents asked for his autograph after games. In 1967, during the Nigerian Civil War, both sides stopped fighting for 48 hours to watch him play." },
      { pt: "Pelé faleceu em dezembro de 2022, mas o seu legado vive para sempre. No Brasil, as crianças ainda sonham em ser como Pelé. O seu nome é sinónimo de perfeição, alegria e o famoso 'jogo bonito' do futebol brasileiro.", en: "Pelé passed away in December 2022, but his legacy lives on forever. In Brazil, children still dream of being like Pelé. His name is synonymous with perfection, joy and the famous 'beautiful game' of Brazilian football." },
    ]
  },
  {
    id: 2,
    title: "O Carnaval do Rio de Janeiro",
    titleEn: "The Rio de Janeiro Carnival",
    topic: "Cultura Brasileira",
    emoji: "🎭",
    level: "A2",
    intro: "A maior festa do mundo acontece todos os anos no Brasil.",
    paragraphs: [
      { pt: "O Carnaval do Rio de Janeiro é a maior festa do mundo. Todos os anos, milhões de pessoas viajam ao Brasil para participar desta celebração incrível. As ruas da cidade ficam cheias de cores, músicas e alegria durante quatro dias.", en: "The Rio de Janeiro Carnival is the world's biggest party. Every year, millions of people travel to Brazil to take part in this incredible celebration. The city's streets fill with colours, music and joy for four days." },
      { pt: "O coração do Carnaval é o Sambódromo, uma passarela especial construída para os desfiles das escolas de samba. Cada escola passa meses preparando o seu desfile com fantasias incríveis, carros alegóricos gigantes e centenas de sambistas dançando.", en: "The heart of Carnival is the Sambadrome, a special avenue built for the samba school parades. Each school spends months preparing its parade with incredible costumes, giant floats and hundreds of samba dancers." },
      { pt: "Além dos desfiles, o Carnaval acontece nas ruas através dos blocos de rua. Existem centenas de blocos espalhados por toda a cidade, cada um com o seu próprio estilo musical. O mais famoso é o Bloco da Favorita, com mais de um milhão de pessoas.", en: "Beyond the parades, Carnival happens in the streets through the street blocos. There are hundreds of blocos spread across the city, each with its own musical style. The most famous is Bloco da Favorita, with over a million people." },
      { pt: "A grande rivalidade do Carnaval é entre as escolas de samba. As mais famosas são Mangueira, Portela, Beija-Flor e Imperatriz. Cada escola defende o seu bairro com orgulho enorme. Os resultados do julgamento causam alegria e lágrimas ao mesmo tempo.", en: "The great rivalry of Carnival is between the samba schools. The most famous are Mangueira, Portela, Beija-Flor and Imperatriz. Each school defends its neighbourhood with enormous pride. The judging results cause joy and tears at the same time." },
      { pt: "Para os brasileiros, o Carnaval não é apenas uma festa — é uma forma de vida. As escolas de samba trabalham o ano inteiro para aqueles quatro dias de glória. O Carnaval é a alma do Brasil exposta ao mundo inteiro.", en: "For Brazilians, Carnival is not just a party — it is a way of life. The samba schools work all year long for those four days of glory. Carnival is the soul of Brazil exposed to the entire world." },
    ]
  },
  {
    id: 3,
    title: "Paulo Coelho — O Escritor Mais Lido do Brasil",
    titleEn: "Paulo Coelho — Brazil's Most Read Author",
    topic: "Literatura Brasileira",
    emoji: "📚",
    level: "A2",
    intro: "O Alquimista é um dos livros mais vendidos da história.",
    paragraphs: [
      { pt: "Paulo Coelho nasceu no Rio de Janeiro em 1947. Quando era jovem, queria ser escritor, mas os seus pais queriam que ele fosse advogado. Esta tensão criou muitos problemas na sua vida. Mas Paulo nunca desistiu do seu sonho de escrever.", en: "Paulo Coelho was born in Rio de Janeiro in 1947. When he was young, he wanted to be a writer, but his parents wanted him to be a lawyer. This tension created many problems in his life. But Paulo never gave up on his dream of writing." },
      { pt: "Em 1988, Paulo Coelho publicou O Alquimista — a história de um jovem pastor espanhol que viaja pelo mundo em busca do seu tesouro. O livro foi inicialmente rejeitado por várias editoras. Mas depois de publicado, tornou-se um fenómeno mundial.", en: "In 1988, Paulo Coelho published The Alchemist — the story of a young Spanish shepherd who travels the world in search of his treasure. The book was initially rejected by several publishers. But once published, it became a worldwide phenomenon." },
      { pt: "O Alquimista foi traduzido para mais de 80 línguas e vendeu mais de 150 milhões de cópias. É um dos livros mais vendidos da história da humanidade. A mensagem central do livro — seguir os seus sonhos — tocou o coração de pessoas em todo o mundo.", en: "The Alchemist was translated into over 80 languages and sold more than 150 million copies. It is one of the best-selling books in human history. The central message of the book — follow your dreams — touched the hearts of people all over the world." },
      { pt: "Paulo Coelho escreveu muitos outros livros famosos como Brida, Onze Minutos, O Zahir e O Manuscrito Encontrado em Accra. Todos os seus livros exploram temas como espiritualidade, amor e a busca do significado da vida. O seu estilo é simples mas profundo.", en: "Paulo Coelho wrote many other famous books such as Brida, Eleven Minutes, The Zahir and Manuscript Found in Accra. All his books explore themes such as spirituality, love and the search for the meaning of life. His style is simple but profound." },
      { pt: "Hoje Paulo Coelho é o escritor brasileiro mais traduzido e mais lido do mundo. Ele usa as redes sociais para falar diretamente com os seus leitores e partilhar pensamentos inspiradores todos os dias. O seu sucesso prova que os sonhos podem mesmo tornar-se realidade.", en: "Today Paulo Coelho is the most translated and most read Brazilian writer in the world. He uses social media to speak directly with his readers and share inspiring thoughts every day. His success proves that dreams really can come true." },
    ]
  },
  {
    id: 4,
    title: "A Bossa Nova — A Música que Conquistou o Mundo",
    titleEn: "Bossa Nova — The Music that Conquered the World",
    topic: "Música Brasileira",
    emoji: "🎵",
    level: "B1",
    intro: "Uma tarde em Ipanema e uma guitarra — assim nasceu a bossa nova.",
    paragraphs: [
      { pt: "A bossa nova nasceu no final dos anos 1950 nos apartamentos de Ipanema e Copacabana, no Rio de Janeiro. Era uma música nova, diferente de tudo o que existia — uma fusão sofisticada de samba com jazz americano. Os seus criadores eram jovens da classe média carioca que adoravam jazz e samba ao mesmo tempo.", en: "Bossa nova was born in the late 1950s in the apartments of Ipanema and Copacabana, in Rio de Janeiro. It was new music, different from anything that existed — a sophisticated fusion of samba with American jazz. Its creators were young middle-class cariocas who loved both jazz and samba." },
      { pt: "João Gilberto foi o grande revolucionário da bossa nova. A sua guitarra tinha um ritmo completamente novo — suave, íntimo e hipnótico. A sua voz era quase um sussurro. Quando tocava, as pessoas paravam de falar para ouvir. Tom Jobim escrevia as melodias e harmonias mais bonitas.", en: "João Gilberto was the great revolutionary of bossa nova. His guitar had a completely new rhythm — smooth, intimate and hypnotic. His voice was almost a whisper. When he played, people stopped talking to listen. Tom Jobim wrote the most beautiful melodies and harmonies." },
      { pt: "A música mais famosa da bossa nova é Garota de Ipanema, composta por Tom Jobim com letra de Vinícius de Moraes. A canção foi inspirada por uma jovem chamada Heloísa Pinheiro que passava todos os dias pela rua onde Jobim e Vinícius tomavam café. A sua beleza inspirou uma obra-prima.", en: "The most famous bossa nova song is The Girl from Ipanema, composed by Tom Jobim with lyrics by Vinícius de Moraes. The song was inspired by a young woman called Heloísa Pinheiro who walked past every day on the street where Jobim and Vinícius had their coffee. Her beauty inspired a masterpiece." },
      { pt: "Em 1962, um concerto histórico no Carnegie Hall em Nova Iorque apresentou a bossa nova ao mundo. O público americano ficou completamente apaixonado por este som novo e sofisticado. A bossa nova tornou-se moda em todo o mundo e influenciou músicos de todos os géneros.", en: "In 1962, a historic concert at Carnegie Hall in New York introduced bossa nova to the world. The American audience fell completely in love with this new and sophisticated sound. Bossa nova became fashionable around the world and influenced musicians of every genre." },
      { pt: "A bossa nova continua a ser ouvida e amada em todo o mundo. Garota de Ipanema é uma das músicas mais gravadas da história. A bossa nova provou que o Brasil podia exportar não só futebol e carnaval, mas também uma das músicas mais elegantes já criadas.", en: "Bossa nova continues to be heard and loved all over the world. The Girl from Ipanema is one of the most recorded songs in history. Bossa nova proved that Brazil could export not just football and carnival, but also one of the most elegant music styles ever created." },
    ]
  },
  {
    id: 5,
    title: "As Telenovelas Brasileiras",
    titleEn: "Brazilian Telenovelas",
    topic: "Telenovelas & TV",
    emoji: "📺",
    level: "A2",
    intro: "As telenovelas são muito mais do que soap operas — são parte da identidade brasileira.",
    paragraphs: [
      { pt: "As telenovelas brasileiras são famosas em todo o mundo. São transmitidas em mais de 150 países e traduzidas para dezenas de línguas. Mas o que é uma telenovela? É uma série de televisão com uma história longa que dura entre seis e oito meses, com um episódio por dia.", en: "Brazilian telenovelas are famous all over the world. They are broadcast in over 150 countries and translated into dozens of languages. But what is a telenovela? It is a television series with a long story that lasts between six and eight months, with one episode per day." },
      { pt: "A Rede Globo é o canal mais importante de telenovelas no Brasil. As suas telenovelas do horário nobre — transmitidas às 21 horas — são vistas por dezenas de milhões de brasileiros todos os dias. Quando uma boa telenovela está no ar, as ruas ficam mais vazias.", en: "Rede Globo is the most important telenovela channel in Brazil. Its prime-time telenovelas — broadcast at 9pm — are watched by tens of millions of Brazilians every day. When a good telenovela is on air, the streets become emptier." },
      { pt: "Avenida Brasil, exibida em 2012, é considerada a melhor telenovela brasileira de todos os tempos. A história de Nina, uma mulher que busca vingança contra a madrasta que a abandonou num lixão, prendeu o Brasil inteiro. O último episódio foi visto por mais de 50 milhões de pessoas.", en: "Avenida Brasil, broadcast in 2012, is considered the best Brazilian telenovela of all time. The story of Nina, a woman seeking revenge against the stepmother who abandoned her at a rubbish dump, gripped the entire country. The final episode was watched by over 50 million people." },
      { pt: "As telenovelas brasileiras não são apenas entretenimento — são também uma forma de discutir temas sociais importantes. Ao longo dos anos, as telenovelas falaram sobre racismo, homossexualidade, violência doméstica e desigualdade social. Muitas vezes, as novelas mudaram a opinião pública.", en: "Brazilian telenovelas are not just entertainment — they are also a way of discussing important social issues. Over the years, telenovelas have addressed racism, homosexuality, domestic violence and social inequality. Many times, telenovelas have changed public opinion." },
      { pt: "Para aprender português brasileiro, as telenovelas são uma ferramenta extraordinária. A linguagem é natural e coloquial, os actores falam claramente e os temas são fáceis de seguir. Se quiser começar, experimente Avenida Brasil ou A Força do Querer na Netflix.", en: "To learn Brazilian Portuguese, telenovelas are an extraordinary tool. The language is natural and colloquial, the actors speak clearly and the themes are easy to follow. If you want to start, try Avenida Brasil or A Força do Querer on Netflix." },
    ]
  },
  {
    id: 6,
    title: "O Amazonas — O Rio Mais Poderoso do Mundo",
    titleEn: "The Amazon — The World's Most Powerful River",
    topic: "Geografia Brasileira",
    emoji: "🌿",
    level: "B1",
    intro: "O Rio Amazonas não é apenas o maior rio do mundo — é um mundo em si mesmo.",
    paragraphs: [
      { pt: "O Rio Amazonas é o maior rio do mundo em volume de água. Ele nasce nos Andes peruanos e percorre mais de 6.400 quilómetros até desaguar no Oceano Atlântico. A sua foz é tão larga que algumas ilhas dentro do rio são maiores do que países europeus.", en: "The Amazon River is the world's largest river by volume of water. It rises in the Peruvian Andes and travels over 6,400 kilometres before emptying into the Atlantic Ocean. Its mouth is so wide that some islands within the river are larger than European countries." },
      { pt: "A bacia amazónica cobre uma área de mais de 7 milhões de quilómetros quadrados — maior do que a Europa ocidental. Esta região enorme abriga a maior floresta tropical do mundo, com mais de 400 mil milhões de árvores. A floresta produz 20% do oxigénio da Terra.", en: "The Amazon basin covers an area of over 7 million square kilometres — larger than Western Europe. This enormous region is home to the world's largest rainforest, with over 400 billion trees. The forest produces 20% of Earth's oxygen." },
      { pt: "A biodiversidade do Amazonas é de tirar o fôlego. O rio tem mais de 3.000 espécies de peixes — mais do que o Oceano Atlântico inteiro. Entre os animais mais fascinantes estão o boto-cor-de-rosa, uma espécie única de golfinho de água doce, e a pirarucu, um dos maiores peixes de água doce do mundo.", en: "The biodiversity of the Amazon is breathtaking. The river has over 3,000 species of fish — more than the entire Atlantic Ocean. Among the most fascinating animals are the pink river dolphin, a unique freshwater dolphin species, and the arapaima, one of the world's largest freshwater fish." },
      { pt: "Às margens do Amazonas vivem comunidades ribeirinhas que dependem completamente do rio para sobreviver. Pescam, cultivam a terra e usam o rio como estrada. A sua relação com a natureza é profunda e harmoniosa. Os povos indígenas têm um conhecimento extraordinário das plantas medicinais da floresta.", en: "Along the banks of the Amazon live riverside communities that depend entirely on the river to survive. They fish, farm the land and use the river as a road. Their relationship with nature is deep and harmonious. The indigenous peoples have extraordinary knowledge of the forest's medicinal plants." },
      { pt: "Manaus, a maior cidade da Amazónia, é um caso fascinante de urbanização no meio da selva. Com mais de 2 milhões de habitantes, Manaus tem um famoso Teatro Amazonas construído durante a era da borracha no século XIX. A cidade é o ponto de partida para explorar a selva amazónica.", en: "Manaus, the largest city in the Amazon, is a fascinating case of urbanisation in the middle of the jungle. With over 2 million inhabitants, Manaus has a famous Amazon Theatre built during the rubber era in the 19th century. The city is the starting point for exploring the Amazon jungle." },
    ]
  },
  {
    id: 7,
    title: "O Samba — O Ritmo do Brasil",
    titleEn: "Samba — The Rhythm of Brazil",
    topic: "Música Brasileira",
    emoji: "🥁",
    level: "B1",
    intro: "O samba nasceu nos morros do Rio e conquistou o mundo inteiro.",
    paragraphs: [
      { pt: "O samba nasceu no início do século XX nos morros e subúrbios do Rio de Janeiro. Veio das tradições musicais e religiosas dos africanos escravizados trazidos para o Brasil. O ritmo sincopado, os instrumentos de percussão e a dança expressiva são marcas inconfundíveis do samba.", en: "Samba was born in the early 20th century in the hills and suburbs of Rio de Janeiro. It came from the musical and religious traditions of enslaved Africans brought to Brazil. The syncopated rhythm, percussion instruments and expressive dance are unmistakable hallmarks of samba." },
      { pt: "A primeira escola de samba, Deixa Falar, foi fundada em 1928. Rapidamente, o samba deixou de ser apenas música de comunidades pobres e tornou-se o ritmo nacional do Brasil. A Era de Ouro do samba nos anos 1930 e 1940 produziu clássicos que ainda são cantados hoje.", en: "The first samba school, Deixa Falar, was founded in 1928. Quickly, samba stopped being just music of poor communities and became Brazil's national rhythm. The Golden Age of samba in the 1930s and 1940s produced classics that are still sung today." },
      { pt: "Existem muitos estilos de samba. O samba-enredo é o samba das escolas de carnaval — com letras épicas e arranjos grandiosos. O pagode é um samba mais informal e íntimo, tocado em rodas de amigos. O samba de raiz é mais tradicional e percussivo. Cada estilo conta uma história diferente.", en: "There are many styles of samba. Samba-enredo is the samba of carnival schools — with epic lyrics and grand arrangements. Pagode is a more informal and intimate samba, played in circles of friends. Samba de raiz is more traditional and percussive. Each style tells a different story." },
      { pt: "Os grandes sambistas brasileiros são lendas vivas. Cartola, Clara Nunes, Beth Carvalho, Martinho da Vila e Zeca Pagodinho são nomes imortais. Cada um deles contribuiu para a evolução do samba. A sua música fala de amor, saudade, alegria e a vida nos subúrbios do Rio.", en: "Brazil's great samba artists are living legends. Cartola, Clara Nunes, Beth Carvalho, Martinho da Vila and Zeca Pagodinho are immortal names. Each of them contributed to the evolution of samba. Their music speaks of love, longing, joy and life in the suburbs of Rio." },
      { pt: "Hoje o samba continua vivo e em evolução. Artistas jovens misturam samba com funk, soul e R&B. As rodas de samba nos bares do Rio continuam a atrair multidões. O samba está no DNA dos brasileiros — é impossível ouvir um bom samba e ficar parado.", en: "Today samba continues alive and evolving. Young artists mix samba with funk, soul and R&B. Samba circles in Rio's bars continue to attract crowds. Samba is in the DNA of Brazilians — it is impossible to hear a good samba and stay still." },
    ]
  },
  {
    id: 8,
    title: "Fernando de Noronha — O Paraíso Brasileiro",
    titleEn: "Fernando de Noronha — Brazil's Paradise",
    topic: "Viagem & Natureza",
    emoji: "🏝️",
    level: "B1",
    intro: "Um arquipélago isolado no meio do Atlântico com as águas mais cristalinas do Brasil.",
    paragraphs: [
      { pt: "Fernando de Noronha é um arquipélago de 21 ilhas situado a 354 quilómetros da costa nordeste do Brasil. É considerado um dos destinos de mergulho mais bonitos do mundo e Patrimônio Natural da Humanidade pela UNESCO. Quem visita Noronha raramente quer voltar para casa.", en: "Fernando de Noronha is an archipelago of 21 islands situated 354 kilometres off the northeast coast of Brazil. It is considered one of the most beautiful diving destinations in the world and a UNESCO Natural World Heritage Site. Those who visit Noronha rarely want to go home." },
      { pt: "As águas de Noronha são extraordinárias — visibilidade de até 50 metros, temperatura de 28 graus e uma vida marinha incrível. A Baía do Sancho foi eleita várias vezes a mais bonita do mundo. Tartarugas marinhas, golfinhos e tubarões-limão são visitantes frequentes.", en: "The waters of Noronha are extraordinary — visibility of up to 50 metres, temperature of 28 degrees and incredible marine life. Baía do Sancho has been voted the most beautiful bay in the world several times. Sea turtles, dolphins and lemon sharks are frequent visitors." },
      { pt: "Para proteger o ecossistema, Fernando de Noronha limita o número de visitantes. Só é possível entrar com uma taxa ambiental diária, e os turistas são incentivados a não usar protetor solar comum para proteger os corais. Esta política de turismo sustentável é um modelo para o mundo.", en: "To protect the ecosystem, Fernando de Noronha limits the number of visitors. Entry is only possible with a daily environmental tax, and tourists are encouraged not to use regular sunscreen to protect the corals. This sustainable tourism policy is a model for the world." },
      { pt: "A história de Noronha é fascinante. O arquipélago serviu de prisão política durante séculos — primeiro no período colonial, depois durante a ditadura militar. Hoje, os descendentes dos prisioneiros e guardas vivem na ilha em paz, num lugar que parece ter saído de um sonho.", en: "The history of Noronha is fascinating. The archipelago served as a political prison for centuries — first in the colonial period, then during the military dictatorship. Today, the descendants of prisoners and guards live on the island in peace, in a place that seems to have come from a dream." },
      { pt: "O pôr do sol em Fernando de Noronha é um ritual. Todos os dias, os visitantes reúnem-se no Forte dos Remédios para ver o sol mergulhar no oceano. Não há semáforos, não há shoppings, não há pressa. Noronha ensina que a felicidade pode ser muito simples.", en: "Sunset in Fernando de Noronha is a ritual. Every day, visitors gather at Forte dos Remédios to watch the sun sink into the ocean. There are no traffic lights, no shopping malls, no rush. Noronha teaches that happiness can be very simple." },
    ]
  },
  {
    id: 9,
    title: "Avenida Brasil — A Telenovela que Parou o Brasil",
    titleEn: "Avenida Brasil — The Telenovela that Stopped Brazil",
    topic: "Telenovelas & TV",
    emoji: "🎬",
    level: "B2",
    intro: "Em 2012, 50 milhões de brasileiros assistiram ao último episódio desta novela histórica.",
    paragraphs: [
      { pt: "Avenida Brasil foi exibida pela Rede Globo em 2012 e transformou-se rapidamente num fenómeno cultural sem precedentes. Escrita por João Emanuel Carneiro, a novela contava a história de Nina, uma menina abandonada pela madrasta Carminha num lixão do Rio de Janeiro. Anos depois, Nina regressa disfarçada de cozinheira para se vingar.", en: "Avenida Brasil was broadcast by Rede Globo in 2012 and quickly became an unprecedented cultural phenomenon. Written by João Emanuel Carneiro, the telenovela told the story of Nina, a girl abandoned by her stepmother Carminha at a rubbish dump in Rio de Janeiro. Years later, Nina returns disguised as a cook to take her revenge." },
      { pt: "O que tornou Avenida Brasil diferente das outras novelas foi a sua ambientação. Em vez de contar histórias de personagens ricas no asfalto, a novela se passava no subúrbio carioca — um Brasil real, com problemas reais. Os espectadores viram-se refletidos nas histórias das personagens pela primeira vez.", en: "What made Avenida Brasil different from other telenovelas was its setting. Instead of telling stories of wealthy characters in upmarket areas, the telenovela was set in Rio's suburbs — a real Brazil, with real problems. Viewers saw themselves reflected in the characters' stories for the first time." },
      { pt: "A vilã Carminha, interpretada por Adriana Esteves, tornou-se uma das personagens mais odiadas e adoradas da história da televisão brasileira. O público adorava odiar Carminha. As suas cenas eram assistidas com gritos e aplausos. Adriana Esteves ganhou vários prémios pela sua interpretação extraordinária.", en: "The villain Carminha, played by Adriana Esteves, became one of the most hated and adored characters in Brazilian television history. The public loved to hate Carminha. Her scenes were watched with shouts and applause. Adriana Esteves won several awards for her extraordinary performance." },
      { pt: "O impacto social de Avenida Brasil foi imenso. Pela primeira vez, os subúrbios do Rio foram mostrados na televisão não como lugares de crime, mas como comunidades com vida, amor, humor e dignidade. A novela mudou a forma como os brasileiros viam os seus próprios compatriotas.", en: "The social impact of Avenida Brasil was enormous. For the first time, Rio's suburbs were shown on television not as places of crime, but as communities with life, love, humour and dignity. The telenovela changed the way Brazilians saw their own compatriots." },
      { pt: "O último episódio de Avenida Brasil foi exibido em outubro de 2012. Estima-se que 50 milhões de pessoas assistiram ao final — um recorde na televisão brasileira. Restaurantes e bares colocaram televisões nas janelas para os clientes verem. O Brasil parou. Avenida Brasil ficou na história.", en: "The final episode of Avenida Brasil was broadcast in October 2012. It is estimated that 50 million people watched the finale — a record in Brazilian television. Restaurants and bars put televisions in their windows for customers to watch. Brazil stopped. Avenida Brasil went down in history." },
    ]
  },
  {
    id: 10,
    title: "Iguaçu — As Cataratas que Fazem o Niágara Parecer Pequeno",
    titleEn: "Iguaçu — The Waterfalls that Make Niagara Look Small",
    topic: "Viagem & Natureza",
    emoji: "💧",
    level: "B2",
    intro: "Eleanor Roosevelt disse ao ver as Cataratas do Iguaçu: 'Pobre Niágara!'",
    paragraphs: [
      { pt: "As Cataratas do Iguaçu são uma das maravilhas naturais mais espetaculares do mundo. Situadas na fronteira entre o Brasil, a Argentina e o Paraguai, as cataratas consistem em 275 quedas de água que se estendem por quase três quilómetros. A sua largura é quase quatro vezes maior que as Cataratas do Niágara.", en: "The Iguaçu Falls are one of the world's most spectacular natural wonders. Located on the border between Brazil, Argentina and Paraguay, the falls consist of 275 waterfalls extending for nearly three kilometres. Their width is almost four times greater than Niagara Falls." },
      { pt: "A queda mais impressionante chama-se Garganta do Diabo — a Garganta do Diabo. Esta queda tem 82 metros de altura e a sua força é tão colossal que cria uma névoa permanente visível a quilómetros de distância. Estar perto da Garganta do Diabo é uma das experiências físicas mais intensas que a natureza pode oferecer.", en: "The most impressive fall is called Garganta do Diabo — the Devil's Throat. This fall is 82 metres high and its force is so colossal that it creates a permanent mist visible kilometres away. Standing near the Devil's Throat is one of the most physically intense experiences nature can offer." },
      { pt: "O Parque Nacional do Iguaçu, no lado brasileiro, foi declarado Patrimônio Natural da Humanidade pela UNESCO em 1986. O parque protege uma das últimas grandes extensões de Mata Atlântica — um bioma em perigo crítico. As trilhas dentro do parque permitem aproximações às cataratas que deixam os visitantes completamente encharcados.", en: "The Iguaçu National Park, on the Brazilian side, was declared a UNESCO Natural World Heritage Site in 1986. The park protects one of the last large expanses of Atlantic Forest — a critically endangered biome. The trails inside the park allow approaches to the falls that leave visitors completely soaked." },
      { pt: "A biodiversidade em torno das cataratas é extraordinária. O parque abriga jaguares, antas, queixadas e mais de 400 espécies de aves. Os tucanos são tão abundantes que aparecem frequentemente nos trilhos sem qualquer timidez. Os andorinhos-de-Iguaçu, uma espécie única, nidificam atrás das cortinas de água.", en: "The biodiversity around the falls is extraordinary. The park is home to jaguars, tapirs, white-lipped peccaries and over 400 bird species. Toucans are so abundant that they appear frequently on the trails without any shyness. The Iguaçu swifts, a unique species, nest behind the curtains of water." },
      { pt: "Iguaçu é um destino que transforma as pessoas. A escala da natureza ali presente faz com que os problemas humanos pareçam muito pequenos. Quando Eleanor Roosevelt visitou as cataratas pela primeira vez e disse 'Pobre Niágara!', estava a exprimir o que todos os visitantes sentem — que há lugares no mundo que simplesmente superam qualquer expectativa.", en: "Iguaçu is a destination that transforms people. The scale of nature there makes human problems seem very small. When Eleanor Roosevelt visited the falls for the first time and said 'Poor Niagara!', she was expressing what all visitors feel — that there are places in the world that simply exceed any expectation." },
    ]
  },
];
