export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.85; // friendly and clear pace
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};
