import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Vibration, Text, StatusBar, TouchableOpacity, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import GameBoard from './components/GameBoard';
import StatCard from './components/StatCard';
import MenuScreen from './components/MenuScreen';
import IntroScreen from './components/IntroScreen';
import ResultScreen from './components/ResultScreen';
import BurgerPiece from './components/BurgerPiece';
import { PieceType, Screen, GameMode, Cell, Level, Piece } from './types';

const GRID_SIZE = 8;
const LEVELS: Level[] = [
  { id: 1, name: "Nivel 1: El Comienzo", targetMoney: 20, ingredients: ['MEAT'], newIngredient: 'MEAT', description: "¡Bienvenido! Empieza con lo básico: hamburguesas de carne." },
  { id: 2, name: "Nivel 2: Más Sabor", targetMoney: 40, ingredients: ['MEAT', 'CHEESE'], newIngredient: 'CHEESE', description: "¡Desbloqueaste el QUESO! Ahora los pedidos pueden llevar carne y queso." },
  { id: 3, name: "Nivel 3: El Toque Verde", targetMoney: 60, ingredients: ['MEAT', 'CHEESE', 'LETTUCE'], newIngredient: 'LETTUCE', description: "¡La LECHUGA está aquí! Haz tus hamburguesas más frescas." },
  { id: 4, name: "Nivel 4: Todo Completo", targetMoney: 80, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO'], newIngredient: 'TOMATO', description: "¡TOMATE desbloqueado! La hamburguesa completa está lista." },
  { id: 5, name: "Nivel 5: Crujiente", targetMoney: 100, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON'], newIngredient: 'BACON', description: "¡BACON desbloqueado! Añade un toque crujiente." },
  { id: 6, name: "Nivel 6: Salsa Especial", targetMoney: 115, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP'], newIngredient: 'KETCHUP', description: "¡KETCHUP desbloqueado! La salsa que no puede faltar." },
  { id: 7, name: "Nivel 7: El Toque Ácido", targetMoney: 130, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE'], newIngredient: 'PICKLE', description: "¡PEPINILLO desbloqueado! Para los amantes de los sabores fuertes." },
  { id: 8, name: "Nivel 8: El Final", targetMoney: 145, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'], newIngredient: 'ONION', description: "¡CEBOLLA desbloqueada! La hamburguesa definitiva." }
];

const createPiece = (availableIngredients: PieceType[]): Piece => {
  const rand = Math.random();
  let type: PieceType;
  if (rand < 0.35) type = 'BREAD';
  else if (rand < 0.65 && availableIngredients.includes('MEAT')) type = 'MEAT';
  else type = availableIngredients[Math.floor(Math.random() * availableIngredients.length)];
  return { id: Math.random().toString(36).substr(2, 9), type, isNew: true };
};

const findChain = (idx: number, currentChain: PieceType[], results: PieceType[][], visited: Set<number>, gridRef: Cell[]) => {
  if (currentChain.length >= 3 && currentChain[currentChain.length - 1] === 'BREAD') {
    const breadCount = currentChain.filter(t => t === 'BREAD').length;
    if (breadCount === 2) {
      results.push([...currentChain]);
      if (results.length > 50) return;
    }
    return;
  }
  if (currentChain.length >= 6) return;

  const cell = gridRef[idx];
  const neighbors = [
    { r: cell.row - 1, c: cell.col }, { r: cell.row + 1, c: cell.col },
    { r: cell.row, c: cell.col - 1 }, { r: cell.row, c: cell.col + 1 }
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
            findChain(nextIdx, [...currentChain, nextPiece.type], results, new Set(visited).add(nextIdx), gridRef);
          }
        }
      }
    }
  }
};

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

export default function App() {
  const [screen, setScreen] = useState<Screen>('MENU');
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [gameMode, setGameMode] = useState<GameMode>('CAMPAIGN');
  const [arcadeHighScore, setArcadeHighScore] = useState<number>(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const [currentOrder, setCurrentOrder] = useState<PieceType[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [money, setMoney] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const backAction = () => {
      if (screen !== 'MENU') {
        setScreen('MENU');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [screen]);

  useEffect(() => {
    async function setupAudio() {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/buttons/button-20.mp3' }
      );
      soundRef.current = sound;
    }
    setupAudio();
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playClickSound = async (index: number) => {
    if (!soundRef.current) return;
    try {
      const newPitch = 1.0 + (index * 0.15); 
      await soundRef.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
        pitch: newPitch,
        shouldCorrectPitch: false,
        rate: newPitch,
      });
    } catch (e) {}
  };

  const playSuccessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' }
      );
      await sound.playAsync();
    } catch (e) {}
  };

  const calculatePrice = useCallback((order: PieceType[]) => {
    const nonBread = order.filter(t => t !== 'BREAD');
    const breads = order.filter(t => t === 'BREAD');
    
    // Precio base moderado
    let total = breads.length * 1.5;
    
    // Multiplicador exponencial suavizado
    const countMultiplier = [1, 1, 1, 1.15, 1.4, 1.8, 2.5][nonBread.length] || 1;
    
    let ingredientSum = 0;
    let varietyBonus = 1.0;
    
    nonBread.forEach((type, index) => {
      ingredientSum += (2 + index * 1.0);
      if (index < nonBread.length - 1 && type !== nonBread[index + 1]) {
        varietyBonus += 0.15;
      }
    });

    const uniqueCount = new Set(nonBread).size;
    if (uniqueCount === nonBread.length && nonBread.length > 2) {
      varietyBonus *= 1.25;
    }

    return Math.round(total + (ingredientSum * countMultiplier * varietyBonus));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const level = await AsyncStorage.getItem('unlockedLevel');
      const score = await AsyncStorage.getItem('arcadeHighScore');
      if (level) setUnlockedLevel(parseInt(level));
      if (score) setArcadeHighScore(parseInt(score));
    };
    loadData();
  }, []);

  const initGrid = useCallback((level: Level, mode: GameMode) => {
    const initialGrid: Cell[] = [];
    const ingredients = mode === 'ARCADE' ? LEVELS[LEVELS.length-1].ingredients : level.ingredients;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        initialGrid.push({ row, col, piece: createPiece(ingredients) });
      }
    }
    setGrid(initialGrid);
    return initialGrid;
  }, []);

  const generateNewOrder = useCallback((targetGrid: Cell[], complexity?: 'simpler' | 'harder') => {
    if (!targetGrid || targetGrid.length === 0) return;
    let possibleChains: PieceType[][] = [];
    for (let i = 0; i < targetGrid.length; i++) {
      if (targetGrid[i].piece?.type === 'BREAD') {
        findChain(i, ['BREAD'], possibleChains, new Set([i]), targetGrid);
      }
    }
    if (possibleChains.length > 0) {
      let filteredChains = [...possibleChains];
      
      if (complexity === 'simpler') {
        filteredChains.sort((a, b) => a.length - b.length);
        filteredChains = filteredChains.slice(0, Math.max(1, Math.floor(filteredChains.length / 3)));
      } else if (complexity === 'harder') {
        filteredChains.sort((a, b) => b.length - a.length);
        filteredChains = filteredChains.slice(0, Math.max(1, Math.floor(filteredChains.length / 3)));
      }

      if (gameMode === 'CAMPAIGN' && selectedLevel.newIngredient) {
        const withNew = filteredChains.filter(chain => chain.includes(selectedLevel.newIngredient));
        if (withNew.length > 0) filteredChains = withNew;
      }
      
      const order = filteredChains[Math.floor(Math.random() * filteredChains.length)];
      setCurrentOrder(order);
      setCurrentPrice(calculatePrice(order));
    } else {
      const order: PieceType[] = ['BREAD', 'MEAT', 'BREAD'];
      setCurrentOrder(order);
      setCurrentPrice(calculatePrice(order));
    }
  }, [calculatePrice, gameMode, selectedLevel.newIngredient]);

  const playGame = (mode: GameMode = gameMode, level: Level = selectedLevel) => {
    const newGrid = initGrid(level, mode);
    setMoney(0);
    setTimeLeft(mode === 'ARCADE' ? 60 : level.id * 10 + 50);
    setIsGameOver(false);
    setScreen('GAME');
    generateNewOrder(newGrid);
  };

  const skipOrder = (complexity?: 'simpler' | 'harder') => {
    if (isGameOver) return;
    generateNewOrder(grid, complexity);
    Vibration.vibrate(20);
  };

  const handleSelectionUpdate = (index: number) => {
    if (isGameOver) return;
    if (currentSelection.length === 0) {
      if (grid[index].piece?.type === 'BREAD') {
        setCurrentSelection([index]);
        Vibration.vibrate(40);
        playClickSound(0);
      }
      return;
    }
    const lastIdx = currentSelection[currentSelection.length - 1];
    if (index === lastIdx) return;
    if (currentSelection.length > 1 && currentSelection[currentSelection.length - 2] === index) {
      setCurrentSelection(prev => prev.slice(0, -1));
      Vibration.vibrate(20);
      return;
    }
    const lastCell = grid[lastIdx];
    const currentCell = grid[index];
    const rowDiff = Math.abs(lastCell.row - currentCell.row);
    const colDiff = Math.abs(lastCell.col - currentCell.col);
    
    // Solo permitimos movimientos en ángulo recto (arriba, abajo, izquierda, derecha)
    const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

    if (isAdjacent && currentCell.piece && !currentSelection.includes(index)) {
      const hasClosingBread = currentSelection.some((idx, i) => i > 0 && grid[idx].piece?.type === 'BREAD');
      if (hasClosingBread) return;
      const newSelection = [...currentSelection, index];
      setCurrentSelection(newSelection);
      Vibration.vibrate(40);
      playClickSound(newSelection.length - 1);
    }
  };

  const handleSelectionEnd = async () => {
    const selectionTypes = currentSelection.map(idx => grid[idx].piece?.type);
    const isForwardMatch = selectionTypes.length === currentOrder.length && selectionTypes.every((t, i) => t === currentOrder[i]);
    const isBackwardMatch = selectionTypes.length === currentOrder.length && selectionTypes.every((t, i) => t === currentOrder[currentOrder.length - 1 - i]);
    
    if (isForwardMatch || isBackwardMatch) {
      Vibration.vibrate([0, 100, 50, 100]);
      playSuccessSound();
      
      const newMoney = money + currentPrice;
      setMoney(newMoney);

      if (gameMode === 'CAMPAIGN' && newMoney >= selectedLevel.targetMoney) {
        setIsGameOver(true);
        setScreen('RESULT');
        const nextLevelId = selectedLevel.id + 1;
        if (nextLevelId > unlockedLevel && nextLevelId <= LEVELS.length) {
          setUnlockedLevel(nextLevelId);
          await AsyncStorage.setItem('unlockedLevel', nextLevelId.toString());
        }
        setCurrentSelection([]);
        return;
      }

      if (gameMode === 'ARCADE' && newMoney > arcadeHighScore) {
        setArcadeHighScore(newMoney);
        await AsyncStorage.setItem('arcadeHighScore', newMoney.toString());
      }

      const newGrid = [...grid];
      currentSelection.forEach(idx => { newGrid[idx] = { ...newGrid[idx], piece: null }; });
      const ingredients = gameMode === 'ARCADE' ? LEVELS[LEVELS.length-1].ingredients : selectedLevel.ingredients;
      for (let i = 0; i < newGrid.length; i++) {
        if (!newGrid[i].piece) newGrid[i].piece = createPiece(ingredients);
      }
      setGrid(newGrid);
      generateNewOrder(newGrid);
    }
    setCurrentSelection([]);
  };

  useEffect(() => {
    if (screen !== 'GAME' || isGameOver) return;
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
  }, [screen, isGameOver]);

  const resetProgress = async () => {
    setUnlockedLevel(1);
    await AsyncStorage.setItem('unlockedLevel', '1');
  };

  const handleResultAction = () => {
    const isWin = gameMode === 'ARCADE' ? true : money >= selectedLevel.targetMoney;
    if (isWin && gameMode === 'CAMPAIGN') {
      const nextLevel = LEVELS.find(l => l.id === selectedLevel.id + 1);
      if (nextLevel) { setSelectedLevel(nextLevel); setScreen('INTRO'); }
      else { setScreen('MENU'); }
    } else { playGame(); }
  };

  if (screen === 'MENU') return (
    <MenuScreen levels={LEVELS} unlockedLevel={unlockedLevel} arcadeHighScore={arcadeHighScore}
      onStartLevel={(l) => { setSelectedLevel(l); setScreen('INTRO'); }}
      onStartArcade={() => { setGameMode('ARCADE'); playGame('ARCADE'); }}
      onResetProgress={resetProgress}
    />
  );

  if (screen === 'INTRO') return (
    <IntroScreen newIngredient={selectedLevel.newIngredient} description={selectedLevel.description}
      targetMoney={selectedLevel.targetMoney} timeLimit={60}
      onPlay={() => { setGameMode('CAMPAIGN'); playGame('CAMPAIGN'); }}
      onBack={() => setScreen('MENU')}
    />
  );

  if (screen === 'RESULT') return (
    <ResultScreen gameMode={gameMode} money={money} targetMoney={selectedLevel.targetMoney}
      arcadeHighScore={arcadeHighScore} onBack={() => setScreen('MENU')}
      onRetry={handleResultAction}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setScreen('MENU')}>
            <Text style={styles.menuText}>🏠</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        
        <View style={styles.statsRow}>
          <StatCard label="Tiempo" value={`${timeLeft}s`} icon="⏱️" type="time" isLowTime={timeLeft < 10} />
          <StatCard 
            label="Dinero" 
            value={gameMode === 'CAMPAIGN' ? `${money}/${selectedLevel.targetMoney}€` : `${money}€`} 
            icon="💰" 
            type="money" 
          />
        </View>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderLabel}>ORDEN ACTUAL</Text>
              <Text style={styles.burgerNameText}>{getBurgerName(currentOrder)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={styles.priceLabel}>{currentPrice}€</Text>
              {gameMode === 'ARCADE' ? (
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  <TouchableOpacity style={styles.complexityButton} onPress={() => skipOrder('simpler')}>
                    <Text style={styles.complexityText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.complexityButton} onPress={() => skipOrder('harder')}>
                    <Text style={styles.complexityText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.skipButtonSmall} onPress={() => skipOrder()}>
                  <Text style={styles.skipTextSmall}>SALTAR ⏩</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.orderPieces}>
            {currentOrder.map((type, i) => (
              <BurgerPiece key={i} type={type} scale={0.7} />
            ))}
          </View>
        </View>

        <View style={styles.boardWrapper}>
          <GameBoard grid={grid} currentSelection={currentSelection} isGameOver={isGameOver}
            onSelectionUpdate={handleSelectionUpdate} onSelectionEnd={handleSelectionEnd} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdfbf9' },
  container: { flex: 1, padding: 15, alignItems: 'center' },
  header: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 26, fontWeight: '900', color: '#D2691E', fontStyle: 'italic' },
  menuButton: { backgroundColor: '#fff', padding: 8, borderRadius: 12, elevation: 2 },
  menuText: { fontSize: 18 },
  skipButtonSmall: { backgroundColor: '#f8f9fa', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  skipTextSmall: { fontSize: 9, fontWeight: '800', color: '#adb5bd' },
  complexityButton: { backgroundColor: '#f8f9fa', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
  complexityText: { fontSize: 18, fontWeight: '900', color: '#adb5bd' },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 15 },
  orderCard: { backgroundColor: 'white', padding: 15, borderRadius: 24, width: '100%', marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8, alignItems: 'center' },
  orderLabel: { fontSize: 10, fontWeight: '800', color: '#adb5bd', letterSpacing: 1 },
  burgerNameText: { fontSize: 14, fontWeight: '900', color: '#4a4a4a', marginTop: 2 },
  priceLabel: { fontSize: 18, fontWeight: '900', color: '#27ae60' },
  orderPieces: { flexDirection: 'row-reverse', alignItems: 'center', gap: -15, height: 60, justifyContent: 'center', width: '100%' },
  boardWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }
});
