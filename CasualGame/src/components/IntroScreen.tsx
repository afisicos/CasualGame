import React from 'react';
import type { PieceType } from '../types';

interface IntroScreenProps {
  newIngredient: PieceType;
  description: string;
  targetMoney: number;
  onPlay: () => void;
  onBack: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({
  newIngredient,
  description,
  targetMoney,
  onPlay,
  onBack
}) => {
  return (
    <div className="game-wrapper intro-screen">
      <h1 className="fun-title main-title">Nuevo Ingrediente</h1>
      <div className="intro-container">
        <div className={`new-ingredient-card ${newIngredient.toLowerCase()}`}>
           <div className={`big-piece ${newIngredient.toLowerCase()}`} />
           <h3>{newIngredient}</h3>
        </div>
        <p className="level-description">{description}</p>
        <div className="level-stats">
          <p>Objetivo: <strong>{targetMoney}€</strong></p>
          <p>Tiempo: <strong>60s</strong></p>
        </div>
        <button className="start-btn" onClick={onPlay}>¡A COCINAR!</button>
        <button className="back-btn" onClick={onBack}>Volver al Mapa</button>
      </div>
    </div>
  );
};

export default IntroScreen;

