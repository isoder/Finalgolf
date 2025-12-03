import { ScoreTerm } from './types';

export const DEFAULT_PARS_9 = [3, 4, 5, 4, 4, 3, 5, 4, 4]; // Total 36
export const DEFAULT_PARS_18 = [
  ...DEFAULT_PARS_9,
  4, 3, 4, 5, 4, 3, 4, 5, 4 // Arbitrary back 9, Total 72
];

export const getScoreTerm = (par: number, strokes: number): ScoreTerm => {
  const diff = strokes - par;
  if (diff <= -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double Bogey';
  return 'Triple Bogey+';
};

export const getScoreColor = (par: number, strokes: number | null): string => {
  if (strokes === null) return 'bg-white border-slate-200 text-slate-400';
  
  const diff = strokes - par;
  
  if (diff <= -2) return 'bg-purple-100 border-purple-500 text-purple-700 font-bold'; // Eagle/Albatross
  if (diff === -1) return 'bg-red-50 border-red-500 text-red-600 font-bold'; // Birdie
  if (diff === 0) return 'bg-green-50 border-green-500 text-green-700 font-bold'; // Par
  if (diff === 1) return 'bg-blue-50 border-blue-500 text-blue-700 font-bold'; // Bogey
  return 'bg-slate-800 border-slate-900 text-white font-bold'; // Double Bogey+
};

export const formatScoreToPar = (score: number): string => {
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
};