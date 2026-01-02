import { useState, useEffect, useCallback } from 'react'
import './App.css'

const GRID_SIZE = 8;

type PieceType = 'BREAD' | 'MEAT' | 'CHEESE' | 'LETTUCE' | 'TOMATO' | 'BACON' | 'KETCHUP' | 'PICKLE' | 'ONION';

type Screen = 'MENU' | 'INTRO' | 'GAME' | 'RESULT';

interface Level {
  id: number;
  name: string;
  targetMoney: number;
  ingredients: PieceType[];
  newIngredient: PieceType;
  description: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Nivel 1: El Comienzo",
    targetMoney: 20,
    ingredients: ['MEAT'],
    newIngredient: 'MEAT',
    description: "¡Bienvenido! Empieza con lo básico: hamburguesas de carne."
  },
  {
    id: 2,
    name: "Nivel 2: Más Sabor",
    targetMoney: 40,
    ingredients: ['MEAT', 'CHEESE'],
    newIngredient: 'CHEESE',
    description: "¡Desbloqueaste el QUESO! Ahora los pedidos pueden llevar carne y queso."
  },
  {
    id: 3,
    name: "Nivel 3: El Toque Verde",
    targetMoney: 60,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE'],
    newIngredient: 'LETTUCE',
    description: "¡La LECHUGA está aquí! Haz tus hamburguesas más frescas."
  },
  {
    id: 4,
    name: "Nivel 4: Todo Completo",
    targetMoney: 80,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO'],
    newIngredient: 'TOMATO',
    description: "¡TOMATE desbloqueado! La hamburguesa completa está lista."
  },
  {
    id: 5,
    name: "Nivel 5: Crujiente",
    targetMoney: 100,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON'],
    newIngredient: 'BACON',
    description: "¡BACON desbloqueado! Añade un toque crujiente a tus hamburguesas."
  },
  {
    id: 6,
    name: "Nivel 6: Salsa Especial",
    targetMoney: 120,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP'],
    newIngredient: 'KETCHUP',
    description: "¡KETCHUP desbloqueado! La salsa que no puede faltar."
  },
  {
    id: 7,
    name: "Nivel 7: El Toque Ácido",
    targetMoney: 140,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE'],
    newIngredient: 'PICKLE',
    description: "¡PEPINILLO desbloqueado! Para los amantes de los sabores fuertes."
  },
  {
    id: 8,
    name: "Nivel 8: El Final",
    targetMoney: 160,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'],
    newIngredient: 'ONION',
    description: "¡CEBOLLA desbloqueada! La hamburguesa definitiva está aquí."
  },
  {
    id: 9,
    name: "Nivel 9: Maestro Chef",
    targetMoney: 200,
    ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'],
    newIngredient: 'ONION',
    description: "¡Demuestra que eres el mejor! Meta de dinero máxima con todos los ingredientes."
  }
];

interface Piece {
  id: string;
  type: PieceType;
}

interface Cell {
  row: number;
  col: number;
  piece: Piece | null;
}

const createPiece = (availableIngredients: PieceType[]): Piece => ({
  id: Math.random().toString(36).substr(2, 9),
  type: (Math.random() > 0.4 ? availableIngredients[Math.floor(Math.random() * availableIngredients.length)] : 'BREAD')
});

const findChain = (idx: number, currentChain: PieceType[], results: PieceType[][], visited: Set<number>, gridRef: Cell[]) => {
  if (currentChain.length >= 3 && currentChain[currentChain.length - 1] === 'BREAD') {
    results.push([...currentChain]);
    if (results.length > 50) return;
  }
  
  if (currentChain.length >= 5) return;

  const cell = gridRef[idx];
  const neighbors = [
    { r: cell.row - 1, c: cell.col },
    { r: cell.row + 1, c: cell.col },
    { r: cell.row, c: cell.col - 1 },
    { r: cell.row, c: cell.col + 1 }
  ];

  for (const n of neighbors) {
    if (n.r >= 0 && n.r < GRID_SIZE && n.c >= 0 && n.c < GRID_SIZE) {
      const nextIdx = n.r * GRID_SIZE + n.c;
      if (!visited.has(nextIdx)) {
        const nextPiece = gridRef[nextIdx].piece;
        if (nextPiece) {
          if (nextPiece.type === 'BREAD') {
             // Only allow finishing with bread if we have at least one ingredient
             if (currentChain.length >= 2 && currentChain[currentChain.length - 1] !== 'BREAD') {
               findChain(nextIdx, [...currentChain, 'BREAD'], results, new Set(visited).add(nextIdx), gridRef);
             }
          } else {
            findChain(nextIdx, [...currentChain, nextPiece.type], results, new Set(visited).add(nextIdx), gridRef);
          }
        }
      }
    }
  }
};

function App() {
  const [screen, setScreen] = useState<Screen>('MENU');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('unlockedLevel');
    return saved ? parseInt(saved) : 1;
  });
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);

  const [grid, setGrid] = useState<Cell[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PieceType[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [money, setMoney] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initGrid = (level: Level) => {
    const initialGrid: Cell[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        initialGrid.push({ row, col, piece: createPiece(level.ingredients) });
      }
    }
    setGrid(initialGrid);
  };

  const startLevel = (level: Level) => {
    setSelectedLevel(level);
    setScreen('INTRO');
  };

  const playGame = () => {
    initGrid(selectedLevel);
    setMoney(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setHasSaved(false);
    setScreen('GAME');
    // We'll let the useEffect handle generateNewOrder when grid is ready
  };

  const calculatePrice = useCallback((order: PieceType[]) => {
    // Bread costs 1€ each, ingredients cost 2€
    return order.reduce((acc, type) => acc + (type === 'BREAD' ? 1 : 2), 0);
  }, []);

  const generateNewOrder = useCallback(() => {
    if (grid.length === 0) return;
    // Try to find a valid chain in the current grid
    const possibleChains: PieceType[][] = [];
    
    // Simple search for potential burgers (bread -> 1-3 ingredients -> bread)
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].piece?.type === 'BREAD') {
        findChain(i, ['BREAD'], possibleChains, new Set([i]), grid);
      }
    }

    let order: PieceType[];
    if (possibleChains.length > 0) {
      // Pick a random valid chain from the board
      order = possibleChains[Math.floor(Math.random() * possibleChains.length)];
    } else {
      // Fallback
      const numIngredients = Math.floor(Math.random() * 2) + 1;
      order = ['BREAD'];
      const maxIngredients = selectedLevel.ingredients.length > 0 ? numIngredients : 0;
      for (let i = 0; i < maxIngredients; i++) {
        order.push(selectedLevel.ingredients[Math.floor(Math.random() * selectedLevel.ingredients.length)]);
      }
      order.push('BREAD');
    }

    setCurrentOrder(order);
    setCurrentPrice(calculatePrice(order));
  }, [grid, selectedLevel, calculatePrice]);

  // Initialize first order and timer
  useEffect(() => {
    if (screen !== 'GAME') return;

    generateNewOrder();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setScreen('RESULT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, generateNewOrder]);

  // Handle level completion and unlocking
  useEffect(() => {
    if (screen === 'RESULT' && money >= selectedLevel.targetMoney) {
      const nextLevel = selectedLevel.id + 1;
      if (nextLevel > unlockedLevel && nextLevel <= LEVELS.length) {
        setUnlockedLevel(nextLevel);
        localStorage.setItem('unlockedLevel', nextLevel.toString());
      }
    }
  }, [screen, money, selectedLevel.id, selectedLevel.targetMoney, unlockedLevel]);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      setAudioContext(new AudioContextClass());
    }
  };

  const playNote = (index: number) => {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    // Pentatonic-ish scale for pleasant sound
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const freq = frequencies[Math.min(index, frequencies.length - 1)];
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
  };

  const playSuccessSound = () => {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.4);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.4);
    });
  };

  const playCancelSound = () => {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.frequency.setValueAtTime(150, audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(50, audioContext.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + 0.2);
  };

  const playErrorSound = () => {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    // Balanced error sound: Triangle wave is softer than sawtooth but clearer than sine
    [160, 130].forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.06, now + i * 0.1); // Moderate volume
      gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.25);
    });
  };

  const handleMouseDown = (index: number) => {
    if (isGameOver) return;
    initAudio();
    const cell = grid[index];
    if (cell.piece?.type === 'BREAD') {
      setIsSelecting(true);
      setCurrentSelection([index]);
      playNote(0);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!isSelecting || isGameOver) return;
    
    if (currentSelection.includes(index)) {
      if (currentSelection.length > 1 && currentSelection[currentSelection.length - 2] === index) {
        setCurrentSelection(prev => prev.slice(0, -1));
        playNote(currentSelection.length - 2);
      }
      return;
    }

    const lastIndex = currentSelection[currentSelection.length - 1];
    const lastCell = grid[lastIndex];
    const currentCell = grid[index];

    const isAdjacent = 
      (Math.abs(lastCell.row - currentCell.row) === 1 && lastCell.col === currentCell.col) ||
      (Math.abs(lastCell.col - currentCell.col) === 1 && lastCell.row === currentCell.row);

    if (isAdjacent && currentCell.piece) {
      const newSelection = [...currentSelection, index];
      setCurrentSelection(newSelection);
      playNote(newSelection.length - 1);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting || isGameOver) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellElement = element?.closest('.cell') as HTMLElement;
    
    if (cellElement) {
      const index = parseInt(cellElement.getAttribute('data-index') || '-1');
      if (index !== -1 && index !== currentSelection[currentSelection.length - 1]) {
        handleMouseEnter(index);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting || isGameOver) return;
    setIsSelecting(false);

    const selectionTypes = currentSelection.map(idx => grid[idx].piece?.type);
    
    const isForwardMatch = selectionTypes.length === currentOrder.length && 
                          selectionTypes.every((type, i) => type === currentOrder[i]);
    
    const isBackwardMatch = selectionTypes.length === currentOrder.length && 
                           selectionTypes.every((type, i) => type === currentOrder[currentOrder.length - 1 - i]);

    if (isForwardMatch || isBackwardMatch) {
      completeOrder();
      playSuccessSound();
    } else {
      if (currentSelection.length > 1) {
        // If the last piece is a bread but the burger is wrong
        if (currentSelection.length > 2 && selectionTypes[selectionTypes.length - 1] === 'BREAD') {
          playErrorSound();
        } else {
          playCancelSound();
        }
      }
    }
    
    setCurrentSelection([]);
  };

  const completeOrder = () => {
    const newMoney = money + currentPrice;
    setMoney(newMoney);
    
    // Check if level target reached
    if (newMoney >= selectedLevel.targetMoney) {
      setIsGameOver(true);
      setScreen('RESULT');
      return;
    }

    const newGrid = [...grid];
    
    // Remove pieces
    currentSelection.forEach(idx => {
      newGrid[idx] = { ...newGrid[idx], piece: null };
    });

    // Apply gravity
    for (let col = 0; col < GRID_SIZE; col++) {
      let emptySpot = GRID_SIZE - 1;
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        const idx = row * GRID_SIZE + col;
        if (newGrid[idx].piece) {
          if (row !== emptySpot) {
            newGrid[emptySpot * GRID_SIZE + col] = { ...newGrid[emptySpot * GRID_SIZE + col], piece: newGrid[idx].piece };
            newGrid[idx] = { ...newGrid[idx], piece: null };
          }
          emptySpot--;
        }
      }
      // Fill from top
      for (let row = emptySpot; row >= 0; row--) {
        newGrid[row * GRID_SIZE + col] = { ...newGrid[row * GRID_SIZE + col], piece: createPiece(selectedLevel.ingredients) };
      }
    }

    setGrid(newGrid);
    generateNewOrder();
  };

  const skipOrder = () => {
    if (isGameOver) return;
    generateNewOrder();
  };

  const saveGameLog = useCallback(async (finalMoney: number) => {
    if (hasSaved) return;
    setHasSaved(true);
    
    // Ensure we send a valid number
    const moneyToSend = Number(finalMoney) || 0;

    // Get browser and device info
    const ua = navigator.userAgent;
    let deviceType = "Desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = "Tablet";
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      deviceType = "Mobile";
    }

    const browserInfo = {
      device: deviceType,
      language: navigator.language,
      userAgent: ua,
      screen: `${window.screen.width}x${window.screen.height}`
    };
    
    try {
      // Intentamos obtener el país de forma opcional (timeout corto para no bloquear)
      let country = 'Desconocido';
      try {
        const countryRes = await Promise.race([
          fetch('https://ipapi.co/country_name/'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]) as Response;
        if (countryRes.ok) {
          country = await countryRes.text();
        }
      } catch {
        console.log('No se pudo obtener el país');
      }

      await fetch('save_log.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString('es-ES'),
          money: moneyToSend,
          playTime: 60,
          browserInfo: {
            ...browserInfo,
            country: country
          }
        }),
      });
    } catch (error) {
      console.error('Error saving game log:', error);
    }
  }, [hasSaved]);

  useEffect(() => {
    if (isGameOver && !hasSaved) {
      saveGameLog(money);
    }
  }, [isGameOver, money, hasSaved, saveGameLog]);

  const resetProgress = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todos tus avances? Esto no se puede deshacer.')) {
      setUnlockedLevel(1);
      localStorage.setItem('unlockedLevel', '1');
    }
  };

  if (screen === 'MENU') {
    return (
      <div className="game-wrapper menu-screen">
        <h1 className="fun-title main-title">Food For Fun</h1>
        <div className="menu-container">
          <div className="menu-header">
            <h2 className="menu-subtitle">Selecciona un Nivel</h2>
            <button className="reset-progress-btn" onClick={resetProgress} title="Reiniciar Progresos">
              🔄
            </button>
          </div>
          <div className="levels-map">
            {LEVELS.map((level) => {
              const isUnlocked = level.id <= unlockedLevel;
              return (
                <div 
                  key={level.id} 
                  className={`level-node ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => isUnlocked && startLevel(level)}
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
  }

  if (screen === 'INTRO') {
    return (
      <div className="game-wrapper intro-screen">
        <h1 className="fun-title main-title">Nuevo Ingrediente</h1>
        <div className="intro-container">
          <div className={`new-ingredient-card ${selectedLevel.newIngredient.toLowerCase()}`}>
             <div className={`big-piece ${selectedLevel.newIngredient.toLowerCase()}`} />
             <h3>{selectedLevel.newIngredient}</h3>
          </div>
          <p className="level-description">{selectedLevel.description}</p>
          <div className="level-stats">
            <p>Objetivo: <strong>{selectedLevel.targetMoney}€</strong></p>
            <p>Tiempo: <strong>60s</strong></p>
          </div>
          <button className="start-btn" onClick={playGame}>¡A COCINAR!</button>
          <button className="back-btn" onClick={() => setScreen('MENU')}>Volver al Mapa</button>
        </div>
      </div>
    );
  }

  if (screen === 'RESULT') {
    const isSuccess = money >= selectedLevel.targetMoney;
    return (
      <div className="game-wrapper result-screen">
        <h1 className="fun-title main-title">{isSuccess ? '¡Nivel Superado!' : 'Nivel Fallido'}</h1>
        <div className="result-container">
          <div className={`result-card ${isSuccess ? 'success' : 'fail'}`}>
            <span className="final-money">{money}€</span>
            <p className="target-info">Meta: {selectedLevel.targetMoney}€</p>
          </div>
          
          {isSuccess ? (
            <p className="result-msg">¡Excelente trabajo! Has conseguido el dinero suficiente.</p>
          ) : (
            <p className="result-msg">No has conseguido llegar a la meta. ¡Inténtalo de nuevo!</p>
          )}

          <div className="result-actions">
            <button className="back-btn" onClick={() => setScreen('MENU')}>Volver al Mapa</button>
            {!isSuccess && <button className="retry-btn" onClick={playGame}>Reintentar</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="game-wrapper" 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <h1 className="fun-title main-title">Food For Fun</h1>
      
      <div className="side-stat left">
        <span className="label">TIEMPO</span>
        <span className={`value ${timeLeft <= 10 ? 'low-time' : ''}`}>{timeLeft}s</span>
      </div>

      <div className="game-container" style={{ touchAction: 'none' }}>
        <div className="header">
          <div className="order-panel">
            <div className="order-header">
              <p>Nivel {selectedLevel.id}: <span className="price">+{currentPrice}€</span></p>
              <button className="skip-btn" onClick={skipOrder} disabled={isGameOver}>Saltar</button>
            </div>
            <div className="order-display">
              {currentOrder.map((type, i) => (
                <div key={i} className={`mini-piece ${type.toLowerCase()}`} />
              ))}
            </div>
            <div className="level-progress-bar">
               <div className="progress-fill" style={{ width: `${Math.min(100, (money / selectedLevel.targetMoney) * 100)}%` }} />
               <span className="progress-text">{money} / {selectedLevel.targetMoney}€</span>
            </div>
          </div>
        </div>

        <div className={`grid ${isGameOver ? 'game-over' : ''}`}>
          {grid.map((cell, index) => (
            <div
              key={`${cell.row}-${cell.col}`}
              data-index={index}
              className={`cell ${currentSelection.includes(index) ? 'selecting' : ''}`}
              onMouseDown={() => handleMouseDown(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleMouseDown(index);
              }}
            >
            {cell.piece && (
              <div
                className={`piece ${cell.piece.type.toLowerCase()}`}
              />
            )}
            </div>
          ))}
        </div>
        
        <div className="controls">
          <p>Arrastra de PAN a PAN pasando por ingredientes</p>
        </div>
      </div>

      <div className="side-stat right">
        <span className="label">DINERO</span>
        <span className="value">{money}€</span>
      </div>

      <svg className="selection-svg">
        {currentSelection.length > 1 && currentSelection.map((idx, i) => {
          if (i === 0) return null;
          const start = grid[currentSelection[i-1]];
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
  )
}

export default App
