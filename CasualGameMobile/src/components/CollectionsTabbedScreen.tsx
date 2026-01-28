import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/CollectionsTabbedScreen.styles';
import { BASE_RECIPES, getUnlockedIngredientsForCampaign } from '../constants/gameData';
import { PieceType } from '../types';
import BurgerPiece from './BurgerPiece';

interface CollectionsTabbedScreenProps {
  // Props para Arcade
  arcadeUnlockedLevel: number;
  arcadeHighScore: number;
  energy: number;
  maxEnergy: number;
  onStartArcade: () => void;
  onWatchAdForEnergy?: () => void;
  
  // Props para Recetas
  discoveredRecipes: string[];
  unlockedRecipes: string[];
  onRecipesBook?: () => void;
  
  // Props para Ingredientes
  unlockedLevel: number;
  onIngredientsBook?: () => void;
  
  // Props comunes
  onPlaySound?: () => void;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
}

const CollectionsTabbedScreen: React.FC<CollectionsTabbedScreenProps> = ({
  arcadeUnlockedLevel,
  arcadeHighScore,
  energy,
  maxEnergy,
  onStartArcade,
  onWatchAdForEnergy,
  discoveredRecipes,
  unlockedRecipes,
  onRecipesBook,
  unlockedLevel,
  onIngredientsBook,
  onPlaySound,
  t,
  isFirstTime = false,
  tutorialStep = 0,
}) => {
  const [showEnergyPanel, setShowEnergyPanel] = useState(false);

  // Animaciones
  const arcadeButtonScale = useRef(new Animated.Value(1)).current;
  const recipesButtonScale = useRef(new Animated.Value(1)).current;
  const ingredientsButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const arcadeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(arcadeButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(arcadeButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    arcadeAnimation.start();

    const recipesAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(recipesButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(recipesButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    recipesAnimation.start();

    const ingredientsAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(ingredientsButtonScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(ingredientsButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    ingredientsAnimation.start();

    return () => {
      arcadeAnimation.stop();
      recipesAnimation.stop();
      ingredientsAnimation.stop();
    };
  }, []);

  // Filtrar solo las recetas completamente descubiertas
  const availableRecipes = BASE_RECIPES.filter(recipe =>
    discoveredRecipes.includes(recipe.id)
  );

  // Calcular progreso de recetas
  const totalRecipes = BASE_RECIPES.length;
  const unlockedCount = availableRecipes.length;
  const recipesProgressPercentage = totalRecipes > 0 ? (unlockedCount / totalRecipes) * 100 : 0;

  // Obtener ingredientes desbloqueados
  const unlockedIngredientsData = getUnlockedIngredientsForCampaign(unlockedLevel);
  const unlockedIngredients: PieceType[] = unlockedIngredientsData.map(ing => ing.type);

  // Ordenar ingredientes
  const ingredientOrder: PieceType[] = [
    'BREAD', 'MEAT', 'TOMATO', 'CHEESE', 'LETTUCE', 'BACON', 'KETCHUP',
    'ONION', 'PICKLE', 'EGG', 'AVOCADO', 'JALAPENO', 'BEETROOT'
  ];

  const sortedIngredients = ingredientOrder.filter(ing => 
    unlockedIngredients.includes(ing)
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Panel 1: Arcade */}
        <TouchableOpacity
          style={[
            styles.panelSection,
            isFirstTime && tutorialStep === 1 && { opacity: 0.3 }
          ]}
          onPress={() => {
            if (!isFirstTime || tutorialStep !== 1) {
              onPlaySound?.();
              if (energy > 0) {
                onStartArcade();
              } else {
                setShowEnergyPanel(true);
              }
            }
          }}
          activeOpacity={isFirstTime && tutorialStep === 1 ? 1 : 0.8}
          disabled={isFirstTime && tutorialStep === 1}
        >
          <LinearGradient
            colors={['#ff6033', '#ff8800']}
            style={styles.panelGradient}
          >
            <View style={styles.panelHeader}>
              <View style={styles.panelTitleContainer}>
                <Text style={styles.panelTitle}>{t.arcade_title}</Text>
              </View>

              <View style={styles.arcadeRecordCenter}>
                <Text style={styles.arcadeRecordLabel}>{t.record}</Text>
                <View style={styles.arcadeRecordValueRow}>
                  <Text style={styles.arcadeRecordValue}>{arcadeHighScore}</Text>
                  <Image source={require('../assets/Iconos/coin.png')} style={styles.arcadeRecordCoin} resizeMethod="resize" />
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: arcadeButtonScale }] }}>
                <View style={styles.playButton}>
                  <Image source={require('../assets/Iconos/arcade.png')} style={styles.playIcon} resizeMode="contain" />
                  <View style={styles.costBadge}>
                    <Image source={require('../assets/Iconos/Lighting.png')} style={styles.costEnergyIconImage} resizeMethod="resize" />
                  </View>
                </View>
              </Animated.View>
            </View>
            <Text style={styles.panelDescription}>{t.arcade_desc}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Panel 2: Recetas */}
        <TouchableOpacity
          style={styles.panelSection}
          onPress={() => {
            onPlaySound?.();
            if (onRecipesBook) onRecipesBook();
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#ff13d9', '#ff99cc']}
            style={styles.panelGradient}
          >
            <View style={styles.panelHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.panelTitle}>{t.recipes}</Text>
                <Text style={styles.panelSubtitle}>
                  {String(unlockedCount)}/{String(totalRecipes)} {t.recipes?.toLowerCase() || 'recetas'}
                </Text>
              </View>
              <Animated.View style={{ transform: [{ scale: recipesButtonScale }] }}>
                <View style={styles.playButton}>
                  <Image source={require('../assets/Iconos/book.png')} style={styles.playIcon} resizeMode="contain" />
                </View>
              </Animated.View>
            </View>
            <Text style={styles.panelDescription}>{t.recipes_panel_description}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Panel 3: Ingredientes */}
        <TouchableOpacity
          style={styles.panelSection}
          onPress={() => {
            onPlaySound?.();
            if (onIngredientsBook) onIngredientsBook();
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#4CAF50', '#8BC34A']}
            style={styles.panelGradient}
          >
            <View style={styles.panelHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.panelTitle}>{t.ingredients || 'INGREDIENTES'}</Text>
                <Text style={styles.panelSubtitle}>
                  {String(sortedIngredients.length)}/{String(ingredientOrder.length)} {t.ingredients?.toLowerCase() || 'ingredientes'}
                </Text>
              </View>
              <Animated.View style={{ transform: [{ scale: ingredientsButtonScale }] }}>
                <View style={styles.playButton}>
                  <Image source={require('../assets/Iconos/book.png')} style={styles.playIcon} resizeMode="contain" />
                </View>
              </Animated.View>
            </View>
            <Text style={styles.panelDescription}>{t.ingredients_panel_description || 'Descubre la historia y características de cada ingrediente'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Panel flotante para recuperar energía */}
      {showEnergyPanel && (
        <View style={styles.energyPanelOverlay}>
          <View style={styles.energyPanel}>
            <Text style={styles.energyPanelTitle}>{t.energy_panel_title}</Text>
            <Text style={styles.energyPanelMessage}>
              {t.energy_panel_message}
            </Text>
            <View style={styles.energyPanelButtons}>
              <TouchableOpacity
                style={[styles.energyPanelButton, styles.energyPanelCancel]}
                onPress={() => {
                  onPlaySound?.();
                  setShowEnergyPanel(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.energyPanelCancelText}>{t.energy_panel_cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.energyPanelButton, styles.energyPanelWatch]}
                onPress={() => {
                  onPlaySound?.();
                  setShowEnergyPanel(false);
                  if (onWatchAdForEnergy) onWatchAdForEnergy();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.energyPanelWatchText}>{t.energy_panel_watch}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CollectionsTabbedScreen;
