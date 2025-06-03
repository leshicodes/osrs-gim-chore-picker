export interface Chore {
  name: string;
  type: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;
}

export type ChoreType = 'afk' | 'gathering' | 'boss' | string;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SpinResult {
  chore: Chore | null;
  isSpinning: boolean;
}
