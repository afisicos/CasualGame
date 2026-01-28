import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/IngredientsBookScreen.styles';
import { getUnlockedIngredientsForCampaign } from '../constants/gameData';
import { PieceType } from '../types';
import IngredientsShowcase from './IngredientsShowcase';

interface IngredientsBookScreenProps {
  unlockedLevel: number;
  onBack: () => void;
  onPlaySound?: () => void;
  t: any;
}

const IngredientsBookScreen: React.FC<IngredientsBookScreenProps> = ({
  unlockedLevel,
  onBack,
  onPlaySound,
  t
}) => {
  // Obtener ingredientes desbloqueados
  const unlockedIngredientsData = getUnlockedIngredientsForCampaign(unlockedLevel);
  const unlockedIngredients: PieceType[] = unlockedIngredientsData.map(ing => ing.type);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            onPlaySound?.();
            onBack();
          }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>{String(t.ingredients || 'INGREDIENTES')}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Ingredients Showcase */}
      <IngredientsShowcase
        unlockedIngredients={unlockedIngredients}
        t={t}
      />
    </View>
  );
};

export default IngredientsBookScreen;
