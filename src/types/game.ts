// Game types

export type GameMode = 'match_word' | 'starts_with' | 'guess_first_letter' | 'find_letter';
export type OptionItem = { id: string; display: string; isText?: boolean; audioText?: string };
export type GameState = 'menu' | 'playing' | 'level_complete';
