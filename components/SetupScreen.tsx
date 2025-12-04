import React, { useState, useRef } from 'react';
import { CourseType, Hole, Player } from '../types';
import { DEFAULT_PARS_9, DEFAULT_PARS_18 } from '../constants';
import { User, Flag, ArrowRight, Camera, Plus, Trash2, Users } from 'lucide-react';

interface SetupScreenProps {
  onStart: (players: Player[], type: CourseType, course: Hole[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  // Player staging state
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [newHandicap, setNewHandicap] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | undefined>(undefined);
  
  // Course config state
  const [courseType, setCourseType] = useState<CourseType>(9);
  const [pars, setPars] = useState<number[]>([...DEFAULT_PARS_9]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCourseTypeChange = (type: CourseType) => {
    setCourseType(type);
    if (type === 9) {
      setPars([...DEFAULT_PARS_9]);
    } else {
      setPars([...DEFAULT_PARS_18]);
    }
  };

  const handleParChange = (index: number, value: string) => {
    const val = parseInt(value);
    if (!isNaN(val) && val > 0) {
      const newPars = [...pars];
      newPars[index] = val;
      setPars(newPars);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPlayer = () => {
    if (!newName.trim()) return;
    const newPlayer: Player = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: newName.trim(),
      photoUrl: newPhotoUrl,
      handicap: newHandicap ? parseInt(newHandicap) : undefined,
      scores: {}
    };
    setPlayers([...players, newPlayer]);
    setNewName('');
    setNewHandicap('');
    setNewPhotoUrl(undefined);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimeout(() => {
        if (window.confirm("Voulez-vous vraiment effacer tous les joueurs ?")) {
            setPlayers([]);
        }
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length === 0) return;

    const course: Hole[] = pars.map((p, i) => ({
      number: i + 1,
      par: p,
    }));
    
    onStart(players, courseType, course);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-50 p-4 md:p-6">
      <div className="max-w-lg mx-auto w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <Flag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Golf Dakar</h1>
          <p className="text-green-100">Mode Tournoi</p>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Add Player Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Participants ({players.length})
              </h2>
              {players.length > 0 && (
                <button 
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                >
                  Tout effacer
                </button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
               {/* Photo Upload */}
               <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                    {newPhotoUrl ? (
                      <img src={newPhotoUrl} alt="New" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-300" />
                    )}
                 </div>
                 <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
               </div>

               <div className="flex-1 w-full flex gap-2">
                 <input
                   type="text"
                   value={newName}
                   onChange={(e) => setNewName(e.target.value)}
                   placeholder="Nom"
                   className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-w-0"
                   onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                 />
                 <input
                   type="number"
                   value={newHandicap}
                   onChange={(e) => setNewHandicap(e.target.value)}
                   placeholder="Hcp"
                   className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                   onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                 />
                 <button 
                   type="button"
                   onClick={addPlayer}
                   disabled={!newName.trim()}
                   className="bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                 >
                   <Plus className="w-5 h-5" />
                 </button>
               </div>
            </div>

            {/* Players List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {players.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4 italic">Aucun joueur inscrit</p>
              )}
              {players.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-300 m-2" />
                      )}
                    </div>
                    <div>
                        <div className="font-bold text-slate-700">{player.name}</div>
                        {player.handicap !== undefined && (
                            <div className="text-[10px] text-slate-400 font-medium">Hcp {player.handicap}</div>
                        )}
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removePlayer(player.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Course Config */}
          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Configuration du parcours</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => handleCourseTypeChange(9)}
                className={`py-3 rounded-xl font-medium border-2 transition-all ${
                  courseType === 9
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                9 Trous
              </button>
              <button
                type="button"
                onClick={() => handleCourseTypeChange(18)}
                className={`py-3 rounded-xl font-medium border-2 transition-all ${
                  courseType === 18
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                18 Trous
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
               <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                  {pars.map((par, i) => (
                    <div key={i} className="text-center">
                      <label className="block text-[10px] text-slate-400 mb-1">{i + 1}</label>
                      <input
                        type="number"
                        value={par}
                        onChange={(e) => handleParChange(i, e.target.value)}
                        className="w-full text-center py-1 rounded border border-slate-200 text-sm font-bold focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={players.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            Lancer le Tournoi
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;