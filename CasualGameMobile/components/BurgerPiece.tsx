import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PieceType } from '../types';

interface BurgerPieceProps {
  type: PieceType;
  scale?: number;
}

const BurgerPiece: React.FC<BurgerPieceProps> = ({ type, scale = 1 }) => {
  const getIcon = () => {
    switch (type) {
      case 'BREAD': return '🍞';
      case 'MEAT': return '🍗';  // Volvemos al muslo de pollo/carne
      case 'CHEESE': return '🧀';
      case 'LETTUCE': return '🥬';
      case 'TOMATO': return '🍅';
      case 'BACON': return '🥓';
      case 'KETCHUP': return '🥫';
      case 'PICKLE': return '🥒';
      case 'ONION': return '🧅';
      default: return '❓';
    }
  };

  const colors = {
    BREAD: '#e6a15c',
    MEAT: '#63392b',
    CHEESE: '#ffcc33',
    LETTUCE: '#74b72e',
    TOMATO: '#e23d28',
    BACON: '#9e2a2b',
    KETCHUP: '#d00000',
    PICKLE: '#52796f',
    ONION: '#f8f9fa',
  };

  return (
    <View style={[styles.container, { transform: [{ scale }] }]}>
      <Text style={styles.iconText}>{getIcon()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
  },
  iconText: {
    fontSize: 28, // Un poco más grande ahora que no tiene círculo
  }
});

export default BurgerPiece;
