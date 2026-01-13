import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Vibration, Text, StatusBar, TouchableOpacity, BackHandler, Image, Alert, Dimensions, LayoutAnimation, Platform, UIManager, ScrollView, Animated } from 'react-native';
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
import ShopScreen from './components/ShopScreen';
import ArcadeIntroScreen from './components/ArcadeIntroScreen';
import { PieceType, Screen, GameMode, Cell, Level, Piece, Recipe } from './types';
import { 
  TRANSLATIONS, 
  LIFE_RECOVERY_TIME, 
  MAX_LIVES, 
  BASE_RECIPES, 
  LEVELS, 
  getUnlockedRecipesForArcade, 
  getUnlockedIngredientsForArcade,
  INGREDIENT_IMAGES
} from './constants/gameData';
import { 
  getGridSize, 
  createPiece, 
  findChain, 
  getBurgerName, 
  isRecipeMatch, 
  calculatePrice 
} from './utils/gameLogic';
import { styles } from './styles/App.styles';
import { initializeAds, showRewardedAd } from './utils/ads';
import { logScreenView, logGameEvent } from './utils/analytics';

const { width, height } = Dimensions.get('window');

// Habilitar animaciones de layout en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [arcadeUnlockedLevel, setArcadeUnlockedLevel] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [gameMode, setGameMode] = useState<GameMode>('CAMPAIGN');
  const [arcadeHighScore, setArcadeHighScore] = useState<number>(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const selectionRef = useRef<number[]>([]);

  // Función auxiliar para mantener el Ref sincronizado con el estado
  const updateSelection = (newSelection: number[]) => {
    selectionRef.current = newSelection;
    setCurrentSelection(newSelection);
  };
  const [currentOrder, setCurrentOrder] = useState<PieceType[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [money, setMoney] = useState(0);
  const [burgersCreated, setBurgersCreated] = useState(0);
  const [burgerTarget, setBurgerTarget] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [arcadeDifficultyStep, setArcadeDifficultyStep] = useState(0);
  const [countdown, setCountdown] = useState<number | string | null>(null);
  
  // Ref para detectar el doble toque
  const lastTapRef = useRef({ index: -1, time: 0 });

  // Nuevos estados
  const [lives, setLives] = useState(MAX_LIVES);
  const [globalMoney, setGlobalMoney] = useState(200);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [nextLifeTime, setNextLifeTime] = useState(LIFE_RECOVERY_TIME);
  const [lastLifeGainTime, setLastLifeGainTime] = useState<number>(Date.now());
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  
  const t = TRANSLATIONS[language];

  // Recetario
  const [discoveredRecipes, setDiscoveredRecipes] = useState<string[]>([]);
  const [isRecipeListVisible, setIsRecipeListVisible] = useState(false);

  // Inicializar Firebase Analytics y AdMob al montar el componente
  useEffect(() => {
    initializeAds();
  }, []);

  // Registrar cambios de pantalla en Analytics
  useEffect(() => {
    logScreenView(screen);
  }, [screen]);

  // Power-ups
  const [timeBoostCount, setTimeBoostCount] = useState<number>(0);
  const [destructionPackCount, setDestructionPackCount] = useState<number>(0);
  const [useTimeBoost, setUseTimeBoost] = useState<boolean>(false);
  const [useDestructionPack, setUseDestructionPack] = useState<boolean>(false);
  const [destructionsUsed, setDestructionsUsed] = useState<number>(0);
  const [maxDestructions, setMaxDestructions] = useState<number>(25);
  const [shouldBlinkDestructions, setShouldBlinkDestructions] = useState<boolean>(false);
  const [helpText, setHelpText] = useState<string>('');

  const soundPool = useRef<Audio.Sound[]>([]);
  const poolIndex = useRef(0);
  const successSoundRef = useRef<Audio.Sound | null>(null);
  const destroySoundRef = useRef<Audio.Sound | null>(null);
  const discoverSoundRef = useRef<Audio.Sound | null>(null);
  const cancelSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const backAction = () => {
      if (screen === 'GAME' && isGameStarted) {
        Alert.alert(
          t.exit_title,
          t.exit_msg,
          [
            { text: t.cancel, style: "cancel" },
            { text: t.exit_confirm, onPress: () => {
              // Consumir power-ups activados al salir perdiendo vida (ya se consumieron al empezar)
              setUseTimeBoost(false);
              setUseDestructionPack(false);
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
        const savedArcadeLevel = await AsyncStorage.getItem('arcadeUnlockedLevel');
        const savedScore = await AsyncStorage.getItem('arcadeHighScore');
        const savedLives = await AsyncStorage.getItem('lives');
        const savedMoney = await AsyncStorage.getItem('globalMoney');
        const savedSound = await AsyncStorage.getItem('isSoundEnabled');
        const savedLastLifeTime = await AsyncStorage.getItem('lastLifeGainTime');
        const savedRecipes = await AsyncStorage.getItem('discoveredRecipes');
        const savedLang = await AsyncStorage.getItem('language');
        const savedTimeBoost = await AsyncStorage.getItem('timeBoostCount');
        const savedDestructionPack = await AsyncStorage.getItem('destructionPackCount');

        if (savedLevel) setUnlockedLevel(parseInt(savedLevel));
        if (savedArcadeLevel) setArcadeUnlockedLevel(parseInt(savedArcadeLevel));
        if (savedScore) setArcadeHighScore(parseInt(savedScore));
        if (savedMoney) {
          const moneyValue = parseInt(savedMoney);
          setGlobalMoney(moneyValue > 0 ? moneyValue : 200);
        } else {
          setGlobalMoney(200);
        }
        if (savedSound) setIsSoundEnabled(savedSound === 'true');
        if (savedLastLifeTime) setLastLifeGainTime(parseInt(savedLastLifeTime));
        if (savedRecipes) setDiscoveredRecipes(JSON.parse(savedRecipes));
        if (savedLang) setLanguage(savedLang as 'es' | 'en');
        if (savedTimeBoost) setTimeBoostCount(parseInt(savedTimeBoost));
        if (savedDestructionPack) setDestructionPackCount(parseInt(savedDestructionPack));

        // Si las vidas guardadas son menos que el nuevo MAX_LIVES, las subimos a MAX_LIVES por esta vez
        if (savedLives) {
          const val = parseInt(savedLives);
          setLives(val < MAX_LIVES ? MAX_LIVES : val);
        } else {
          setLives(MAX_LIVES);
        }
      } catch (e) {}
    };
    loadData();
  }, []);

  // Guardar datos persistentes al cambiar
  useEffect(() => {
    AsyncStorage.setItem('unlockedLevel', unlockedLevel.toString());
    AsyncStorage.setItem('arcadeUnlockedLevel', arcadeUnlockedLevel.toString());
    AsyncStorage.setItem('arcadeHighScore', arcadeHighScore.toString());
    AsyncStorage.setItem('lives', lives.toString());
    AsyncStorage.setItem('globalMoney', globalMoney.toString());
    AsyncStorage.setItem('isSoundEnabled', isSoundEnabled.toString());
    AsyncStorage.setItem('lastLifeGainTime', lastLifeGainTime.toString());
    AsyncStorage.setItem('discoveredRecipes', JSON.stringify(discoveredRecipes));
    AsyncStorage.setItem('language', language);
    AsyncStorage.setItem('timeBoostCount', timeBoostCount.toString());
    AsyncStorage.setItem('destructionPackCount', destructionPackCount.toString());
  }, [unlockedLevel, arcadeHighScore, lives, globalMoney, isSoundEnabled, lastLifeGainTime, discoveredRecipes, language, timeBoostCount, destructionPackCount]);

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
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Cargar el sonido de click local
        const loadClick = () => Audio.Sound.createAsync(
          require('./assets/Sounds/click2.wav'),
          { shouldPlay: false }
        );
        const clicks = await Promise.all([loadClick(), loadClick(), loadClick()]);
        soundPool.current = clicks.map(c => c.sound);

        const { sound: successSound } = await Audio.Sound.createAsync(
          require('./assets/Sounds/bell.wav'),
          { shouldPlay: false }
        );
        successSoundRef.current = successSound;

        const { sound: dSound } = await Audio.Sound.createAsync(
          require('./assets/Sounds/destroy.wav'),
          { shouldPlay: false }
        );
        destroySoundRef.current = dSound;

        const { sound: discSound } = await Audio.Sound.createAsync(
          require('./assets/Sounds/discover.mp3'),
          { shouldPlay: false }
        );
        discoverSoundRef.current = discSound;

        const { sound: cSound } = await Audio.Sound.createAsync(
          require('./assets/Sounds/cancel.wav'),
          { shouldPlay: false }
        );
        cancelSoundRef.current = cSound;

        console.log("Local sounds loaded successfully (with pool)");
      } catch (e) {
        console.log("Error loading sounds", e);
      }
    }
    setupAudio();
    return () => {
      soundPool.current.forEach(s => s.unloadAsync());
      successSoundRef.current?.unloadAsync();
      destroySoundRef.current?.unloadAsync();
      discoverSoundRef.current?.unloadAsync();
      cancelSoundRef.current?.unloadAsync();
    };
  }, []);

  const playClickSound = async (index: number) => {
    if (soundPool.current.length === 0 || !isSoundEnabled) return;
    try {
      // Lógica MIDI: Cada índice es un semitono. 
      // 1.0 es la nota base. La fórmula de frecuencia es 2^(n/12)
      const semitone = index;
      const newPitch = Math.pow(2, semitone / 12); 
      
      const sound = soundPool.current[poolIndex.current];
      poolIndex.current = (poolIndex.current + 1) % soundPool.current.length;

      // Usamos un volumen suave para que la onda sea pura y no sature
      await sound.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
        rate: newPitch,
        shouldCorrectPitch: false,
        volume: 0.5, 
      });
    } catch (e) {}
  };

  const playSuccessSound = async () => {
    if (!successSoundRef.current || !isSoundEnabled) return;
    try {
      await successSoundRef.current.playFromPositionAsync(0);
    } catch (e) {}
  };

  const playDestroySound = async () => {
    if (!destroySoundRef.current || !isSoundEnabled) return;
    try {
      await destroySoundRef.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      });
    } catch (e) {}
  };

  const playDiscoverSound = async () => {
    if (!discoverSoundRef.current || !isSoundEnabled) return;
    try {
      await discoverSoundRef.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      });
    } catch (e) {}
  };

  const playCancelSound = async () => {
    if (!cancelSoundRef.current || !isSoundEnabled) return;
    try {
      await cancelSoundRef.current.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      });
    } catch (e) {}
  };

  const playUIButtonSound = async () => {
    if (soundPool.current.length === 0 || !isSoundEnabled) return;
    try {
      const sound = soundPool.current[poolIndex.current];
      poolIndex.current = (poolIndex.current + 1) % soundPool.current.length;
      
      // Sonido sintético suave para botones UI (nota más baja que los clicks del juego)
      await sound.setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
        rate: 0.8, // Tono más bajo y suave
        shouldCorrectPitch: false,
        volume: 0.3, // Volumen más bajo para UI
      });
    } catch (e) {}
  };

  const initGrid = useCallback((level: Level, mode: GameMode, currentUnlockedLevel: number) => {
    const initialGrid: Cell[] = [];
    const gridSize = getGridSize(level.id, mode);
    
    // Determinamos qué ingredientes están disponibles
    let ingredients: PieceType[] = [];
    if (mode === 'ARCADE') {
      ingredients = getUnlockedIngredientsForArcade(currentUnlockedLevel);
    } else {
      ingredients = level.ingredients;
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        initialGrid.push({ row, col, piece: createPiece(ingredients) });
      }
    }
    setGrid(initialGrid);
    return initialGrid;
  }, []);

  const generateNewOrder = useCallback((targetGrid: Cell[], complexity?: 'simpler' | 'medium' | 'harder', overrideMode?: GameMode, overrideLevel?: Level) => {
    if (!targetGrid || targetGrid.length === 0) return;
    
    const currentMode = overrideMode || gameMode;
    const currentLevel = overrideLevel || selectedLevel;

    // Calculamos el tamaño real del tablero recibido
    const gridSize = Math.sqrt(targetGrid.length);

    if (currentMode === 'CAMPAIGN' && currentLevel) {
      // En campaña, el pedido es SIEMPRE la receta definida en el nivel
      const recipeId = currentLevel.newRecipe;
      const recipe = BASE_RECIPES.find(r => r.id === recipeId);
      
      if (recipe) {
        setCurrentOrder(recipe.ingredients);
        setCurrentPrice(recipe.price);
        // Calculate burger target for campaign mode
        if (currentMode === 'CAMPAIGN' && currentLevel) {
          const targetBurgers = Math.floor(currentLevel.targetMoney / recipe.price);
          setBurgerTarget(targetBurgers);
        }
        return;
      } else {
        // Fallback de seguridad por si no hay receta definida, pero forzamos una básica
        const fallback = BASE_RECIPES[0];
        setCurrentOrder(fallback.ingredients);
        setCurrentPrice(fallback.price);
        return;
      }
    }

    // 1. Buscamos todas las combinaciones posibles en el tablero actual
    let possibleChains: PieceType[][] = [];
    for (let i = 0; i < targetGrid.length; i++) {
      if (targetGrid[i].piece?.type === 'BREAD') {
        findChain(i, ['BREAD'], possibleChains, new Set([i]), targetGrid, gridSize);
      }
    }

    // Filtrar cadenas según ingredientes desbloqueados si es Arcade
    if (currentMode === 'ARCADE') {
      const unlockedIngredients = getUnlockedIngredientsForArcade(arcadeUnlockedLevel);
      possibleChains = possibleChains.filter(chain => 
        chain.every(ing => unlockedIngredients.includes(ing))
      );
    }

    // 2. Si no hay NINGUNA hamburguesa posible, reseteamos el tablero (Petición del usuario)
    if (possibleChains.length === 0) {
      Vibration.vibrate(200);
      if (isGameStarted) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      }
      const newGrid = initGrid(currentLevel, currentMode, currentMode === 'ARCADE' ? arcadeUnlockedLevel : unlockedLevel);
      setTimeout(() => generateNewOrder(newGrid, complexity, currentMode, currentLevel), 100);
      return;
    }

    // 3. Seleccionamos una de las que SÍ son posibles
    let filteredChains = [...possibleChains];

    // Si es Arcade, intentamos que coincida con recetas desbloqueadas para dar variedad pero con sentido
    if (currentMode === 'ARCADE') {
      const unlockedRecipes = BASE_RECIPES.filter(r => 
        getUnlockedRecipesForArcade(arcadeUnlockedLevel).includes(r.id)
      );
      
      // Intentamos encontrar cadenas que coincidan con recetas desbloqueadas (sin importar el orden interior)
      const matchingRecipes = filteredChains.filter(chain => 
        unlockedRecipes.some(r => isRecipeMatch(chain, r.ingredients))
      );

      if (matchingRecipes.length > 0) {
        filteredChains = matchingRecipes;
      }
    }

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

    const order = filteredChains[Math.floor(Math.random() * filteredChains.length)];
    setCurrentOrder(order);
    setCurrentPrice(calculatePrice(order));
  }, [gameMode, selectedLevel, arcadeUnlockedLevel, unlockedLevel, initGrid]);

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

    setGameMode(mode);
    setSelectedLevel(level);

    // Desbloqueo Arcade: Se desbloquea al EMPEZAR a jugar el nivel
    if (mode === 'CAMPAIGN') {
      setArcadeUnlockedLevel(prev => Math.max(prev, level.id));
    }

    // Verificar y consumir power-ups activados - Solo en modo campaña
    const timeBoostToUse = mode === 'CAMPAIGN' && useTimeBoost && timeBoostCount > 0;
    const destructionPackToUse = mode === 'CAMPAIGN' && useDestructionPack && destructionPackCount > 0;

    // Consumir power-ups solo si están activados y disponibles y estamos en modo campaña
    if (mode === 'CAMPAIGN') {
      if (useTimeBoost && timeBoostCount > 0) {
        setTimeBoostCount(prev => Math.max(0, prev - 1));
      }
      if (useDestructionPack && destructionPackCount > 0) {
        setDestructionPackCount(prev => Math.max(0, prev - 1));
      }
    }

    const initialGrid = initGrid(level, mode, mode === 'ARCADE' ? arcadeUnlockedLevel : unlockedLevel);
    setMoney(0);
    setBurgersCreated(0);
    setTimeLeft(60 + (timeBoostToUse ? 10 : 0)); // 60 segundos base + 10 si tiene time boost
    setIsGameOver(false);
    setIsGameStarted(false);
    setArcadeDifficultyStep(0);
    setCurrentOrder([]);
    setDestructionsUsed(0); // Resetear contador de eliminaciones
    setMaxDestructions(destructionPackToUse ? 75 : 25); // Guardar el máximo de eliminaciones
    setShouldBlinkDestructions(false); // Resetear parpadeo
    setScreen('GAME');

    // Resetear toggles de power-ups
    setUseTimeBoost(false);
    setUseDestructionPack(false);

    // Iniciar cuenta atrás con el grid recién creado
    startCountdown(initialGrid, mode, level);
  };

  const startCountdown = (currentGrid: Cell[], mode: GameMode, level: Level) => {
    let count = 3;
    setCountdown(3);
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown(t.go);
      } else {
        clearInterval(interval);
        setCountdown(null);
        startGame(currentGrid, mode, level);
      }
    }, 250); // Reducido a la mitad (0.25s por número)
  };

  const startGame = (currentGrid: Cell[], mode: GameMode, level: Level) => {
    setIsGameStarted(true);
    generateNewOrder(currentGrid, undefined, mode, level);
    Vibration.vibrate(50);
  };


  const destroyPiece = (index: number) => {
    if (destructionsUsed >= maxDestructions) {
      // Activar parpadeo en vez de mostrar alerta
      setShouldBlinkDestructions(true);
      Vibration.vibrate([0, 100, 50, 100]);
      setTimeout(() => setShouldBlinkDestructions(false), 2000); // Parpadear por 2 segundos
      return;
    }

    setDestructionsUsed(prev => prev + 1);
    Vibration.vibrate(60);
    playDestroySound();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    
    setGrid(currentGrid => {
      const size = Math.sqrt(currentGrid.length);
      const nextGrid = currentGrid.map(c => ({ ...c }));
      const col = index % size;
      const row = Math.floor(index / size);

      // Mover los de arriba hacia abajo
      for (let r = row; r > 0; r--) {
        const targetIdx = r * size + col;
        const sourceIdx = (r - 1) * size + col;
        nextGrid[targetIdx].piece = nextGrid[sourceIdx].piece;
      }

      // Nueva pieza arriba
    const ingredients = gameMode === 'ARCADE' 
      ? getUnlockedIngredientsForArcade(unlockedLevel) 
      : selectedLevel.ingredients;
    nextGrid[col].piece = createPiece(ingredients);

      // Comprobar si el pedido sigue siendo posible
      setTimeout(() => generateNewOrder(nextGrid), 50);
      
      return nextGrid;
    });
  };

  const handleSelectionUpdate = (index: number, isGrant: boolean = false) => {
    if (isGameOver || !isGameStarted || !grid[index]) return;
    
    // Guardamos el inicio del toque para detectar si es un "tap" rápido al soltar
    if (isGrant) {
      lastTapRef.current = { index, time: Date.now() };
    }

    const gridSize = Math.sqrt(grid.length);
    
    const currentSelection = selectionRef.current; // Usar el ref para tener el estado real inmediato

    if (currentSelection.length === 0) {
      if (grid[index].piece?.type === 'BREAD') {
        updateSelection([index]);
        Vibration.vibrate(40);
        playClickSound(0);
      }
      return;
    }
    const lastIdx = currentSelection[currentSelection.length - 1];
    if (index === lastIdx) return;
    if (currentSelection.length > 1 && currentSelection[currentSelection.length - 2] === index) {
      const newSelection = currentSelection.slice(0, -1);
      updateSelection(newSelection);
      Vibration.vibrate(20);
      playClickSound(newSelection.length - 1); // El tono baja al deseleccionar
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
      updateSelection(newSelection);
      Vibration.vibrate(40);
      playClickSound(newSelection.length - 1);
    }
  };

  const handleSelectionEnd = async () => {
    if (!isGameStarted) return;

    const currentSelection = selectionRef.current; // Usar el ref para consistencia

    // --- NUEVA LÓGICA: DESTRUCCIÓN POR TOQUE RÁPIDO (< 0.3s) ---
    const now = Date.now();
    const duration = now - lastTapRef.current.time;
    if (duration < 300 && currentSelection.length <= 1 && lastTapRef.current.index !== -1) {
      destroyPiece(lastTapRef.current.index);
      lastTapRef.current = { index: -1, time: 0 };
      updateSelection([]);
      return;
    }
    lastTapRef.current = { index: -1, time: 0 };

    const selectionTypes = currentSelection.map(idx => grid[idx].piece?.type).filter(t => t !== undefined) as PieceType[];
    
    // --- LÓGICA ARCADE: VALIDAR CONTRA RECETARIO ---
    if (gameMode === 'ARCADE') {
      const unlockedIds = getUnlockedRecipesForArcade(arcadeUnlockedLevel);
      const match = BASE_RECIPES.find(r => {
        if (!unlockedIds.includes(r.id) && !r.isSecret) return false;
        return isRecipeMatch(selectionTypes, r.ingredients);
      });

      if (match) {
        // Si es secreta y no descubierta, la descubrimos
        if (match.isSecret && !discoveredRecipes.includes(match.id)) {
          setDiscoveredRecipes(prev => [...prev, match.id]);
          const discoveredName = t[match.name as keyof typeof t] || match.name;
          playDiscoverSound();
          Alert.alert(t.new_discovery, `${t.discovery_msg}${discoveredName}`);
        }
        
        Vibration.vibrate([0, 100, 50, 100]);
        playSuccessSound();
        const newMoney = money + match.price;
        setMoney(newMoney);
        setGlobalMoney(prev => prev + match.price);
        if (newMoney > arcadeHighScore) setArcadeHighScore(newMoney);

        // Animación de desaparición y relleno
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setGrid(prev => prev.map((c, i) => 
          currentSelection.includes(i) && c.piece ? { ...c, piece: { ...c.piece, isRemoving: true } } : c
        ));

        setTimeout(() => {
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
          const ingredients = gameMode === 'ARCADE' 
            ? getUnlockedIngredientsForArcade(arcadeUnlockedLevel) 
            : selectedLevel.ingredients;
          for (let i = 0; i < nextGrid.length; i++) {
            if (nextGrid[i].piece === null) nextGrid[i].piece = createPiece(ingredients);
          }
            return nextGrid;
          });
        }, 400);
      } else {
        if (currentSelection.length > 0) playCancelSound();
      }
      updateSelection([]);
      return;
    }

    // --- LÓGICA CAMPAÑA: VALIDAR CONTRA PEDIDO ---
    const isMatch = isRecipeMatch(selectionTypes, currentOrder);
    
    if (isMatch) {
      Vibration.vibrate([0, 100, 50, 100]);
      playSuccessSound();
      const newMoney = money + currentPrice;
      const newBurgersCreated = burgersCreated + 1;
      const isLevelComplete = gameMode === 'CAMPAIGN' && newBurgersCreated >= burgerTarget;

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
          setBurgersCreated(newBurgersCreated);
          setGlobalMoney(prev => prev + currentPrice);
          setHelpText(''); // Ocultar ayuda al completar nivel
          setIsGameOver(true);
          setScreen('RESULT');
          if (selectedLevel.id === unlockedLevel) {
            setUnlockedLevel(unlockedLevel + 1);
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

        const ingredients = selectedLevel.ingredients;
        for (let i = 0; i < nextGrid.length; i++) {
          if (nextGrid[i].piece === null) {
            nextGrid[i].piece = createPiece(ingredients);
          }
        }

          setTimeout(() => generateNewOrder(nextGrid), 50);
          return nextGrid;
        });

        setMoney(newMoney);
        setBurgersCreated(newBurgersCreated);
        setGlobalMoney(prev => prev + currentPrice);
        setHelpText(''); // Ocultar ayuda cuando se completa una receta
      }, 400);
    } else {
      if (currentSelection.length > 0) playCancelSound();
    }
    updateSelection([]);
  };

  useEffect(() => {
    if (screen !== 'GAME' || isGameOver || !isGameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setHelpText(''); // Ocultar ayuda cuando se acaba el tiempo
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
    setArcadeUnlockedLevel(0);
    setArcadeHighScore(0);
    setGlobalMoney(0);
    setLives(MAX_LIVES);
    setDiscoveredRecipes([]);
    setTimeBoostCount(0);
    setDestructionPackCount(0);
    setUseTimeBoost(false);
    setUseDestructionPack(false);
    setScreen('MENU');
    await AsyncStorage.clear();
  };

  const buyTimeBoost = () => {
    if (globalMoney >= 50) {
      setGlobalMoney(prev => prev - 50);
      setTimeBoostCount(prev => prev + 1);
    }
  };

  const buyDestructionPack = () => {
    if (globalMoney >= 100) {
      setGlobalMoney(prev => prev - 100);
      setDestructionPackCount(prev => prev + 1);
    }
  };

  const handleWatchAdForLives = async () => {
    if (lives >= MAX_LIVES) {
      return;
    }

    try {
      const rewarded = await showRewardedAd(() => {
        // Recompensa: Recargar todas las vidas
        setLives(MAX_LIVES);
        setLastLifeGainTime(Date.now());
        setNextLifeTime(LIFE_RECOVERY_TIME);
        
        // Registrar evento en Analytics
        logGameEvent('lives_recovered_from_ad', {
          lives_gained: MAX_LIVES - lives,
        });
        
        // En desarrollo, mostrar mensaje informativo
        if (__DEV__) {
          Alert.alert(
            t.success || "¡Éxito!",
            (t.lives_recovered || "¡Vidas recargadas!") + "\n\n(Modo desarrollo: En producción se mostrará un anuncio real)"
          );
        } else {
          Alert.alert(
            t.success || "¡Éxito!",
            t.lives_recovered || "¡Vidas recargadas!"
          );
        }
      });

      if (!rewarded) {
        // El usuario cerró el anuncio sin completarlo
        Alert.alert(
          t.info || "Información",
          t.ad_not_completed || "Debes ver el anuncio completo para recibir las vidas."
        );
      }
    } catch (error) {
      console.error('Error al mostrar anuncio:', error);
      Alert.alert(
        t.error || "Error",
        t.ad_error || "No se pudo cargar el anuncio. Inténtalo más tarde."
      );
    }
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
            onBack={() => setScreen('MENU')}
            language={language}
            onToggleLanguage={() => setLanguage(language === 'es' ? 'en' : 'es')}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'SHOP':
        return (
          <ShopScreen
            globalMoney={globalMoney}
            timeBoostCount={timeBoostCount}
            destructionPackCount={destructionPackCount}
            onBuyTimeBoost={buyTimeBoost}
            onBuyDestructionPack={buyDestructionPack}
            onBack={() => setScreen('MENU')}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'MENU':
        return (
          <MenuScreen 
            levels={LEVELS} 
            unlockedLevel={unlockedLevel} 
            arcadeUnlockedLevel={arcadeUnlockedLevel}
            arcadeHighScore={arcadeHighScore}
            lives={lives}
            maxLives={MAX_LIVES}
            globalMoney={globalMoney}
            nextLifeTime={nextLifeTime}
            timeBoostCount={timeBoostCount}
            destructionPackCount={destructionPackCount}
            useTimeBoost={useTimeBoost}
            useDestructionPack={useDestructionPack}
            onToggleTimeBoost={setUseTimeBoost}
            onToggleDestructionPack={setUseDestructionPack}
            onStartLevel={(l) => { 
              setSelectedLevel(l); 
              setScreen('INTRO'); 
            }}
            onStartArcade={() => setScreen('ARCADE_INTRO')}
            onOptions={() => setScreen('OPTIONS')}
            onShop={() => setScreen('SHOP')}
            onWatchAdForLives={handleWatchAdForLives}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'INTRO':
        const levelRecipe = selectedLevel.newRecipe 
          ? BASE_RECIPES.find(r => r.id === selectedLevel.newRecipe)
          : null;

        return (
          <IntroScreen 
            levelId={selectedLevel.id}
            newIngredient={selectedLevel.newIngredient} 
            showNewIngredient={!!(selectedLevel.showNewIngredient && selectedLevel.newIngredient)}
            newRecipe={levelRecipe ? (t[levelRecipe.name as keyof typeof t] || levelRecipe.name) : undefined}
            recipeIngredients={levelRecipe?.ingredients}
            recipePrice={levelRecipe?.price}
            description={selectedLevel.description}
            targetMoney={selectedLevel.targetMoney} 
            timeLimit={60}
            timeBoostCount={timeBoostCount}
            destructionPackCount={destructionPackCount}
            useTimeBoost={useTimeBoost}
            useDestructionPack={useDestructionPack}
            onToggleTimeBoost={setUseTimeBoost}
            onToggleDestructionPack={setUseDestructionPack}
            onPlay={() => playGame('CAMPAIGN')}
            onBack={() => setScreen('MENU')}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'ARCADE_INTRO':
        return (
          <ArcadeIntroScreen 
            highScore={arcadeHighScore}
            onPlay={() => playGame('ARCADE')}
            onBack={() => setScreen('MENU')}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'RESULT':
        return (
          <ResultScreen gameMode={gameMode} money={money} targetMoney={selectedLevel.targetMoney}
            arcadeHighScore={arcadeHighScore} onBack={() => setScreen('MENU')}
            onRetry={handleResultAction}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'GAME':
        const isArcade = gameMode === 'ARCADE';
        return (
          <View style={styles.container}>
            <View style={styles.statsRow}>
              <TouchableOpacity
                style={styles.statTouchable}
                onPress={() => gameMode === 'CAMPAIGN' && setHelpText('Tiempo restante de juego')}
                activeOpacity={0.7}
              >
                <StatCard value={`${timeLeft}s`} type="time" isLowTime={timeLeft < 10} verticalLayout={true} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTouchable}
                onPress={() => gameMode === 'CAMPAIGN' && setHelpText('Hamburguesas a completar')}
                activeOpacity={0.7}
              >
                <StatCard
                  value={gameMode === 'CAMPAIGN' ? `${burgersCreated}/${burgerTarget}` : `${money}`}
                  type={gameMode === 'CAMPAIGN' ? "burgers" : "money"}
                  verticalLayout={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statTouchable}
                onPress={() => gameMode === 'CAMPAIGN' && setHelpText('Usos de eliminación de ingrediente')}
                activeOpacity={0.7}
              >
                <StatCard
                  value={`${maxDestructions - destructionsUsed}`}
                  type="destruction"
                  isLowTime={(maxDestructions - destructionsUsed) <= 3}
                  shouldBlink={shouldBlinkDestructions}
                  verticalLayout={true}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.orderCard}>
              {countdown !== null ? (
                <View style={styles.waitingContainer}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              ) : !isGameStarted ? (
                <TouchableOpacity style={styles.waitingContainer} onPress={() => { playUIButtonSound(); startGame(grid, gameMode, selectedLevel); }}>
                  <Image source={require('./assets/Iconos/play.png')} style={styles.largePlayIcon} resizeMode="contain" />
                  <Text style={styles.waitingText}>{t.press_to_start}</Text>
                </TouchableOpacity>
              ) : isArcade ? (
                <View style={styles.arcadeRecipeContainer}>
                  <Text style={styles.recipeLabelIntegrated}>📖 {t.recipes}</Text>
                         <ScrollView 
                           style={styles.recipeListIntegrated} 
                           contentContainerStyle={{ paddingBottom: 10 }}
                           nestedScrollEnabled={true}
                         >
                           {BASE_RECIPES.filter(r => {
                             const isUnlockedNormal = getUnlockedRecipesForArcade(arcadeUnlockedLevel).includes(r.id);
                             const isSecretDiscovered = r.isSecret && discoveredRecipes.includes(r.id);
                             return isUnlockedNormal || isSecretDiscovered;
                           }).map((recipe) => {
                             const isDiscovered = !recipe.isSecret || discoveredRecipes.includes(recipe.id);
                             const isUnlocked = getUnlockedRecipesForArcade(arcadeUnlockedLevel).includes(recipe.id) || (recipe.isSecret && discoveredRecipes.includes(recipe.id));
                             
                             // Ya está filtrado arriba, así que siempre debería mostrarse

                             return (
                               <View key={recipe.id} style={styles.recipeItem}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={styles.recipeName} numberOfLines={1}>
                                {isDiscovered ? t[recipe.name as keyof typeof t] || recipe.name : '???'}
                              </Text>
                            <View style={styles.recipeIngredients}>
                              {recipe.ingredients.map((ing, idx) => (
                                <View key={idx} style={styles.recipeIngredientIcon}>
                                  {isDiscovered ? (
                                    <BurgerPiece type={ing} scale={0.6} gridSize={8} />
                                  ) : (
                                    <Text style={styles.secretTextSmall}>?</Text>
                                  )}
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : (
                <>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderLabel}>{t.current_order}</Text>
                      <Text style={styles.burgerNameText}>{getBurgerName(currentOrder, language)}</Text>
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

            {/* Panel de ayuda centrado - solo visible en modo campaña */}
            {gameMode === 'CAMPAIGN' && helpText ? (
              <View style={styles.helpTextContainerCenter}>
                <TouchableOpacity onPress={() => { playUIButtonSound(); setHelpText(''); }}>
                  <Text style={styles.helpText}>{helpText}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

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

  // Determinar colores del degradado según el modo
  const gradientColors = screen === 'GAME' && gameMode === 'ARCADE' 
    ? ['#CC7A52', '#CC4A4E'] // Degradado más oscuro para modo arcade
    : ['#FF9966', '#FF5E62']; // Naranjas/rojos para otros modos

  return (
    <View style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {screen !== 'SPLASH' && (
        <>
          <LinearGradient
            colors={gradientColors}
            style={StyleSheet.absoluteFill}
          />
          <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            {renderScreen()}
          </View>
        </>
      )}
      {screen === 'SPLASH' && renderScreen()}
    </View>
  );
}
