import React from 'react';
import { Hole, Player } from '../types';
import { getScoreTerm, getScoreColor } from '../constants';
import { Minus, Plus, User } from 'lucide-react';

interface HoleCardProps {
  hole: Hole;
  players: Player[];
  onUpdateScore: (playerId: string, holeNumber: number, newScore: number) => void;
  isActive: boolean;
  onPlayerClick?: (player: Player) => void;
}

const HoleCard: React.FC<HoleCardProps> = ({ hole, players, onUpdateScore, isActive, onPlayerClick }) => {
  // If not active, we might show a summary or nothing. For this vertical scroll design, we render all content.
  // The isActive prop helps with visual highlighting.

  return (
    <div 
      id={`hole-${hole.number}`}
      className={`relative rounded-2xl transition-all duration-300 overflow-hidden ${
        isActive 
          ? 'bg-white shadow-xl ring-2 ring-green-500 z-10' 
          : 'bg-white/80 shadow-sm border border-slate-100 opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
      }`}
    >
      {/* Header of the Card */}
      <div className="bg-slate-50 border-b border-slate-100 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-md">
                {hole.number}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase">Par {hole.par}</span>
        </div>
        {isActive && (
            <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full animate-pulse">
                Trou en cours
            </div>
        )}
      </div>

      {/* Players List for this Hole */}
      <div className="divide-y divide-slate-100">
        {players.map((player) => {
            const strokes = player.scores[hole.number];
            const currentScore = strokes ?? hole.par;
            const term = strokes !== null ? getScoreTerm(hole.par, strokes) : 'À jouer';
            const colorClass = getScoreColor(hole.par, strokes);

            return (
                <div key={player.id} className="p-3 flex items-center gap-3">
                    {/* Player Info - Clickable */}
                    <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                        onClick={() => onPlayerClick?.(player)}
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0 group-hover:border-green-400 transition-colors">
                            {player.photoUrl ? (
                                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-300" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 truncate group-hover:text-green-700 transition-colors">{player.name}</div>
                            <div className={`text-[10px] font-medium truncate ${strokes ? 'text-slate-500' : 'text-slate-300'}`}>
                                {term}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // prevent card click if any
                                if (currentScore > 1) onUpdateScore(player.id, hole.number, currentScore - 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
                        >
                            <Minus className="w-4 h-4" />
                        </button>

                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl border font-bold text-lg transition-colors ${colorClass}`}>
                            {strokes ?? '-'}
                        </div>

                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdateScore(player.id, hole.number, currentScore + 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default HoleCard;