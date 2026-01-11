import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BurgerPiece from './BurgerPiece';
import { PieceType } from '../types';

const { width } = Dimensions.get('window');

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
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Ingrediente</Text>
        <View style={styles.pieceContainer}>
          <BurgerPiece type={newIngredient} scale={1.8} />
        </View>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>OBJETIVO</Text>
            <Text style={styles.statValue}>{targetMoney}€</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>TIEMPO</Text>
            <Text style={styles.statValue}>{timeLimit}s</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={onPlay}>
          <Text style={styles.buttonText}>¡A COCINAR!</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver al mapa</Text>
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
    borderRadius: 30, 
    padding: 30, 
    alignItems: 'center',
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#4a4a4a', 
    marginBottom: 25,
    letterSpacing: 1
  },
  pieceContainer: {
    padding: 20,
    backgroundColor: '#fcf8f2',
    borderRadius: 100,
    marginBottom: 20
  },
  description: { 
    textAlign: 'center', 
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 25,
    fontWeight: '600'
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 15
  },
  statBox: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#adb5bd',
    marginBottom: 5
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#27ae60'
  },
  playButton: { 
    backgroundColor: '#ff922b', 
    paddingVertical: 18, 
    borderRadius: 20, 
    width: '100%', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#ff922b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  buttonText: { 
    color: 'white', 
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1
  },
  backButton: {
    marginTop: 20
  },
  backText: { 
    color: '#adb5bd',
    fontWeight: '700',
    textDecorationLine: 'underline'
  }
});

export default IntroScreen;

