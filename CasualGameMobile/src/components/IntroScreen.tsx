import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BurgerPiece from './BurgerPiece';
import { PieceType } from '../types';
import { styles } from '../styles/IntroScreen.styles';

interface IntroScreenProps {
  levelId: number;
  newIngredient?: PieceType;
  showNewIngredient: boolean;
  newRecipe?: string; // Nombre traducido o clave de traducción
  recipeIngredients?: PieceType[];
  recipePrice?: number; // Nuevo: Precio de la receta
  description: string;
  targetMoney: number;
  timeLimit: number;
  timeBoostCount: number;
  destructionPackCount: number;
  useTimeBoost: boolean;
  useDestructionPack: boolean;
  onToggleTimeBoost: (value: boolean) => void;
  onToggleDestructionPack: (value: boolean) => void;
  onPlay: () => void;
  onBack: () => void;
  onPlaySound?: () => void;
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
  timeBoostCount,
  destructionPackCount,
  useTimeBoost,
  useDestructionPack,
  onToggleTimeBoost,
  onToggleDestructionPack,
  onPlay, 
  onBack,
  onPlaySound,
  t 
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <LinearGradient
        colors={['#f39c12', '#e67e22']}
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
                <Text style={styles.pricePillText}>{recipePrice}</Text>
                <Image source={require('../assets/Iconos/coin.png')} style={styles.pillCoin} resizeMethod="resize" />
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
        {showNewIngredient && newIngredient && (
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.statValue}>{recipePrice ? Math.floor(targetMoney / recipePrice) : targetMoney}</Text>
              <Image source={require('../assets/Iconos/burger.png')} style={styles.statCoin} resizeMethod="resize" />
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t.time}</Text>
            <Text style={styles.statValue}>{timeLimit}s</Text>
          </View>
        </View>

        {/* Power-ups Toggles */}
        {(timeBoostCount > 0 || destructionPackCount > 0) && (
          <View style={styles.powerUpBar}>
            {timeBoostCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Text style={styles.powerUpEmoji}>⏱️</Text>
                <Text style={styles.powerUpLabel}>{t.powerup_time_name}</Text>
                <Switch
                  value={useTimeBoost}
                  onValueChange={(value) => { onPlaySound?.(); onToggleTimeBoost(value); }}
                  trackColor={{ false: '#adb5bd', true: '#ff922b' }}
                  thumbColor={useTimeBoost ? '#fff' : '#f4f3f4'}
                />
              </View>
            )}
            {destructionPackCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Text style={styles.powerUpEmoji}>💥</Text>
                <Text style={styles.powerUpLabel}>{t.powerup_destruction_name}</Text>
                <Switch
                  value={useDestructionPack}
                  onValueChange={(value) => { onPlaySound?.(); onToggleDestructionPack(value); }}
                  trackColor={{ false: '#adb5bd', true: '#ff922b' }}
                  thumbColor={useDestructionPack ? '#fff' : '#f4f3f4'}
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButtonInline} onPress={() => { onPlaySound?.(); onBack(); }}>
            <Text style={styles.backTextInline}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButtonInline} onPress={() => { onPlaySound?.(); onPlay(); }}>
            <Text style={styles.buttonText}>{t.cook}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default IntroScreen;

