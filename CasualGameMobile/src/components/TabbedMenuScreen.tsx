import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LevelsMapTab from './LevelsMapTab';
import DailyAchievementsTab from './DailyAchievementsTab';
import CollectionsTabbedScreen from './CollectionsTabbedScreen';
import { Level, LevelStars, DailyAchievement } from '../types';
import { styles } from '../styles/TabbedMenuScreen.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabbedMenuScreenProps {
  levels: Level[];
  unlockedLevel: number;
  arcadeUnlockedLevel: number;
  arcadeHighScore: number;
  energy: number;
  maxEnergy: number;
  globalMoney: number;
  nextEnergyTime: number;
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
  onStartArcade: () => void;
  onOptions: () => void;
  onShop: () => void;
  onRecipesBook?: () => void;
  onIngredientsBook?: () => void;
  onWatchAdForEnergy?: () => void;
  discoveredRecipes: string[];
  onPlaySound?: () => void;
  onPlayErrorSound?: () => void;
  onPlayDestroySound?: () => void;
  dailyAchievements: DailyAchievement[];
  onClaimAchievementReward: (id: string) => void;
  levelStarsData?: Record<number, LevelStars>;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
  initialTab?: number;
  onTabChange?: (index: number) => void;
}

const TabbedMenuScreen: React.FC<TabbedMenuScreenProps> = ({
  levels,
  unlockedLevel,
  arcadeUnlockedLevel,
  arcadeHighScore,
  energy,
  maxEnergy,
  globalMoney,
  nextEnergyTime,
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
  onStartArcade,
  onOptions,
  onShop,
  onRecipesBook,
  onIngredientsBook,
  onWatchAdForEnergy,
  discoveredRecipes,
  onPlaySound,
  onPlayErrorSound,
  onPlayDestroySound,
  dailyAchievements,
  onClaimAchievementReward,
  levelStarsData = {},
  t,
  isFirstTime = false,
  tutorialStep = 0,
  initialTab = 0,
  onTabChange,
}) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(initialTab);

  // Sincronizar currentPage con initialTab si este cambia externamente
  // Usar useLayoutEffect para evitar parpadeo visual
  useLayoutEffect(() => {
    if (initialTab !== currentPage) {
      setCurrentPage(initialTab);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: initialTab * SCREEN_WIDTH,
          animated: false,
        });
      }
    }
  }, [initialTab, currentPage]);

  // Manejar el desplazamiento inicial al montar
  useLayoutEffect(() => {
    if (initialTab !== 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: initialTab * SCREEN_WIDTH,
        animated: false,
      });
    }
  }, []);

  // Manejar el cambio de página al deslizar
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    if (page !== currentPage) {
      setCurrentPage(page);
      onTabChange?.(page);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Barra Superior - Compartida entre todas las pestañas */}
      <View style={styles.headerBar}>
        <View style={styles.topBar}>
          <View style={styles.topBarGroup}>
            <TouchableOpacity 
              style={styles.statPill}
              onPress={() => {
                if (energy < maxEnergy && onWatchAdForEnergy) {
                  onPlaySound?.();
                  onWatchAdForEnergy();
                }
              }}
              disabled={energy >= maxEnergy || !onWatchAdForEnergy}
              activeOpacity={energy < maxEnergy && onWatchAdForEnergy ? 0.7 : 1}
            >
              <Image source={require('../assets/Iconos/Lighting.png')} style={styles.statIcon} resizeMethod="resize" />
              <Text style={styles.statValue}>{energy}/{maxEnergy}</Text>
              {energy < maxEnergy && (
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>{formatTime(nextEnergyTime)}</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={[styles.statPill, { marginLeft: 3 }]}>
              <Text style={styles.statValue}>{globalMoney}</Text>
              <Image source={require('../assets/Iconos/coin.png')} style={styles.statIcon} resizeMethod="resize" />
            </View>
            {/* Contador de estrellas totales */}
            {(() => {
              const totalStars = Object.values(levelStarsData || {}).reduce((sum, stars) => sum + (stars?.stars || 0), 0);
              return totalStars > 0 ? (
                <View style={[styles.statPill, { marginLeft: 3 }]}>
                  <Image 
                    source={require('../assets/Iconos/star.png')} 
                    style={styles.statEmoji}
                    resizeMode="contain" 
                  />
                  <Text style={styles.statValue}>{totalStars}</Text>
                </View>
              ) : null;
            })()}
          </View>
          <View style={styles.rightButtons}>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => {
                onPlaySound?.();
                onShop();
              }}
              activeOpacity={0.8}
            >
              <Image source={require('../assets/Iconos/power.png')} style={styles.buttonIcon} resizeMethod="resize" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => {
                onPlaySound?.();
                onOptions();
              }}
              activeOpacity={0.8}
            >
              <Image source={require('../assets/Iconos/settings.png')} style={styles.buttonIcon} resizeMethod="resize" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ScrollView horizontal para las pestañas */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pestaña 1: Niveles */}
        <View style={styles.tabContainer}>
          <LevelsMapTab
            levels={levels}
            unlockedLevel={unlockedLevel}
            energy={energy}
            maxEnergy={maxEnergy}
            onStartLevel={onStartLevel}
            onWatchAdForEnergy={onWatchAdForEnergy}
            onPlaySound={onPlaySound}
            onPlayErrorSound={onPlayErrorSound}
            onPlayDestroySound={onPlayDestroySound}
            levelStarsData={levelStarsData}
            t={t}
            isFirstTime={isFirstTime}
            tutorialStep={tutorialStep}
          />
        </View>

        {/* Pestaña 2: Logros Diarios */}
        <View style={styles.tabContainer}>
          <DailyAchievementsTab
            achievements={dailyAchievements}
            onClaimReward={onClaimAchievementReward}
            onPlaySound={onPlaySound}
            t={t}
          />
        </View>

        {/* Pestaña 3: Colecciones (Arcade + Recetas + Ingredientes) */}
        <View style={styles.tabContainer}>
          <CollectionsTabbedScreen
            arcadeHighScore={arcadeHighScore}
            energy={energy}
            maxEnergy={maxEnergy}
            onStartArcade={onStartArcade}
            onWatchAdForEnergy={onWatchAdForEnergy}
            discoveredRecipes={discoveredRecipes}
            onRecipesBook={onRecipesBook}
            unlockedLevel={unlockedLevel}
            onIngredientsBook={onIngredientsBook}
            onPlaySound={onPlaySound}
            t={t}
            isFirstTime={isFirstTime}
            tutorialStep={tutorialStep}
          />
        </View>
      </ScrollView>

      {/* Indicadores de página */}
      <View style={styles.pageIndicators}>
        <View style={[styles.indicator, currentPage === 0 && styles.indicatorActive]} />
        <View style={[styles.indicator, currentPage === 1 && styles.indicatorActive]} />
        <View style={[styles.indicator, currentPage === 2 && styles.indicatorActive]} />
      </View>
    </View>
  );
};

export default TabbedMenuScreen;
