import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Switch, StyleSheet, ScrollView, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Level } from '../types';
import { styles } from '../styles/MenuScreen.styles';

interface MenuScreenProps {
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
  onWatchAdForEnergy?: () => void;
  onRecipesBook?: () => void;
  onPlaySound?: () => void;
  t: any;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  levels, unlockedLevel, arcadeUnlockedLevel, arcadeHighScore, energy, maxEnergy, globalMoney, nextEnergyTime,
  timeBoostCount, superTimeBoostCount, destructionPackCount, superDestructionPackCount, 
  useTimeBoost, useSuperTimeBoost, useDestructionPack, useSuperDestructionPack,
  onToggleTimeBoost, onToggleSuperTimeBoost, onToggleDestructionPack, onToggleSuperDestructionPack,
  onStartLevel, onStartArcade, onOptions, onShop, onWatchAdForEnergy, onRecipesBook, onPlaySound, t
}) => {
  // Animaciones de pulso para los botones redondos
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const arcadeButtonScale = useRef(new Animated.Value(1)).current;
  const recipesButtonScale = useRef(new Animated.Value(1)).current;

  // Estado para el panel flotante de recuperar energía
  const [showEnergyPanel, setShowEnergyPanel] = useState(false);

  useEffect(() => {
    // Animación para el botón de Play
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

    // Animación para el botón de Arcade
    const arcadeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(arcadeButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(arcadeButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación para el botón de Recetas
    const recipesAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(recipesButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(recipesButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Iniciar animaciones con un pequeño delay entre ellas para que no estén sincronizadas
    playAnimation.start();
    setTimeout(() => {
      arcadeAnimation.start();
    }, 500);
    setTimeout(() => {
      recipesAnimation.start();
    }, 1000);

    return () => {
      playAnimation.stop();
      arcadeAnimation.stop();
      recipesAnimation.stop();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentLevelData = levels.find(l => l.id === unlockedLevel) || levels[0];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Barra Superior */}
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
            {timeBoostCount > 0 && (
              <View style={[styles.statPill, { marginLeft: 3 }]}>
                <Text style={styles.statEmoji}>⏱️</Text>
                <Text style={styles.statValue}>{timeBoostCount}</Text>
              </View>
            )}
            {superTimeBoostCount > 0 && (
              <View style={[styles.statPill, { marginLeft: 3, backgroundColor: '#fff4e6' }]}>
                <Text style={styles.statEmoji}>⏳</Text>
                <Text style={[styles.statValue, { color: '#d9480f' }]}>{superTimeBoostCount}</Text>
              </View>
            )}
            {destructionPackCount > 0 && (
              <View style={[styles.statPill, { marginLeft: 3 }]}>
                <Image source={require('../assets/Iconos/rubber.png')} style={styles.statIcon} resizeMethod="resize" />
                <Text style={styles.statValue}>{destructionPackCount}</Text>
              </View>
            )}
            {superDestructionPackCount > 0 && (
              <View style={[styles.statPill, { marginLeft: 3, backgroundColor: '#fff5f5' }]}>
                <Text style={styles.statEmoji}>🔥</Text>
                <Text style={[styles.statValue, { color: '#c92a2a' }]}>{superDestructionPackCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.shopBtn} onPress={() => { onPlaySound?.(); onShop(); }}>
              <Image source={require('../assets/Iconos/power.png')} style={styles.buttonIcon} resizeMethod="resize" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => { onPlaySound?.(); onOptions(); }}>
              <Image source={require('../assets/Iconos/settings.png')} style={styles.buttonIcon} resizeMethod="resize" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity 
          style={styles.arcadeSection}
          onPress={() => { onPlaySound?.(); onStartArcade(); }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#ffa94d', '#ff9500']}
            style={styles.arcadeGradient}
          >
            <View style={styles.arcadeHeader}>
              <View style={styles.arcadeTitleContainer}>
                <Text style={styles.arcadeTitle}>{t.arcade_title}</Text>
              </View>

              <View style={styles.arcadeRecordCenter}>
                <Text style={styles.arcadeRecordLabel}>{t.record}</Text>
                <View style={styles.arcadeRecordValueRow}>
                  <Text style={styles.arcadeRecordValue}>{arcadeHighScore}</Text>
                  <Image source={require('../assets/Iconos/coin.png')} style={styles.arcadeRecordCoin} resizeMethod="resize" />
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: arcadeButtonScale }] }}>
                <View style={styles.arcadeButton}>
                  <Image source={require('../assets/Iconos/arcade.png')} style={styles.arcadeIcon} resizeMode="contain" />
                  <View style={styles.costBadge}>
                    <Image source={require('../assets/Iconos/Lighting.png')} style={styles.costEnergyIconImage} resizeMethod="resize" />
                  </View>
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.arcade_desc}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.campaignSection}
          onPress={() => {
            onPlaySound?.();
            if (energy > 0) {
              onStartLevel(currentLevelData);
            } else {
              setShowEnergyPanel(true);
            }
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#fcc419', '#fab005']}
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

        <TouchableOpacity 
          style={styles.recipeBookSection}
          onPress={() => { 
            Vibration.vibrate(50);
            onPlaySound?.(); 
            if (onRecipesBook) onRecipesBook();
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#ffb3d9', '#ff99cc']}
            style={styles.arcadeGradient}
          >
            <View style={styles.arcadeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.campaignTitle}>{t.recipes}</Text>
                <Text style={styles.campaignLevelName}>{t.recipes_panel_subtitle}</Text>
              </View>
              <Animated.View style={[{ transform: [{ scale: recipesButtonScale }] }]}>
                <View style={styles.playLevelButton}>
                  <Image source={require('../assets/Iconos/book.png')} style={styles.playLevelIcon} resizeMode="contain" />
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.recipes_panel_description}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MenuScreen;
