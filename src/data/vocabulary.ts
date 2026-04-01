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
  { id: '20', word: 'Urso', emoji: '🐻' },
  { id: '21', word: 'Pão', emoji: '🍞' },
  { id: '22', word: 'Avião', emoji: '✈️' },
  { id: '23', word: 'Ovo', emoji: '🥚' },
  { id: '24', word: 'Robô', emoji: '🤖' },
  { id: '25', word: 'Ioiô', emoji: '🪀' },
  { id: '26', word: 'Abelha', emoji: '🐝' },
  { id: '27', word: 'Fantasma', emoji: '👻' },
  { id: '28', word: 'Palhaço', emoji: '🤡' },
  { id: '29', word: 'Abóbora', emoji: '🎃' },
  { id: '30', word: 'Mão', emoji: '✋' },
  { id: '31', word: 'Língua', emoji: '👅' },
  { id: '32', word: 'Boca', emoji: '👄' },
  { id: '33', word: 'Olho', emoji: '👀' },
  { id: '34', word: 'Ossos', emoji: '🦴' },
  { id: '35', word: 'Dente', emoji: '🦷' },
  { id: '36', word: 'Pé', emoji: '🦶' },
  { id: '37', word: 'Orelha', emoji: '👂' },
  { id: '38', word: 'Pegadas', emoji: '👣' },
  { id: '39', word: 'Coração', emoji: '❤️' },
  { id: '40', word: 'Cérebro', emoji: '🧠' },
  { id: '41', word: 'Unhas', emoji: '💅' },
  { id: '42', word: 'Policial', emoji: '👮‍♂️' },
  { id: '43', word: 'Pedreiro', emoji: '👷‍♂️' },
  { id: '44', word: 'Professora', emoji: '👩‍🏫' },
  { id: '45', word: 'Médico', emoji: '👨‍⚕️' },
  { id: '46', word: 'Papai Noel', emoji: '🎅' },
  { id: '47', word: 'Princesa', emoji: '👸' },
  { id: '48', word: 'Vampiro', emoji: '🧛‍♂️' },
  { id: '49', word: 'Bruxa', emoji: '🧙‍♀️' },
  { id: '50', word: 'Boné', emoji: '🧢' },
  { id: '51', word: 'Chapéu', emoji: '🎩' },
  { id: '52', word: 'Óculos', emoji: '👓' },
  { id: '53', word: 'Bolsa', emoji: '👜' },
  { id: '54', word: 'Batom', emoji: '💄' },
  { id: '55', word: 'Guarda-chuva', emoji: '☂️' },
  { id: '56', word: 'Coroa', emoji: '👑' },
  { id: '57', word: 'Sapato', emoji: '👞' },
  { id: '58', word: 'Meia', emoji: '🧦' },
  { id: '59', word: 'Luva', emoji: '🧤' },
  { id: '60', word: 'Cachecol', emoji: '🧣' },
  { id: '61', word: 'Mochila', emoji: '🎒' },
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
