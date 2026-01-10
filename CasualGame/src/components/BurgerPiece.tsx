import React from 'react';
import type { PieceType } from '../types';

interface BurgerPieceProps {
  type: PieceType;
  isNew?: boolean;
  isRemoving?: boolean;
  className?: string;
}

const BurgerPiece: React.FC<BurgerPieceProps> = ({ type, isNew, isRemoving, className = '' }) => {
  const baseClass = 'piece';
  const typeClass = type.toLowerCase();
  const stateClasses = `${isNew ? 'is-new' : ''} ${isRemoving ? 'is-removing' : ''}`.trim();
  
  return (
    <div className={`${baseClass} ${typeClass} ${stateClasses} ${className}`.trim()} />
  );
};

export default BurgerPiece;

