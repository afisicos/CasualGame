import React from 'react';
import type { Level } from '../types';

interface MenuScreenProps {
  levels: Level[];
  unlockedLevel: number;
  arcadeHighScore: number;
  onStartLevel: (level: any) => void;
  onStartArcade: () => void;
  onResetProgress: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  levels,
  unlockedLevel,
  arcadeHighScore,
  onStartLevel,
  onStartArcade,
  onResetProgress
}) => {
  return (
    <div className="game-wrapper menu-screen">
      <h1 className="fun-title main-title">Food For Fun</h1>
      <div className="menu-container">
        <div className="mode-selector">
          <div className="arcade-high-score">
            <span>Récord Minuto Express:</span>
            <strong>{arcadeHighScore}€</strong>
          </div>
          <button className="arcade-btn" onClick={onStartArcade}>
            ⏱️ Minuto Express
          </button>
        </div>

        <div className="menu-header">
          <h2 className="menu-subtitle">Modo Campaña</h2>
          <button className="reset-progress-btn" onClick={onResetProgress} title="Reiniciar Progresos">
            🔄
          </button>
        </div>
        <div className="levels-map">
          {levels.map((level) => {
            const isUnlocked = level.id <= unlockedLevel;
            return (
              <div 
                key={level.id} 
                className={`level-node ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => isUnlocked && onStartLevel(level)}
              >
                <div className="level-number">{level.id}</div>
                <div className="level-info">
                  <span className="level-name">{level.name}</span>
                  {isUnlocked && <span className="level-target">Meta: {level.targetMoney}€</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;

