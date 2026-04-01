import { useState } from 'react';
import confetti from 'canvas-confetti';
import { getRandomWords, shuffleArray, vocabulary, alphabet, getRandomLetters, getWordsNotStartingWith, type Word } from '../data/vocabulary';
import { type GameMode, type OptionItem, type GameState } from '../types/game';
import { speak } from '../utils/audio';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [stage, setStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);
  
  const [mode, setMode] = useState<GameMode>('match_word');
  const [targetWord, setTargetWord] = useState<Word | null>(null);
  const [targetLetter, setTargetLetter] = useState<string>('');
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<OptionItem | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
  const [seenWords, setSeenWords] = useState<string[]>([]);
  const [seenLetters, setSeenLetters] = useState<string[]>([]);

  const nextQuestion = () => {
    const modes: GameMode[] = ['match_word', 'starts_with', 'guess_first_letter', 'find_letter'];
    const selectedMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(selectedMode);
    
    let opts: OptionItem[] = [];
    let audioToSpeak = '';
    
    if (selectedMode !== 'find_letter') {
      let availableWords = vocabulary.filter(v => !seenWords.includes(v.id));
      if (availableWords.length === 0) {
        availableWords = [...vocabulary];
        setSeenWords([]);
      }
      const newTarget = shuffleArray(availableWords)[0];
      setSeenWords(prev => Array.from(new Set([...prev, newTarget.id])));
      setTargetWord(newTarget);
      
      if (selectedMode === 'match_word') {
        audioToSpeak = newTarget.word;
        const wrongWords = getRandomWords(3, newTarget.id);
        const allWords = shuffleArray([...wrongWords, newTarget]);
        opts = allWords.map(w => ({ id: w.id, display: w.emoji, audioText: w.word }));
      } else if (selectedMode === 'starts_with') {
        const startLetter = newTarget.word.charAt(0).toUpperCase();
        setTargetLetter(startLetter);
        audioToSpeak = `Qual começa com a letra ${startLetter}?`;
        const wrongWords = getWordsNotStartingWith(startLetter, 3);
        const allWords = shuffleArray([...wrongWords, newTarget]);
        opts = allWords.map(w => ({ id: w.id, display: w.emoji, audioText: w.word }));
      } else if (selectedMode === 'guess_first_letter') {
        const correctLetter = newTarget.word.charAt(0).toUpperCase();
        setTargetLetter(correctLetter);
        audioToSpeak = `Com qual letra começa a palavra ${newTarget.word}?`;
        const wrongLetters = getRandomLetters(3, correctLetter);
        const allLetters = shuffleArray([...wrongLetters, correctLetter]);
        opts = allLetters.map(l => ({ id: l, display: l, isText: true, audioText: l }));
      }
    } else {
      let availableLetters = alphabet.filter(l => !seenLetters.includes(l));
      if (availableLetters.length === 0) {
        availableLetters = [...alphabet];
        setSeenLetters([]);
      }
      const letter = shuffleArray(availableLetters)[0];
      setSeenLetters(prev => Array.from(new Set([...prev, letter])));
      setTargetLetter(letter);
      audioToSpeak = `Onde está a letra ${letter}?`;
      
      const wrongLetters = getRandomLetters(3, letter);
      const allLetters = shuffleArray([...wrongLetters, letter]);
      opts = allLetters.map(l => ({ id: l, display: l, isText: true, audioText: l }));
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
    setSeenWords([]);
    setSeenLetters([]);
    nextQuestion();
  };

  const getTargetId = () => {
    if (mode === 'match_word' || mode === 'starts_with') return targetWord?.id;
    if (mode === 'guess_first_letter' || mode === 'find_letter') return targetLetter;
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
    else if (mode === 'guess_first_letter') speak(`Com qual letra começa a palavra ${targetWord?.word}?`);
    else if (mode === 'find_letter') speak(`Onde está a letra ${targetLetter}?`);
  };

  const handleOptClick = (opt: OptionItem) => {
    setSelectedOpt(opt);
    if (opt.audioText) speak(opt.audioText);
  };

  const handleContinueOrRetry = () => {
    if (isCorrect) nextQuestion();
    else {
      setIsChecked(false);
      setSelectedOpt(null);
    }
  };

  return {
    gameState,
    stage,
    progress,
    lives,
    mode,
    targetWord,
    targetLetter,
    options,
    selectedOpt,
    isChecked,
    isCorrect,
    startGame,
    checkAnswer,
    nextLevel,
    replayAudio,
    getTargetId,
    handleOptClick,
    handleContinueOrRetry
  };
}
