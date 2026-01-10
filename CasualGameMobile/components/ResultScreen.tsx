import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GameMode } from '../types';

interface ResultScreenProps {
  gameMode: GameMode;
  money: number;
  targetMoney: number;
  arcadeHighScore: number;
  onBack: () => void;
  onRetry: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ gameMode, money, targetMoney, onBack, onRetry }) => {
  const isWin = gameMode === 'ARCADE' ? true : money >= targetMoney;
  return (
    <View style={styles.container}>
      <View style={[styles.card, isWin ? styles.win : styles.fail]}>
        <Text style={styles.title}>{isWin ? '¡Nivel Superado!' : '¡Tiempo Agotado!'}</Text>
        <Text style={styles.money}>{money}€</Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}><Text style={styles.buttonText}>CONTINUAR</Text></TouchableOpacity>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>MENU</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  card: { borderRadius: 30, padding: 40, alignItems: 'center' },
  win: { backgroundColor: '#ebfbee' },
  fail: { backgroundColor: '#fff5f5' },
  title: { fontSize: 24, fontWeight: '900' },
  money: { fontSize: 48, fontWeight: '900', color: '#27ae60', marginVertical: 20 },
  button: { backgroundColor: '#333', padding: 15, borderRadius: 15, width: '100%', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '900' },
  back: { marginTop: 20, fontWeight: '700', color: '#666' }
});

export default ResultScreen;

