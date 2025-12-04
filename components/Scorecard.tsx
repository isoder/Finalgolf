import React, { useState } from 'react';
import { GameState, Player, Hole } from '../types';
import { formatScoreToPar } from '../constants';
import PlayerStatsModal from './PlayerStatsModal';
import { RefreshCcw, Share2, User, Trophy } from 'lucide-react';

interface ScorecardProps {
  state: GameState;
  onRestart: () => void;
}

const Scorecard: React.FC<ScorecardProps> = ({ state, onRestart }) => {
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const holes = state.course;
  
  // Calculate final stats for sorting
  const getPlayerStats = (player: Player) => {
    let totalStrokes = 0;
    let totalPar = 0;
    
    holes.forEach(h => {
        totalPar += h.par;
        totalStrokes += (player.scores[h.number] || h.par); // Assume par if not played for sorting purposes ideally
    });

    return {
        ...player,
        totalStrokes,
        scoreToPar: totalStrokes - totalPar
    };
  };

  const rankedPlayers = state.players
      .map(getPlayerStats)
      .sort((a, b) => a.scoreToPar - b.scoreToPar);

  const winner = rankedPlayers[0];

  const renderGrid = (subsetHoles: Hole[], title: string) => {
    if (subsetHoles.length === 0) return null;

    return (
      <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-700 text-sm uppercase tracking-wider flex justify-between">
           <span>{title}</span>
           <span className="text-slate-400 text-xs">Par Total: {subsetHoles.reduce((acc, h) => acc + h.par, 0)}</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-3 py-2 text-left font-medium text-slate-400 border-b border-slate-100 min-w-[120px] sticky left-0 bg-slate-50 z-10">Joueur</th>
                {subsetHoles.map(h => (
                  <th key={h.number} className="px-1 py-2 text-center font-bold text-slate-600 border-b border-slate-100 min-w-[36px] border-l border-slate-100/50">
                    {h.number}
                    <div className="text-[9px] text-slate-400 font-normal">P{h.par}</div>
                  </th>
                ))}
                <th className="px-2 py-2 text-center font-bold text-slate-800 border-b border-slate-100 min-w-[50px] bg-slate-50 border-l border-slate-200">TOT</th>
              </tr>
            </thead>
            <tbody>
              {rankedPlayers.map((player, idx) => {
                  const subsetTotal = subsetHoles.reduce((acc, h) => acc + (player.scores[h.number] || 0), 0);
                  
                  return (
                    <tr key={player.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                        <td className="px-3 py-2 border-b border-slate-100 sticky left-0 bg-white z-10 shadow-[1px_0_5px_rgba(0,0,0,0.02)]">
                            <div 
                                className="flex items-center gap-2 cursor-pointer group"
                                onClick={() => setViewingPlayer(player)}
                            >
                                <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 group-hover:border-green-400 transition-colors">
                                    {player.photoUrl ? (
                                        <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-3 h-3 m-1.5 text-slate-400" />
                                    )}
                                </div>
                                <span className={`font-bold truncate max-w-[90px] group-hover:text-green-700 transition-colors ${idx === 0 ? 'text-yellow-600' : 'text-slate-700'}`}>
                                    {player.name}
                                </span>
                            </div>
                        </td>
                        {subsetHoles.map(h => {
                            const score = player.scores[h.number];
                            const diff = score ? score - h.par : 0;
                            let color = 'text-slate-400';
                            let bg = '';
                            
                            if (score) {
                                if (diff < 0) { color = 'text-red-600 font-bold'; bg = 'bg-red-50'; }
                                else if (diff > 0) { color = 'text-slate-800'; bg = ''; }
                                else { color = 'text-green-600 font-bold'; bg = 'bg-green-50'; }
                            }

                            return (
                                <td key={h.number} className={`px-1 py-2 text-center border-b border-l border-slate-100 ${bg}`}>
                                    <span className={color}>{score || '-'}</span>
                                </td>
                            );
                        })}
                        <td className="px-2 py-2 text-center font-black text-slate-800 border-b border-l border-slate-200 bg-slate-50">
                            {subsetTotal}
                        </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const front9 = holes.slice(0, 9);
  const back9 = holes.length > 9 ? holes.slice(9, 18) : [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Podium / Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 text-center">
           <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-4">
               <Trophy className="w-8 h-8 text-yellow-600" />
           </div>
           <h1 className="text-2xl font-black text-slate-900 mb-1">Résultats du Tournoi</h1>
           <p className="text-slate-400 text-sm uppercase tracking-widest mb-6">Classement Final</p>
           
           <div 
            className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setViewingPlayer(winner)}
           >
               <div className="w-24 h-24 rounded-full bg-yellow-50 overflow-hidden border-4 border-yellow-200 shadow-xl mb-3 flex items-center justify-center relative">
                    {winner.photoUrl ? (
                        <img src={winner.photoUrl} alt="Winner" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-10 h-10 text-yellow-300" />
                    )}
                    <div className="absolute -bottom-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        WINNER
                    </div>
               </div>
               <h2 className="text-xl font-bold text-slate-800">{winner.name}</h2>
               <div className={`text-3xl font-black mt-2 ${winner.scoreToPar < 0 ? 'text-red-500' : 'text-slate-800'}`}>
                   {formatScoreToPar(winner.scoreToPar)} <span className="text-sm font-normal text-slate-400 align-middle">({winner.totalStrokes})</span>
               </div>
           </div>
        </div>

        {/* Score Grids */}
        {renderGrid(front9, "Aller (Front 9)")}
        {renderGrid(back9, "Retour (Back 9)")}

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button 
            type="button"
            onClick={() => onRestart()}
            className="flex-1 flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw className="w-6 h-6 text-slate-600 mb-2" />
            <span className="text-sm font-bold text-slate-600">Nouveau Tournoi</span>
          </button>
          
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); window.print(); }}
            className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-6 h-6 text-white mb-2" />
            <span className="text-sm font-bold text-white">Partager / Imprimer</span>
          </button>
        </div>
      </div>

      {/* Player Stats Modal */}
      {viewingPlayer && (
        <PlayerStatsModal 
          player={viewingPlayer} 
          course={state.course} 
          onClose={() => setViewingPlayer(null)} 
        />
      )}
    </div>
  );
};

export default Scorecard;