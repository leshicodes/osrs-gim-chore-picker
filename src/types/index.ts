export interface Chore {
  name: string;
  type: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;
  count?: {
    min: number;
    max: number;
    value?: number; // For holding the randomly generated value
  };
}

export type ChoreType = 'afk' | 'gathering' | 'boss' | string;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SpinResult {
  chore: Chore | null;
  isSpinning: boolean;
}
