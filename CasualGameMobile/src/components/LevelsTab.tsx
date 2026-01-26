import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Level } from '../types';
import { styles } from '../styles/MenuScreen.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Función para obtener el siguiente ingrediente que se desbloqueará
const getNextIngredientToUnlock = (currentLevel: number): { ingredient: string; level: number } | null => {
  const ingredientUnlockLevels: { [key: number]: string } = {
    2: 'CHEESE',
    3: 'LETTUCE',
    5: 'BACON',
    7: 'KETCHUP',
    9: 'ONION',
    12: 'PICKLE',
    16: 'EGG'
  };

  const unlockLevels = Object.keys(ingredientUnlockLevels).map(Number).sort((a, b) => a - b);

  for (const level of unlockLevels) {
    if (level > currentLevel) {
      return {
        ingredient: ingredientUnlockLevels[level],
        level: level
      };
    }
  }

  return null;
};

interface LevelsTabProps {
  levels: Level[];
  unlockedLevel: number;
  energy: number;
  maxEnergy: number;
  timeBoostCount: number;
  superTimeBoostCount: number;
  destructionPackCount: number;
  superDestructionPackCount: number;
  useTimeBoost: boolean;
  useSuperTimeBoost: boolean;
  useDestructionPack: boolean;
  useSuperDestructionPack: boolean;
  onToggleTimeBoost: (value: boolean) => void;
  onToggleSuperTimeBoost: (value: boolean) => void;
  onToggleDestructionPack: (value: boolean) => void;
  onToggleSuperDestructionPack: (value: boolean) => void;
  onStartLevel: (level: Level) => void;
  onWatchAdForEnergy?: () => void;
  onPlaySound?: () => void;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
}

const LevelsTab: React.FC<LevelsTabProps> = ({
  levels,
  unlockedLevel,
  energy,
  maxEnergy,
  timeBoostCount,
  superTimeBoostCount,
  destructionPackCount,
  superDestructionPackCount,
  useTimeBoost,
  useSuperTimeBoost,
  useDestructionPack,
  useSuperDestructionPack,
  onToggleTimeBoost,
  onToggleSuperTimeBoost,
  onToggleDestructionPack,
  onToggleSuperDestructionPack,
  onStartLevel,
  onWatchAdForEnergy,
  onPlaySound,
  t,
  isFirstTime = false,
  tutorialStep = 0,
}) => {
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const tutorialPulseAnim = useRef(new Animated.Value(1)).current;
  const [showEnergyPanel, setShowEnergyPanel] = useState(false);

  useEffect(() => {
    const playAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(playButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(playButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    playAnimation.start();
    return () => playAnimation.stop();
  }, []);

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

  const currentLevelData = levels.find(l => l.id === unlockedLevel) || levels[0];

  return (
    <View style={styles.tabContent}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity
          style={[
            styles.campaignSection,
            isFirstTime && tutorialStep === 1 && {
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
          onPress={() => {
            onPlaySound?.();
            if (energy > 0) {
              onStartLevel(currentLevelData);
            } else {
              setShowEnergyPanel(true);
            }
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FB3', '#F93']}
            style={styles.arcadeGradient}
          >
            <View style={styles.arcadeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.campaignTitle}>{t.level_prefix} {currentLevelData.id}</Text>
                <Text style={styles.campaignLevelName}>{t[currentLevelData.name as keyof typeof t] || currentLevelData.name}</Text>
              </View>
              <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
                <View style={styles.playLevelButton}>
                  <Image source={require('../assets/Iconos/play.png')} style={styles.playLevelIcon} resizeMode="contain" />
                  <View style={styles.costBadge}>
                    <Image source={require('../assets/Iconos/Lighting.png')} style={styles.costEnergyIconImage} resizeMethod="resize" />
                  </View>
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.campaign_desc}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {(() => {
          const nextIngredient = getNextIngredientToUnlock(unlockedLevel);
          if (!nextIngredient) return null;

          const ingredientImages: { [key: string]: any } = {
            'CHEESE': require('../assets/Ingredientes/cheese.png'),
            'LETTUCE': require('../assets/Ingredientes/lettuce.png'),
            'BACON': require('../assets/Ingredientes/bacon.png'),
            'KETCHUP': require('../assets/Ingredientes/ketchup.png'),
            'ONION': require('../assets/Ingredientes/onion.png'),
            'PICKLE': require('../assets/Ingredientes/pickle.png'),
            'EGG': require('../assets/Ingredientes/egg.png')
          };

          const ingredientNames: { [key: string]: string } = {
            'CHEESE': 'ing_CHEESE',
            'LETTUCE': 'ing_LETTUCE',
            'BACON': 'ing_BACON',
            'KETCHUP': 'ing_KETCHUP',
            'ONION': 'ing_ONION',
            'PICKLE': 'ing_PICKLE',
            'EGG': 'ing_EGG'
          };

          return (
            <TouchableOpacity
              style={styles.nextIngredientSection}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FB3', '#F93']}
                style={styles.nextIngredientGradient}
              >
                <View style={styles.nextIngredientHeader}>
                  <View style={styles.nextIngredientLeft}>
                    <Text style={styles.nextIngredientTitle}>{t.next_ingredient}</Text>
                    <Text style={styles.nextIngredientName}>
                      {t[ingredientNames[nextIngredient.ingredient] as keyof typeof t] || nextIngredient.ingredient}
                    </Text>
                    <Text style={styles.nextIngredientLevel}>
                      {t.level_prefix} {nextIngredient.level}
                    </Text>
                  </View>

                  <View style={styles.nextIngredientRight}>
                    <Image
                      source={require('../assets/Iconos/lock.png')}
                      style={styles.nextIngredientLockIcon}
                      resizeMode="contain"
                    />
                    <View style={styles.nextIngredientCircle}>
                      <Image
                        source={ingredientImages[nextIngredient.ingredient] || require('../assets/Iconos/lock.png')}
                        style={styles.nextIngredientCircleIcon}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })()}
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

export default LevelsTab;
