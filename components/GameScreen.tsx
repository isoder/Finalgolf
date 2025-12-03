import React, { useEffect, useRef, useState } from 'react';
import { GameState, Player } from '../types';
import HoleCard from './HoleCard';
import PlayerStatsModal from './PlayerStatsModal';
import { formatScoreToPar } from '../constants';
import { Trophy, ArrowLeft, User, ListOrdered, Trash2 } from 'lucide-react';

interface GameScreenProps {
  state: GameState;
  onUpdateScore: (playerId: string, holeNumber: number, score: number) => void;
  onFinish: () => void;
  onBack: () => void;
  onReset: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ state, onUpdateScore, onFinish, onBack, onReset }) => {
  const [activeHoleIndex, setActiveHoleIndex] = useState(0);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    const currentHole = state.course[activeHoleIndex];
    if (currentHole) {
      const element = document.getElementById(`hole-${currentHole.number}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeHoleIndex, state.course]);

  // Determine current active hole number
  const activeHoleNumber = state.course[activeHoleIndex]?.number;

  // Calculate Leaderboard Data
  const getPlayerStats = (player: Player) => {
    let totalStrokes = 0;
    let totalParSoFar = 0;
    let holesPlayed = 0;

    state.course.forEach(h => {
        const s = player.scores[h.number];
        if (s !== undefined && s !== null) {
            totalStrokes += s;
            totalParSoFar += h.par;
            holesPlayed++;
        }
    });

    return {
        ...player,
        totalStrokes,
        scoreToPar: totalStrokes - totalParSoFar,
        holesPlayed
    };
  };

  const rankedPlayers = state.players
      .map(getPlayerStats)
      .sort((a, b) => a.scoreToPar - b.scoreToPar);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      
      {/* Tournament Header */}
      <header className="bg-white shadow-md z-30 sticky top-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-700 p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
               <Trophy className="w-4 h-4 text-yellow-500" />
               <span className="font-bold text-slate-800 uppercase tracking-wider text-sm">Leaderboard</span>
            </div>

            <button type="button" onClick={onReset} className="text-slate-400 hover:text-red-600 p-1 transition-colors" title="Supprimer le tournoi">
               <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mini Leaderboard Scroll View */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
             {rankedPlayers.map((p, index) => (
                 <div 
                    key={p.id} 
                    onClick={() => setViewingPlayer(p)}
                    className={`flex-shrink-0 flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:shadow-md transition-all ${index === 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}
                    style={{ minWidth: '140px' }}
                 >
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-slate-200">
                             {p.photoUrl ? (
                                <img src={p.photoUrl} alt="P" className="w-full h-full object-cover" />
                             ) : (
                                <User className="w-4 h-4 m-2 text-slate-300" />
                             )}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                            {index + 1}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-800 truncate max-w-[80px]">{p.name}</div>
                        <div className={`text-xs font-black ${p.scoreToPar < 0 ? 'text-red-500' : p.scoreToPar > 0 ? 'text-slate-600' : 'text-green-600'}`}>
                           {formatScoreToPar(p.scoreToPar)}
                        </div>
                    </div>
                 </div>
             ))}
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto w-full pb-32">
        {state.course.map((hole, index) => (
          <HoleCard
            key={hole.number}
            hole={hole}
            players={state.players}
            isActive={index === activeHoleIndex}
            onUpdateScore={onUpdateScore}
            onPlayerClick={setViewingPlayer}
          />
        ))}
      </main>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-100 via-slate-100/95 to-transparent pointer-events-none z-20">
         <div className="max-w-3xl mx-auto flex justify-center pointer-events-auto">
           {activeHoleIndex === state.course.length - 1 ? (
              <button
                type="button"
                onClick={onFinish}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 animate-bounce"
              >
                <ListOrdered className="w-5 h-5 text-yellow-400" />
                Voir le classement final
              </button>
           ) : (
             <div className="flex gap-2 w-full">
               <button 
                 type="button"
                 onClick={() => setActiveHoleIndex(Math.max(0, activeHoleIndex - 1))}
                 disabled={activeHoleIndex === 0}
                 className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl shadow-sm disabled:opacity-50"
               >
                 Précédent
               </button>
               <button 
                 type="button"
                 onClick={() => setActiveHoleIndex(Math.min(state.course.length - 1, activeHoleIndex + 1))}
                 className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-600/30"
               >
                 Trou Suivant
               </button>
             </div>
           )}
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

export default GameScreen;