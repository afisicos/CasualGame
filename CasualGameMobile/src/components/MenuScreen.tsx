import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Switch, StyleSheet } from 'react-native';
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
  destructionPackCount: number;
  useTimeBoost: boolean;
  useDestructionPack: boolean;
  onToggleTimeBoost: (value: boolean) => void;
  onToggleDestructionPack: (value: boolean) => void;
  onStartLevel: (level: Level) => void;
  onStartArcade: () => void;
  onOptions: () => void;
  onShop: () => void;
  onWatchAdForEnergy?: () => void;
  onPlaySound?: () => void;
  t: any;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ 
  levels, unlockedLevel, arcadeUnlockedLevel, arcadeHighScore, energy, maxEnergy, globalMoney, nextEnergyTime,
  timeBoostCount, destructionPackCount, useTimeBoost, useDestructionPack,
  onToggleTimeBoost, onToggleDestructionPack,
  onStartLevel, onStartArcade, onOptions, onShop, onWatchAdForEnergy, onPlaySound, t
}) => {
  // Animaciones de pulso para los botones redondos
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const arcadeButtonScale = useRef(new Animated.Value(1)).current;

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

    // Iniciar animaciones con un pequeño delay entre ellas para que no estén sincronizadas
    playAnimation.start();
    setTimeout(() => {
      arcadeAnimation.start();
    }, 500);

    return () => {
      playAnimation.stop();
      arcadeAnimation.stop();
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
              <Text style={styles.statEmoji}>⚡</Text>
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
            {destructionPackCount > 0 && (
              <View style={[styles.statPill, { marginLeft: 3 }]}>
                <Text style={styles.statEmoji}>💥</Text>
                <Text style={styles.statValue}>{destructionPackCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightButtons}>
            <TouchableOpacity style={styles.shopBtn} onPress={() => { onPlaySound?.(); onShop(); }}>
              <Image source={require('../assets/Iconos/shop.png')} style={styles.buttonIcon} resizeMethod="resize" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => { onPlaySound?.(); onOptions(); }}>
              <Image source={require('../assets/Iconos/settings.png')} style={styles.buttonIcon} resizeMethod="resize" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
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
                    <Text style={styles.costBadgeText}>1</Text>
                    <Text style={styles.costEnergyIcon}>⚡</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.arcade_desc}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.campaignSection}
          onPress={() => { onPlaySound?.(); onStartLevel(currentLevelData); }}
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
                    <Text style={styles.costBadgeText}>1</Text>
                    <Text style={styles.costEnergyIcon}>⚡</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.campaign_desc}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;
