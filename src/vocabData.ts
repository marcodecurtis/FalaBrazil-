export interface VocabItem {
  pt: string;
  en: string;
}

export const VOCAB_LIBRARY: Record<string, VocabItem[]> = {
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
  ]
};

export const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
