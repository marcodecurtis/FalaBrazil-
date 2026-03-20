export const speak = (text: string) => {
    window.speechSynthesis.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };
  