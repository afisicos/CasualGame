import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BurgerPiece from './BurgerPiece';
import { PieceType } from '../types';

interface IntroScreenProps {
  newIngredient: PieceType;
  description: string;
  targetMoney: number;
  timeLimit: number;
  onPlay: () => void;
  onBack: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ newIngredient, description, targetMoney, timeLimit, onPlay, onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Ingrediente</Text>
        <BurgerPiece type={newIngredient} scale={1.5} />
        <Text style={styles.description}>{description}</Text>
        <Text>🎯 Objetivo: {targetMoney}€</Text>
        <Text>⏱️ Tiempo: {timeLimit}s</Text>
        <TouchableOpacity style={styles.playButton} onPress={onPlay}><Text style={styles.buttonText}>¡A COCINAR!</Text></TouchableOpacity>
        <TouchableOpacity onPress={onBack}><Text style={styles.backText}>Volver</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 30, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#D2691E', marginBottom: 20 },
  description: { textAlign: 'center', marginVertical: 20 },
  playButton: { backgroundColor: '#27ae60', padding: 15, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: '900' },
  backText: { marginTop: 15, color: '#8c8c8c' }
});

export default IntroScreen;

