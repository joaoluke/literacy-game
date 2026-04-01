import { useState } from 'react';
import { Heart, Volume2, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type Word, getRandomWords, shuffleArray, vocabulary, alphabet, getRandomLetters, getWordsNotStartingWith } from './data/vocabulary';

// Use Web Speech API for reading Portuguese text
const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.85; // friendly and clear pace
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
};

type GameMode = 'match_word' | 'starts_with' | 'find_letter';
type OptionItem = { id: string; display: string; isText?: boolean };

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'level_complete'>('menu');
  const [stage, setStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);
  
  // Question state
  const [mode, setMode] = useState<GameMode>('match_word');
  const [targetWord, setTargetWord] = useState<Word | null>(null);
  const [targetLetter, setTargetLetter] = useState<string>('');
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<OptionItem | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Initialize a new question
  const nextQuestion = () => {
    // Randomly pick a mode
    const modes: GameMode[] = ['match_word', 'starts_with', 'find_letter'];
    const selectedMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(selectedMode);
    
    let opts: OptionItem[] = [];
    let audioToSpeak = '';
    
    if (selectedMode === 'match_word') {
      const newTarget = getRandomWords(1)[0];
      setTargetWord(newTarget);
      audioToSpeak = newTarget.word;
      
      const wrongWords = getRandomWords(3, newTarget.id);
      const allWords = shuffleArray([...wrongWords, newTarget]);
      opts = allWords.map(w => ({ id: w.id, display: w.emoji }));
      
    } else if (selectedMode === 'starts_with') {
      const newTarget = getRandomWords(1)[0];
      setTargetWord(newTarget);
      const startLetter = newTarget.word.charAt(0).toUpperCase();
      setTargetLetter(startLetter);
      audioToSpeak = `Qual começa com a letra ${startLetter}?`;
      
      const wrongWords = getWordsNotStartingWith(startLetter, 3);
      const allWords = shuffleArray([...wrongWords, newTarget]);
      opts = allWords.map(w => ({ id: w.id, display: w.emoji }));
      
    } else if (selectedMode === 'find_letter') {
      const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      setTargetLetter(letter);
      audioToSpeak = `Onde está a letra ${letter}?`;
      
      const wrongLetters = getRandomLetters(3, letter);
      const allLetters = shuffleArray([...wrongLetters, letter]);
      opts = allLetters.map(l => ({ id: l, display: l, isText: true }));
    }
    
    setOptions(opts);
    setSelectedOpt(null);
    setIsChecked(false);
    setIsCorrect(false);
    
    setTimeout(() => {
      speak(audioToSpeak);
    }, 500);
  };

  const startGame = () => {
    setGameState('playing');
    setStage(1);
    setProgress(0);
    setLives(5);
    nextQuestion();
  };

  const getTargetId = () => {
    if (mode === 'match_word' || mode === 'starts_with') return targetWord?.id;
    if (mode === 'find_letter') return targetLetter;
    return '';
  };

  const checkAnswer = () => {
    if (!selectedOpt) return;
    
    const isAnsCorrect = selectedOpt.id === getTargetId();
    
    setIsChecked(true);
    if (isAnsCorrect) {
      setIsCorrect(true);
      speak('Muito bem!');
      const newProgress = progress + 1;
      if (newProgress >= 5) {
        setTimeout(() => {
          setGameState('level_complete');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#58cc02', '#1cb0f6', '#ff4b4b', '#ffc800']
          });
          speak(`Parabéns! Nível ${stage} concluído!`);
        }, 1500);
      } else {
        setProgress(newProgress);
      }
    } else {
      setIsCorrect(false);
      speak('Ops, tente de novo!');
      setLives((prev) => Math.max(0, prev - 1));
    }
  };

  const nextLevel = () => {
    setStage(stage + 1);
    setProgress(0);
    setGameState('playing');
    nextQuestion();
  };

  const replayAudio = () => {
    if (mode === 'match_word') speak(targetWord?.word || '');
    else if (mode === 'starts_with') speak(`Qual começa com a letra ${targetLetter}?`);
    else if (mode === 'find_letter') speak(`Onde está a letra ${targetLetter}?`);
  };

  if (gameState === 'menu') {
    return (
      <div className="main-menu">
        <Star size={80} color="#ffc800" style={{ marginBottom: 20 }} className="animate-pop" />
        <h1>Aprender Brincando</h1>
        <p>Um jogo divertido para aprender a ler!</p>
        <button className="btn-3d" onClick={startGame}>
          COMEÇAR A JOGAR
        </button>
      </div>
    );
  }

  if (gameState === 'level_complete') {
    return (
      <div className="main-menu" style={{ backgroundColor: '#d7ffb8' }}>
        <Star size={100} color="#ffc800" fill="#ffc800" style={{ marginBottom: 20 }} className="animate-bounce-in" />
        <h1 style={{ color: '#58cc02' }}>Nível {stage} Concluído!</h1>
        <p>Você é incrível! Vamos continuar?</p>
        <button className="btn-3d" onClick={nextLevel}>
          PRÓXIMO NÍVEL
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="top-bar">
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${(progress / 5) * 100}%` }}></div>
        </div>
        <div className="hearts">
          <Heart size={24} fill="#ff4b4b" color="#ff4b4b" className={lives < 5 ? "animate-shake" : ""} />
          <span>{lives}</span>
        </div>
      </div>

      <div className="game-area">
        {lives === 0 ? (
          <div className="main-menu" style={{ flex: 1, padding: 0 }}>
            <h1 style={{ color: '#ff4b4b' }}>Fim de jogo</h1>
            <p>Você tentou muito bem! Vamos recomeçar?</p>
            <button className="btn-3d danger" onClick={startGame} style={{ marginTop: 20 }}>
              TENTAR NOVAMENTE
            </button>
          </div>
        ) : (
          <>
            <h2 className="question-title">
              {mode === 'match_word' && 'Qual é a imagem para:'}
              {mode === 'starts_with' && 'Qual imagem começa com:'}
              {mode === 'find_letter' && 'Onde está a letra:'}
            </h2>
            
            <button 
              className="speaker-btn animate-pop" 
              onClick={replayAudio}
              aria-label="Ouvir"
            >
              <Volume2 size={32} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, marginBottom: '30px', color: '#58cc02', letterSpacing: '2px' }}>
              {mode === 'match_word' && targetWord?.word.toUpperCase()}
              {mode === 'starts_with' && targetLetter}
              {mode === 'find_letter' && targetLetter}
            </p>

            <div className="options-grid">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  disabled={isChecked}
                  className={`card-btn 
                    ${selectedOpt?.id === opt.id ? 'selected' : ''} 
                    ${isChecked && opt.id === getTargetId() ? 'correct' : ''} 
                    ${isChecked && selectedOpt?.id === opt.id && selectedOpt?.id !== getTargetId() ? 'wrong' : ''}
                  `}
                  style={opt.isText ? { fontSize: '4rem', color: '#1cb0f6' } : {}}
                  onClick={() => setSelectedOpt(opt)}
                >
                  {opt.display}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bottom-actions">
        {lives > 0 && (
          isChecked ? (
            <>
              <div className={`result-banner ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? 'Excelente!' : 'Ops, não é essa.'}
              </div>
              <button 
                className={`btn-3d ${isCorrect ? '' : 'danger'}`} 
                onClick={isCorrect ? nextQuestion : () => {
                  setIsChecked(false);
                  setSelectedOpt(null);
                }}
              >
                {isCorrect ? 'CONTINUAR' : 'ENTENDI'}
              </button>
            </>
          ) : (
             <button 
               className="btn-3d" 
               disabled={!selectedOpt}
               onClick={checkAnswer}
               style={{ padding: '20px 24px', fontSize: '1.4rem' }}
             >
               VERIFICAR
             </button>
           )
        )}
      </div>
    </>
  );
}
