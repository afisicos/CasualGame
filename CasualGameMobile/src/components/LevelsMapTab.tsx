import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Level, LevelStars } from '../types';
import { styles } from '../styles/LevelsMapTab.styles';
import BurgerPiece from './BurgerPiece';
import { INGREDIENT_IMAGES } from '../constants/gameData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Paleta de colores cozy para los niveles
const cozyColorPalette: [string, string][] = [
  ['#FF9966', '#FF5E62'], // Naranja/Rojo cálido
  ['#FFB347', '#FF6B6B'], // Melocotón/Rojo suave
  ['#FFD89B', '#FF8C94'], // Crema/Rosa pastel
  ['#A8E6CF', '#88D8A3'], // Verde menta
  ['#C7CEEA', '#B5EAD7'], // Lavanda/Verde claro
  ['#FFD3A5', '#FD9853'], // Durazno/Naranja
  ['#FEC8D8', '#FFDFD3'], // Rosa/Coral
  ['#E0BBE4', '#D291BC'], // Lila/Rosa
  ['#FFEAA7', '#FDCB6E'], // Amarillo claro/Dorado
  ['#DDA15E', '#BC6C25'], // Marrón claro/Terracota
  ['#95E1D3', '#F38181'], // Turquesa/Rosa
  ['#AA96DA', '#FCBAD3'], // Púrpura claro/Rosa
  ['#FFE5B4', '#FFCCCB'], // Melocotón/Rosa claro
  ['#C8E6C9', '#A5D6A7'], // Verde claro
  ['#BBDEFB', '#90CAF9'], // Azul claro
  ['#F8BBD0', '#F48FB1'], // Rosa/Magenta
  ['#FFCCBC', '#FFAB91'], // Naranja claro/Coral
  ['#C5E1A5', '#AED581'], // Verde lima
  ['#FFE082', '#FFD54F'], // Amarillo/Dorado
  ['#CE93D8', '#BA68C8'], // Púrpura
];

interface LevelsMapTabProps {
  levels: Level[];
  unlockedLevel: number;
  energy: number;
  maxEnergy: number;
  onStartLevel: (level: Level) => void;
  onWatchAdForEnergy?: () => void;
  onPlaySound?: () => void;
  onPlayErrorSound?: () => void;
  levelStarsData?: Record<number, LevelStars>;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
}

const LevelsMapTab: React.FC<LevelsMapTabProps> = ({
  levels,
  unlockedLevel,
  energy,
  maxEnergy,
  onStartLevel,
  onWatchAdForEnergy,
  onPlaySound,
  onPlayErrorSound,
  levelStarsData = {},
  t,
  isFirstTime = false,
  tutorialStep = 0,
}) => {
  const [showEnergyPanel, setShowEnergyPanel] = useState(false);
  const tutorialPulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const levelRefs = useRef<{ [key: number]: { y: number; height: number } }>({});
  const [centeredLevelId, setCenteredLevelId] = useState<number | null>(null);
  const heartbeatAnim = useRef(new Animated.Value(1)).current;
  const hasScrolledToUnlockedLevel = useRef(false);
  
  // Estado para rastrear los toques en cada barrera
  const [barrierTaps, setBarrierTaps] = useState<Record<number, number>>({});
  // Estado para barreras rotas (guardado persistentemente)
  const [brokenBarriers, setBrokenBarriers] = useState<Set<number>>(new Set());
  // Animaciones para cada barrera (simular que se rompe)
  const barrierAnimations = useRef<Record<number, Animated.Value>>({});
  const barrierScaleAnims = useRef<Record<number, Animated.Value>>({});
  // Animaciones para la partición de la barrera
  const barrierLeftHalfAnim = useRef<Record<number, Animated.Value>>({});
  const barrierRightHalfAnim = useRef<Record<number, Animated.Value>>({});
  const barrierOpacityAnim = useRef<Record<number, Animated.Value>>({});
  // Estado para controlar si la barrera está en animación de rotura
  const [barrierBreaking, setBarrierBreaking] = useState<Set<number>>(new Set());
  
  // Cargar barreras rotas desde AsyncStorage al montar
  useEffect(() => {
    const loadBrokenBarriers = async () => {
      try {
        const saved = await AsyncStorage.getItem('brokenBarriers');
        if (saved) {
          const broken = JSON.parse(saved);
          setBrokenBarriers(new Set(broken));
        }
      } catch (error) {
        console.log('Error loading broken barriers:', error);
      }
    };
    loadBrokenBarriers();
  }, []);

  // Inicializar el nivel centrado al montar
  useEffect(() => {
    // Establecer el primer nivel desbloqueado como centrado inicialmente
    if (unlockedLevel > 0 && centeredLevelId === null) {
      setCenteredLevelId(1);
    }
  }, [unlockedLevel, centeredLevelId]);

  // Centrar automáticamente en el último nivel desbloqueado al montar o cuando cambia unlockedLevel
  useEffect(() => {
    if (unlockedLevel > 0 && scrollViewRef.current) {
      // Resetear el flag para permitir scroll cuando cambia unlockedLevel
      hasScrolledToUnlockedLevel.current = false;
      
      // Esperar un momento para que los layouts se hayan medido
      const timer = setTimeout(() => {
        const lastUnlockedLevelData = levelRefs.current[unlockedLevel];
        
        if (lastUnlockedLevelData && scrollViewRef.current) {
          // Calcular la posición Y para centrar el nivel en la pantalla
          const levelCenterY = lastUnlockedLevelData.y + (lastUnlockedLevelData.height / 2);
          const screenCenter = SCREEN_HEIGHT / 2;
          const scrollY = levelCenterY - screenCenter;
          
          // Asegurarse de que el scroll no sea negativo
          const finalScrollY = Math.max(0, scrollY);
          
          scrollViewRef.current.scrollTo({
            y: finalScrollY,
            animated: true,
          });
          
          setCenteredLevelId(unlockedLevel);
          hasScrolledToUnlockedLevel.current = true;
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [unlockedLevel]);

  // Animación de latido para el círculo del número (solo para el nivel centrado)
  useEffect(() => {
    if (centeredLevelId === null) {
      heartbeatAnim.setValue(1);
      return;
    }
    
    const heartbeat = Animated.loop(
      Animated.sequence([
        Animated.timing(heartbeatAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    heartbeat.start();
    return () => heartbeat.stop();
  }, [centeredLevelId, heartbeatAnim]);

  useEffect(() => {
    if (isFirstTime && tutorialStep === 1) {
      const tutorialAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(tutorialPulseAnim, {
            toValue: 0.95,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(tutorialPulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      tutorialAnimation.start();
      return () => {
        tutorialAnimation.stop();
        tutorialPulseAnim.setValue(1);
      };
    } else {
      tutorialPulseAnim.setValue(1);
    }
  }, [isFirstTime, tutorialStep, tutorialPulseAnim]);

  const handleLevelPress = (level: Level) => {
    // Verificar si el nivel está bloqueado por barrera o por progreso
    const isBlockedByBarrier = !canLevelBeUnlocked(level.id);
    if (level.id > unlockedLevel || isBlockedByBarrier) return;
    
    onPlaySound?.();
    if (energy > 0) {
      onStartLevel(level);
    } else {
      setShowEnergyPanel(true);
    }
  };

  const getStarsForLevel = (levelId: number): LevelStars | null => {
    return levelStarsData[levelId] || null;
  };

  // Calcular estrellas totales del jugador
  const getTotalStars = (): number => {
    return Object.values(levelStarsData || {}).reduce((sum, stars) => sum + (stars?.stars || 0), 0);
  };

  // Determinar si hay una barrera antes de un nivel (cada 5 niveles)
  const getBarrierBeforeLevel = (levelId: number): number | null => {
    // Las barreras están después de los niveles 5, 10, 15, 20, etc.
    // El nivel 6 necesita que la barrera 1 esté desbloqueada
    if (levelId > 5 && (levelId - 1) % 5 === 0) {
      return Math.floor((levelId - 1) / 5);
    }
    return null;
  };

  // Obtener el requisito de estrellas para una barrera
  const getBarrierStarRequirement = (barrierNumber: number): number => {
    // La primera barrera requiere 5 estrellas, luego aumenta progresivamente
    return 5 * barrierNumber;
  };

  // Obtener el nivel anterior a una barrera
  const getLevelBeforeBarrier = (barrierNumber: number): number => {
    // La barrera 1 está antes del nivel 6, entonces el nivel anterior es el 5
    // La barrera 2 está antes del nivel 11, entonces el nivel anterior es el 10
    return barrierNumber * 5;
  };

  // Verificar si el nivel anterior a la barrera está completado con al menos 1 estrella
  const isPreviousLevelCompleted = (barrierNumber: number): boolean => {
    const previousLevelId = getLevelBeforeBarrier(barrierNumber);
    const previousLevelStars = getStarsForLevel(previousLevelId);
    return (previousLevelStars?.stars || 0) >= 1;
  };

  // Verificar si una barrera está desbloqueada (considerando toques y estado guardado)
  const isBarrierUnlocked = (barrierNumber: number): boolean => {
    // Si la barrera está en el conjunto de barreras rotas, está desbloqueada
    if (brokenBarriers.has(barrierNumber)) {
      return true;
    }
    // La barrera está desbloqueada solo si tiene 3 toques
    return (barrierTaps[barrierNumber] || 0) >= 3;
  };

  // Guardar barrera rota en AsyncStorage
  const saveBrokenBarrier = async (barrierNumber: number) => {
    try {
      const newBrokenBarriers = new Set(brokenBarriers);
      newBrokenBarriers.add(barrierNumber);
      setBrokenBarriers(newBrokenBarriers);
      await AsyncStorage.setItem('brokenBarriers', JSON.stringify(Array.from(newBrokenBarriers)));
    } catch (error) {
      console.log('Error saving broken barrier:', error);
    }
  };

  // Animación de partición y desaparición de la barrera
  const animateBarrierBreak = (barrierNumber: number) => {
    // Inicializar animaciones si no existen
    if (!barrierLeftHalfAnim.current[barrierNumber]) {
      barrierLeftHalfAnim.current[barrierNumber] = new Animated.Value(0);
      barrierRightHalfAnim.current[barrierNumber] = new Animated.Value(0);
      barrierOpacityAnim.current[barrierNumber] = new Animated.Value(1);
    }

    const leftAnim = barrierLeftHalfAnim.current[barrierNumber];
    const rightAnim = barrierRightHalfAnim.current[barrierNumber];
    const opacityAnim = barrierOpacityAnim.current[barrierNumber];

    // Marcar que está en animación de rotura
    setBarrierBreaking(prev => new Set(prev).add(barrierNumber));

    // Animación: las dos mitades se separan y desaparecen
    Animated.parallel([
      // Mitad izquierda sale hacia la izquierda
      Animated.timing(leftAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 800,
        useNativeDriver: true,
      }),
      // Mitad derecha sale hacia la derecha
      Animated.timing(rightAnim, {
        toValue: SCREEN_WIDTH,
        duration: 800,
        useNativeDriver: true,
      }),
      // Opacidad disminuye
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Guardar que la barrera está rota
      saveBrokenBarrier(barrierNumber);
      // Remover de la animación de rotura
      setBarrierBreaking(prev => {
        const newSet = new Set(prev);
        newSet.delete(barrierNumber);
        return newSet;
      });
    });
  };

  // Manejar toque en la barrera
  const handleBarrierTap = (barrierNumber: number) => {
    const requiredStars = getBarrierStarRequirement(barrierNumber);
    const totalStars = getTotalStars();
    const currentTaps = barrierTaps[barrierNumber] || 0;
    
    // Inicializar animaciones si no existen
    if (!barrierScaleAnims.current[barrierNumber]) {
      barrierScaleAnims.current[barrierNumber] = new Animated.Value(1);
    }
    
    // Animación de latido rápido al tocar
    const scaleAnim = barrierScaleAnims.current[barrierNumber];
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Verificar si el nivel anterior está completado con al menos 1 estrella
    if (!isPreviousLevelCompleted(barrierNumber)) {
      // Reproducir sonido de error
      onPlayErrorSound?.();
      return;
    }
    
    // Verificar si tiene las estrellas necesarias
    if (totalStars < requiredStars) {
      // Reproducir sonido de error
      onPlayErrorSound?.();
      return;
    }
    
    // Si ya está desbloqueada, no hacer nada
    if (currentTaps >= 3) {
      return;
    }
    
    // Incrementar contador de toques
    const newTaps = currentTaps + 1;
    setBarrierTaps(prev => ({ ...prev, [barrierNumber]: newTaps }));
    
    // Reproducir sonido de toque
    onPlaySound?.();
    
    // Inicializar animaciones si no existen
    if (!barrierAnimations.current[barrierNumber]) {
      barrierAnimations.current[barrierNumber] = new Animated.Value(0);
    }
    
    // Animación de "romperse" - shake
    const shakeAnim = barrierAnimations.current[barrierNumber];
    const scaleAnimForShake = barrierScaleAnims.current[barrierNumber];
    
    // Animación de shake (temblor)
    Animated.sequence([
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnimForShake, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimForShake, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
    
    // Si se completaron los 3 toques, iniciar animación de rotura
    if (newTaps >= 3) {
      // Pequeño delay antes de la animación de rotura
      setTimeout(() => {
        animateBarrierBreak(barrierNumber);
      }, 300);
    } else {
      // Si no se completaron los 3 toques, usar la animación de shake existente
      // (ya se ejecutó arriba)
    }
  };

  // Verificar si un nivel puede estar desbloqueado (considerando barreras)
  const canLevelBeUnlocked = (levelId: number): boolean => {
    // Si el nivel es 1-5, no hay barrera
    if (levelId <= 5) {
      return true;
    }
    
    // Determinar qué barrera controla este nivel
    // Niveles 6-10 necesitan barrera 1, niveles 11-15 necesitan barrera 2, etc.
    const barrierNumber = Math.floor((levelId - 1) / 5);
    
    // Verificar si esa barrera está desbloqueada
    return isBarrierUnlocked(barrierNumber);
  };

  // Obtener colores para un nivel específico
  const getLevelColors = (levelId: number, isLocked: boolean): [string, string] => {
    if (isLocked) {
      return ['#999', '#666'];
    }
    const colorIndex = (levelId - 1) % cozyColorPalette.length;
    return cozyColorPalette[colorIndex];
  };

  // Determinar qué nivel está más centrado en la pantalla
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const screenCenter = SCREEN_HEIGHT / 2;
    const targetY = scrollY + screenCenter;

    // Encontrar el nivel más cercano al centro
    let closestLevel: number | null = null;
    let minDistance = Infinity;

    Object.keys(levelRefs.current).forEach((levelIdStr) => {
      const levelId = parseInt(levelIdStr);
      const levelData = levelRefs.current[levelId];
      if (!levelData) return;
      
      // Calcular la distancia desde el centro de la pantalla hasta el centro del nivel
      const levelCenterY = levelData.y + (levelData.height / 2);
      const distance = Math.abs(levelCenterY - targetY);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestLevel = levelId;
      }
    });

    // Actualizar el nivel centrado solo si cambió
    if (closestLevel !== null && closestLevel !== centeredLevelId) {
      setCenteredLevelId(closestLevel);
    }
  };

  // Guardar la posición Y y altura de cada nivel
  const onLevelLayout = (levelId: number, event: any) => {
    const { y, height } = event.nativeEvent.layout;
    levelRefs.current[levelId] = { y, height };
    
    // Si este es el último nivel desbloqueado y aún no se ha hecho scroll, centrarlo
    if (levelId === unlockedLevel && !hasScrolledToUnlockedLevel.current && scrollViewRef.current) {
      // Usar un pequeño delay para asegurar que el layout esté completamente medido
      setTimeout(() => {
        const levelData = levelRefs.current[unlockedLevel];
        if (levelData && scrollViewRef.current) {
          const levelCenterY = levelData.y + (levelData.height / 2);
          const screenCenter = SCREEN_HEIGHT / 2;
          const scrollY = levelCenterY - screenCenter;
          const finalScrollY = Math.max(0, scrollY);
          
          scrollViewRef.current.scrollTo({
            y: finalScrollY,
            animated: true,
          });
          
          setCenteredLevelId(unlockedLevel);
          hasScrolledToUnlockedLevel.current = true;
        }
      }, 50);
    }
  };

  // Calcular padding superior para permitir que el nivel 1 quede centrado
  const topPadding = Math.max(SCREEN_HEIGHT / 2 - 65, 20); // 65 es aproximadamente la mitad de la altura del nivel

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {levels.map((level, index) => {
          const isUnlocked = level.id <= unlockedLevel;
          const isBlockedByBarrier = !canLevelBeUnlocked(level.id);
          const isLocked = !isUnlocked || isBlockedByBarrier;
          const stars = getStarsForLevel(level.id);
          const starsCount = stars?.stars || 0;
          const hasNewIngredient = !isLocked && level.newIngredient && level.showNewIngredient;
          
          const levelColors = getLevelColors(level.id, isLocked);
          
          // Verificar si hay una barrera antes de este nivel
          const barrierNumber = getBarrierBeforeLevel(level.id);
          const showBarrier = barrierNumber !== null && !brokenBarriers.has(barrierNumber!);
          const barrierUnlocked = barrierNumber !== null ? isBarrierUnlocked(barrierNumber) : true;
          const barrierRequiredStars = barrierNumber !== null ? getBarrierStarRequirement(barrierNumber) : 0;
          const isBreaking = barrierNumber !== null ? barrierBreaking.has(barrierNumber) : false;
          
          return (
            <React.Fragment key={level.id}>
              {/* Mostrar barrera antes del nivel si corresponde y no está rota */}
              {showBarrier && (
                <View style={styles.barrierRow}>
                  {isBreaking ? (
                    // Animación de partición: dos mitades separándose
                    <View style={styles.barrierBreakingContainer}>
                      {/* Mitad izquierda */}
                      <Animated.View
                        style={[
                          styles.barrierHalf,
                          styles.barrierHalfLeft,
                          barrierLeftHalfAnim.current[barrierNumber!] && {
                            transform: [
                              { translateX: barrierLeftHalfAnim.current[barrierNumber!] },
                            ],
                            opacity: barrierOpacityAnim.current[barrierNumber!] || 1,
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['#666', '#555']}
                          style={[styles.barrierGradient, styles.barrierGradientHalf]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <Image 
                            source={require('../assets/Iconos/lock.png')} 
                            style={[styles.barrierLockIcon, { width: 20, height: 20 }]}
                            resizeMode="contain" 
                          />
                          <Text style={[styles.barrierText, { fontSize: 14 }]}>
                            {barrierRequiredStars}
                          </Text>
                        </LinearGradient>
                      </Animated.View>
                      {/* Mitad derecha */}
                      <Animated.View
                        style={[
                          styles.barrierHalf,
                          styles.barrierHalfRight,
                          barrierRightHalfAnim.current[barrierNumber!] && {
                            transform: [
                              { translateX: barrierRightHalfAnim.current[barrierNumber!] },
                            ],
                            opacity: barrierOpacityAnim.current[barrierNumber!] || 1,
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['#666', '#555']}
                          style={[styles.barrierGradient, styles.barrierGradientHalf]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          <View style={styles.barrierStarsContainer}>
                            <Text style={styles.barrierStar}>⭐</Text>
                            <Text style={styles.barrierStarsText}>
                              {getTotalStars()} / {barrierRequiredStars}
                            </Text>
                          </View>
                        </LinearGradient>
                      </Animated.View>
                    </View>
                  ) : (
                    // Barrera normal
                    <TouchableOpacity
                      onPress={() => handleBarrierTap(barrierNumber!)}
                      activeOpacity={1}
                      disabled={barrierUnlocked}
                    >
                      <Animated.View
                        style={[
                          styles.barrierContainer,
                          {
                            transform: [
                              barrierAnimations.current[barrierNumber!] ? { translateX: barrierAnimations.current[barrierNumber!] } : { translateX: 0 },
                              { scale: barrierScaleAnims.current[barrierNumber!] || 1 },
                            ],
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={barrierUnlocked ? ['#4CAF50', '#45a049'] : ['#666', '#555']}
                          style={styles.barrierGradient}
                        >
                          {!barrierUnlocked && (
                            <Image 
                              source={require('../assets/Iconos/lock.png')} 
                              style={styles.barrierLockIcon}
                              resizeMode="contain" 
                            />
                          )}
                          <Text style={styles.barrierText}>
                            {barrierUnlocked ? '✓' : barrierRequiredStars}
                          </Text>
                          <View style={styles.barrierStarsContainer}>
                            <Text style={styles.barrierStar}>⭐</Text>
                            {!barrierUnlocked && (
                              <Text style={styles.barrierStarsText}>
                                {getTotalStars()} / {barrierRequiredStars}
                              </Text>
                            )}
                          </View>
                          {!barrierUnlocked && barrierTaps[barrierNumber!] > 0 && (
                            <View style={styles.barrierProgressContainer}>
                              <Text style={styles.barrierProgressText}>
                                {barrierTaps[barrierNumber!]} / 3
                              </Text>
                            </View>
                          )}
                        </LinearGradient>
                      </Animated.View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              <View 
                style={styles.levelRow}
                onLayout={(event) => onLevelLayout(level.id, event)}
              >
              <View style={styles.levelRowContent}>
                {/* Icono del ingrediente nuevo - izquierda */}
                {hasNewIngredient && (
                  <View style={styles.newIngredientIconSide}>
                    <BurgerPiece type={level.newIngredient!} scale={1.2} gridSize={8} />
                  </View>
                )}
                
                <Animated.View
                  style={[
                    !isLocked && level.id === centeredLevelId && {
                      transform: [{ scale: heartbeatAnim }],
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.levelCard,
                      styles.levelCardCentered,
                      isLocked && styles.levelCardLocked,
                      isFirstTime && tutorialStep === 1 && level.id === unlockedLevel && {
                        borderWidth: 3,
                        borderColor: '#FFF',
                        shadowColor: '#FFF',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 15,
                        elevation: 25,
                        transform: [{ scale: tutorialPulseAnim }],
                      }
                    ]}
                    onPress={() => handleLevelPress(level)}
                    disabled={isLocked}
                    activeOpacity={isLocked ? 1 : 0.8}
                  >
                  <LinearGradient
                    colors={levelColors}
                    style={styles.levelGradient}
                  >
                    {/* Número del nivel */}
                    <Animated.View 
                      style={[
                        styles.levelNumberContainer,
                        !isLocked && level.id === centeredLevelId && {
                          transform: [{ scale: heartbeatAnim }],
                        }
                      ]}
                    >
                      {isLocked ? (
                        <Image 
                          source={require('../assets/Iconos/lock.png')} 
                          style={styles.lockIcon} 
                          resizeMode="contain" 
                        />
                      ) : (
                        <Text style={styles.levelNumber}>{level.id}</Text>
                      )}
                    </Animated.View>

                    {/* Nombre del nivel - solo mostrar si está desbloqueado */}
                    {!isLocked && (
                      <Text style={styles.levelName}>
                        {t[level.name as keyof typeof t] || level.name}
                      </Text>
                    )}

                    {/* Estrellas con iconos de logros */}
                    {isUnlocked && (
                      <View style={styles.starsContainer}>
                      {/* Estrella 1: Completar nivel */}
                      <View style={styles.starWithIcon}>
                        <Text
                          style={[
                            styles.star,
                            { opacity: starsCount >= 1 ? 1 : 0.3 }
                          ]}
                        >
                          ⭐
                        </Text>
                        <Image 
                          source={require('../assets/Iconos/burger.png')} 
                          style={[
                            styles.starIcon,
                            { opacity: starsCount >= 1 ? 1 : 0.3 }
                          ]} 
                          resizeMode="contain" 
                        />
                      </View>
                        
                        {/* Estrella 2: Tiempo */}
                        <View style={styles.starWithIcon}>
                          <Text
                            style={[
                              styles.star,
                              { opacity: (stars && stars.timeBonus) ? 1 : 0.3 }
                            ]}
                          >
                            ⭐
                          </Text>
                          <Image 
                            source={require('../assets/Iconos/time.png')} 
                            style={[
                              styles.starIcon,
                              { opacity: (stars && stars.timeBonus) ? 1 : 0.3 }
                            ]} 
                            resizeMode="contain" 
                          />
                        </View>
                        
                        {/* Estrella 3: Eliminaciones */}
                        <View style={styles.starWithIcon}>
                          <Text
                            style={[
                              styles.star,
                              { opacity: (stars && stars.destructionBonus) ? 1 : 0.3 }
                            ]}
                          >
                            ⭐
                          </Text>
                          <Image 
                            source={require('../assets/Iconos/rubber.png')} 
                            style={[
                              styles.starIcon,
                              { opacity: (stars && stars.destructionBonus) ? 1 : 0.3 }
                            ]} 
                            resizeMode="contain" 
                          />
                        </View>
                      </View>
                    )}

                    {/* Indicador de energía */}
                    {isUnlocked && (
                      <View style={styles.energyIndicator}>
                        <Image 
                          source={require('../assets/Iconos/Lighting.png')} 
                          style={styles.energyIcon} 
                          resizeMode="contain" 
                        />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                </Animated.View>
                
                {/* Icono del ingrediente nuevo - derecha */}
                {hasNewIngredient && (
                  <View style={styles.newIngredientIconSide}>
                    <BurgerPiece type={level.newIngredient!} scale={1.2} gridSize={8} />
                  </View>
                )}
              </View>
            </View>
            </React.Fragment>
          );
        })}
      </ScrollView>

      {/* Panel flotante para recuperar energía */}
      {showEnergyPanel && (
        <View style={styles.energyPanelOverlay}>
          <View style={styles.energyPanel}>
            <Text style={styles.energyPanelTitle}>{t.energy_panel_title}</Text>
            <Text style={styles.energyPanelMessage}>
              {t.energy_panel_message}
            </Text>
            <View style={styles.energyPanelButtons}>
              <TouchableOpacity
                style={[styles.energyPanelButton, styles.energyPanelCancel]}
                onPress={() => {
                  onPlaySound?.();
                  setShowEnergyPanel(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.energyPanelCancelText}>{t.energy_panel_cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.energyPanelButton, styles.energyPanelWatch]}
                onPress={() => {
                  onPlaySound?.();
                  setShowEnergyPanel(false);
                  if (onWatchAdForEnergy) onWatchAdForEnergy();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.energyPanelWatchText}>{t.energy_panel_watch}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default LevelsMapTab;
