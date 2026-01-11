import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Level } from '../types';

const { width } = Dimensions.get('window');

interface MenuScreenProps {
  levels: Level[];
  unlockedLevel: number;
  arcadeUnlockedLevel: number;
  arcadeHighScore: number;
  lives: number;
  maxLives: number;
  globalMoney: number;
  nextLifeTime: number; 
  onStartLevel: (level: Level) => void;
  onStartArcade: () => void;
  onOptions: () => void;
  t: any;
}

const LevelNode = ({ item, isLocked, onStartLevel, t }: { item: Level, isLocked: boolean, onStartLevel: (l: Level) => void, t: any }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isLocked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLocked]);

  return (
    <TouchableOpacity 
      style={[styles.levelNode, isLocked && styles.levelLocked]} 
      onPress={() => !isLocked && onStartLevel(item)}
      disabled={isLocked}
    >
      <View style={[styles.levelCircleWrapper]}>
        {!isLocked && (
          <Animated.View style={[
            styles.circlePulse,
            { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.15], outputRange: [0.4, 0] }) }
          ]} />
        )}
        <LinearGradient
          colors={isLocked ? ['#adb5bd', '#868e96'] : ['#ff922b', '#f08c00']}
          style={styles.levelCircle}
        >
          <Text style={styles.levelNumber}>{item.id}</Text>
        </LinearGradient>
      </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{t.level_prefix} {item.id}: {t[item.name as keyof typeof t] || item.name}</Text>
              <Text style={styles.levelTarget}>{t.objective}: {item.targetMoney}€</Text>
            </View>
      {isLocked ? (
        <Text style={styles.lockIcon}>🔒</Text>
      ) : (
        <Text style={styles.playIcon}>▶️</Text>
      )}
    </TouchableOpacity>
  );
};

const MenuScreen: React.FC<MenuScreenProps> = ({ 
  levels, unlockedLevel, arcadeUnlockedLevel, arcadeHighScore, lives, maxLives, globalMoney, nextLifeTime,
  onStartLevel, onStartArcade, onOptions, t
}) => {
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
      
      {/* Barra Superior */}
      <View style={styles.headerBar}>
        <View style={styles.topBar}>
          <View style={styles.topBarGroup}>
            <View style={styles.statPill}>
              <Text style={styles.statEmoji}>❤️</Text>
              <Text style={styles.statValue}>{lives}/{maxLives}</Text>
              {lives < maxLives && (
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>{formatTime(nextLifeTime)}</Text>
                </View>
              )}
            </View>
            <View style={[styles.statPill, { marginLeft: 10 }]}>
              <Text style={styles.statEmoji}>💰</Text>
              <Text style={styles.statValue}>{globalMoney}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsBtn} onPress={onOptions}>
            <Text style={styles.settingsEmoji}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.arcadeSection}>
                <LinearGradient
                  colors={['#4dabf7', '#339af0']}
                  style={styles.arcadeGradient}
                >
                  <View style={styles.arcadeHeader}>
                    <TouchableOpacity style={styles.arcadeButton} onPress={onStartArcade}>
                      <Image source={require('../assets/Iconos/arcade.png')} style={styles.arcadeIcon} resizeMode="contain" />
                      <Text style={styles.arcadeButtonText}>{t.arcade_btn}</Text>
                    </TouchableOpacity>
                    <View style={styles.recordContainer}>
                      <Text style={styles.recordLabel}>{t.record}</Text>
                      <Text style={styles.recordValue}>{arcadeHighScore}€</Text>
                    </View>
                  </View>
                </LinearGradient>
        </View>

        <FlatList 
          data={levels}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                  <LevelNode 
                    item={item} 
                    isLocked={item.id > unlockedLevel} 
                    onStartLevel={onStartLevel} 
                    t={t}
                  />
                )}
          style={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 5,
    marginBottom: 15
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  topBarGroup: { flexDirection: 'row', alignItems: 'center' },
  statPill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  statEmoji: { fontSize: 14, marginRight: 5 },
  statValue: { fontSize: 13, fontWeight: '900', color: '#4a4a4a' },
  timeBadge: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white'
  },
  timeBadgeText: { color: 'white', fontSize: 7, fontWeight: '900' },
  settingsBtn: {
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  settingsEmoji: { fontSize: 20 },
  content: { flex: 1 },
  arcadeSection: { 
    marginHorizontal: 20,
    borderRadius: 24, 
    marginBottom: 30, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    overflow: 'hidden'
  },
  arcadeGradient: { padding: 20 },
  arcadeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  arcadeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    borderRadius: 15 
  },
  arcadeIcon: { width: 30, height: 30, marginRight: 10 },
  arcadeButtonText: { color: 'white', fontWeight: '900', fontSize: 14 },
  recordContainer: { alignItems: 'flex-end' },
  recordLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  recordValue: { fontSize: 24, fontWeight: '900', color: 'white' },
  subtitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: 'white', 
    letterSpacing: 3, 
    marginBottom: 15, 
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  list: { flex: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },
  levelNode: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 24, 
    marginBottom: 15, // Aumentado un poco para que se vea mejor la sombra
    marginHorizontal: 2, // Margen extra para que la sombra no se corte
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 4 
  },
  levelLocked: { opacity: 0.7, backgroundColor: '#f8f9fa' },
  levelCircleWrapper: { marginRight: 15, position: 'relative' },
  levelCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  circlePulse: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff922b',
    opacity: 0.3
  },
  levelNumber: { color: 'white', fontWeight: '900', fontSize: 20 },
  levelInfo: { flex: 1 },
  levelName: { fontWeight: '800', fontSize: 16, color: '#4a4a4a' },
  levelTarget: { fontSize: 12, color: '#27ae60', fontWeight: '700', marginTop: 2 },
  lockIcon: { fontSize: 20 },
  playIcon: { fontSize: 18 }
});

export default MenuScreen;
