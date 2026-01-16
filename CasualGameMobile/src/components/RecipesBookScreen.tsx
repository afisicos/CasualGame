import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/RecipesBookScreen.styles';
import { BASE_RECIPES } from '../constants/gameData';
import BurgerPiece from './BurgerPiece';

interface RecipesBookScreenProps {
  discoveredRecipes: string[];
  unlockedRecipes: string[];
  onPlaySound?: () => void;
  t: any;
}

const RecipesBookScreen: React.FC<RecipesBookScreenProps> = ({
  discoveredRecipes,
  unlockedRecipes,
  onPlaySound,
  t
}) => {
  // Filtrar solo las recetas desbloqueadas y descubiertas
  const availableRecipes = BASE_RECIPES.filter(recipe =>
    unlockedRecipes.includes(recipe.id) || (recipe.isSecret && discoveredRecipes.includes(recipe.id))
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.recipes}</Text>
      </View>

      {/* Recipes Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.recipesGrid}>
          {availableRecipes.map((recipe) => {
            const isDiscovered = !recipe.isSecret || discoveredRecipes.includes(recipe.id);
            return (
              <View
                key={recipe.id}
                style={styles.recipeCard}
              >
                <View style={styles.recipeTitleContainer}>
                  <View style={styles.recipeTitleBox}>
                    <Text style={styles.recipeName} numberOfLines={2}>
                      {isDiscovered ? t[recipe.name as keyof typeof t] || recipe.name : '???'}
                    </Text>
                    {isDiscovered && (
                      <View style={styles.recipePriceContainer}>
                        <Text style={styles.recipePrice}>{recipe.price}</Text>
                        <Image source={require('../assets/Iconos/coin.png')} style={styles.recipeCoin} resizeMode="contain" />
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.recipeIngredients}>
                  {isDiscovered ? (
                    recipe.ingredients.slice(0, 6).map((ing, idx) => (
                      <BurgerPiece key={idx} type={ing} scale={1.2} gridSize={8} />
                    ))
                  ) : (
                    <Text style={styles.secretText}>?</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipesBookScreen;
