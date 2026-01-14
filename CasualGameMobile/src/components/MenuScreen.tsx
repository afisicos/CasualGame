import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Switch, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Level } from '../types';
import { styles } from '../styles/MenuScreen.styles';

interface MenuScreenProps {
  levels: Level[];
  unlockedLevel: number;
  arcadeUnlockedLevel: number;
  arcadeHighScore: number;
  lives: number;
  maxLives: number;
  globalMoney: number;
  nextLifeTime: number;
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
  onWatchAdForLives?: () => void;
  onPlaySound?: () => void;
  t: any;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ 
  levels, unlockedLevel, arcadeUnlockedLevel, arcadeHighScore, lives, maxLives, globalMoney, nextLifeTime,
  timeBoostCount, destructionPackCount, useTimeBoost, useDestructionPack,
  onToggleTimeBoost, onToggleDestructionPack,
  onStartLevel, onStartArcade, onOptions, onShop, onWatchAdForLives, onPlaySound, t
}) => {
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
                if (lives < maxLives && onWatchAdForLives) {
                  onPlaySound?.();
                  onWatchAdForLives();
                }
              }}
              disabled={lives >= maxLives || !onWatchAdForLives}
              activeOpacity={lives < maxLives && onWatchAdForLives ? 0.7 : 1}
            >
              <Text style={styles.statEmoji}>❤️</Text>
              <Text style={styles.statValue}>{lives}/{maxLives}</Text>
              {lives < maxLives && (
                <View style={styles.timeBadge}>
                  {onWatchAdForLives ? (
                    <Text style={styles.timeBadgeText}>📺</Text>
                  ) : (
                    <Text style={styles.timeBadgeText}>{formatTime(nextLifeTime)}</Text>
                  )}
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
        <View style={styles.arcadeSection}>
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

                    <TouchableOpacity style={styles.arcadeButton} onPress={() => { onPlaySound?.(); onStartArcade(); }}>
                      <Image source={require('../assets/Iconos/arcade.png')} style={styles.arcadeIcon} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.arcadeDescription}>{t.arcade_desc}</Text>
                </LinearGradient>
        </View>

        <View style={styles.campaignSection}>
          <LinearGradient
            colors={['#fcc419', '#fab005']}
            style={styles.arcadeGradient}
          >
            <View style={styles.arcadeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.campaignTitle}>{t.level_prefix} {currentLevelData.id}</Text>
                <Text style={styles.campaignLevelName}>{t[currentLevelData.name as keyof typeof t] || currentLevelData.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.playLevelButton} 
                onPress={() => { onPlaySound?.(); onStartLevel(currentLevelData); }}
              >
                <Image source={require('../assets/Iconos/play.png')} style={styles.playLevelIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <Text style={styles.arcadeDescription}>{t.campaign_desc}</Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default MenuScreen;
