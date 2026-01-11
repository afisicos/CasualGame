import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode } from '../types';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  gameMode: GameMode;
  money: number;
  targetMoney: number;
  arcadeHighScore: number;
  onBack: () => void;
  onRetry: () => void;
  t: any;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ gameMode, money, targetMoney, arcadeHighScore, onBack, onRetry, t }) => {
  const isCampaign = gameMode === 'CAMPAIGN';
  const isWin = isCampaign ? money >= targetMoney : false;
  const isNewRecord = !isCampaign && money >= arcadeHighScore && money > 0;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.card}>
        <View style={[styles.statusBadge, { backgroundColor: (isCampaign ? isWin : isNewRecord) ? '#40c057' : '#ff6b6b' }]}>
          <Text style={styles.statusText}>{isCampaign ? (isWin ? '🏆' : '⏰') : (isNewRecord ? '🔥' : '📈')}</Text>
        </View>
        
        <Text style={styles.title}>
          {isCampaign 
            ? (isWin ? t.win_title : t.lose_title) 
            : (isNewRecord ? t.arcade_win : t.arcade_lose)}
        </Text>
        
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>{t.money_earned}</Text>
          <Text style={styles.money}>{money}€</Text>
          
          {isCampaign ? (
            <Text style={styles.targetLabel}>{t.objective}: {targetMoney}€</Text>
          ) : (
            <View style={styles.recordRow}>
              <Text style={styles.recordLabelSmall}>{t.record}: </Text>
              <Text style={styles.recordValueSmall}>{arcadeHighScore}€</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>
            {isCampaign ? (isWin ? t.continue : t.retry) : t.play_again}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>{t.back_menu}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 35, 
    padding: 30, 
    alignItems: 'center',
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70,
    borderWidth: 6,
    borderColor: 'white',
    elevation: 5
  },
  statusText: { fontSize: 40 },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#4a4a4a', 
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  resultBox: {
    backgroundColor: '#f8f9fa',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 25
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#adb5bd',
    letterSpacing: 1
  },
  money: { 
    fontSize: 56, 
    fontWeight: '900', 
    color: '#27ae60', 
    marginVertical: 5 
  },
  targetLabel: {
    fontSize: 14,
    color: '#868e96',
    fontWeight: '700'
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  recordLabelSmall: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '800'
  },
  recordValueSmall: {
    fontSize: 14,
    color: '#4dabf7',
    fontWeight: '900'
  },
  button: { 
    backgroundColor: '#ff922b', 
    paddingVertical: 18, 
    borderRadius: 20, 
    width: '100%', 
    alignItems: 'center',
    elevation: 5
  },
  buttonText: { color: 'white', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  backButton: { marginTop: 20 },
  backText: { 
    fontSize: 12,
    fontWeight: '800', 
    color: '#adb5bd',
    letterSpacing: 1
  }
});

export default ResultScreen;

