import React from 'react';

interface ResultScreenProps {
  gameMode: 'CAMPAIGN' | 'ARCADE';
  money: number;
  targetMoney: number;
  arcadeHighScore: number;
  onBack: () => void;
  onRetry: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  gameMode,
  money,
  targetMoney,
  arcadeHighScore,
  onBack,
  onRetry
}) => {
  const isSuccess = gameMode === 'ARCADE' || money >= targetMoney;
  const isNewRecord = gameMode === 'ARCADE' && money >= arcadeHighScore && money > 0;

  return (
    <div className="game-wrapper result-screen">
      <h1 className="fun-title main-title">
        {gameMode === 'ARCADE' ? '¡Tiempo Agotado!' : (isSuccess ? '¡Nivel Superado!' : 'Nivel Fallido')}
      </h1>
      <div className="result-container">
        <div className={`result-card ${isSuccess ? 'success' : 'fail'}`}>
          <span className="final-money">{money}€</span>
          {gameMode === 'CAMPAIGN' && <p className="target-info">Meta: {targetMoney}€</p>}
          {gameMode === 'ARCADE' && isNewRecord && <p className="new-record-tag">¡NUEVO RÉCORD!</p>}
        </div>
        
        {gameMode === 'CAMPAIGN' ? (
          isSuccess ? (
            <p className="result-msg">¡Excelente trabajo! Has conseguido el dinero suficiente.</p>
          ) : (
            <p className="result-msg">No has conseguido llegar a la meta. ¡Inténtalo de nuevo!</p>
          )
        ) : (
          <p className="result-msg">¡Has conseguido un total de {money}€ en un minuto!</p>
        )}

        <div className="result-actions">
          <button className="back-btn" onClick={onBack}>Volver al Mapa</button>
          {(gameMode === 'ARCADE' || !isSuccess) && (
            <button className="retry-btn" onClick={onRetry}>Reintentar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;

