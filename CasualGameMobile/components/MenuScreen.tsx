import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Level } from '../types';

interface MenuScreenProps {
  levels: Level[];
  unlockedLevel: number;
  arcadeHighScore: number;
  onStartLevel: (level: Level) => void;
  onStartArcade: () => void;
  onResetProgress: () => void;
}

const MenuScreen: React.FC<MenuScreenProps> = ({ levels, unlockedLevel, arcadeHighScore, onStartLevel, onStartArcade, onResetProgress }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🍔</Text>
          <Text style={styles.titleMain}>FOOD</Text>
          <Text style={styles.titleSub}>FOR FUN</Text>
          <View style={styles.titleUnderline} />
        </View>
        
        <View style={styles.arcadeSection}>
          <Text style={styles.arcadeTitle}>MODO ARCADE</Text>
          <View style={styles.arcadeRow}>
            <TouchableOpacity style={styles.arcadeButton} onPress={onStartArcade}>
              <Text style={styles.buttonText}>¡MINUTO EXPRESS!</Text>
            </TouchableOpacity>
            <View style={styles.arcadeHighScoreContainer}>
              <Text style={styles.recordLabel}>RÉCORD</Text>
              <Text style={styles.recordValue}>{arcadeHighScore}€</Text>
            </View>
          </View>
        </View>
        <FlatList data={levels} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => {
          const isLocked = item.id > unlockedLevel;
          return (
            <TouchableOpacity style={[styles.levelNode, isLocked && styles.levelLocked]} onPress={() => !isLocked && onStartLevel(item)} disabled={isLocked}>
              <View style={[styles.levelCircle, isLocked && styles.circleLocked]}><Text style={styles.levelNumber}>{item.id}</Text></View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelName}>{item.name}</Text>
                <Text style={styles.levelTarget}>Objetivo: {item.targetMoney}€</Text>
              </View>
              {isLocked && <Text>🔒</Text>}
            </TouchableOpacity>
          );
        }} />
        <TouchableOpacity onPress={onResetProgress}><Text style={styles.resetText}>Reiniciar Progreso</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfbf9' },
  content: { padding: 20, flex: 1 },
  logoContainer: { alignItems: 'center', marginVertical: 30 },
  logoEmoji: { fontSize: 50, marginBottom: 5 },
  titleMain: { fontSize: 48, fontWeight: '900', color: '#D2691E', letterSpacing: -2, lineHeight: 48 },
  titleSub: { fontSize: 24, fontWeight: '800', color: '#e6a15c', letterSpacing: 4, marginTop: -5 },
  titleUnderline: { width: 60, height: 6, backgroundColor: '#27ae60', borderRadius: 3, marginTop: 10 },
  subtitle: { fontSize: 14, fontWeight: '800', color: '#adb5bd', letterSpacing: 2, marginBottom: 15, textAlign: 'center' },
  arcadeSection: { backgroundColor: '#e7f5ff', padding: 20, borderRadius: 24, marginBottom: 30, elevation: 4, borderWidth: 2, borderColor: '#a5d8ff' },
  arcadeTitle: { fontWeight: '900', color: '#1971c2', marginBottom: 15, textAlign: 'center', letterSpacing: 1 },
  arcadeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  arcadeButton: { flex: 2, backgroundColor: '#228be6', paddingVertical: 15, borderRadius: 15, elevation: 3, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '900', fontSize: 14 },
  arcadeHighScoreContainer: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 15, alignItems: 'center', elevation: 2 },
  recordLabel: { fontSize: 8, fontWeight: '800', color: '#adb5bd' },
  recordValue: { fontSize: 18, fontWeight: '900', color: '#27ae60' },
  levelNode: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 20, marginBottom: 10, elevation: 1 },
  levelLocked: { opacity: 0.5 },
  levelCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e6a15c', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  circleLocked: { backgroundColor: '#8c8c8c' },
  levelNumber: { color: 'white', fontWeight: '900' },
  levelInfo: { flex: 1 },
  levelName: { fontWeight: '700', color: '#4a4a4a' },
  levelTarget: { fontSize: 12, color: '#27ae60' },
  resetText: { color: '#8c8c8c', textAlign: 'center', marginTop: 10, textDecorationLine: 'underline' }
});

export default MenuScreen;

