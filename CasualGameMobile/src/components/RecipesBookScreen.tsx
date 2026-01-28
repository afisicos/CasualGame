import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/RecipesBookScreen.styles';
import { BASE_RECIPES } from '../constants/gameData';
import BurgerPiece from './BurgerPiece';

interface RecipesBookScreenProps {
  discoveredRecipes: string[];
  unlockedRecipes: string[];
  onBack: () => void;
  onPlaySound?: () => void;
  t: any;
}

const RecipesBookScreen: React.FC<RecipesBookScreenProps> = ({
  discoveredRecipes,
  unlockedRecipes,
  onBack,
  onPlaySound,
  t
}) => {
  // Filtrar solo las recetas completamente descubiertas
  const availableRecipes = BASE_RECIPES.filter(recipe =>
    discoveredRecipes.includes(recipe.id)
  );

  // Calcular progreso de recetas
  const totalRecipes = BASE_RECIPES.length;
  const unlockedCount = availableRecipes.length;
  const progressPercentage = totalRecipes > 0 ? (unlockedCount / totalRecipes) * 100 : 0;

  // Asegurar que los valores de traducción sean strings válidos
  const recipesLabel = (t && t.recipes && typeof t.recipes === 'string') 
    ? t.recipes.toLowerCase() 
    : 'recetas';
  const recipesTitle = (t && t.recipes) ? String(t.recipes) : 'RECETAS';

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
          <Text style={styles.title}>{recipesTitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: 'white', marginBottom: 5 }}>
          {String(unlockedCount)}/{String(totalRecipes)} {recipesLabel}
        </Text>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
      </View>

      {/* Recipes Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.recipesGrid}>
          {availableRecipes.length > 0 ? availableRecipes.map((recipe) => {
            if (!recipe || !recipe.id) {
              return <View key={`empty-${Math.random()}`} />;
            }
            
            const isDiscovered = discoveredRecipes.includes(recipe.id);
            const recipeNameValue = isDiscovered && t && t[recipe.name as keyof typeof t] 
              ? t[recipe.name as keyof typeof t] 
              : (isDiscovered ? recipe.name : '???');
            const recipeName = String(recipeNameValue || '');
            const recipePrice = recipe.price ? Number(recipe.price) : 0;

            return (
              <View
                key={String(recipe.id)}
                style={styles.recipeCard}
              >
                <View style={styles.recipeTitleContainer}>
                  <View style={styles.recipeTitleBox}>
                    <Text style={styles.recipeName} numberOfLines={2}>
                      {recipeName}
                    </Text>
                    {isDiscovered ? (
                      <View style={styles.recipePriceContainer}>
                        <Text style={styles.recipePrice}>{String(recipePrice)}</Text>
                        <Image source={require('../assets/Iconos/coin.png')} style={styles.recipeCoin} resizeMode="contain" />
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={styles.recipeIngredients}>
                  {isDiscovered && recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.slice(0, 6).map((ing, idx) => {
                      if (!ing) return null;
                      return <BurgerPiece key={`${recipe.id}-${idx}`} type={ing} scale={1.2} gridSize={8} />;
                    })
                  ) : (
                    <Text style={styles.secretText}>?</Text>
                  )}
                </View>
              </View>
            );
          }) : (
            <View />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipesBookScreen;
