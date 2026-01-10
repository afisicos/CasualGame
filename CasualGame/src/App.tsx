import { useState, useEffect, useCallback } from 'react';
import './App.css';
import type { PieceType, Screen, GameMode, Cell, Level, Piece } from './types';
import MenuScreen from './components/MenuScreen';
import IntroScreen from './components/IntroScreen';
import ResultScreen from './components/ResultScreen';
import OrderPanel from './components/OrderPanel';
import GameBoard from './components/GameBoard';
import StatCard from './components/StatCard';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const GRID_SIZE = 8;

const LEVELS: Level[] = [
  { id: 1, name: "Nivel 1: El Comienzo", targetMoney: 20, timeLimit: 60, ingredients: ['MEAT'], newIngredient: 'MEAT', description: "¡Bienvenido! Empieza con lo básico: hamburguesas de carne." },
  { id: 2, name: "Nivel 2: Más Sabor", targetMoney: 40, timeLimit: 60, ingredients: ['MEAT', 'CHEESE'], newIngredient: 'CHEESE', description: "¡Desbloqueaste el QUESO! Ahora los pedidos pueden llevar carne y queso." },
  { id: 3, name: "Nivel 3: El Toque Verde", targetMoney: 60, timeLimit: 60, ingredients: ['MEAT', 'CHEESE', 'LETTUCE'], newIngredient: 'LETTUCE', description: "¡La LECHUGA está aquí! Haz tus hamburguesas más frescas." },
  { id: 4, name: "Nivel 4: Todo Completo", targetMoney: 80, timeLimit: 70, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO'], newIngredient: 'TOMATO', description: "¡TOMATE desbloqueado! La hamburguesa completa está lista." },
  { id: 5, name: "Nivel 5: Crujiente", targetMoney: 100, timeLimit: 80, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON'], newIngredient: 'BACON', description: "¡BACON desbloqueado! Añade un toque crujiente a tus hamburguesas." },
  { id: 6, name: "Nivel 6: Salsa Especial", targetMoney: 115, timeLimit: 100, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP'], newIngredient: 'KETCHUP', description: "¡KETCHUP desbloqueado! La salsa que no puede faltar." },
  { id: 7, name: "Nivel 7: El Toque Ácido", targetMoney: 130, timeLimit: 120, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE'], newIngredient: 'PICKLE', description: "¡PEPINILLO desbloqueado! Para los amantes de los sabores fuertes." },
  { id: 8, name: "Nivel 8: El Final", targetMoney: 145, timeLimit: 140, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'], newIngredient: 'ONION', description: "¡CEBOLLA desbloqueada! La hamburguesa definitiva está aquí." },
  { id: 9, name: "Nivel 9: Maestro Chef", targetMoney: 160, timeLimit: 160, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'], newIngredient: 'ONION', description: "¡Demuestra que eres el mejor! Meta con todos los ingredientes y tiempo extendido." }
];

const createPiece = (availableIngredients: PieceType[]): Piece => {
  const rand = Math.random();
  let type: PieceType;
  
  // Aumentamos probabilidad de BREAD (35%) y MEAT (30%)
  if (rand < 0.35) {
    type = 'BREAD';
  } else if (rand < 0.65 && availableIngredients.includes('MEAT')) {
    type = 'MEAT';
  } else {
    // El resto se distribuye entre los ingredientes disponibles del nivel
    type = availableIngredients[Math.floor(Math.random() * availableIngredients.length)];
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    isNew: true
  };
};

const findChain = (idx: number, currentChain: PieceType[], results: PieceType[][], visited: Set<number>, gridRef: Cell[]) => {
  // Permitimos hamburguesas de hasta 6 piezas (Pan + 4 ingredientes + Pan)
  if (currentChain.length >= 3 && currentChain[currentChain.length - 1] === 'BREAD') {
    results.push([...currentChain]);
    if (results.length > 100) return; // Aumentamos variedad de búsqueda
  }
  if (currentChain.length >= 6) return;

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
            if (currentChain.length >= 2 && currentChain[currentChain.length - 1] !== 'BREAD') {
              findChain(nextIdx, [...currentChain, 'BREAD'], results, new Set(visited).add(nextIdx), gridRef);
            }
          } else {
            // Límite de 2 carnes por hamburguesa
            if (nextPiece.type === 'MEAT') {
              const meatCount = currentChain.filter(t => t === 'MEAT').length;
              if (meatCount >= 2) continue;
            }
            findChain(nextIdx, [...currentChain, nextPiece.type], results, new Set(visited).add(nextIdx), gridRef);
          }
        }
      }
    }
  }
};

function App() {
  // --- States ---
  const [screen, setScreen] = useState<Screen>('MENU');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('unlockedLevel');
    return saved ? parseInt(saved) : 1;
  });
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [gameMode, setGameMode] = useState<GameMode>('CAMPAIGN');
  const [arcadeHighScore, setArcadeHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('arcadeHighScore');
    return saved ? parseInt(saved) : 0;
  });

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

  // --- Audio Logic ---
  const initAudio = () => {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      setAudioContext(new AudioContextClass());
    }
  };

  const playNote = useCallback((index: number) => {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
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
  }, [audioContext]);

  const playSuccessSound = useCallback(() => {
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
  }, [audioContext]);

  const playCancelSound = useCallback(() => {
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
  }, [audioContext]);

  const playErrorSound = useCallback(() => {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    [160, 130].forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.06, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.25);
    });
  }, [audioContext]);

  // --- Burger Logic ---
  const getBurgerName = (order: PieceType[]) => {
    const ingredients = order.filter((t): t is Exclude<PieceType, 'BREAD'> => t !== 'BREAD');
    const has = (type: Exclude<PieceType, 'BREAD'>) => ingredients.includes(type);
    const count = ingredients.length;
    const hasCheese = has('CHEESE');
    const hasBacon = has('BACON');
    const hasAllVeggies = has('LETTUCE') && has('TOMATO') && has('PICKLE') && has('ONION');

    if (count >= 6) return "La Mega Monster";
    if (hasAllVeggies && hasCheese && hasBacon) return "La Gran Gourmet";
    if (hasAllVeggies) return "La Huerta Completa";
    if (hasCheese && hasBacon && has('ONION')) return "La Vikinga";
    if (hasCheese && has('PICKLE') && has('KETCHUP')) return "Clásica Americana";
    if (hasBacon && has('KETCHUP') && has('ONION')) return "Bacon BBQ Style";
    if (hasCheese && has('TOMATO') && has('LETTUCE')) return "Cheeseburger Fresh";
    if (has('PICKLE') && has('ONION') && has('TOMATO')) return "La Encurtida";
    if (hasCheese && hasBacon) return "Bacon & Cheese";
    if (hasCheese && has('ONION')) return "Queso y Cebolla Crunch";
    if (hasBacon && has('PICKLE')) return "Crunchy Bacon";
    if (hasCheese && has('PICKLE')) return "Doble Texture";
    if (has('LETTUCE') && has('TOMATO')) return "Burger del Huerto";
    if (hasCheese) return "Cheeseburger Simple";
    if (hasBacon) return "Bacon Burger";
    if (has('PICKLE') && has('ONION')) return "Dúo Encurtido";
    if (has('TOMATO') && has('PICKLE')) return "Fresh Pickle Burger";
    if (has('LETTUCE')) return "Lechuga Fresh";
    if (has('TOMATO')) return "Tomato Special";
    if (has('ONION')) return "Cebolla Grill";
    if (has('PICKLE')) return "Pickle Bomb";
    return "Hamburguesa Pura";
  };

  const calculatePrice = useCallback((order: PieceType[]) => {
    const nonBread = order.filter(t => t !== 'BREAD');
    const breads = order.filter(t => t === 'BREAD');
    
    // Precio base: 1€ por cada pan
    let total = breads.length * 1;
    
    // Precio progresivo para ingredientes:
    // El primero cuesta 2€, los siguientes cuestan 3€ cada uno
    nonBread.forEach((_, index) => {
      total += (index === 0 ? 2 : 3);
    });
    
    return total;
  }, []);

  // --- Game Control ---
  const initGrid = useCallback((level: Level, mode: GameMode = 'CAMPAIGN') => {
    const initialGrid: Cell[] = [];
    const ingredients = mode === 'ARCADE' 
      ? ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'] as PieceType[]
      : level.ingredients;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        initialGrid.push({ row, col, piece: createPiece(ingredients) });
      }
    }
    setGrid(initialGrid);
    return initialGrid;
  }, []);

  const generateNewOrder = useCallback((gridRef?: Cell[]) => {
    let targetGrid = gridRef || grid;
    if (targetGrid.length === 0) return;
    
    let possibleChains: PieceType[][] = [];
    let attempts = 0;
    
    // Si el tablero está bloqueado, lo regeneramos hasta que haya opciones
    while (attempts < 5) {
      possibleChains = [];
      for (let i = 0; i < targetGrid.length; i++) {
        if (targetGrid[i].piece?.type === 'BREAD') {
          findChain(i, ['BREAD'], possibleChains, new Set([i]), targetGrid);
        }
      }
      
      if (possibleChains.length > 0) break;
      
      console.log("Tablero bloqueado, regenerando...");
      targetGrid = initGrid(selectedLevel, gameMode);
      attempts++;
    }

    if (possibleChains.length === 0) return;

    let order: PieceType[];
    const meatChains = possibleChains.filter(chain => chain.includes('MEAT'));
    
    if (meatChains.length > 0) {
      // Preferimos pedidos que contengan carne si es posible
      order = meatChains[Math.floor(Math.random() * meatChains.length)];
    } else {
      // Si no hay con carne, cualquier combinación válida que esté en el tablero
      order = possibleChains[Math.floor(Math.random() * possibleChains.length)];
    }
    
    setCurrentOrder(order);
    setCurrentPrice(calculatePrice(order));
  }, [grid, selectedLevel, calculatePrice, gameMode, initGrid]);

  const playGame = (mode: GameMode = gameMode) => {
    const newGrid = initGrid(selectedLevel, mode);
    setMoney(0);
    setTimeLeft(mode === 'ARCADE' ? 60 : selectedLevel.timeLimit);
    setIsGameOver(false);
    setHasSaved(false);
    setScreen('GAME');
    generateNewOrder(newGrid);
  };

  const startLevel = (level: Level) => {
    setGameMode('CAMPAIGN');
    setSelectedLevel(level);
    setScreen('INTRO');
  };

  const startArcade = () => {
    setGameMode('ARCADE');
    playGame('ARCADE');
  };

  const saveGameLog = useCallback(async (finalMoney: number) => {
    if (hasSaved) return;
    setHasSaved(true);
    const playTime = gameMode === 'ARCADE' ? 60 : selectedLevel.timeLimit;
    try {
      await fetch('save_log.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: new Date().toLocaleString('es-ES'), money: finalMoney, playTime })
      });
    } catch (error) { console.error('Error saving game log:', error); }
  }, [hasSaved, gameMode, selectedLevel.timeLimit]);

  const endGame = useCallback((finalMoney: number) => {
    setIsGameOver(true);
    setScreen('RESULT');
    
    if (gameMode === 'ARCADE' && finalMoney > arcadeHighScore) {
      setArcadeHighScore(finalMoney);
      localStorage.setItem('arcadeHighScore', finalMoney.toString());
    }

    if (!hasSaved) {
      saveGameLog(finalMoney);
    }
  }, [gameMode, arcadeHighScore, hasSaved, saveGameLog]);

  const completeOrder = () => {
    const newMoney = money + currentPrice;
    setMoney(newMoney);
    if (gameMode === 'CAMPAIGN' && newMoney >= selectedLevel.targetMoney) {
      endGame(newMoney);
      
      // Desbloqueo de nivel inmediato al ganar
      const nextLevel = selectedLevel.id + 1;
      if (nextLevel > unlockedLevel && nextLevel <= LEVELS.length) {
        setUnlockedLevel(nextLevel);
        localStorage.setItem('unlockedLevel', nextLevel.toString());
      }
      return;
    }

    const removingGrid = [...grid];
    currentSelection.forEach(idx => {
      if (removingGrid[idx].piece) {
        removingGrid[idx] = { ...removingGrid[idx], piece: { ...removingGrid[idx].piece!, isRemoving: true } };
      }
    });
    setGrid(removingGrid);

    setTimeout(() => {
      const newGrid = [...removingGrid];
      currentSelection.forEach(idx => { newGrid[idx] = { ...newGrid[idx], piece: null }; });
      const ingredientsPool = gameMode === 'ARCADE'
        ? ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'] as PieceType[]
        : selectedLevel.ingredients;

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
        for (let row = emptySpot; row >= 0; row--) {
          newGrid[row * GRID_SIZE + col] = { ...newGrid[row * GRID_SIZE + col], piece: createPiece(ingredientsPool) };
        }
      }
      setGrid(newGrid);
      generateNewOrder();
      setCurrentSelection([]);
    }, 300);
  };

  const skipOrder = () => { if (!isGameOver) generateNewOrder(); };

  // --- Handlers ---
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
    const isAdjacent = (Math.abs(lastCell.row - currentCell.row) === 1 && lastCell.col === currentCell.col) ||
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
    const isForwardMatch = selectionTypes.length === currentOrder.length && selectionTypes.every((type, i) => type === currentOrder[i]);
    const isBackwardMatch = selectionTypes.length === currentOrder.length && selectionTypes.every((type, i) => type === currentOrder[currentOrder.length - 1 - i]);

    if (isForwardMatch || isBackwardMatch) {
      completeOrder();
      playSuccessSound();
    } else {
      if (currentSelection.length > 1) {
        if (currentSelection.length > 2 && selectionTypes[selectionTypes.length - 1] === 'BREAD') playErrorSound();
        else playCancelSound();
      }
      setCurrentSelection([]);
    }
  };

  useEffect(() => {
    if (screen !== 'GAME') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame(money);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, endGame, money]);

  useEffect(() => {
    const hasNewPieces = grid.some(cell => cell.piece?.isNew);
    if (hasNewPieces) {
      const timer = setTimeout(() => {
        setGrid(currentGrid => 
          currentGrid.map(cell => cell.piece?.isNew ? { ...cell, piece: { ...cell.piece, isNew: false } } : cell)
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [grid]);

  const resetProgress = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todos tus avances?')) {
      setUnlockedLevel(1);
      localStorage.setItem('unlockedLevel', '1');
    }
  };

  // --- Render ---
  if (screen === 'MENU') return (
    <MenuScreen 
      levels={LEVELS} 
      unlockedLevel={unlockedLevel} 
      arcadeHighScore={arcadeHighScore} 
      onStartLevel={startLevel} 
      onStartArcade={startArcade} 
      onResetProgress={resetProgress} 
    />
  );

  if (screen === 'INTRO') return (
    <IntroScreen 
      newIngredient={selectedLevel.newIngredient} 
      description={selectedLevel.description} 
      targetMoney={selectedLevel.targetMoney} 
      timeLimit={selectedLevel.timeLimit}
      onPlay={() => playGame()} 
      onBack={() => setScreen('MENU')} 
    />
  );

  if (screen === 'RESULT') return (
    <ResultScreen 
      gameMode={gameMode} 
      money={money} 
      targetMoney={selectedLevel.targetMoney} 
      arcadeHighScore={arcadeHighScore} 
      onBack={() => setScreen('MENU')} 
      onRetry={() => playGame()} 
    />
  );

  return (
    <div className="game-wrapper" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchEnd={handleMouseUp} onTouchMove={handleTouchMove}>
      <h1 className="fun-title main-title">Food For Fun</h1>
      <div className="game-container" style={{ touchAction: 'none' }}>
        <div className="left-panel">
          <OrderPanel 
            order={currentOrder} 
            burgerName={getBurgerName(currentOrder)} 
            price={currentPrice} 
            levelInfo={gameMode === 'ARCADE' ? 'Minuto Express' : `Nivel ${selectedLevel.id}`} 
            isGameOver={isGameOver} 
            onSkip={skipOrder} 
            showProgress={gameMode === 'CAMPAIGN'} 
            money={money} 
            targetMoney={selectedLevel.targetMoney} 
          />
        </div>

        <GameBoard 
          grid={grid} 
          currentSelection={currentSelection} 
          isGameOver={isGameOver} 
          onMouseDown={handleMouseDown} 
          onMouseEnter={handleMouseEnter} 
          onTouchStart={(e, idx) => { e.preventDefault(); handleMouseDown(idx); }} 
        />

        <div className="right-panel">
          <StatCard label="TIEMPO" value={`${timeLeft}s`} icon="⏱️" type="time" isLowTime={timeLeft <= 10} />
          <StatCard label="DINERO" value={`${money}€`} icon="💰" type="money" />
          {gameMode === 'ARCADE' && (
            <StatCard label="RÉCORD" value={`${arcadeHighScore}€`} icon="🏆" type="record" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
