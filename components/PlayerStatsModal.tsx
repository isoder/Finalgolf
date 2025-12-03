import React from 'react';
import { Player, Hole } from '../types';
import { getScoreColor, formatScoreToPar } from '../constants';
import { X, User, TrendingUp } from 'lucide-react';

interface PlayerStatsModalProps {
  player: Player;
  course: Hole[];
  onClose: () => void;
}

const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({ player, course, onClose }) => {
  // Calculate stats
  let totalStrokes = 0;
  let totalPar = 0;
  const stats = {
    eagle: 0,
    birdie: 0,
    par: 0,
    bogey: 0,
    double: 0,
    worse: 0
  };

  const holeDetails = course.map(hole => {
    const strokes = player.scores[hole.number];
    let color = 'bg-slate-100 text-slate-400';
    let toPar = '-';

    if (strokes !== undefined && strokes !== null) {
      totalStrokes += strokes;
      totalPar += hole.par;
      const diff = strokes - hole.par;
      toPar = formatScoreToPar(diff);
      color = getScoreColor(hole.par, strokes);
      
      if (diff <= -2) stats.eagle++;
      else if (diff === -1) stats.birdie++;
      else if (diff === 0) stats.par++;
      else if (diff === 1) stats.bogey++;
      else if (diff === 2) stats.double++;
      else stats.worse++;
    }

    return { hole, strokes, color, toPar };
  });

  const currentScoreToPar = totalStrokes - totalPar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0">
               {player.photoUrl ? (
                 <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
               ) : (
                 <User className="w-8 h-8 m-3.5 text-slate-500" />
               )}
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {player.name}
                {player.handicap !== undefined && (
                   <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-normal border border-slate-600">
                       Hcp {player.handicap}
                   </span>
                )}
              </h2>
              <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>Total: <span className="text-white font-bold">{formatScoreToPar(currentScoreToPar)}</span> ({totalStrokes > 0 ? totalStrokes : '-'})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 shrink-0 border-b border-slate-100">
           <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
             <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Birdies+</div>
             <div className="text-lg font-black text-green-600">{stats.eagle + stats.birdie}</div>
           </div>
           <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
             <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pars</div>
             <div className="text-lg font-black text-slate-700">{stats.par}</div>
           </div>
           <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
             <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Bogeys+</div>
             <div className="text-lg font-black text-red-500">{stats.bogey + stats.double + stats.worse}</div>
           </div>
        </div>

        {/* Hole List */}
        <div className="overflow-y-auto p-0 flex-1 scrollbar-hide">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 text-xs font-bold text-slate-500 uppercase z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left">Trou</th>
                <th className="px-4 py-3 text-center">Par</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-right">Vs Par</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holeDetails.map(({ hole, strokes, color, toPar }) => (
                <tr key={hole.number} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-800">
                    Trou {hole.number}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 font-medium">
                    {hole.par}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {strokes !== undefined && strokes !== null ? (
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs shadow-sm ${color}`}>
                        {strokes}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-right font-black ${toPar.startsWith('-') ? 'text-green-600' : toPar.startsWith('+') ? 'text-red-500' : toPar === 'E' ? 'text-slate-600' : 'text-slate-300'}`}>
                    {toPar}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsModal;