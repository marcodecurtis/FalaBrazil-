import { useState } from 'react';
import './VideoStudio.css';

interface Props {
  onBack: () => void;
  userLevel: string | null;
}

interface Video {
  id: string;
  title: string;
  level: string;
  topic: string;
  duration: string;
  vocabulary: { word: string; translation: string }[];
}

const ALL_VIDEOS: Video[] = [
  {
    id: 'tRUJZUtXShA',
    title: 'Common Portuguese Questions You\'ll Actually Use',
    level: 'A1',
    topic: 'Conversation',
    duration: '~8 min',
    vocabulary: [
      { word: 'Como se chama?', translation: 'What is your name?' },
      { word: 'De onde é?', translation: 'Where are you from?' },
      { word: 'Quanto custa?', translation: 'How much does it cost?' },
      { word: 'Onde fica?', translation: 'Where is it?' },
      { word: 'Que horas são?', translation: 'What time is it?' },
      { word: 'Por favor', translation: 'Please' },
      { word: 'Obrigado/a', translation: 'Thank you' },
      { word: 'Com licença', translation: 'Excuse me' },
    ],
  },
  {
    id: 'ZMZ7B7gpXQM',
    title: 'How Brazilians Really Introduce Themselves',
    level: 'A1',
    topic: 'Culture',
    duration: '~8 min',
    vocabulary: [
      { word: 'Prazer em conhecer', translation: 'Nice to meet you' },
      { word: 'Me chamo', translation: 'My name is' },
      { word: 'Sou de', translation: 'I am from' },
      { word: 'Tenho anos', translation: 'I am ... years old' },
      { word: 'Trabalho como', translation: 'I work as' },
      { word: 'Moro em', translation: 'I live in' },
      { word: 'Falo inglês', translation: 'I speak English' },
      { word: 'Estou aprendendo', translation: 'I am learning' },
    ],
  },
  {
    id: '2f3YBM1ui0s',
    title: 'Portuguese Conjugation: Verbs Ending in ER',
    level: 'A2',
    topic: 'Grammar',
    duration: '~10 min',
    vocabulary: [
      { word: 'Comer', translation: 'To eat' },
      { word: 'Beber', translation: 'To drink' },
      { word: 'Escrever', translation: 'To write' },
      { word: 'Vender', translation: 'To sell' },
      { word: 'Responder', translation: 'To answer' },
      { word: 'Correr', translation: 'To run' },
      { word: 'Aprender', translation: 'To learn' },
      { word: 'Entender', translation: 'To understand' },
    ],
  },
  {
    id: 'EaapayxSl2w',
    title: 'Padaria em São Paulo — Bakery Vocabulary',
    level: 'B1',
    topic: 'Food',
    duration: '~10 min',
    vocabulary: [
      { word: 'Padaria', translation: 'Bakery' },
      { word: 'Pão de queijo', translation: 'Cheese bread' },
      { word: 'Coxinha', translation: 'Chicken croquette' },
      { word: 'Pastel', translation: 'Fried pastry' },
      { word: 'Café com leite', translation: 'Coffee with milk' },
      { word: 'Balcão', translation: 'Counter' },
      { word: 'Cardápio', translation: 'Menu' },
      { word: 'Para viagem', translation: 'To go / takeaway' },
    ],
  },
  {
    id: 'y9J9WFt0BAY',
    title: 'Rio de Janeiro\'s Most Iconic Places',
    level: 'B1',
    topic: 'Travel',
    duration: '~10 min',
    vocabulary: [
      { word: 'Cristo Redentor', translation: 'Christ the Redeemer' },
      { word: 'Pão de Açúcar', translation: 'Sugar Loaf Mountain' },
      { word: 'Ipanema', translation: 'Famous Rio beach neighbourhood' },
      { word: 'Bonde', translation: 'Tram / cable car' },
      { word: 'Mirante', translation: 'Viewpoint' },
      { word: 'Cartão postal', translation: 'Postcard / landmark' },
      { word: 'Maravilhoso', translation: 'Marvellous' },
      { word: 'Paisagem', translation: 'Landscape / scenery' },
    ],
  },
  {
    id: 'vHeXBOe1A_A',
    title: 'Viagem pelos Lugares Mais Incríveis do Brasil',
    level: 'B2',
    topic: 'Travel',
    duration: '~30 min',
    vocabulary: [
      { word: 'Biodiversidade', translation: 'Biodiversity' },
      { word: 'Patrimônio natural', translation: 'Natural heritage' },
      { word: 'Chapada', translation: 'Plateau / highland' },
      { word: 'Cachoeira', translation: 'Waterfall' },
      { word: 'Cerrado', translation: 'Brazilian savanna' },
      { word: 'Pantanal', translation: 'World\'s largest wetland' },
      { word: 'Ecossistema', translation: 'Ecosystem' },
      { word: 'Preservação', translation: 'Preservation' },
    ],
  },
  {
    id: 'SeDXen3LqrA',
    title: 'Aprenda a Cozinhar com o Chef — Gratuito',
    level: 'C1',
    topic: 'Food',
    duration: '~30 min',
    vocabulary: [
      { word: 'Refogue', translation: 'Sauté' },
      { word: 'Temperar', translation: 'To season' },
      { word: 'Ponto certo', translation: 'Perfect consistency / done just right' },
      { word: 'Ingredientes', translation: 'Ingredients' },
      { word: 'Pitada', translation: 'Pinch (of salt etc.)' },
      { word: 'Fogo médio', translation: 'Medium heat' },
      { word: 'Mexer', translation: 'To stir' },
      { word: 'Rendimento', translation: 'Yield / servings' },
    ],
  },
  {
    id: 'DqtPZVBhfNw',
    title: 'Roda Viva: Sérgio Moro — Entrevista Completa',
    level: 'C1',
    topic: 'Politics',
    duration: '~60 min',
    vocabulary: [
      { word: 'Lavagem de dinheiro', translation: 'Money laundering' },
      { word: 'Corrupção', translation: 'Corruption' },
      { word: 'Investigação', translation: 'Investigation' },
      { word: 'Poder judiciário', translation: 'Judicial power' },
      { word: 'Impunidade', translation: 'Impunity' },
      { word: 'Delação premiada', translation: 'Plea deal / whistleblowing agreement' },
      { word: 'Mandato', translation: 'Mandate / term in office' },
      { word: 'Transparência', translation: 'Transparency' },
    ],
  },
  {
    id: 'lDL59dkeTi0',
    title: 'Roda Viva: Jair Bolsonaro — Entrevista Completa',
    level: 'C2',
    topic: 'Politics',
    duration: '~60 min',
    vocabulary: [
      { word: 'Soberania', translation: 'Sovereignty' },
      { word: 'Segurança pública', translation: 'Public safety' },
      { word: 'Ideologia', translation: 'Ideology' },
      { word: 'Reformas estruturais', translation: 'Structural reforms' },
      { word: 'Polarização', translation: 'Polarisation' },
      { word: 'Discurso', translation: 'Speech / discourse' },
      { word: 'Contraditório', translation: 'Contradictory / right of reply' },
      { word: 'Pleito eleitoral', translation: 'Electoral contest' },
    ],
  },
  {
    id: '428D7a9qt1k',
    title: 'Jornal Nacional: Tecnologia e o Futuro do Planeta',
    level: 'C1',
    topic: 'Technology',
    duration: '~5 min',
    vocabulary: [
      { word: 'Inteligência artificial', translation: 'Artificial intelligence' },
      { word: 'Sustentabilidade', translation: 'Sustainability' },
      { word: 'Emissões de carbono', translation: 'Carbon emissions' },
      { word: 'Inovação', translation: 'Innovation' },
      { word: 'Desafio global', translation: 'Global challenge' },
      { word: 'Impacto ambiental', translation: 'Environmental impact' },
      { word: 'Transformação digital', translation: 'Digital transformation' },
      { word: 'Futuro do trabalho', translation: 'Future of work' },
    ],
  },
];

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const NEXT_LEVEL: Record<string, string> = { A1: 'A2', A2: 'B1', B1: 'B2', B2: 'C1', C1: 'C2', C2: 'C2' };
const LEVEL_COLORS: Record<string, string> = {
  A1: '#16a34a', A2: '#15803d',
  B1: '#0284c7', B2: '#0369a1',
  C1: '#7c3aed', C2: '#6d28d9',
};

function getVideosForLevel(userLevel: string | null): Video[] {
  if (!userLevel) return ALL_VIDEOS;
  const next = NEXT_LEVEL[userLevel] || userLevel;
  return ALL_VIDEOS.filter(v => v.level === userLevel || v.level === next);
}

export default function VideoStudio({ userLevel }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  const videos = getVideosForLevel(userLevel);

  const handleAskClaude = async () => {
    if (!question.trim() || !selectedVideo) return;
    setLoadingAnswer(true);
    setAnswer('');
    try {
      const response = await fetch('/api/ask-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `The user is watching a Brazilian Portuguese video called "${selectedVideo.title}" (topic: ${selectedVideo.topic}, CEFR level: ${selectedVideo.level}). They ask: "${question}". Give a clear, helpful answer in English appropriate for a ${selectedVideo.level} learner. Keep it concise — 2-4 sentences max.`,
        }),
      });
      const data = await response.json();
      setAnswer(data.text || 'Sorry, something went wrong.');
    } catch {
      setAnswer('Sorry, something went wrong. Please try again.');
    } finally {
      setLoadingAnswer(false);
    }
  };

  if (selectedVideo) {
    return (
      <div className="vs-detail">
        <button className="vs-back-btn" onClick={() => { setSelectedVideo(null); setAnswer(''); setQuestion(''); setShowVocab(false); }}>
          ← Back to videos
        </button>

        <div className="vs-detail-header">
          <span className="vs-level-tag" style={{ background: LEVEL_COLORS[selectedVideo.level] }}>
            {selectedVideo.level}
          </span>
          <span className="vs-topic-tag">{selectedVideo.topic}</span>
          <span className="vs-duration">{selectedVideo.duration}</span>
        </div>

        <h2 className="vs-detail-title">{selectedVideo.title}</h2>

        {/* YouTube embed */}
        <div className="vs-embed-wrap">
          <iframe
            className="vs-embed"
            src={`https://www.youtube.com/embed/${selectedVideo.id}`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Vocabulary */}
        <div className="vs-section">
          <button className="vs-section-toggle" onClick={() => setShowVocab(!showVocab)}>
            <span>📚 Key Vocabulary ({selectedVideo.vocabulary.length} words)</span>
            <span>{showVocab ? '▲' : '▼'}</span>
          </button>
          {showVocab && (
            <div className="vs-vocab-grid">
              {selectedVideo.vocabulary.map((v, i) => (
                <div key={i} className="vs-vocab-card">
                  <div className="vs-vocab-pt">{v.word}</div>
                  <div className="vs-vocab-en">{v.translation}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ask Claude */}
        <div className="vs-section">
          <div className="vs-ask-header">
            <span>🤖 Ask about this video</span>
            <span className="vs-ask-hint">Type any word, phrase or question</span>
          </div>
          <div className="vs-ask-input-row">
            <input
              className="vs-ask-input"
              type="text"
              placeholder='e.g. "What does padaria mean?" or "Why did they use subjunctive here?"'
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskClaude()}
            />
            <button className="vs-ask-btn" onClick={handleAskClaude} disabled={loadingAnswer || !question.trim()}>
              {loadingAnswer ? '...' : 'Ask'}
            </button>
          </div>
          {answer && (
            <div className="vs-answer">
              <div className="vs-answer-label">Claude says:</div>
              <div className="vs-answer-text">{answer}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="vs-root">
      <div className="vs-header">
        <h2 className="vs-title">Watch & Learn</h2>
        {userLevel && (
          <p className="vs-subtitle">
            Showing videos for your level ({userLevel} + {NEXT_LEVEL[userLevel]})
          </p>
        )}
      </div>

      {/* My Level videos */}
      <div className="vs-video-list">
        {videos.map(video => (
          <div key={video.id} className="vs-card" onClick={() => setSelectedVideo(video)}>
            <div className="vs-thumbnail">
              <img
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="vs-thumb-img"
              />
              <div className="vs-play-overlay">▶</div>
            </div>
            <div className="vs-card-body">
              <div className="vs-card-tags">
                <span className="vs-level-tag" style={{ background: LEVEL_COLORS[video.level] }}>{video.level}</span>
                <span className="vs-topic-tag">{video.topic}</span>
                <span className="vs-duration">{video.duration}</span>
              </div>
              <h3 className="vs-card-title">{video.title}</h3>
              <div className="vs-card-vocab">{video.vocabulary.length} key words included</div>
            </div>
          </div>
        ))}
      </div>

      {/* All other levels */}
      {userLevel && (
        <div className="vs-other-section">
          <div className="vs-other-label">All levels</div>
          {LEVEL_ORDER.map(level => {
            const levelVideos = ALL_VIDEOS.filter(v => v.level === level);
            if (levelVideos.length === 0) return null;
            return (
              <div key={level} className="vs-level-group">
                <div className="vs-level-heading">
                  <span className="vs-level-tag" style={{ background: LEVEL_COLORS[level] }}>{level}</span>
                </div>
                {levelVideos.map(video => (
                  <div key={video.id} className="vs-card vs-card-compact" onClick={() => setSelectedVideo(video)}>
                    <div className="vs-thumbnail vs-thumbnail-sm">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="vs-thumb-img"
                      />
                      <div className="vs-play-overlay vs-play-sm">▶</div>
                    </div>
                    <div className="vs-card-body">
                      <div className="vs-card-tags">
                        <span className="vs-topic-tag">{video.topic}</span>
                        <span className="vs-duration">{video.duration}</span>
                      </div>
                      <h3 className="vs-card-title vs-card-title-sm">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
