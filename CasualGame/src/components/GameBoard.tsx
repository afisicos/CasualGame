import React from 'react';
import BurgerPiece from './BurgerPiece';
import type { Cell } from '../types';

interface GameBoardProps {
  grid: Cell[];
  currentSelection: number[];
  isGameOver: boolean;
  onMouseDown: (index: number) => void;
  onMouseEnter: (index: number) => void;
  onTouchStart: (e: React.TouchEvent, index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  currentSelection,
  isGameOver,
  onMouseDown,
  onMouseEnter,
  onTouchStart
}) => {
  return (
    <div className="grid-section">
      <div className={`grid ${isGameOver ? 'game-over' : ''}`}>
        {grid.map((cell, index) => (
          <div
            key={`${cell.row}-${cell.col}`}
            data-index={index}
            className={`cell ${currentSelection.includes(index) ? 'selecting' : ''}`}
            onMouseDown={() => onMouseDown(index)}
            onMouseEnter={() => onMouseEnter(index)}
            onTouchStart={(e) => onTouchStart(e, index)}
          >
            {cell.piece && (
              <BurgerPiece 
                type={cell.piece.type} 
                isNew={cell.piece.isNew} 
                isRemoving={cell.piece.isRemoving} 
              />
            )}
          </div>
        ))}
        
        <svg 
          className="selection-svg"
          style={{ 
            position: 'absolute', 
            gridArea: '1 / 1 / -1 / -1',
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none',
            zIndex: 20,
            margin: 0
          }}
        >
          {currentSelection.length > 1 && currentSelection.map((idx, i) => {
            if (i === 0) return null;
            const start = grid[currentSelection[i - 1]];
            const end = grid[idx];
            return (
              <line
                key={i}
                x1={`${(start.col * 100 / 8) + (100 / 16)}%`}
                y1={`${(start.row * 100 / 8) + (100 / 16)}%`}
                x2={`${(end.col * 100 / 8) + (100 / 16)}%`}
                y2={`${(end.row * 100 / 8) + (100 / 16)}%`}
                className="selection-line"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default GameBoard;

