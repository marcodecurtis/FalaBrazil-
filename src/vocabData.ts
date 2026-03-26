export interface VocabItem {
  pt: string;
  en: string;
}

export const VOCAB_LIBRARY: Record<string, VocabItem[]> = {
  // ── ORIGINAL TOPICS ──────────────────────────────────────────
  "Natureza": [
    { pt: "Árvore", en: "Tree" }, { pt: "Flor", en: "Flower" }, { pt: "Rio", en: "River" }, { pt: "Montanha", en: "Mountain" },
    { pt: "Mar", en: "Sea" }, { pt: "Sol", en: "Sun" }, { pt: "Lua", en: "Moon" }, { pt: "Céu", en: "Sky" },
    { pt: "Nuvem", en: "Cloud" }, { pt: "Chuva", en: "Rain" }, { pt: "Vento", en: "Wind" }, { pt: "Pedra", en: "Stone" },
    { pt: "Areia", en: "Sand" }, { pt: "Ilha", en: "Island" }, { pt: "Lago", en: "Lake" }, { pt: "Mata", en: "Forest" },
    { pt: "Campo", en: "Field" }, { pt: "Estrela", en: "Star" }, { pt: "Fogo", en: "Fire" }, { pt: "Terra", en: "Earth" }
  ],
  "Casa": [
    { pt: "Mesa", en: "Table" }, { pt: "Cadeira", en: "Chair" }, { pt: "Cama", en: "Bed" }, { pt: "Janela", en: "Window" },
    { pt: "Porta", en: "Door" }, { pt: "Cozinha", en: "Kitchen" }, { pt: "Quarto", en: "Bedroom" }, { pt: "Sofá", en: "Sofa" },
    { pt: "Banheiro", en: "Bathroom" }, { pt: "Geladeira", en: "Fridge" }, { pt: "Fogão", en: "Stove" }, { pt: "Chave", en: "Key" },
    { pt: "Espelho", en: "Mirror" }, { pt: "Tapete", en: "Rug" }, { pt: "Lâmpada", en: "Lamp" }, { pt: "Parede", en: "Wall" },
    { pt: "Teto", en: "Ceiling" }, { pt: "Piso", en: "Floor" }, { pt: "Escada", en: "Stairs" }, { pt: "Almofada", en: "Cushion" }
  ],
  "Comida": [
    { pt: "Pão", en: "Bread" }, { pt: "Arroz", en: "Rice" }, { pt: "Feijão", en: "Beans" }, { pt: "Carne", en: "Meat" },
    { pt: "Fruta", en: "Fruit" }, { pt: "Leite", en: "Milk" }, { pt: "Água", en: "Water" }, { pt: "Queijo", en: "Cheese" },
    { pt: "Ovo", en: "Egg" }, { pt: "Peixe", en: "Fish" }, { pt: "Salada", en: "Salad" }, { pt: "Sopa", en: "Soup" },
    { pt: "Suco", en: "Juice" }, { pt: "Café", en: "Coffee" }, { pt: "Chá", en: "Tea" }, { pt: "Bolo", en: "Cake" },
    { pt: "Açúcar", en: "Sugar" }, { pt: "Sal", en: "Salt" }, { pt: "Manteiga", en: "Butter" }, { pt: "Macarrão", en: "Pasta" }
  ],
  "Profissões": [
    { pt: "Médico", en: "Doctor" }, { pt: "Professor", en: "Teacher" }, { pt: "Engenheiro", en: "Engineer" }, { pt: "Advogado", en: "Lawyer" },
    { pt: "Cozinheiro", en: "Chef" }, { pt: "Pintor", en: "Painter" }, { pt: "Policial", en: "Police Officer" }, { pt: "Bombeiro", en: "Firefighter" },
    { pt: "Motorista", en: "Driver" }, { pt: "Dentista", en: "Dentist" }, { pt: "Arquiteto", en: "Architect" }, { pt: "Vendedor", en: "Salesperson" },
    { pt: "Garçom", en: "Waiter" }, { pt: "Ator", en: "Actor" }, { pt: "Músico", en: "Musician" }, { pt: "Escritor", en: "Writer" },
    { pt: "Enfermeiro", en: "Nurse" }, { pt: "Piloto", en: "Pilot" }, { pt: "Jornalista", en: "Journalist" }, { pt: "Fotógrafo", en: "Photographer" }
  ],
  "Viagem": [
    { pt: "Avião", en: "Plane" }, { pt: "Passaporte", en: "Passport" }, { pt: "Malas", en: "Luggage" }, { pt: "Hotel", en: "Hotel" },
    { pt: "Bilhete", en: "Ticket" }, { pt: "Aeroporto", en: "Airport" }, { pt: "Praia", en: "Beach" }, { pt: "Mapa", en: "Map" },
    { pt: "Trem", en: "Train" }, { pt: "Barco", en: "Boat" }, { pt: "Ônibus", en: "Bus" }, { pt: "Carro", en: "Car" },
    { pt: "Bicicleta", en: "Bicycle" }, { pt: "Pousada", en: "Inn" }, { pt: "Caminho", en: "Path" }, { pt: "Destino", en: "Destination" },
    { pt: "Passeio", en: "Tour" }, { pt: "Guia", en: "Guide" }, { pt: "Estação", en: "Station" }, { pt: "Fronteira", en: "Border" }
  ],
  "Animais": [
    { pt: "Cachorro", en: "Dog" }, { pt: "Gato", en: "Cat" }, { pt: "Cavalo", en: "Horse" }, { pt: "Pássaro", en: "Bird" },
    { pt: "Peixe", en: "Fish" }, { pt: "Leão", en: "Lion" }, { pt: "Elefante", en: "Elephant" }, { pt: "Macaco", en: "Monkey" },
    { pt: "Urso", en: "Bear" }, { pt: "Tubarão", en: "Shark" }, { pt: "Cobra", en: "Snake" }, { pt: "Rato", en: "Mouse" },
    { pt: "Coelho", en: "Rabbit" }, { pt: "Vaca", en: "Cow" }, { pt: "Porco", en: "Pig" }, { pt: "Galinha", en: "Chicken" },
    { pt: "Pato", en: "Duck" }, { pt: "Abelha", en: "Bee" }, { pt: "Aranha", en: "Spider" }, { pt: "Tartaruga", en: "Turtle" }
  ],
  "Cidade": [
    { pt: "Rua", en: "Street" }, { pt: "Prédio", en: "Building" }, { pt: "Parque", en: "Park" }, { pt: "Loja", en: "Store" },
    { pt: "Escola", en: "School" }, { pt: "Igreja", en: "Church" }, { pt: "Banco", en: "Bank" }, { pt: "Praça", en: "Square" },
    { pt: "Museu", en: "Museum" }, { pt: "Hospital", en: "Hospital" }, { pt: "Cinema", en: "Cinema" }, { pt: "Teatro", en: "Theater" },
    { pt: "Biblioteca", en: "Library" }, { pt: "Prefeitura", en: "City Hall" }, { pt: "Delegacia", en: "Police Station" }, { pt: "Padaria", en: "Bakery" },
    { pt: "Farmácia", en: "Pharmacy" }, { pt: "Supermercado", en: "Supermarket" }, { pt: "Posto", en: "Gas Station" }, { pt: "Ponte", en: "Bridge" }
  ],
  "Corpo": [
    { pt: "Cabeça", en: "Head" }, { pt: "Olho", en: "Eye" }, { pt: "Nariz", en: "Nose" }, { pt: "Boca", en: "Mouth" },
    { pt: "Ouvido", en: "Ear" }, { pt: "Mão", en: "Hand" }, { pt: "Pé", en: "Foot" }, { pt: "Braço", en: "Arm" },
    { pt: "Perna", en: "Leg" }, { pt: "Dedo", en: "Finger" }, { pt: "Costas", en: "Back" }, { pt: "Peito", en: "Chest" },
    { pt: "Cabelo", en: "Hair" }, { pt: "Dente", en: "Tooth" }, { pt: "Língua", en: "Tongue" }, { pt: "Ombro", en: "Shoulder" },
    { pt: "Joelho", en: "Knee" }, { pt: "Pescoço", en: "Neck" }, { pt: "Coração", en: "Heart" }, { pt: "Sangue", en: "Blood" }
  ],
  "Tempo": [
    { pt: "Hoje", en: "Today" }, { pt: "Amanhã", en: "Tomorrow" }, { pt: "Ontem", en: "Yesterday" }, { pt: "Semana", en: "Week" },
    { pt: "Mês", en: "Month" }, { pt: "Ano", en: "Year" }, { pt: "Segunda", en: "Monday" }, { pt: "Sábado", en: "Saturday" },
    { pt: "Domingo", en: "Sunday" }, { pt: "Manhã", en: "Morning" }, { pt: "Tarde", en: "Afternoon" }, { pt: "Noite", en: "Night" },
    { pt: "Hora", en: "Hour" }, { pt: "Minuto", en: "Minute" }, { pt: "Segundo", en: "Second" }, { pt: "Calendário", en: "Calendar" },
    { pt: "Relógio", en: "Clock" }, { pt: "Verão", en: "Summer" }, { pt: "Inverno", en: "Winter" }, { pt: "Outono", en: "Autumn" }
  ],
  "Cores": [
    { pt: "Azul", en: "Blue" }, { pt: "Vermelho", en: "Red" }, { pt: "Verde", en: "Green" }, { pt: "Amarelo", en: "Yellow" },
    { pt: "Preto", en: "Black" }, { pt: "Branco", en: "White" }, { pt: "Roxo", en: "Purple" }, { pt: "Cinza", en: "Gray" },
    { pt: "Rosa", en: "Pink" }, { pt: "Laranja", en: "Orange" }, { pt: "Marrom", en: "Brown" }, { pt: "Dourado", en: "Golden" },
    { pt: "Prateado", en: "Silver" }, { pt: "Claro", en: "Light" }, { pt: "Escuro", en: "Dark" }, { pt: "Brilhante", en: "Bright" },
    { pt: "Colorido", en: "Colorful" }, { pt: "Transparente", en: "Transparent" }, { pt: "Creme", en: "Cream" }, { pt: "Bege", en: "Beige" }
  ],

  // ── NEW FUN TOPICS ────────────────────────────────────────────
  "Futebol": [
    { pt: "Gol", en: "Goal" }, { pt: "Bola", en: "Ball" }, { pt: "Jogador", en: "Player" }, { pt: "Time", en: "Team" },
    { pt: "Torcida", en: "Fans / Supporters" }, { pt: "Estádio", en: "Stadium" }, { pt: "Árbitro", en: "Referee" }, { pt: "Goleiro", en: "Goalkeeper" },
    { pt: "Pênalti", en: "Penalty" }, { pt: "Cartão amarelo", en: "Yellow card" }, { pt: "Cartão vermelho", en: "Red card" }, { pt: "Campeonato", en: "Championship" },
    { pt: "Chute", en: "Kick / Shot" }, { pt: "Drible", en: "Dribble" }, { pt: "Passe", en: "Pass" }, { pt: "Defesa", en: "Defence" },
    { pt: "Ataque", en: "Attack" }, { pt: "Empate", en: "Draw" }, { pt: "Vitória", en: "Victory" }, { pt: "Derrota", en: "Defeat" }
  ],
  "Música Brasileira": [
    { pt: "Samba", en: "Samba" }, { pt: "Bossa nova", en: "Bossa nova" }, { pt: "Forró", en: "Forró (NE dance music)" }, { pt: "Funk", en: "Funk carioca" },
    { pt: "Pagode", en: "Pagode (informal samba)" }, { pt: "Sertanejo", en: "Sertanejo (country)" }, { pt: "Berimbau", en: "Berimbau (musical bow)" }, { pt: "Pandeiro", en: "Tambourine" },
    { pt: "Letra", en: "Lyrics" }, { pt: "Ritmo", en: "Rhythm" }, { pt: "Cantor", en: "Singer" }, { pt: "Show", en: "Concert / Gig" },
    { pt: "Palco", en: "Stage" }, { pt: "Sanfona", en: "Accordion" }, { pt: "Bateria", en: "Drum kit" }, { pt: "Melodia", en: "Melody" },
    { pt: "Refrão", en: "Chorus" }, { pt: "Violão", en: "Acoustic guitar" }, { pt: "Sambódromo", en: "Sambadrome" }, { pt: "Axé", en: "Axé music (Bahia)" }
  ],
  "Telenovelas": [
    { pt: "Novela", en: "Telenovela" }, { pt: "Personagem", en: "Character" }, { pt: "Vilã", en: "Villain (female)" }, { pt: "Protagonista", en: "Main character" },
    { pt: "Traição", en: "Betrayal" }, { pt: "Segredo", en: "Secret" }, { pt: "Vingança", en: "Revenge" }, { pt: "Amor proibido", en: "Forbidden love" },
    { pt: "Episódio", en: "Episode" }, { pt: "Capítulo", en: "Chapter" }, { pt: "Enredo", en: "Plot" }, { pt: "Final", en: "Finale" },
    { pt: "Horário nobre", en: "Prime time" }, { pt: "Audiência", en: "Ratings" }, { pt: "Globo", en: "Globo (TV network)" }, { pt: "Série", en: "Series" },
    { pt: "Atriz", en: "Actress" }, { pt: "Ator", en: "Actor" }, { pt: "Reprise", en: "Rerun" }, { pt: "Clímax", en: "Climax" }
  ],
  "Carnaval": [
    { pt: "Fantasia", en: "Costume" }, { pt: "Desfile", en: "Parade" }, { pt: "Bloco", en: "Street carnival group" }, { pt: "Escola de samba", en: "Samba school" },
    { pt: "Confete", en: "Confetti" }, { pt: "Máscara", en: "Mask" }, { pt: "Alegoria", en: "Float" }, { pt: "Rainha", en: "Queen" },
    { pt: "Folião", en: "Carnival reveller" }, { pt: "Trio elétrico", en: "Electric truck with band" }, { pt: "Marchinha", en: "Carnival march song" }, { pt: "Abadá", en: "Carnival outfit" },
    { pt: "Folia", en: "Revelry" }, { pt: "Axé", en: "Axé music" }, { pt: "Micareta", en: "Off-season carnival" }, { pt: "Sambista", en: "Samba dancer/musician" },
    { pt: "Bateria", en: "Percussion section" }, { pt: "Passista", en: "Lead samba dancer" }, { pt: "Mestre-sala", en: "Flag bearer partner" }, { pt: "Porta-bandeira", en: "Flag bearer" }
  ],
  "Praia & Verão": [
    { pt: "Onda", en: "Wave" }, { pt: "Areia", en: "Sand" }, { pt: "Bronzeado", en: "Tan" }, { pt: "Protetor solar", en: "Sunscreen" },
    { pt: "Canga", en: "Beach sarong" }, { pt: "Caipirinha", en: "Caipirinha cocktail" }, { pt: "Biquíni", en: "Bikini" }, { pt: "Sunga", en: "Swimming trunks" },
    { pt: "Vendedor ambulante", en: "Street vendor" }, { pt: "Frescobol", en: "Beach bat ball" }, { pt: "Vôlei de praia", en: "Beach volleyball" }, { pt: "Futevôlei", en: "Footvolley" },
    { pt: "Calçadão", en: "Seafront promenade" }, { pt: "Quiosque", en: "Beach kiosk" }, { pt: "Açaí", en: "Açaí bowl" }, { pt: "Mate gelado", en: "Iced mate tea" },
    { pt: "Guarda-sol", en: "Beach umbrella" }, { pt: "Redinha", en: "Hammock" }, { pt: "Caldo de cana", en: "Sugarcane juice" }, { pt: "Prancha", en: "Surfboard" }
  ],
  "Comida Brasileira": [
    { pt: "Feijoada", en: "Black bean stew with pork" }, { pt: "Coxinha", en: "Chicken croquette" }, { pt: "Brigadeiro", en: "Chocolate truffle" }, { pt: "Pão de queijo", en: "Cheese bread" },
    { pt: "Churrasco", en: "Brazilian barbecue" }, { pt: "Picanha", en: "Rump cap steak" }, { pt: "Acarajé", en: "Fried bean cake" }, { pt: "Moqueca", en: "Fish coconut stew" },
    { pt: "Tapioca", en: "Tapioca crepe" }, { pt: "Açaí", en: "Açaí berry" }, { pt: "Guaraná", en: "Guaraná soft drink" }, { pt: "Cachaça", en: "Sugarcane spirit" },
    { pt: "Farofa", en: "Toasted manioc flour" }, { pt: "Pastel", en: "Fried pastry" }, { pt: "Cocada", en: "Coconut sweet" }, { pt: "Vatapá", en: "Shrimp & bread paste" },
    { pt: "Quindim", en: "Coconut egg custard" }, { pt: "Churrasquinho", en: "Skewer / BBQ stick" }, { pt: "Caldo verde", en: "Green broth soup" }, { pt: "Canjica", en: "Sweet corn pudding" }
  ],
  "Literatura Brasileira": [
    { pt: "Romance", en: "Novel" }, { pt: "Conto", en: "Short story" }, { pt: "Poesia", en: "Poetry" }, { pt: "Escritor", en: "Writer" },
    { pt: "Personagem", en: "Character" }, { pt: "Narrador", en: "Narrator" }, { pt: "Enredo", en: "Plot" }, { pt: "Capítulo", en: "Chapter" },
    { pt: "Obra", en: "Work / Piece" }, { pt: "Publicar", en: "To publish" }, { pt: "Editora", en: "Publisher" }, { pt: "Alquimista", en: "Alchemist" },
    { pt: "Lenda", en: "Legend" }, { pt: "Mito", en: "Myth" }, { pt: "Livraria", en: "Bookshop" }, { pt: "Tradução", en: "Translation" },
    { pt: "Autor", en: "Author" }, { pt: "Leitor", en: "Reader" }, { pt: "Crónica", en: "Chronicle / column" }, { pt: "Poema", en: "Poem" }
  ],
};

export const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
