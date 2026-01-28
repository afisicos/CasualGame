import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../styles/IngredientsShowcase.styles';
import { PieceType } from '../types';
import BurgerPiece from './BurgerPiece';

interface IngredientsShowcaseProps {
  unlockedIngredients: PieceType[];
  t: any;
}

const IngredientsShowcase: React.FC<IngredientsShowcaseProps> = ({
  unlockedIngredients,
  t
}) => {
  // Ordenar ingredientes según el orden de desbloqueo
  const ingredientOrder: PieceType[] = [
    'BREAD',
    'MEAT',
    'TOMATO',
    'CHEESE',
    'LETTUCE',
    'BACON',
    'KETCHUP',
    'ONION',
    'PICKLE',
    'EGG',
    'AVOCADO',
    'JALAPENO',
    'BEETROOT'
  ];

  const sortedIngredients = ingredientOrder.filter(ing => 
    unlockedIngredients.includes(ing)
  );

  const totalIngredients = ingredientOrder.length;
  const unlockedCount = sortedIngredients.length;
  const progressPercentage = totalIngredients > 0 ? (unlockedCount / totalIngredients) * 100 : 0;

  // Asegurar que los valores de traducción sean strings válidos
  const ingredientsLabel = (t && t.ingredients && typeof t.ingredients === 'string') 
    ? t.ingredients.toLowerCase() 
    : 'ingredientes';

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: 'white', marginBottom: 5 }}>
          {String(unlockedCount)}/{String(totalIngredients)} {ingredientsLabel}
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

      {/* Ingredients List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {sortedIngredients.length > 0 ? sortedIngredients.map((ingredient) => {
          if (!ingredient) {
            return <View key={`empty-${Math.random()}`} />;
          }
          
          const ingredientNameValue = t && t[`ing_${ingredient}`] ? t[`ing_${ingredient}`] : ingredient;
          const ingredientName = String(ingredientNameValue || '');
          const ingredientDescriptionValue = t && t[`ing_desc_${ingredient}`] ? t[`ing_desc_${ingredient}`] : '';
          const ingredientDescription = String(ingredientDescriptionValue || '');

          return (
            <View key={String(ingredient)} style={styles.ingredientCard}>
              <View style={styles.ingredientHeader}>
                <View style={styles.iconContainer}>
                  <BurgerPiece type={ingredient} scale={1.5} gridSize={8} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.ingredientName}>{ingredientName}</Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{ingredientDescription}</Text>
              </View>
            </View>
          );
        }) : (
          <View />
        )}
      </ScrollView>
    </View>
  );
};

export default IngredientsShowcase;
