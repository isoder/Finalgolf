export interface Hole {
  number: number;
  par: number;
}

export interface Player {
  id: string;
  name: string;
  photoUrl?: string;
  handicap?: number;
  scores: Record<number, number | null>; // Map hole number to strokes
}

export type CourseType = 9 | 18;

export interface GameState {
  status: 'setup' | 'playing' | 'finished';
  players: Player[];
  courseType: CourseType;
  course: Hole[];
}

export type ScoreTerm = 'Albatross' | 'Eagle' | 'Birdie' | 'Par' | 'Bogey' | 'Double Bogey' | 'Triple Bogey+';