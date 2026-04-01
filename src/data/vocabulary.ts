export type Word = {
  id: string;
  word: string;
  emoji: string;
};

export const vocabulary: Word[] = [
  { id: '1', word: 'Maçã', emoji: '🍎' },
  { id: '2', word: 'Gato', emoji: '🐱' },
  { id: '3', word: 'Cachorro', emoji: '🐶' },
  { id: '4', word: 'Bola', emoji: '⚽' },
  { id: '5', word: 'Pato', emoji: '🦆' },
  { id: '6', word: 'Casa', emoji: '🏠' },
  { id: '7', word: 'Sol', emoji: '☀️' },
  { id: '8', word: 'Flor', emoji: '🌸' },
  { id: '9', word: 'Carro', emoji: '🚗' },
  { id: '10', word: 'Estrela', emoji: '⭐' },
  { id: '11', word: 'Cadeira', emoji: '🪑' },
  { id: '12', word: 'Lua', emoji: '🌙' },
  { id: '13', word: 'Dado', emoji: '🎲' },
  { id: '14', word: 'Bolo', emoji: '🎂' },
  { id: '15', word: 'Sapo', emoji: '🐸' },
  { id: '16', word: 'Peixe', emoji: '🐟' },
  { id: '17', word: 'Uva', emoji: '🍇' },
  { id: '18', word: 'Banana', emoji: '🍌' },
  { id: '19', word: 'Leão', emoji: '🦁' },
  { id: '20', word: 'Urso', emoji: '🐻' }
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function getRandomWords(count: number, excludeId?: string): Word[] {
  let pool = excludeId ? vocabulary.filter(v => v.id !== excludeId) : [...vocabulary];
  pool = shuffleArray(pool);
  return pool.slice(0, count);
}

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function getRandomLetters(count: number, excludeLetter?: string): string[] {
  let pool = excludeLetter ? alphabet.filter(l => l !== excludeLetter) : [...alphabet];
  pool = shuffleArray(pool);
  return pool.slice(0, count);
}

export function getWordsNotStartingWith(letter: string, count: number): Word[] {
  let pool = vocabulary.filter(v => !v.word.toUpperCase().startsWith(letter.toUpperCase()));
  pool = shuffleArray(pool);
  return pool.slice(0, count);
}
