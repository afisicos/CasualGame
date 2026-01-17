import React, { useState, useEffect, useCallback, useRef, Component } from 'react';
import { StyleSheet, View, Vibration, Text, StatusBar, TouchableOpacity, BackHandler, Image, ImageBackground, Alert, Dimensions, LayoutAnimation, Platform, UIManager, ScrollView, Animated, AppState } from 'react-native';
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
import RecipesBookScreen from './components/RecipesBookScreen';
import ArcadeIntroScreen from './components/ArcadeIntroScreen';
import { PieceType, Screen, GameMode, Cell, Level, Piece, Recipe } from './types';

interface RecipeToastData {
  id: string;
  name: string;
  price: number;
}
import { 
  TRANSLATIONS, 
  ENERGY_RECOVERY_TIME, 
  MAX_ENERGY, 
  BASE_RECIPES,
  LEVELS,
  getUnlockedRecipesForArcade,
  getUnlockedRecipesForCampaign,
  getUnlockedIngredientsForArcade,
  getUnlockedIngredientsForCampaign,
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
import { styles as statCardStyles } from './styles/StatCard.styles';
import { initializeAds, showRewardedAd } from './utils/ads';
import { logScreenView, logGameEvent } from './utils/analytics';

// Habilitar animaciones de layout en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Error Boundary para capturar errores de React
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error capturado por ErrorBoundary:', error);
    console.error('❌ Stack:', error.stack);
    console.error('❌ ErrorInfo:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF9966' }}>
          <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Error al cargar la aplicación</Text>
          <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>
            {this.state.error?.message || 'Error desconocido'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GameContent />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const RecipeToastItem: React.FC<{ toast: RecipeToastData; onComplete: (id: string) => void; t: any }> = ({ toast, onComplete, t }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200, // Más rápido al aparecer
          useNativeDriver: true,
        }),
        Animated.delay(600), // Menos tiempo estático
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300, // Se desvanece más rápido
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateY, {
        toValue: -250, // Sube mucho más arriba
        duration: 1200, // Un poco más rápido el movimiento total
        useNativeDriver: true,
      }),
    ]).start(() => onComplete(toast.id));
  }, []);

  return (
    <Animated.View 
      style={[
        styles.recipeToast, 
        { 
          opacity, 
          transform: [{ translateY }] 
        }
      ]}
    >
      <Text style={styles.recipeToastName}>{t[toast.name as keyof typeof t] || toast.name}</Text>
      <View style={styles.recipeToastPriceRow}>
        <Text style={styles.recipeToastPrice}>+{toast.price}</Text>
        <Image source={require('./assets/Iconos/coin.png')} style={styles.recipeToastCoin} resizeMode="contain" />
      </View>
    </Animated.View>
  );
};

function GameContent() {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<Screen>('SPLASH');
  const [toasts, setToasts] = useState<RecipeToastData[]>([]);

  const showRecipeToast = (name: string, price: number) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, name, price }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [arcadeUnlockedLevel, setArcadeUnlockedLevel] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS && LEVELS.length > 0 ? LEVELS[0] : {
    id: 1,
    name: 'level_1',
    targetBurgers: 100,
    ingredients: ['BREAD', 'MEAT'],
    description: 'level_1_desc'
  });
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
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [globalMoney, setGlobalMoney] = useState(200);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [nextEnergyTime, setNextEnergyTime] = useState(ENERGY_RECOVERY_TIME);
  const [lastEnergyGainTime, setLastEnergyGainTime] = useState<number>(Date.now());
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  
  const t = TRANSLATIONS[language];

  // Recetario
  const [discoveredRecipes, setDiscoveredRecipes] = useState<string[]>(['classic', 'tomato_burger']);
  const [isRecipeListVisible, setIsRecipeListVisible] = useState(false);

  // Inicializar Firebase Analytics y AdMob al montar el componente
  useEffect(() => {
    // Envolver en try-catch para evitar crashes
    try {
      initializeAds().catch((error) => {
        console.warn('Error al inicializar ads (no crítico):', error);
      });
    } catch (error) {
      console.warn('Error al inicializar ads (no crítico):', error);
    }
  }, []);

  // Registrar cambios de pantalla en Analytics
  useEffect(() => {
    try {
      logScreenView(screen);
    } catch (error) {
      console.warn('Error al registrar screen view (no crítico):', error);
    }
  }, [screen]);

  // Power-ups
  const [timeBoostCount, setTimeBoostCount] = useState<number>(0);
  const [superTimeBoostCount, setSuperTimeBoostCount] = useState<number>(0);
  const [destructionPackCount, setDestructionPackCount] = useState<number>(0);
  const [superDestructionPackCount, setSuperDestructionPackCount] = useState<number>(0);
  const [useTimeBoost, setUseTimeBoost] = useState<boolean>(false);
  const [useSuperTimeBoost, setUseSuperTimeBoost] = useState<boolean>(false);
  const [useDestructionPack, setUseDestructionPack] = useState<boolean>(false);
  const [useSuperDestructionPack, setUseSuperDestructionPack] = useState<boolean>(false);
  const [destructionsUsed, setDestructionsUsed] = useState<number>(0);
  const [maxDestructions, setMaxDestructions] = useState<number>(25);
  const [shouldBlinkDestructions, setShouldBlinkDestructions] = useState<boolean>(false);
  const [shouldBlinkBurgers, setShouldBlinkBurgers] = useState<boolean>(false);
  const [helpText, setHelpText] = useState<string>('');
  const helpTextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const expandRecipeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const appState = useRef(AppState.currentState);

  // Función para calcular recuperación de energía basada en tiempo
  const refreshEnergy = useCallback((currentEnergy: number, lastGain: number) => {
    if (currentEnergy >= MAX_ENERGY) return { energy: MAX_ENERGY, lastGain: Date.now() };

    const now = Date.now();
    const diffSeconds = Math.floor((now - lastGain) / 1000);
    
    if (diffSeconds >= ENERGY_RECOVERY_TIME) {
      const recovered = Math.floor(diffSeconds / ENERGY_RECOVERY_TIME);
      const newEnergy = Math.min(MAX_ENERGY, currentEnergy + recovered);
      
      let newLastGain = lastGain;
      if (newEnergy >= MAX_ENERGY) {
        newLastGain = now;
      } else {
        newLastGain = lastGain + (recovered * ENERGY_RECOVERY_TIME * 1000);
      }
      return { energy: newEnergy, lastGain: newLastGain };
    }
    
    return { energy: currentEnergy, lastGain: lastGain };
  }, []);

  // Actualizar High Score de Arcade cuando termina el juego
  useEffect(() => {
    if (isGameOver && gameMode === 'ARCADE' && money > arcadeHighScore) {
      setArcadeHighScore(money);
    }
  }, [isGameOver, gameMode, money, arcadeHighScore]);

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
        // Añadir un pequeño delay para asegurar que todo esté inicializado
        await new Promise(resolve => setTimeout(resolve, 100));
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
        const savedSuperTimeBoost = await AsyncStorage.getItem('superTimeBoostCount');
        const savedDestructionPack = await AsyncStorage.getItem('destructionPackCount');
        const savedSuperDestructionPack = await AsyncStorage.getItem('superDestructionPackCount');

        if (savedLevel) {
          const lvId = parseInt(savedLevel);
          setUnlockedLevel(lvId);
          // Al cargar, seleccionamos el último nivel desbloqueado por defecto
          const levelToSelect = LEVELS.find(l => l.id === lvId);
          if (levelToSelect) setSelectedLevel(levelToSelect);
        }
        if (savedArcadeLevel) setArcadeUnlockedLevel(parseInt(savedArcadeLevel));
        if (savedScore) setArcadeHighScore(parseInt(savedScore));
        if (savedMoney) {
          const moneyValue = parseInt(savedMoney);
          setGlobalMoney(moneyValue > 0 ? moneyValue : 200);
        } else {
          setGlobalMoney(200);
        }
        if (savedSound) setIsSoundEnabled(savedSound === 'true');
        if (savedRecipes) {
          setDiscoveredRecipes(JSON.parse(savedRecipes));
        } else {
          // Si no hay datos guardados, asegura que tenga las recetas básicas y las guarda
          setDiscoveredRecipes(['classic', 'tomato_burger']);
          AsyncStorage.setItem('discoveredRecipes', JSON.stringify(['classic', 'tomato_burger']));
        }
        if (savedLang) setLanguage(savedLang as 'es' | 'en');
        if (savedTimeBoost) setTimeBoostCount(parseInt(savedTimeBoost));
        if (savedSuperTimeBoost) setSuperTimeBoostCount(parseInt(savedSuperTimeBoost));
        if (savedDestructionPack) setDestructionPackCount(parseInt(savedDestructionPack));
        if (savedSuperDestructionPack) setSuperDestructionPackCount(parseInt(savedSuperDestructionPack));

        // Cargar energía y calcular recuperación offline
        let initialEnergy = MAX_ENERGY;
        let initialLastGain = Date.now();

        if (savedLives) initialEnergy = parseInt(savedLives);
        if (savedLastLifeTime) initialLastGain = parseInt(savedLastLifeTime);

        const result = refreshEnergy(initialEnergy, initialLastGain);
        setEnergy(result.energy);
        setLastEnergyGainTime(result.lastGain);
        
        setIsDataLoaded(true);
      } catch (e) {
        setIsDataLoaded(true);
      }
    };
    loadData();
  }, [refreshEnergy]);

  // Usar refs para tener acceso a los valores actuales dentro de listeners
  const energyRef = useRef(energy);
  const lastEnergyGainTimeRef = useRef(lastEnergyGainTime);
  useEffect(() => { energyRef.current = energy; }, [energy]);
  useEffect(() => { lastEnergyGainTimeRef.current = lastEnergyGainTime; }, [lastEnergyGainTime]);

  // Listener para cuando la app vuelve del background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const result = refreshEnergy(energyRef.current, lastEnergyGainTimeRef.current);
        if (result.energy !== energyRef.current) {
          setEnergy(result.energy);
          setLastEnergyGainTime(result.lastGain);
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [refreshEnergy]);

  // Guardar datos persistentes al cambiar
  useEffect(() => {
    if (!isDataLoaded) return;
    
    AsyncStorage.setItem('unlockedLevel', unlockedLevel.toString());
    AsyncStorage.setItem('arcadeUnlockedLevel', arcadeUnlockedLevel.toString());
    AsyncStorage.setItem('arcadeHighScore', arcadeHighScore.toString());
    AsyncStorage.setItem('lives', energy.toString()); // Mantener clave 'lives' para compatibilidad
    AsyncStorage.setItem('globalMoney', globalMoney.toString());
    AsyncStorage.setItem('isSoundEnabled', isSoundEnabled.toString());
    AsyncStorage.setItem('lastLifeGainTime', lastEnergyGainTime.toString()); // Mantener clave para compatibilidad
    AsyncStorage.setItem('discoveredRecipes', JSON.stringify(discoveredRecipes));
    AsyncStorage.setItem('language', language);
    AsyncStorage.setItem('timeBoostCount', timeBoostCount.toString());
    AsyncStorage.setItem('superTimeBoostCount', superTimeBoostCount.toString());
    AsyncStorage.setItem('destructionPackCount', destructionPackCount.toString());
    AsyncStorage.setItem('superDestructionPackCount', superDestructionPackCount.toString());
  }, [unlockedLevel, arcadeUnlockedLevel, arcadeHighScore, energy, globalMoney, isSoundEnabled, lastEnergyGainTime, discoveredRecipes, language, timeBoostCount, superTimeBoostCount, destructionPackCount, superDestructionPackCount]);

  // Sistema de recuperación de energía
  useEffect(() => {
    const timer = setInterval(() => {
      if (energy < MAX_ENERGY) {
        const now = Date.now();
        const diff = Math.floor((now - lastEnergyGainTime) / 1000);
        
        if (diff >= ENERGY_RECOVERY_TIME) {
          const energyToGain = Math.floor(diff / ENERGY_RECOVERY_TIME);
          const newEnergy = Math.min(MAX_ENERGY, energy + energyToGain);
          setEnergy(newEnergy);
          setLastEnergyGainTime(now - (diff % ENERGY_RECOVERY_TIME) * 1000);
          setNextEnergyTime(ENERGY_RECOVERY_TIME - (diff % ENERGY_RECOVERY_TIME));
        } else {
          setNextEnergyTime(ENERGY_RECOVERY_TIME - diff);
        }
      } else {
        setNextEnergyTime(ENERGY_RECOVERY_TIME);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [energy, lastEnergyGainTime]);

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
      ingredients = getUnlockedIngredientsForCampaign(currentUnlockedLevel);
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
        // Set burger target for campaign mode
        if (currentMode === 'CAMPAIGN' && currentLevel) {
          setBurgerTarget(currentLevel.targetBurgers);
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
    if (energy <= 0) {
      Alert.alert("¡Sin Energía!", "Espera a recuperar energía o mira un anuncio para jugar.");
      return;
    }
    
    setEnergy(prev => {
      const newEnergy = prev - 1;
      if (prev === MAX_ENERGY) setLastEnergyGainTime(Date.now());
      return newEnergy;
    });

    setGameMode(mode);
    setSelectedLevel(level);

    // Desbloqueo Arcade: Se desbloquea al EMPEZAR a jugar el nivel
    if (mode === 'CAMPAIGN') {
      setArcadeUnlockedLevel(prev => Math.max(prev, level.id));
    }

    // Verificar y consumir power-ups activados - Solo en modo campaña
    const superTimeBoostToUse = mode === 'CAMPAIGN' && useSuperTimeBoost && superTimeBoostCount > 0;
    const timeBoostToUse = mode === 'CAMPAIGN' && useTimeBoost && timeBoostCount > 0 && !superTimeBoostToUse;
    
    const superDestructionPackToUse = mode === 'CAMPAIGN' && useSuperDestructionPack && superDestructionPackCount > 0;
    const destructionPackToUse = mode === 'CAMPAIGN' && useDestructionPack && destructionPackCount > 0 && !superDestructionPackToUse;

    // Consumir power-ups solo si están activados y disponibles y estamos en modo campaña
    if (mode === 'CAMPAIGN') {
      if (superTimeBoostToUse) {
        setSuperTimeBoostCount(prev => Math.max(0, prev - 1));
      } else if (timeBoostToUse) {
        setTimeBoostCount(prev => Math.max(0, prev - 1));
      }

      if (superDestructionPackToUse) {
        setSuperDestructionPackCount(prev => Math.max(0, prev - 1));
      } else if (destructionPackToUse) {
        setDestructionPackCount(prev => Math.max(0, prev - 1));
      }
    }

    const initialGrid = initGrid(level, mode, mode === 'ARCADE' ? arcadeUnlockedLevel : unlockedLevel);
    setMoney(0);
    setBurgersCreated(0);
    
    // Calcular tiempo: Super(20) > Normal(10) > Base(60)
    let startTime = 60;
    if (superTimeBoostToUse) startTime += 20;
    else if (timeBoostToUse) startTime += 10;
    
    setTimeLeft(startTime);
    setIsGameOver(false);
    setIsGameStarted(false);
    setArcadeDifficultyStep(0);
    setCurrentOrder([]);
    setDestructionsUsed(0); // Resetear contador de eliminaciones
    
    // Calcular eliminaciones: Super(150) > Normal(75) > Base(25)
    let startDestructions = 25;
    if (superDestructionPackToUse) startDestructions = 150;
    else if (destructionPackToUse) startDestructions = 75;
    
    setMaxDestructions(startDestructions); // Guardar el máximo de eliminaciones
    setShouldBlinkDestructions(false); // Resetear parpadeo
    setScreen('GAME');

    // Resetear toggles de power-ups
    setUseTimeBoost(false);
    setUseSuperTimeBoost(false);
    setUseDestructionPack(false);
    setUseSuperDestructionPack(false);

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
        // Detener el intervalo y esperar un poco más para empezar el juego
        clearInterval(interval);
        setTimeout(() => {
          setCountdown(null);
          startGame(currentGrid, mode, level);
        }, 550); // 250ms del intervalo original + 300ms extra solicitados = 550ms
      }
    }, 250); // 0.25s por número
  };

  const startGame = (currentGrid: Cell[], mode: GameMode, level: Level) => {
    setIsGameStarted(true);
    generateNewOrder(currentGrid, undefined, mode, level);
    Vibration.vibrate(50);

    // Descubrir automáticamente la receta del nivel al jugar por primera vez (solo en campaña)
    if (mode === 'CAMPAIGN' && level?.newRecipe && !discoveredRecipes.includes(level.newRecipe)) {
      setDiscoveredRecipes(prev => [...prev, level.newRecipe!]);
    }

    // Mostrar mensaje de instrucciones durante 5 segundos al iniciar el nivel (solo en campaña)
    if (mode === 'CAMPAIGN') {
      setHelpText(t.recipe_instruction);
      setTimeout(() => {
        setHelpText('');
      }, 5000);
    }
  };


  const destroyPiece = (index: number) => {
    if (destructionsUsed >= maxDestructions) {
      setShouldBlinkDestructions(true);
      Vibration.vibrate([0, 100, 50, 100]);
      setTimeout(() => setShouldBlinkDestructions(false), 2000);
      return;
    }

    if (!grid[index] || !grid[index].piece) return;

    setDestructionsUsed(prev => prev + 1);
    
    // Destello visual al gastar
    setShouldBlinkDestructions(true);
    setTimeout(() => setShouldBlinkDestructions(false), 200);

    Vibration.vibrate(60);
    playDestroySound();
    
    // Fase 1: Marcar la pieza para eliminación (activar animación de explosión)
    const targetPieceId = grid[index].piece.id;
    setGrid(prev => prev.map(c => 
      c.piece && c.piece.id === targetPieceId ? { ...c, piece: { ...c.piece, isRemoving: true } } : c
    ));

    // Fase 2: Ejecutar la lógica de gravedad después de la animación
    setTimeout(() => {
      setGrid(currentGrid => {
        const size = Math.sqrt(currentGrid.length);
        const nextGrid = currentGrid.map(c => ({ ...c }));
        
        // Encontrar la posición actual de la pieza (por si se movió)
        const currentPos = nextGrid.findIndex(c => c.piece?.id === targetPieceId);
        if (currentPos === -1) return currentGrid;

        const col = currentPos % size;
        const row = Math.floor(currentPos / size);

        // Mover los de arriba hacia abajo
        for (let r = row; r > 0; r--) {
          const targetIdx = r * size + col;
          const sourceIdx = (r - 1) * size + col;
          nextGrid[targetIdx].piece = nextGrid[sourceIdx].piece;
        }

        // Nueva pieza arriba
        const ingredients = gameMode === 'ARCADE' 
          ? getUnlockedIngredientsForArcade(arcadeUnlockedLevel) 
          : selectedLevel.ingredients;
        nextGrid[col].piece = createPiece(ingredients);

        setTimeout(() => generateNewOrder(nextGrid), 50);
        return nextGrid;
      });
    }, 300); // Tiempo ligeramente menor que la animación completa para fluidez
  };

  const handleSelectionUpdate = (index: number, isGrant: boolean = false) => {
    if (isGameOver || !isGameStarted || !grid[index]) return;
    
    if (isGrant) {
      lastTapRef.current = { index, time: Date.now() };
    }

    const currentSelection = selectionRef.current;

    if (currentSelection.length === 0) {
      if (grid[index].piece?.type === 'BREAD' && !grid[index].piece?.isRemoving) {
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
      playClickSound(newSelection.length - 1);
      return;
    }

    const lastCell = grid[lastIdx];
    const currentCell = grid[index];
    if (!lastCell || !currentCell) return;

    const rowDiff = Math.abs(lastCell.row - currentCell.row);
    const colDiff = Math.abs(lastCell.col - currentCell.col);
    const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    
    if (isAdjacent && currentCell.piece && !currentCell.piece.isRemoving && !currentSelection.includes(index)) {
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

    const currentSelection = [...selectionRef.current];
    const now = Date.now();
    const duration = now - lastTapRef.current.time;

    if (duration < 300 && currentSelection.length <= 1 && lastTapRef.current.index !== -1) {
      destroyPiece(lastTapRef.current.index);
      lastTapRef.current = { index: -1, time: 0 };
      updateSelection([]);
      return;
    }
    lastTapRef.current = { index: -1, time: 0 };

    if (currentSelection.length === 0) return;

    const selectionPieces = currentSelection.map(idx => grid[idx]?.piece).filter(Boolean);
    const selectionTypes = selectionPieces.map(p => p!.type);
    const selectionIds = selectionPieces.map(p => p!.id);
    
    const isArcade = gameMode === 'ARCADE';
    let match = null;

    if (isArcade) {
      const unlockedIds = getUnlockedRecipesForArcade(arcadeUnlockedLevel);
      match = BASE_RECIPES.find(r => {
        if (!unlockedIds.includes(r.id)) return false;
        return isRecipeMatch(selectionTypes, r.ingredients);
      });

      // Si no es una receta oficial, pero es una hamburguesa válida (pan al inicio y fin y con carne)
      if (!match && selectionTypes.length >= 2 && selectionTypes[0] === 'BREAD' && selectionTypes[selectionTypes.length - 1] === 'BREAD') {
        const hasMeat = selectionTypes.includes('MEAT');
        if (hasMeat) {
          const uniqueIngredients = new Set(selectionTypes).size;
          match =           {
            id: 'strange',
            name: 'strange_burger',
            price: 2 + uniqueIngredients,
            ingredients: []
          } as Recipe;
        }
      }
    } else {
      if (isRecipeMatch(selectionTypes, currentOrder)) {
        match = { price: currentPrice };
      }
    }

    if (match) {
      Vibration.vibrate([0, 100, 50, 100]);
      playSuccessSound();

      if (isArcade && !discoveredRecipes.includes((match as Recipe).id)) {
        setDiscoveredRecipes(prev => [...prev, (match as Recipe).id]);
        const discoveredName = t[(match as Recipe).name as keyof typeof t] || (match as Recipe).name;
        playDiscoverSound();
        Alert.alert(t.new_discovery, `${t.discovery_msg}${discoveredName}`);
      }

      const matchPrice = isArcade ? (match as Recipe).price : currentPrice;
      const newMoney = money + matchPrice;
      const newBurgersCreated = burgersCreated + 1;
      const isLevelComplete = !isArcade && newBurgersCreated >= burgerTarget;

      // Mostrar toast si es modo arcade
      if (isArcade) {
        showRecipeToast((match as Recipe).name, (match as Recipe).price);
      }

      setGrid(prev => prev.map(c => 
        c.piece && selectionIds.includes(c.piece.id) ? { ...c, piece: { ...c.piece, isRemoving: true } } : c
      ));

      setTimeout(() => {
        if (isLevelComplete) {
          setMoney(newMoney);
          setBurgersCreated(newBurgersCreated);
          setShouldBlinkBurgers(true);
          setTimeout(() => setShouldBlinkBurgers(false), 200);
          setGlobalMoney(prev => prev + matchPrice);
          // Limpiar timeout de ayuda si existe
          if (helpTextTimeoutRef.current) {
            clearTimeout(helpTextTimeoutRef.current);
            helpTextTimeoutRef.current = null;
          }
          setHelpText('');
          setIsGameOver(true);
          setScreen('RESULT');
          setUnlockedLevel(prev => Math.max(prev, selectedLevel.id + 1));
          return;
        }

        setGrid(currentGrid => {
          const size = Math.sqrt(currentGrid.length);
          const nextGrid = currentGrid.map(c => ({ ...c }));
          
          nextGrid.forEach(cell => {
            if (cell.piece && selectionIds.includes(cell.piece.id)) {
              cell.piece = null;
            }
          });

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

          const ingredients = isArcade 
            ? getUnlockedIngredientsForArcade(arcadeUnlockedLevel) 
            : selectedLevel.ingredients;
            
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
        setShouldBlinkBurgers(true);
        setTimeout(() => setShouldBlinkBurgers(false), 200);
        setGlobalMoney(prev => prev + matchPrice);
        // Limpiar timeout de ayuda si existe
        if (helpTextTimeoutRef.current) {
          clearTimeout(helpTextTimeoutRef.current);
          helpTextTimeoutRef.current = null;
        }
        setHelpText('');
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
          // Limpiar timeout de ayuda si existe
          if (helpTextTimeoutRef.current) {
            clearTimeout(helpTextTimeoutRef.current);
            helpTextTimeoutRef.current = null;
          }
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
    setEnergy(MAX_ENERGY);
    setDiscoveredRecipes(['classic', 'tomato_burger']);
    setTimeBoostCount(0);
    setSuperTimeBoostCount(0);
    setDestructionPackCount(0);
    setSuperDestructionPackCount(0);
    setUseTimeBoost(false);
    setUseSuperTimeBoost(false);
    setUseDestructionPack(false);
    setUseSuperDestructionPack(false);
    setScreen('MENU');
    await AsyncStorage.clear();
    // Después de limpiar, guardar las recetas básicas
    await AsyncStorage.setItem('discoveredRecipes', JSON.stringify(['classic', 'tomato_burger']));
  };

  const buyTimeBoost = () => {
    if (globalMoney >= 50) {
      setGlobalMoney(prev => prev - 50);
      setTimeBoostCount(prev => prev + 1);
    }
  };

  const buySuperTimeBoost = () => {
    if (globalMoney >= 150) {
      setGlobalMoney(prev => prev - 150);
      setSuperTimeBoostCount(prev => prev + 1);
    }
  };

  const buyDestructionPack = () => {
    if (globalMoney >= 100) {
      setGlobalMoney(prev => prev - 100);
      setDestructionPackCount(prev => prev + 1);
    }
  };

  const buySuperDestructionPack = () => {
    if (globalMoney >= 250) {
      setGlobalMoney(prev => prev - 250);
      setSuperDestructionPackCount(prev => prev + 1);
    }
  };

  const buyEnergy = () => {
    if (globalMoney >= 100 && energy < MAX_ENERGY) {
      setGlobalMoney(prev => prev - 100);
      setEnergy(prev => Math.min(MAX_ENERGY, prev + 1));
      // Si el jugador estaba al mínimo, reiniciamos el tiempo de recuperación
      if (energy === 0) {
        setLastEnergyGainTime(Date.now());
        setNextEnergyTime(ENERGY_RECOVERY_TIME);
      }
    }
  };

  const handleWatchAdForEnergy = async () => {
    if (energy >= MAX_ENERGY) {
      return;
    }

    try {
      const rewarded = await showRewardedAd(() => {
        // Recompensa: Recargar toda la energía
        setEnergy(MAX_ENERGY);
        setLastEnergyGainTime(Date.now());
        setNextEnergyTime(ENERGY_RECOVERY_TIME);
        
        // Registrar evento en Analytics
        logGameEvent('energy_recovered_from_ad', {
          energy_gained: MAX_ENERGY - energy,
        });
        
        // En desarrollo, mostrar mensaje informativo
        if (__DEV__) {
          Alert.alert(
            t.success || "¡Éxito!",
            (t.energy_recovered || "¡Energía recargada!") + "\n\n(Modo desarrollo: En producción se mostrará un anuncio real)"
          );
        } else {
          Alert.alert(
            t.success || "¡Éxito!",
            t.energy_recovered || "¡Energía recargada!"
          );
        }
      });

      if (!rewarded) {
        // El usuario cerró el anuncio sin completarlo
        Alert.alert(
          t.info || "Información",
          t.ad_not_completed || "Debes ver el anuncio completo para recibir la energía."
        );
      }
    } catch (error: any) {
      console.error('Error al mostrar anuncio:', error);
      const errorMsg = error?.message || String(error);
      
      // Usar el mensaje del error si ya es amigable, sino usar uno genérico
      let userMessage = errorMsg;
      
      // Si el mensaje del error ya es descriptivo (viene de showRewardedAd), usarlo directamente
      if (errorMsg.includes('Intenta más tarde') || errorMsg.includes('Intenta de nuevo') || errorMsg.includes('Verifica tu conexión')) {
        userMessage = errorMsg;
      } else {
        // Mensajes más amigables según el tipo de error
        userMessage = t.ad_error || "No se pudo cargar el anuncio.";
        if (errorMsg.includes('network') || errorMsg.includes('internet') || errorMsg.includes('conexión')) {
          userMessage = "Verifica tu conexión a internet e intenta de nuevo.";
        } else if (errorMsg.includes('not available') || errorMsg.includes('no fill') || errorMsg.includes('disponibles')) {
          userMessage = "No hay anuncios disponibles en este momento. Intenta más tarde.";
        } else if (errorMsg.includes('timeout') || errorMsg.includes('tardó demasiado')) {
          userMessage = "El anuncio tardó demasiado en cargar. Intenta de nuevo.";
        }
      }
      
      Alert.alert(
        t.error || "Error",
        userMessage
      );
    }
  };

  const handleResultAction = () => {
    const isWin = gameMode === 'ARCADE' ? true : burgersCreated >= burgerTarget;
    if (isWin && gameMode === 'CAMPAIGN') {
      // Asegurar que el nivel se desbloquea
      setUnlockedLevel(prev => Math.max(prev, selectedLevel.id + 1));
      
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
            energy={energy}
            maxEnergy={MAX_ENERGY}
            timeBoostCount={timeBoostCount}
            superTimeBoostCount={superTimeBoostCount}
            destructionPackCount={destructionPackCount}
            superDestructionPackCount={superDestructionPackCount}
            onBuyTimeBoost={buyTimeBoost}
            onBuySuperTimeBoost={buySuperTimeBoost}
            onBuyDestructionPack={buyDestructionPack}
            onBuySuperDestructionPack={buySuperDestructionPack}
            onBuyEnergy={buyEnergy}
            onPlaySound={playUIButtonSound}
            t={t}
          />
        );
      case 'RECIPES_BOOK':
        const campaignUnlocked = getUnlockedRecipesForCampaign(unlockedLevel);
        const arcadeUnlocked = getUnlockedRecipesForArcade(arcadeUnlockedLevel);
        const allUnlockedRecipes = [...new Set([...campaignUnlocked, ...arcadeUnlocked])];

        return (
          <RecipesBookScreen
            discoveredRecipes={discoveredRecipes}
            unlockedRecipes={allUnlockedRecipes}
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
            energy={energy}
            maxEnergy={MAX_ENERGY}
            globalMoney={globalMoney}
            nextEnergyTime={nextEnergyTime}
            timeBoostCount={timeBoostCount}
            superTimeBoostCount={superTimeBoostCount}
            destructionPackCount={destructionPackCount}
            superDestructionPackCount={superDestructionPackCount}
            useTimeBoost={useTimeBoost}
            useSuperTimeBoost={useSuperTimeBoost}
            useDestructionPack={useDestructionPack}
            useSuperDestructionPack={useSuperDestructionPack}
            onToggleTimeBoost={setUseTimeBoost}
            onToggleSuperTimeBoost={setUseSuperTimeBoost}
            onToggleDestructionPack={setUseDestructionPack}
            onToggleSuperDestructionPack={setUseSuperDestructionPack}
            onStartLevel={(l) => { 
              setSelectedLevel(l); 
              setScreen('INTRO'); 
            }}
            onStartArcade={() => setScreen('ARCADE_INTRO')}
            onOptions={() => setScreen('OPTIONS')}
            onShop={() => setScreen('SHOP')}
            onRecipesBook={() => setScreen('RECIPES_BOOK')}
            onWatchAdForEnergy={handleWatchAdForEnergy}
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
            targetBurgers={selectedLevel.targetBurgers} 
            timeLimit={60}
            timeBoostCount={timeBoostCount}
            superTimeBoostCount={superTimeBoostCount}
            destructionPackCount={destructionPackCount}
            superDestructionPackCount={superDestructionPackCount}
            useTimeBoost={useTimeBoost}
            useSuperTimeBoost={useSuperTimeBoost}
            useDestructionPack={useDestructionPack}
            useSuperDestructionPack={useSuperDestructionPack}
            onToggleTimeBoost={setUseTimeBoost}
            onToggleSuperTimeBoost={setUseSuperTimeBoost}
            onToggleDestructionPack={setUseDestructionPack}
            onToggleSuperDestructionPack={setUseSuperDestructionPack}
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
          <ResultScreen 
            gameMode={gameMode} 
            money={money} 
            targetBurgers={selectedLevel.targetBurgers}
            burgersCreated={burgersCreated}
            burgerTarget={burgerTarget}
            arcadeHighScore={arcadeHighScore} 
            onBack={() => setScreen('MENU')}
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
                style={[styles.statTouchable, statCardStyles.touchableContainerVertical]}
                onPress={() => {
                  if (gameMode === 'CAMPAIGN') {
                    // Limpiar timeout anterior si existe
                    if (helpTextTimeoutRef.current) {
                      clearTimeout(helpTextTimeoutRef.current);
                    }
                    setHelpText(t.help_time_remaining);
                    // Ocultar después de 2 segundos
                    helpTextTimeoutRef.current = setTimeout(() => {
                      setHelpText('');
                      helpTextTimeoutRef.current = null;
                    }, 2000);
                  }
                }}
                activeOpacity={gameMode === 'CAMPAIGN' ? 0.7 : 1}
                disabled={gameMode !== 'CAMPAIGN'}
              >
              <StatCard 
                value={`${timeLeft}s`} 
                type="time" 
                isLowTime={timeLeft < 10} 
                isVeryLowTime={timeLeft <= 5}
                verticalLayout={true} 
              />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statTouchable, statCardStyles.touchableContainerVertical]}
                onPress={() => {
                  if (gameMode === 'CAMPAIGN') {
                    // Limpiar timeout anterior si existe
                    if (helpTextTimeoutRef.current) {
                      clearTimeout(helpTextTimeoutRef.current);
                    }
                    setHelpText(t.help_burgers_to_complete);
                    // Ocultar después de 2 segundos
                    helpTextTimeoutRef.current = setTimeout(() => {
                      setHelpText('');
                      helpTextTimeoutRef.current = null;
                    }, 2000);
                  }
                }}
                activeOpacity={gameMode === 'CAMPAIGN' ? 0.7 : 1}
                disabled={gameMode !== 'CAMPAIGN'}
              >
                <StatCard
                  value={gameMode === 'CAMPAIGN' ? `${burgersCreated}/${burgerTarget}` : `${money}`}
                  type={gameMode === 'CAMPAIGN' ? "burgers" : "money"}
                  shouldBlink={shouldBlinkBurgers}
                  verticalLayout={true}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statTouchable, statCardStyles.touchableContainerVertical]}
                onPress={() => {
                  if (gameMode === 'CAMPAIGN') {
                    // Limpiar timeout anterior si existe
                    if (helpTextTimeoutRef.current) {
                      clearTimeout(helpTextTimeoutRef.current);
                    }
                    setHelpText(t.help_tap_to_destroy);
                    // Ocultar después de 2 segundos
                    helpTextTimeoutRef.current = setTimeout(() => {
                      setHelpText('');
                      helpTextTimeoutRef.current = null;
                    }, 2000);
                  }
                }}
                activeOpacity={gameMode === 'CAMPAIGN' ? 0.7 : 1}
                disabled={gameMode !== 'CAMPAIGN'}
              >
                <StatCard
                  value={`${maxDestructions - destructionsUsed}`}
                  type="destruction"
                  isLowTime={(maxDestructions - destructionsUsed) < 10}
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
                             return discoveredRecipes.includes(r.id);
                           }).map((recipe) => {
                             const isDiscovered = true; // Todas las recetas que llegan aquí están descubiertas
                             const isUnlocked = true; // Todas están disponibles
                             
                             // Ya está filtrado arriba, así que siempre debería mostrarse

                             return (
                               <TouchableOpacity 
                                 key={recipe.id} 
                                 style={styles.recipeItem}
                                 onPressIn={() => {
                                   // Limpiar timeout anterior si existe
                                   if (expandRecipeTimeoutRef.current) {
                                     clearTimeout(expandRecipeTimeoutRef.current);
                                     expandRecipeTimeoutRef.current = null;
                                   }
                                   // Iniciar timeout de 500ms para mostrar el overlay
                                   expandRecipeTimeoutRef.current = setTimeout(() => {
                                     playUIButtonSound();
                                     setExpandedRecipeId(recipe.id);
                                     expandRecipeTimeoutRef.current = null;
                                   }, 500);
                                 }}
                                 onPressOut={() => {
                                   // Cancelar timeout si se suelta antes de tiempo
                                   if (expandRecipeTimeoutRef.current) {
                                     clearTimeout(expandRecipeTimeoutRef.current);
                                     expandRecipeTimeoutRef.current = null;
                                   }
                                   // Ocultar overlay si estaba visible
                                   setExpandedRecipeId(null);
                                 }}
                                 activeOpacity={0.7}
                               >
                                 <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                   <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
                                   {isDiscovered && (
                                     <View style={styles.recipePriceContainer}>
                                       <Text style={styles.recipePrice}>{recipe.price}</Text>
                                       <Image source={require('./assets/Iconos/coin.png')} style={styles.recipeCoin} resizeMode="contain" />
                                     </View>
                                   )}
                                 </View>
                               </TouchableOpacity>
                             );
                           })}
                  </ScrollView>
                </View>
              ) : (
                <>
                  <View style={styles.orderHeaderCompact}>
                    <Text style={styles.burgerNameTextCentered}>{getBurgerName(currentOrder, language)}</Text>
                  </View>
                  <View style={styles.orderPiecesCompact}>
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
                <TouchableOpacity onPress={() => { 
                  playUIButtonSound(); 
                  // Limpiar timeout si se cierra manualmente
                  if (helpTextTimeoutRef.current) {
                    clearTimeout(helpTextTimeoutRef.current);
                    helpTextTimeoutRef.current = null;
                  }
                  setHelpText(''); 
                }}>
                  <Text style={styles.helpText}>{helpText}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Panel expandido de receta - solo visible en modo arcade */}
            {isArcade && expandedRecipeId ? (() => {
              const expandedRecipe = BASE_RECIPES.find(r => r.id === expandedRecipeId);
              if (!expandedRecipe) return null;
              const isDiscovered = discoveredRecipes.includes(expandedRecipe.id);
              return (
                <View style={styles.recipeExpandedOverlay}>
                  <View style={styles.recipeExpandedContent}>
                    <Text style={styles.recipeNameExpanded} numberOfLines={2}>
                      {isDiscovered ? t[expandedRecipe.name as keyof typeof t] || expandedRecipe.name : '???'}
                    </Text>
                    <View style={styles.recipeIngredientsExpanded}>
                      {expandedRecipe.ingredients.map((ing, idx) => (
                        <View key={idx} style={styles.recipeIngredientIconExpanded}>
                          {isDiscovered ? (
                            <BurgerPiece type={ing} scale={0.8} gridSize={8} />
                          ) : (
                            <Text style={styles.secretTextSmall}>?</Text>
                          )}
                        </View>
                      ))}
                    </View>
                    {isDiscovered && (
                      <View style={styles.recipePriceContainerExpanded}>
                        <Text style={styles.recipePriceExpanded}>{expandedRecipe.price}</Text>
                        <Image source={require('./assets/Iconos/coin.png')} style={styles.recipeCoinExpanded} resizeMode="contain" />
                      </View>
                    )}
                  </View>
                </View>
              );
            })() : null}

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

            {/* Toasts de recetas en modo arcade */}
            {isArcade && toasts.map(toast => (
              <RecipeToastItem 
                key={toast.id} 
                toast={toast} 
                onComplete={removeToast} 
                t={t}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  // Determinar colores del degradado según el modo
  const gradientColors: [string, string] = screen === 'GAME' && gameMode === 'ARCADE' 
    ? ['#CC7A52', '#CC4A4E'] // Degradado más oscuro para modo arcade
    : ['#FF9966', '#FF5E62']; // Naranjas/rojos para otros modos

  return (
    <View style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {screen === 'GAME' && (
        <View style={{ flex: 1, backgroundColor: '#FF9966' }}>
          <View style={{ height: insets.top + 10 }} />
          <ImageBackground
            source={require('./assets/Iconos/Fondo2.png')}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <View style={{ flex: 1, paddingBottom: insets.bottom }}>
              {renderScreen()}
            </View>
          </ImageBackground>
        </View>
      )}
      {screen !== 'SPLASH' && screen !== 'GAME' && (
        <View style={{ flex: 1, backgroundColor: '#FF9966' }}>
          <View style={{ height: insets.top + 10 }} />
          <LinearGradient
            colors={gradientColors}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, paddingBottom: insets.bottom }}>
              {renderScreen()}
            </View>
          </LinearGradient>
        </View>
      )}
      {screen === 'SPLASH' && renderScreen()}
    </View>
  );
}
