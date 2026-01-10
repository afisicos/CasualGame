import React from 'react';
import BurgerPiece from './BurgerPiece';
import type { PieceType } from '../types';

interface OrderPanelProps {
  order: PieceType[];
  burgerName: string;
  price: number;
  levelInfo: string;
  isGameOver: boolean;
  onSkip: () => void;
  showProgress?: boolean;
  money?: number;
  targetMoney?: number;
}

const OrderPanel: React.FC<OrderPanelProps> = ({
  order,
  burgerName,
  price,
  levelInfo,
  isGameOver,
  onSkip,
  showProgress,
  money = 0,
  targetMoney = 0
}) => {
  return (
    <div className="order-panel">
      <div className="order-header">
        <div className="order-info-text">
          <p className="order-mode-text">{levelInfo}</p>
          <h3 className="burger-name-display">{burgerName}</h3>
        </div>
        <div className="order-actions">
          <span className="price">+{price}€</span>
          <button className="skip-btn" onClick={onSkip} disabled={isGameOver}>Saltar</button>
        </div>
      </div>
      <div className="order-display">
        {order.map((type, i) => (
          <BurgerPiece key={`${type}-${i}`} type={type} />
        ))}
      </div>
      {showProgress && (
        <div className="level-progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, (money / targetMoney) * 100)}%` }} 
          />
          <span className="progress-text">{money} / {targetMoney}€</span>
        </div>
      )}
    </div>
  );
};

export default OrderPanel;

