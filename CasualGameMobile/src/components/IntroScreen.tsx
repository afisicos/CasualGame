import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BurgerPiece from './BurgerPiece';
import { PieceType } from '../types';

const { width } = Dimensions.get('window');

interface IntroScreenProps {
  levelId: number;
  newIngredient: PieceType;
  showNewIngredient: boolean;
  newRecipe?: string; // Nombre traducido o clave de traducción
  recipeIngredients?: PieceType[];
  recipePrice?: number; // Nuevo: Precio de la receta
  description: string;
  targetMoney: number;
  timeLimit: number;
  onPlay: () => void;
  onBack: () => void;
  t: any;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ 
  levelId,
  newIngredient, 
  showNewIngredient,
  newRecipe,
  recipeIngredients,
  recipePrice,
  description, 
  targetMoney, 
  timeLimit, 
  onPlay, 
  onBack, 
  t 
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.card}>
        <Text style={styles.levelBadge}>{t.level_prefix} {levelId}</Text>
        
        {/* ZONA 1: NUEVA RECETA (SIEMPRE) */}
        <View style={styles.section}>
          <View style={styles.recipeHeaderRow}>
            <Text style={styles.sectionLabel}>{t.new_recipe}</Text>
            {recipePrice !== undefined && (
              <View style={styles.pricePill}>
                <Text style={styles.pricePillText}>{recipePrice}€</Text>
              </View>
            )}
          </View>
          <Text style={styles.burgerName}>
            {newRecipe || '---'}
          </Text>
          <View style={styles.recipePreview}>
            {recipeIngredients?.map((ing, idx) => (
              <View key={idx} style={styles.recipeIngIcon}>
                <BurgerPiece type={ing} scale={0.7} gridSize={8} />
              </View>
            ))}
          </View>
        </View>

        {/* ZONA 2: NUEVO INGREDIENTE (CONDICIONAL) */}
        {showNewIngredient && (
          <View style={[styles.section, styles.ingredientSection]}>
            <Text style={styles.sectionLabel}>{t.new_ingredient}</Text>
            <View style={styles.ingredientRow}>
              <View style={styles.ingredientIconBg}>
                <BurgerPiece type={newIngredient} scale={1.2} />
              </View>
              <Text style={styles.ingredientName}>{t[`ing_${newIngredient}` as keyof typeof t]}</Text>
            </View>
          </View>
        )}
        
        <Text style={styles.description}>{t[description as keyof typeof t] || description}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t.objective}</Text>
            <Text style={styles.statValue}>{targetMoney}€</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t.time}</Text>
            <Text style={styles.statValue}>{timeLimit}s</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={onPlay}>
          <Text style={styles.buttonText}>{t.cook}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>{t.back}</Text>
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
    padding: 25, 
    alignItems: 'center',
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  levelBadge: {
    backgroundColor: '#ff922b',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 20
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fcf8f2',
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#efe5d9'
  },
  ingredientSection: {
    backgroundColor: '#e7f5ff',
    borderColor: '#d0ebff'
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#adb5bd',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recipeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8
  },
  pricePill: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pricePillText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900'
  },
  burgerName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 12
  },
  recipePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: -10 // Superponer un poquito para que parezca una burger
  },
  recipeIngIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  ingredientIconBg: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1864ab'
  },
  description: { 
    textAlign: 'center', 
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '600',
    paddingHorizontal: 10
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 25,
    borderTopWidth: 1,
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
    marginTop: 15
  },
  backText: { 
    color: '#adb5bd',
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontSize: 12
  }
});

export default IntroScreen;

