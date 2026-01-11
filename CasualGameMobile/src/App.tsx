import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Vibration, Text, StatusBar, TouchableOpacity, BackHandler, Image, Alert, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import GameBoard from './components/GameBoard';
import StatCard from './components/StatCard';
import MenuScreen from './components/MenuScreen';
import IntroScreen from './components/IntroScreen';
import ResultScreen from './components/ResultScreen';
import BurgerPiece from './components/BurgerPiece';
import SplashScreen from './components/SplashScreen';
import OptionsScreen from './components/OptionsScreen';
import { PieceType, Screen, GameMode, Cell, Level, Piece } from './types';

const { width, height } = Dimensions.get('window');

// Habilitar animaciones de layout en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LIFE_RECOVERY_TIME = 900; // 15 minutos en segundos
const MAX_LIVES = 5;

const getGridSize = (levelId: number, mode: GameMode) => {
  if (mode === 'ARCADE') return 7;
  if (levelId === 1) return 4;
  if (levelId === 2) return 5;
  if (levelId === 3) return 6;
  return 7;
};

const LEVELS: Level[] = [
  { id: 1, name: "Nivel 1: El Comienzo", targetMoney: 25, ingredients: ['MEAT'], newIngredient: 'MEAT', description: "¡Bienvenido! Empieza con lo básico: hamburguesas de carne." },
  { id: 2, name: "Nivel 2: Más Sabor", targetMoney: 35, ingredients: ['MEAT', 'CHEESE'], newIngredient: 'CHEESE', description: "¡Desbloqueaste el QUESO! Ahora los pedidos pueden llevar carne y queso." },
  { id: 3, name: "Nivel 3: El Toque Verde", targetMoney: 45, ingredients: ['MEAT', 'CHEESE', 'LETTUCE'], newIngredient: 'LETTUCE', description: "¡La LECHUGA está aquí! Haz tus hamburguesas más frescas." },
  { id: 4, name: "Nivel 4: Todo Completo", targetMoney: 50, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO'], newIngredient: 'TOMATO', description: "¡TOMATE desbloqueado! La hamburguesa completa está lista." },
  { id: 5, name: "Nivel 5: Crujiente", targetMoney: 55, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON'], newIngredient: 'BACON', description: "¡BACON desbloqueado! Añade un toque crujiente." },
  { id: 6, name: "Nivel 6: Salsa Especial", targetMoney: 60, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP'], newIngredient: 'KETCHUP', description: "¡KETCHUP desbloqueado! La salsa que no puede faltar." },
  { id: 7, name: "Nivel 7: El Toque Ácido", targetMoney: 65, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE'], newIngredient: 'PICKLE', description: "¡PEPINILLO desbloqueado! Para los amantes de los sabores fuertes." },
  { id: 8, name: "Nivel 8: El Final", targetMoney: 70, ingredients: ['MEAT', 'CHEESE', 'LETTUCE', 'TOMATO', 'BACON', 'KETCHUP', 'PICKLE', 'ONION'], newIngredient: 'ONION', description: "¡CEBOLLA desbloqueada! La hamburguesa definitiva." }
];

const createPiece = (availableIngredients: PieceType[]): Piece => {
  const rand = Math.random();
  let type: PieceType;
  if (rand < 0.35) type = 'BREAD';
  else if (rand < 0.65 && availableIngredients.includes('MEAT')) type = 'MEAT';
  else type = availableIngredients[Math.floor(Math.random() * availableIngredients.length)];
  return { id: Math.random().toString(36).substr(2, 9), type, isNew: true };
};

const findChain = (idx: number, currentChain: PieceType[], results: PieceType[][], visited: Set<number>, gridRef: Cell[], gridSize: number) => {
  if (currentChain.length >= 3 && currentChain[currentChain.length - 1] === 'BREAD') {
    const breadCount = currentChain.filter(t => t === 'BREAD').length;
    const meatCount = currentChain.filter(t => t === 'MEAT').length;
    if (breadCount === 2 && meatCount >= 1) {
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
    if (n.r >= 0 && n.r < gridSize && n.c >= 0 && n.c < gridSize) {
      const nextIdx = n.r * gridSize + n.c;
      if (!visited.has(nextIdx)) {
        const nextPiece = gridRef[nextIdx].piece;
        if (nextPiece) {
          if (nextPiece.type === 'BREAD') {
            if (currentChain.length >= 2 && currentChain[currentChain.length - 1] !== 'BREAD') {
              findChain(nextIdx, [...currentChain, 'BREAD'], results, new Set(visited).add(nextIdx), gridRef, gridSize);
            }
          } else {
            if (nextPiece.type === 'MEAT') {
              const meatCount = currentChain.filter(t => t === 'MEAT').length;
              if (meatCount >= 2) continue;
            }
            findChain(nextIdx, [...currentChain, nextPiece.type], results, new Set(visited).add(nextIdx), gridRef, gridSize);
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
  return (
    <SafeAreaProvider>
      <GameContent />
    </SafeAreaProvider>
  );
}

function GameContent() {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<Screen>('SPLASH');
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
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [arcadeDifficultyStep, setArcadeDifficultyStep] = useState(0);
  const [countdown, setCountdown] = useState<number | string | null>(null);
  
  // Nuevos estados
  const [lives, setLives] = useState(MAX_LIVES);
  const [globalMoney, setGlobalMoney] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [nextLifeTime, setNextLifeTime] = useState(LIFE_RECOVERY_TIME);
  const [lastLifeGainTime, setLastLifeGainTime] = useState<number>(Date.now());

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const backAction = () => {
      if (screen === 'GAME' && isGameStarted) {
        Alert.alert(
          "¿Salir de la partida?",
          "Perderás el progreso de este nivel.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Salir", onPress: () => {
              setIsGameStarted(false);
              setScreen('MENU');
            }}
          ]
        );
        return true;
      } else if (screen !== 'MENU' && screen !== 'SPLASH') {
        setScreen('MENU');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [screen, isGameStarted]);

  // Cargar datos persistentes
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('unlockedLevel');
        const savedScore = await AsyncStorage.getItem('arcadeHighScore');
        const savedLives = await AsyncStorage.getItem('lives');
        const savedMoney = await AsyncStorage.getItem('globalMoney');
        const savedSound = await AsyncStorage.getItem('isSoundEnabled');
        const savedLastLifeTime = await AsyncStorage.getItem('lastLifeGainTime');

        if (savedLevel) setUnlockedLevel(parseInt(savedLevel));
        if (savedScore) setArcadeHighScore(parseInt(savedScore));
        if (savedLives) setLives(parseInt(savedLives));
        if (savedMoney) setGlobalMoney(parseInt(savedMoney));
        if (savedSound) setIsSoundEnabled(savedSound === 'true');
        if (savedLastLifeTime) setLastLifeGainTime(parseInt(savedLastLifeTime));
      } catch (e) {}
    };
    loadData();
  }, []);

  // Guardar datos persistentes al cambiar
  useEffect(() => {
    AsyncStorage.setItem('unlockedLevel', unlockedLevel.toString());
    AsyncStorage.setItem('arcadeHighScore', arcadeHighScore.toString());
    AsyncStorage.setItem('lives', lives.toString());
    AsyncStorage.setItem('globalMoney', globalMoney.toString());
    AsyncStorage.setItem('isSoundEnabled', isSoundEnabled.toString());
    AsyncStorage.setItem('lastLifeGainTime', lastLifeGainTime.toString());
  }, [unlockedLevel, arcadeHighScore, lives, globalMoney, isSoundEnabled, lastLifeGainTime]);

  // Sistema de recuperación de vidas
  useEffect(() => {
    const timer = setInterval(() => {
      if (lives < MAX_LIVES) {
        const now = Date.now();
        const diff = Math.floor((now - lastLifeGainTime) / 1000);
        
        if (diff >= LIFE_RECOVERY_TIME) {
          const livesToGain = Math.floor(diff / LIFE_RECOVERY_TIME);
          const newLives = Math.min(MAX_LIVES, lives + livesToGain);
          setLives(newLives);
          setLastLifeGainTime(now - (diff % LIFE_RECOVERY_TIME) * 1000);
          setNextLifeTime(LIFE_RECOVERY_TIME - (diff % LIFE_RECOVERY_TIME));
        } else {
          setNextLifeTime(LIFE_RECOVERY_TIME - diff);
        }
      } else {
        setNextLifeTime(LIFE_RECOVERY_TIME);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lives, lastLifeGainTime]);

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
    if (!soundRef.current || !isSoundEnabled) return;
    try {
      const newPitch = 1.0 + (index * 0.15); 
      await soundRef.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
        shouldCorrectPitch: false,
        rate: newPitch,
      });
    } catch (e) {}
  };

  const playSuccessSound = async () => {
    if (!isSoundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' }
      );
      await sound.playAsync();
    } catch (e) {}
  };

  const calculatePrice = useCallback((order: PieceType[]) => {
    const nonBread = order.filter(t => t !== 'BREAD');
    const meatCount = nonBread.filter(t => t === 'MEAT').length;
    const extras = nonBread.filter(t => t !== 'MEAT');
    const extrasCount = extras.length;
    const uniqueExtrasCount = new Set(extras).size;

    let price = 0;

    // Lógica base según carnes y extras
    if (meatCount === 1) {
      if (extrasCount === 0) price = 5;
      else if (extrasCount === 1) price = 7;
      else if (extrasCount === 2) price = 10;
      else if (extrasCount === 3) {
        price = (uniqueExtrasCount < extrasCount) ? 13 : 15;
      }
      else price = 15 + (extrasCount - 3) * 2;
    } else if (meatCount === 2) {
      if (extrasCount === 0) price = 7;
      else if (extrasCount === 1) price = 9;
      else if (extrasCount === 2) price = 12;
      else if (extrasCount === 3) price = 17;
      else price = 17 + (extrasCount - 3) * 2;
    } else {
      price = 5 + (meatCount * 2) + (extrasCount * 2);
    }

    if (meatCount === 2) {
      const meatIndices = [];
      for (let i = 0; i < order.length; i++) {
        if (order[i] === 'MEAT') meatIndices.push(i);
      }
      if (meatIndices.length === 2 && Math.abs(meatIndices[0] - meatIndices[1]) > 1) {
        price += 2;
      }
    }

    let hasIdenticalExtrasTogether = false;
    for (let i = 0; i < order.length - 1; i++) {
      if (order[i] !== 'BREAD' && order[i] !== 'MEAT' && order[i] === order[i+1]) {
        hasIdenticalExtrasTogether = true;
        break;
      }
    }
    if (hasIdenticalExtrasTogether) {
      price -= 2;
    }

    return Math.max(5, price);
  }, []);

  const initGrid = useCallback((level: Level, mode: GameMode) => {
    const initialGrid: Cell[] = [];
    const gridSize = getGridSize(level.id, mode);
    const ingredients = mode === 'ARCADE' ? LEVELS[LEVELS.length-1].ingredients : level.ingredients;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        initialGrid.push({ row, col, piece: createPiece(ingredients) });
      }
    }
    setGrid(initialGrid);
    return initialGrid;
  }, []);

  const generateNewOrder = useCallback((targetGrid: Cell[], complexity?: 'simpler' | 'medium' | 'harder') => {
    if (!targetGrid || targetGrid.length === 0) return;
    
    // Calculamos el tamaño real del tablero recibido
    const gridSize = Math.sqrt(targetGrid.length);
    
    // 1. Buscamos todas las combinaciones posibles en el tablero actual
    let possibleChains: PieceType[][] = [];
    for (let i = 0; i < targetGrid.length; i++) {
      if (targetGrid[i].piece?.type === 'BREAD') {
        findChain(i, ['BREAD'], possibleChains, new Set([i]), targetGrid, gridSize);
      }
    }

    // 2. Si no hay NINGUNA hamburguesa posible, reseteamos el tablero (Petición del usuario)
    if (possibleChains.length === 0) {
      Vibration.vibrate(200);
      // Solo animamos el rebarajado si estamos dentro del juego ya empezado
      if (isGameStarted) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      }
      const newGrid = initGrid(selectedLevel, gameMode);
      // Reintentamos generar orden con el nuevo tablero
      setTimeout(() => generateNewOrder(newGrid, complexity), 100);
      return;
    }

    // 3. Seleccionamos una de las que SÍ son posibles
    let filteredChains = [...possibleChains];
    if (complexity === 'simpler') {
      filteredChains.sort((a, b) => a.length - b.length);
      filteredChains = filteredChains.slice(0, Math.max(1, Math.floor(filteredChains.length / 3)));
    } else if (complexity === 'medium') {
      filteredChains.sort((a, b) => a.length - b.length);
      const start = Math.floor(filteredChains.length / 3);
      const end = Math.floor(filteredChains.length * 2 / 3);
      filteredChains = filteredChains.slice(start, Math.max(start + 1, end));
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
  }, [calculatePrice, gameMode, selectedLevel.newIngredient, selectedLevel.id, initGrid]);

  const playGame = (mode: GameMode = gameMode, level: Level = selectedLevel) => {
    if (lives <= 0) {
      Alert.alert("¡Sin Vidas!", "Espera a recuperar vidas o mira un anuncio para jugar.");
      return;
    }
    
    setLives(prev => {
      const newLives = prev - 1;
      if (prev === MAX_LIVES) setLastLifeGainTime(Date.now());
      return newLives;
    });

    const initialGrid = initGrid(level, mode);
    setMoney(0);
    setTimeLeft(60); // Todos los niveles y modos ahora son de 60 segundos
    setIsGameOver(false);
    setIsGameStarted(false);
    setArcadeDifficultyStep(0);
    setCurrentOrder([]);
    setScreen('GAME');

    // Iniciar cuenta atrás con el grid recién creado
    startCountdown(initialGrid);
  };

  const startCountdown = (currentGrid: Cell[]) => {
    let count = 3;
    setCountdown(3);
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown("¡A TRABAJAR!");
      } else {
        clearInterval(interval);
        setCountdown(null);
        startGame(currentGrid);
      }
    }, 500);
  };

  const startGame = (currentGrid: Cell[]) => {
    setIsGameStarted(true);
    generateNewOrder(currentGrid);
    Vibration.vibrate(50);
  };

  const skipOrder = () => {
    if (isGameOver) return;
    if (gameMode === 'ARCADE') {
      const nextStep = (arcadeDifficultyStep + 1) % 3;
      setArcadeDifficultyStep(nextStep);
      const complexities: ('simpler' | 'medium' | 'harder')[] = ['simpler', 'medium', 'harder'];
      generateNewOrder(grid, complexities[nextStep]);
    } else {
      generateNewOrder(grid);
    }
    Vibration.vibrate(20);
  };

  const handleSelectionUpdate = (index: number) => {
    if (isGameOver || !isGameStarted || !grid[index]) return;
    
    // Calculamos el tamaño basado en el grid actual para evitar errores de índice
    const gridSize = Math.sqrt(grid.length);
    
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
    if (!isGameStarted) return;
    const selectionTypes = currentSelection.map(idx => grid[idx].piece?.type);
    const isMatch = selectionTypes.length === currentOrder.length && 
      (selectionTypes.every((t, i) => t === currentOrder[i]) || 
       selectionTypes.every((t, i) => t === currentOrder[currentOrder.length - 1 - i]));
    
    if (isMatch) {
      Vibration.vibrate([0, 100, 50, 100]);
      playSuccessSound();
      const newMoney = money + currentPrice;
      const isLevelComplete = gameMode === 'CAMPAIGN' && newMoney >= selectedLevel.targetMoney;

      // FASE 1: DESVANECER (Efecto visual de los usados)
      // Solo animamos si NO vamos a cambiar de pantalla inmediatamente
      if (!isLevelComplete) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      
      setGrid(prev => prev.map((c, i) => 
        currentSelection.includes(i) && c.piece ? { ...c, piece: { ...c.piece, isRemoving: true } } : c
      ));

      setTimeout(() => {
        // Si el nivel se ha completado, cambiamos de pantalla SIN animación de layout
        if (isLevelComplete) {
          setMoney(newMoney);
          setGlobalMoney(prev => prev + currentPrice);
          setIsGameOver(true); 
          setScreen('RESULT');
          if (selectedLevel.id >= unlockedLevel && selectedLevel.id < LEVELS.length) {
            setUnlockedLevel(selectedLevel.id + 1);
          }
          return;
        }

        // Si el juego sigue, animamos el movimiento de las piezas
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        setGrid(currentGrid => {
          const size = Math.sqrt(currentGrid.length);
          const nextGrid = currentGrid.map(c => ({ ...c }));
          
          currentSelection.forEach(idx => { if (nextGrid[idx]) nextGrid[idx].piece = null; });

          for (let col = 0; col < size; col++) {
            let emptyRow = size - 1;
            for (let row = size - 1; row >= 0; row--) {
              const idx = row * size + col;
              if (nextGrid[idx].piece !== null) {
                if (row !== emptyRow) {
                  nextGrid[emptyRow * size + col].piece = nextGrid[idx].piece;
                  nextGrid[idx].piece = null;
                }
                emptyRow--;
              }
            }
          }

          const ingredients = gameMode === 'ARCADE' ? LEVELS[LEVELS.length-1].ingredients : selectedLevel.ingredients;
          for (let i = 0; i < nextGrid.length; i++) {
            if (nextGrid[i].piece === null) {
              nextGrid[i].piece = createPiece(ingredients);
            }
          }

          setTimeout(() => generateNewOrder(nextGrid), 50);
          return nextGrid;
        });

        setMoney(newMoney);
        setGlobalMoney(prev => prev + currentPrice);
        if (gameMode === 'ARCADE' && newMoney > arcadeHighScore) {
          setArcadeHighScore(newMoney);
        }

      }, 400);
    }
    setCurrentSelection([]);
  };

  useEffect(() => {
    if (screen !== 'GAME' || isGameOver || !isGameStarted) return;
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
  }, [screen, isGameOver, isGameStarted]);

  const resetProgress = async () => {
    setUnlockedLevel(1);
    setArcadeHighScore(0);
    setGlobalMoney(0);
    setLives(MAX_LIVES);
    setScreen('MENU');
    await AsyncStorage.clear();
  };

  const handleResultAction = () => {
    const isWin = gameMode === 'ARCADE' ? true : money >= selectedLevel.targetMoney;
    if (isWin && gameMode === 'CAMPAIGN') {
      // Asegurar que el nivel se desbloquea
      if (selectedLevel.id >= unlockedLevel && selectedLevel.id < LEVELS.length) {
        setUnlockedLevel(selectedLevel.id + 1);
      }
      
      const nextLevel = LEVELS.find(l => l.id === selectedLevel.id + 1);
      if (nextLevel) { 
        setSelectedLevel(nextLevel); 
        setScreen('INTRO'); 
      } else { 
        setScreen('MENU'); 
      }
    } else { 
      playGame(); 
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'SPLASH':
        return <SplashScreen onFinish={() => setScreen('MENU')} />;
      case 'OPTIONS':
        return (
          <OptionsScreen 
            isSoundEnabled={isSoundEnabled}
            onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            onResetProgress={resetProgress}
            onLoginGoogle={() => Alert.alert("Google Login", "Próximamente...")}
            onBack={() => setScreen('MENU')}
          />
        );
      case 'MENU':
        return (
          <MenuScreen 
            levels={LEVELS} 
            unlockedLevel={unlockedLevel} 
            arcadeHighScore={arcadeHighScore}
            lives={lives}
            globalMoney={globalMoney}
            nextLifeTime={nextLifeTime}
            onStartLevel={(l) => { setSelectedLevel(l); setScreen('INTRO'); }}
            onStartArcade={() => { setGameMode('ARCADE'); playGame('ARCADE'); }}
            onOptions={() => setScreen('OPTIONS')}
          />
        );
      case 'INTRO':
        return (
          <IntroScreen newIngredient={selectedLevel.newIngredient} description={selectedLevel.description}
            targetMoney={selectedLevel.targetMoney} timeLimit={60}
            onPlay={() => { setGameMode('CAMPAIGN'); playGame('CAMPAIGN'); }}
            onBack={() => setScreen('MENU')}
          />
        );
      case 'RESULT':
        return (
          <ResultScreen gameMode={gameMode} money={money} targetMoney={selectedLevel.targetMoney}
            arcadeHighScore={arcadeHighScore} onBack={() => setScreen('MENU')}
            onRetry={handleResultAction}
          />
        );
      case 'GAME':
        return (
          <View style={styles.container}>
            <View style={styles.statsRow}>
              <StatCard label="Tiempo" value={`${timeLeft}s`} type="time" isLowTime={timeLeft < 10} />
              <StatCard 
                label="Dinero" 
                value={gameMode === 'CAMPAIGN' ? `${money}/${selectedLevel.targetMoney}€` : `${money}€`} 
                type="money" 
              />
            </View>

            <View style={styles.orderCard}>
              {countdown !== null ? (
                <View style={styles.waitingContainer}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              ) : !isGameStarted ? (
                <TouchableOpacity style={styles.waitingContainer} onPress={() => startGame(grid)}>
                  <Image source={require('./assets/Iconos/play.png')} style={styles.largePlayIcon} resizeMode="contain" />
                  <Text style={styles.waitingText}>PULSA PARA EMPEZAR</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderLabel}>ORDEN ACTUAL</Text>
                      <Text style={styles.burgerNameText}>{getBurgerName(currentOrder)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={styles.priceLabel}>{currentPrice}€</Text>
                      <TouchableOpacity style={styles.iconButton} onPress={() => skipOrder()}>
                        <Image source={require('./assets/Iconos/reset.png')} style={styles.skipIcon} resizeMode="contain" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.orderPieces}>
                    {currentOrder.map((type, i) => {
                      // Escalado dinámico corregido
                      const count = currentOrder.length;
                      let dynamicScale = 1.1; 
                      if (count > 3) {
                        dynamicScale = Math.max(0.7, 1.1 - (count - 3) * 0.08);
                      }
                      
                      return (
                        <View key={i} style={{ width: 35 * dynamicScale, alignItems: 'center', marginHorizontal: -2 }}>
                          <BurgerPiece 
                            type={type} 
                            scale={dynamicScale} 
                            gridSize={7} 
                          />
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>

            <View style={styles.boardWrapper}>
              <GameBoard 
                grid={grid} 
                currentSelection={currentSelection} 
                isGameOver={isGameOver} 
                gridSize={grid.length > 0 ? Math.sqrt(grid.length) : getGridSize(selectedLevel.id, gameMode)}
                onSelectionUpdate={handleSelectionUpdate} 
                onSelectionEnd={handleSelectionEnd} 
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {screen !== 'SPLASH' && (
        <LinearGradient
          colors={['#FF9966', '#FF5E62']}
          style={StyleSheet.absoluteFill}
        />
      )}
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { 
    flex: 1, 
    padding: 15, 
    alignItems: 'center',
    paddingTop: 10, // Un pequeño margen extra tras el notch
  },
  iconButton: { padding: 5 },
  largePlayIcon: { width: 60, height: 60, marginBottom: 5 },
  skipIcon: { width: 30, height: 30 },
  mathIcon: { width: 28, height: 28 },
  complexityButton: { width: 45, height: 45, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 15 },
  orderCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 24, 
    width: '100%', 
    marginBottom: 15, 
    elevation: 6,
    shadowColor: '#d2b48c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8, alignItems: 'center' },
  orderLabel: { fontSize: 10, fontWeight: '800', color: '#adb5bd', letterSpacing: 1 },
  burgerNameText: { fontSize: 14, fontWeight: '900', color: '#4a4a4a', marginTop: 2 },
  priceLabel: { fontSize: 18, fontWeight: '900', color: '#27ae60' },
  orderPieces: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    height: 80, 
    justifyContent: 'center', 
    width: '100%',
    paddingHorizontal: 5,
    overflow: 'visible' 
  },
  waitingContainer: { height: 100, justifyContent: 'center', alignItems: 'center', width: '100%' },
  waitingText: { fontSize: 12, fontWeight: '900', color: '#adb5bd', letterSpacing: 1 },
  countdownText: { fontSize: 32, fontWeight: '900', color: '#ff922b', letterSpacing: 2 },
  boardWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }
});
