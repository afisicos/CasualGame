import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Level, LevelStars } from '../types';
import { styles } from '../styles/LevelsMapTab.styles';
import BurgerPiece from './BurgerPiece';
import { INGREDIENT_IMAGES } from '../constants/gameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LevelsMapTabProps {
  levels: Level[];
  unlockedLevel: number;
  energy: number;
  maxEnergy: number;
  onStartLevel: (level: Level) => void;
  onWatchAdForEnergy?: () => void;
  onPlaySound?: () => void;
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
  levelStarsData = {},
  t,
  isFirstTime = false,
  tutorialStep = 0,
}) => {
  const [showEnergyPanel, setShowEnergyPanel] = useState(false);
  const tutorialPulseAnim = useRef(new Animated.Value(1)).current;

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
    if (level.id > unlockedLevel) return; // No permitir niveles bloqueados
    
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

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {levels.map((level, index) => {
          const isUnlocked = level.id <= unlockedLevel;
          const isLocked = !isUnlocked;
          const stars = getStarsForLevel(level.id);
          const starsCount = stars?.stars || 0;
          const hasNewIngredient = !isLocked && level.newIngredient && level.showNewIngredient;
          
          return (
            <View key={level.id} style={styles.levelRow}>
              <View style={styles.levelRowContent}>
                {/* Icono del ingrediente nuevo - izquierda */}
                {hasNewIngredient && (
                  <View style={styles.newIngredientIconSide}>
                    <BurgerPiece type={level.newIngredient!} scale={1.2} gridSize={8} />
                  </View>
                )}
                
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
                    colors={isLocked 
                      ? ['#999', '#666'] 
                      : ['#FF9966', '#FF5E62']
                    }
                    style={styles.levelGradient}
                  >
                    {/* Número del nivel */}
                    <View style={styles.levelNumberContainer}>
                      {isLocked ? (
                        <Image 
                          source={require('../assets/Iconos/lock.png')} 
                          style={styles.lockIcon} 
                          resizeMode="contain" 
                        />
                      ) : (
                        <Text style={styles.levelNumber}>{level.id}</Text>
                      )}
                    </View>

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
                
                {/* Icono del ingrediente nuevo - derecha */}
                {hasNewIngredient && (
                  <View style={styles.newIngredientIconSide}>
                    <BurgerPiece type={level.newIngredient!} scale={1.2} gridSize={8} />
                  </View>
                )}
              </View>
            </View>
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
