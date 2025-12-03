import React, { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import Scorecard from './components/Scorecard';
import { GameState, CourseType, Hole, Player } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Tentative de chargement depuis le stockage local au démarrage
    const saved = localStorage.getItem('golf_tournament_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erreur de chargement de la sauvegarde", e);
      }
    }
    return {
      status: 'setup',
      players: [],
      courseType: 9,
      course: [],
    };
  });

  // Sauvegarde automatique à chaque changement d'état
  useEffect(() => {
    localStorage.setItem('golf_tournament_state', JSON.stringify(gameState));
  }, [gameState]);

  const handleStartGame = (players: Player[], courseType: CourseType, course: Hole[]) => {
    setGameState({
      status: 'playing',
      players,
      courseType,
      course,
    });
  };

  const handleUpdateScore = (playerId: string, holeNumber: number, score: number) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          scores: {
            ...p.scores,
            [holeNumber]: score
          }
        };
      }),
    }));
  };

  const handleFinishGame = () => {
    setGameState((prev) => ({
      ...prev,
      status: 'finished',
    }));
  };

  const handleRestart = () => {
    if (window.confirm('Voulez-vous vraiment supprimer ce tournoi et recommencer à zéro ?')) {
        const newState: GameState = {
            status: 'setup',
            players: [],
            courseType: 9,
            course: [],
        };
        setGameState(newState);
        // On force le nettoyage du localStorage
        localStorage.removeItem('golf_tournament_state');
    }
  };

  return (
    <>
      {gameState.status === 'setup' && (
        <SetupScreen onStart={handleStartGame} />
      )}
      
      {gameState.status === 'playing' && (
        <GameScreen 
          state={gameState} 
          onUpdateScore={handleUpdateScore} 
          onFinish={handleFinishGame}
          onReset={handleRestart}
          onBack={() => {
              if (window.confirm('Revenir à la configuration ? Le tournoi en cours sera perdu.')) {
                setGameState(prev => ({...prev, status: 'setup'}));
              }
          }}
        />
      )}

      {gameState.status === 'finished' && (
        <Scorecard state={gameState} onRestart={handleRestart} />
      )}
    </>
  );
};

export default App;