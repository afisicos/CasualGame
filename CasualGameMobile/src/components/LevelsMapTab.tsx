import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Level, LevelStars } from '../types';
import { styles } from '../styles/LevelsMapTab.styles';
import BurgerPiece from './BurgerPiece';
import { INGREDIENT_IMAGES, BARRIERS } from '../constants/gameData';

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
  onPlayDestroySound?: () => void;
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
  onPlayDestroySound,
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
  const ingredientRotationAnim = useRef(new Animated.Value(0)).current;
  const hasScrolledToUnlockedLevel = useRef(false);
  
  // Estado para barreras rotas (guardado persistentemente)
  const [brokenBarriers, setBrokenBarriers] = useState<Set<number>>(new Set());
  // Animaciones para cada barrera
  const barrierScaleAnims = useRef<Record<number, Animated.Value>>({});
  const barrierOpacityAnim = useRef<Record<number, Animated.Value>>({});
  // Animación de latido rápido cuando la barrera puede eliminarse
  const barrierPulseAnims = useRef<Record<number, Animated.Value>>({});
  
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

  // Animación de rotación sutil en vaivén para los ingredientes cuando el nivel está centrado
  useEffect(() => {
    if (centeredLevelId === null) {
      ingredientRotationAnim.setValue(0);
      return;
    }
    
    const rotation = Animated.loop(
      Animated.sequence([
        Animated.timing(ingredientRotationAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(ingredientRotationAnim, {
          toValue: -2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ingredientRotationAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    rotation.start();
    return () => rotation.stop();
  }, [centeredLevelId, ingredientRotationAnim]);

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

  // Animación de latido rápido para barreras que pueden eliminarse
  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];
    
    // Inicializar y gestionar animaciones de latido para cada barrera
    BARRIERS.forEach((_, barrierIndex) => {
      if (brokenBarriers.has(barrierIndex)) {
        // Si la barrera ya está rota, detener animación si existe
        if (barrierPulseAnims.current[barrierIndex]) {
          barrierPulseAnims.current[barrierIndex].stopAnimation();
          barrierPulseAnims.current[barrierIndex].setValue(1);
        }
        return;
      }

      const canRemove = canBarrierBeRemoved(barrierIndex);
      
      if (canRemove) {
        // Inicializar animación si no existe
        if (!barrierPulseAnims.current[barrierIndex]) {
          barrierPulseAnims.current[barrierIndex] = new Animated.Value(1);
        }

        const pulseAnim = barrierPulseAnims.current[barrierIndex];
        
        // Animación de latido rápido (más rápido que el latido normal)
        const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15, // Escala más grande para ser más notorio
              duration: 300, // Más rápido (300ms vs 600ms)
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        );
        
        pulseAnimation.start();
        animations.push(pulseAnimation);
      } else {
        // Si no puede eliminarse, detener animación y resetear valor
        if (barrierPulseAnims.current[barrierIndex]) {
          barrierPulseAnims.current[barrierIndex].stopAnimation();
          barrierPulseAnims.current[barrierIndex].setValue(1);
        }
      }
    });
    
    return () => {
      // Limpiar todas las animaciones al desmontar o cuando cambian las dependencias
      animations.forEach(anim => anim.stop());
    };
  }, [brokenBarriers, levelStarsData, unlockedLevel]); // Dependencias: cuando cambian las barreras rotas, las estrellas o el nivel desbloqueado

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

  // Encontrar la barrera que corresponde a un nivel (retorna el índice de la barrera en BARRIERS)
  // La barrera se muestra solo antes del nivel inmediatamente siguiente a levelAfter
  const getBarrierIndexForLevel = (levelId: number): number | null => {
    // Buscar la barrera cuyo levelAfter + 1 es igual a levelId
    for (let i = 0; i < BARRIERS.length; i++) {
      if (levelId === BARRIERS[i].levelAfter + 1) {
        return i;
      }
    }
    return null;
  };

  // Obtener la información de una barrera por su índice
  const getBarrierInfo = (barrierIndex: number) => {
    return BARRIERS[barrierIndex];
  };

  // Obtener el requisito de estrellas para una barrera
  const getBarrierStarRequirement = (barrierIndex: number): number => {
    return BARRIERS[barrierIndex].requiredStars;
  };

  // Verificar si una barrera puede ser eliminada (cumple condiciones)
  const canBarrierBeRemoved = (barrierIndex: number): boolean => {
    // Debe tener el nivel anterior completado con al menos 1 estrella
    if (!isPreviousLevelCompleted(barrierIndex)) {
      return false;
    }
    // Debe tener las estrellas necesarias
    const requiredStars = getBarrierStarRequirement(barrierIndex);
    const totalStars = getTotalStars();
    return totalStars >= requiredStars;
  };

  // Obtener el nivel anterior a una barrera
  const getLevelBeforeBarrier = (barrierIndex: number): number => {
    return BARRIERS[barrierIndex].levelAfter;
  };

  // Verificar si el nivel anterior a la barrera está completado con al menos 1 estrella
  const isPreviousLevelCompleted = (barrierIndex: number): boolean => {
    const previousLevelId = getLevelBeforeBarrier(barrierIndex);
    const previousLevelStars = getStarsForLevel(previousLevelId);
    return (previousLevelStars?.stars || 0) >= 1;
  };

  // Verificar si una barrera está desbloqueada (considerando estado guardado)
  const isBarrierUnlocked = (barrierIndex: number): boolean => {
    // Si la barrera está en el conjunto de barreras rotas, está desbloqueada
    return brokenBarriers.has(barrierIndex);
  };

  // Guardar barrera rota en AsyncStorage
  const saveBrokenBarrier = async (barrierIndex: number) => {
    try {
      const newBrokenBarriers = new Set(brokenBarriers);
      newBrokenBarriers.add(barrierIndex);
      setBrokenBarriers(newBrokenBarriers);
      await AsyncStorage.setItem('brokenBarriers', JSON.stringify(Array.from(newBrokenBarriers)));
    } catch (error) {
      console.log('Error saving broken barrier:', error);
    }
  };

  // Animación de desvanecimiento de la barrera
  const animateBarrierBreak = (barrierIndex: number) => {
    // Inicializar animación de opacidad si no existe
    if (!barrierOpacityAnim.current[barrierIndex]) {
      barrierOpacityAnim.current[barrierIndex] = new Animated.Value(1);
    }

    const opacityAnim = barrierOpacityAnim.current[barrierIndex];

    // Reproducir sonido de destrucción
    onPlayDestroySound?.();

    // Animación de desvanecimiento
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Guardar que la barrera está rota
      saveBrokenBarrier(barrierIndex);
    });
  };

  // Manejar toque en la barrera
  const handleBarrierTap = (barrierIndex: number) => {
    // Verificar si el nivel anterior está completado con al menos 1 estrella
    if (!isPreviousLevelCompleted(barrierIndex)) {
      // Reproducir sonido de error
      onPlayErrorSound?.();
      return;
    }
    
    // Verificar si tiene las estrellas necesarias
    const requiredStars = getBarrierStarRequirement(barrierIndex);
    const totalStars = getTotalStars();
    if (totalStars < requiredStars) {
      // Reproducir sonido de error
      onPlayErrorSound?.();
      return;
    }
    
    // Si ya está desbloqueada, no hacer nada
    if (isBarrierUnlocked(barrierIndex)) {
      return;
    }
    
    // Con un solo toque, eliminar la barrera
    animateBarrierBreak(barrierIndex);
  };

  // Verificar si un nivel puede estar desbloqueado (considerando barreras)
  const canLevelBeUnlocked = (levelId: number): boolean => {
    // Buscar si hay una barrera que bloquea este nivel
    const barrierIndex = getBarrierIndexForLevel(levelId);
    
    // Si no hay barrera que bloquee este nivel, está desbloqueado
    if (barrierIndex === null) {
      return true;
    }
    
    // Verificar si esa barrera está desbloqueada
    return isBarrierUnlocked(barrierIndex);
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
  const topPadding = Math.max(SCREEN_HEIGHT / 2 - 200, 20); // 65 es aproximadamente la mitad de la altura del nivel

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
          const barrierIndex = getBarrierIndexForLevel(level.id);
          const showBarrier = barrierIndex !== null && !brokenBarriers.has(barrierIndex);
          const barrierUnlocked = barrierIndex !== null ? isBarrierUnlocked(barrierIndex) : true;
          const barrierRequiredStars = barrierIndex !== null ? getBarrierStarRequirement(barrierIndex) : 0;
          const barrierNextLevel = barrierIndex !== null ? getBarrierInfo(barrierIndex).levelAfter + 1 : 0;
          const canRemoveBarrier = barrierIndex !== null ? canBarrierBeRemoved(barrierIndex) : false;
          
          // Inicializar animación de opacidad si no existe
          if (barrierIndex !== null && !barrierOpacityAnim.current[barrierIndex]) {
            barrierOpacityAnim.current[barrierIndex] = new Animated.Value(1);
          }
          
          // Inicializar animación de pulso si no existe
          if (barrierIndex !== null && !barrierPulseAnims.current[barrierIndex]) {
            barrierPulseAnims.current[barrierIndex] = new Animated.Value(1);
          }
          
          return (
            <React.Fragment key={level.id}>
              {/* Mostrar barrera antes del nivel si corresponde y no está rota */}
              {showBarrier && (
                <Animated.View 
                  style={[
                    styles.barrierRow,
                    barrierOpacityAnim.current[barrierIndex!] && {
                      opacity: barrierOpacityAnim.current[barrierIndex!],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleBarrierTap(barrierIndex!)}
                    activeOpacity={1}
                    disabled={barrierUnlocked}
                  >
                    <Animated.View
                      style={[
                        styles.barrierContainer,
                        {
                          transform: [
                            // Animación de latido rápido cuando puede eliminarse
                            canRemoveBarrier && barrierPulseAnims.current[barrierIndex!] ? 
                              { scale: barrierPulseAnims.current[barrierIndex!] } : 
                              { scale: 1 },
                          ],
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={['#666', '#555']}
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
                          {`Nivel ${barrierNextLevel}`}
                        </Text>
                        <View style={styles.barrierStarsContainer}>
                          <Image 
                            source={require('../assets/Iconos/star.png')} 
                            style={styles.barrierStar}
                            resizeMode="contain" 
                          />
                          {!barrierUnlocked && (
                            <Text style={styles.barrierStarsText}>
                              {getTotalStars()} / {barrierRequiredStars}
                            </Text>
                          )}
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              )}
              
              <View 
                style={styles.levelRow}
                onLayout={(event) => onLevelLayout(level.id, event)}
              >
              <View style={styles.levelRowContent}>
                {/* Icono del ingrediente nuevo - izquierda */}
                {hasNewIngredient && (
                  <Animated.View 
                    style={[
                      styles.newIngredientIconSide,
                      !isLocked && level.id === centeredLevelId && {
                        transform: [
                          {
                            rotate: ingredientRotationAnim.interpolate({
                              inputRange: [-1, 1],
                              outputRange: ['-8deg', '8deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <BurgerPiece type={level.newIngredient!} scale={1.2} gridSize={8} />
                  </Animated.View>
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
                        <Image 
                          source={require('../assets/Iconos/star.png')} 
                          style={[
                            styles.star,
                            { opacity: starsCount >= 1 ? 1 : 0.3 }
                          ]}
                          resizeMode="contain" 
                        />
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
                          <Image 
                            source={require('../assets/Iconos/star.png')} 
                            style={[
                              styles.star,
                              { opacity: (stars && stars.timeBonus) ? 1 : 0.3 }
                            ]}
                            resizeMode="contain" 
                          />
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
                          <Image 
                            source={require('../assets/Iconos/star.png')} 
                            style={[
                              styles.star,
                              { opacity: (stars && stars.destructionBonus) ? 1 : 0.3 }
                            ]}
                            resizeMode="contain" 
                          />
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
                  <Animated.View 
                    style={[
                      styles.newIngredientIconSide,
                      !isLocked && level.id === centeredLevelId && {
                        transform: [
                          {
                            rotate: ingredientRotationAnim.interpolate({
                              inputRange: [-1, 1],
                              outputRange: ['-8deg', '8deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <BurgerPiece type={level.newIngredient!} scale={1.2} gridSize={8} />
                  </Animated.View>
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
