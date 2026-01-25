import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch, Modal, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BurgerPiece from './BurgerPiece';
import { PieceType } from '../types';
import { BASE_RECIPES } from '../constants/gameData';
import { styles } from '../styles/IntroScreen.styles';

interface IntroScreenProps {
  levelId: number;
  newIngredient?: PieceType;
  showNewIngredient: boolean;
  newRecipe?: string; // Nombre traducido o clave de traducción
  newRecipeId?: string; // ID de la nueva receta
  recipeIngredients?: PieceType[];
  recipePrice?: number; // Nuevo: Precio de la receta
  description: string;
  targetBurgers?: number; // Para compatibilidad con formato antiguo
  targetRecipes?: { id: string; count: number }[]; // Nuevos objetivos múltiples
  timeLimit: number;
  destructionLimit?: number;
  timeBoostCount: number;
  superTimeBoostCount: number;
  destructionPackCount: number;
  superDestructionPackCount: number;
  inhibitorCount: number;
  useTimeBoost: boolean;
  useSuperTimeBoost: boolean;
  useDestructionPack: boolean;
  useSuperDestructionPack: boolean;
  useInhibitor: boolean;
  inhibitedIngredient: PieceType | null;
  availableIngredients: PieceType[];
  onToggleTimeBoost: (value: boolean) => void;
  onToggleSuperTimeBoost: (value: boolean) => void;
  onToggleDestructionPack: (value: boolean) => void;
  onToggleSuperDestructionPack: (value: boolean) => void;
  onToggleInhibitor: (value: boolean) => void;
  onSelectInhibitedIngredient: (ingredient: PieceType | null) => void;
  onPlay: () => void;
  onBack: () => void;
  onPlaySound?: () => void;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
}

const IntroScreen: React.FC<IntroScreenProps> = ({
  levelId,
  newIngredient,
  destructionLimit,
  showNewIngredient,
  newRecipe,
  newRecipeId,
  recipeIngredients,
  recipePrice,
  description,
  targetBurgers,
  targetRecipes,
  timeLimit,
  timeBoostCount,
  superTimeBoostCount,
  destructionPackCount,
  superDestructionPackCount,
  inhibitorCount,
  useTimeBoost,
  useSuperTimeBoost,
  useDestructionPack,
  useSuperDestructionPack,
  useInhibitor,
  inhibitedIngredient,
  availableIngredients,
  onToggleTimeBoost,
  onToggleSuperTimeBoost,
  onToggleDestructionPack,
  onToggleSuperDestructionPack,
  onToggleInhibitor,
  onSelectInhibitedIngredient,
  onPlay,
  onBack,
  onPlaySound,
  t,
  isFirstTime = false,
  tutorialStep = 0
}) => {
  const insets = useSafeAreaInsets();
  const [showInhibitorModal, setShowInhibitorModal] = useState(false);
  const tutorialPulseAnim = useRef(new Animated.Value(1)).current;

  // Convertir objetivos únicos al formato múltiple para consistencia visual
  const displayTargetRecipes = targetRecipes || (targetBurgers && newRecipeId ? [{ id: newRecipeId, count: targetBurgers }] : []);

  // Animación pulsante para el tutorial
  useEffect(() => {
    if (isFirstTime && tutorialStep === 2) {
      const tutorialAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(tutorialPulseAnim, {
            toValue: 1.08,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(tutorialPulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      tutorialAnimation.start();

      return () => {
        tutorialAnimation.stop();
        tutorialPulseAnim.setValue(1);
      };
    } else {
      tutorialPulseAnim.setValue(1);
    }
  }, [isFirstTime, tutorialStep, tutorialPulseAnim]);

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
                <BurgerPiece type={ing} scale={1.0} gridSize={8} />
              </View>
            ))}
          </View>
        </View>

        {/* ZONA 2: NUEVO INGREDIENTE (CONDICIONAL) */}
        {showNewIngredient && newIngredient && (
          <View style={[styles.section, styles.ingredientSection]}>
            <View style={styles.ingredientRowInline}>
              <Text style={styles.sectionLabel}>{t.new_ingredient}: </Text>
              <Text style={styles.ingredientNameInline}>{t[`ing_${newIngredient}` as keyof typeof t]}</Text>
              <BurgerPiece type={newIngredient} scale={1} />
            </View>
          </View>
        )}
        
        <Text style={styles.description}>{t[description as keyof typeof t] || description}</Text>

        {/* ZONA: REQUERIMIENTOS DE ESTRELLAS */}
        <View style={styles.starsRequirementsSection}>
          <Text style={styles.starsRequirementsTitle}>Objetivos extra</Text>
          <View style={styles.requirementsRow}>
            <View style={styles.requirementItem}>
              <Text style={styles.requirementIcon}>⏱️</Text>
              <Text style={styles.requirementText}>
                Tiempo: {timeLimit}s
              </Text>
              <Text style={styles.requirementDesc}>
                Supera el nivel en menos tiempo
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={styles.requirementIcon}>💥</Text>
              <Text style={styles.requirementText}>
                Eliminaciones: {destructionLimit || 25}
              </Text>
              <Text style={styles.requirementDesc}>
                Supera el nivel con menos eliminaciones de ingredientes
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t.objective}</Text>
            <View style={styles.objectivesContainer}>
              {displayTargetRecipes.map((target, index) => {
                const recipe = BASE_RECIPES.find((r: any) => r.id === target.id);
                return (
                  <View key={target.id} style={styles.objectiveItem}>
                    <Text style={styles.objectiveRecipeName}>
                      {recipe ? (t[recipe.name as keyof typeof t] || recipe.name) : target.id}
                    </Text>
                    <View style={styles.objectiveIngredients}>
                      {recipe?.ingredients.map((ing: any, i: number) => (
                        <View key={i} style={styles.objectiveIngredientIcon}>
                          <BurgerPiece type={ing} scale={0.6} gridSize={8} />
                        </View>
                      ))}
                    </View>
                    <Text style={styles.objectiveCount}>x{target.count}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Power-ups Toggles */}
        {(timeBoostCount > 0 || superTimeBoostCount > 0 || destructionPackCount > 0 || superDestructionPackCount > 0 || inhibitorCount > 0) && (
          <View style={styles.powerUpBar}>
            {superTimeBoostCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Text style={styles.powerUpEmoji}>⏳</Text>
                <Text style={styles.powerUpLabel}>{t.powerup_super_time_name} (+20s)</Text>
                <Switch
                  value={useSuperTimeBoost}
                  onValueChange={(value) => {
                    onPlaySound?.();
                    onToggleSuperTimeBoost(value);
                    if (value) onToggleTimeBoost(false);
                  }}
                  trackColor={{ false: '#adb5bd', true: '#e8590c' }}
                  thumbColor={useSuperTimeBoost ? '#fff' : '#f4f3f4'}
                />
              </View>
            )}
            {timeBoostCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Text style={styles.powerUpEmoji}>⏱️</Text>
                <Text style={styles.powerUpLabel}>{t.powerup_time_name} (+10s)</Text>
                <Switch
                  value={useTimeBoost}
                  onValueChange={(value) => {
                    onPlaySound?.();
                    onToggleTimeBoost(value);
                    if (value) onToggleSuperTimeBoost(false);
                  }}
                  trackColor={{ false: '#adb5bd', true: '#ff922b' }}
                  thumbColor={useTimeBoost ? '#fff' : '#f4f3f4'}
                />
              </View>
            )}
            {superDestructionPackCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Text style={styles.powerUpEmoji}>🔥</Text>
                <Text style={styles.powerUpLabel}>{t.powerup_super_destruction_name}</Text>
                <Switch
                  value={useSuperDestructionPack}
                  onValueChange={(value) => { 
                    onPlaySound?.(); 
                    onToggleSuperDestructionPack(value);
                    if (value) onToggleDestructionPack(false);
                  }}
                  trackColor={{ false: '#adb5bd', true: '#f03e3e' }}
                  thumbColor={useSuperDestructionPack ? '#fff' : '#f4f3f4'}
                />
              </View>
            )}
            {destructionPackCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Image source={require('../assets/Iconos/rubber.png')} style={styles.powerUpIcon} resizeMethod="resize" />
                <Text style={styles.powerUpLabel}>{t.powerup_destruction_name}</Text>
                <Switch
                  value={useDestructionPack}
                  onValueChange={(value) => { 
                    onPlaySound?.(); 
                    onToggleDestructionPack(value);
                    if (value) onToggleSuperDestructionPack(false);
                  }}
                  trackColor={{ false: '#adb5bd', true: '#ff922b' }}
                  thumbColor={useDestructionPack ? '#fff' : '#f4f3f4'}
                />
              </View>
            )}
            {inhibitorCount > 0 && (
              <View style={styles.powerUpToggle}>
                <Image source={require('../assets/Iconos/explosion.png')} style={styles.powerUpIcon} resizeMethod="resize" />
                <Text style={styles.powerUpLabel}>{t.powerup_inhibitor_name}</Text>
                <TouchableOpacity
                  style={[
                    styles.inhibitorButton,
                    useInhibitor && styles.inhibitorButtonActive
                  ]}
                  onPress={() => {
                    onPlaySound?.();
                    if (useInhibitor) {
                      // Si ya está activo, desactivarlo
                      onToggleInhibitor(false);
                      onSelectInhibitedIngredient(null);
                    } else {
                      // Si no está activo, mostrar modal para seleccionar
                      setShowInhibitorModal(true);
                    }
                  }}
                >
                  <Text style={[
                    styles.inhibitorButtonText,
                    useInhibitor && styles.inhibitorButtonTextActive
                  ]}>
                    {useInhibitor ? t.activated : t.activate}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}


        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButtonInline} onPress={() => { onPlaySound?.(); onBack(); }}>
            <Text style={styles.backTextInline}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.playButtonInline,
              isFirstTime && tutorialStep === 2 && {
                borderWidth: 3,
                borderColor: '#FFF',
                shadowColor: '#FFF',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.9,
                shadowRadius: 12,
                elevation: 20,
                transform: [{ scale: tutorialPulseAnim }],
              }
            ]}
            onPress={() => { onPlaySound?.(); onPlay(); }}
          >
            <Text style={styles.buttonText}>{t.cook}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de selección de ingrediente inhibido */}
      <Modal
        visible={showInhibitorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInhibitorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.select_inhibited_ingredient}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  onPlaySound?.();
                  setShowInhibitorModal(false);
                }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.modalDescription}>
                {t.powerup_inhibitor_desc}
              </Text>

              {availableIngredients.length > 0 ? (
              <View style={styles.ingredientGrid}>
                {availableIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient}
                      style={styles.ingredientCard}
                    onPress={() => {
                      onPlaySound?.();
                      onSelectInhibitedIngredient(ingredient);
                      onToggleInhibitor(true);
                      setShowInhibitorModal(false);
                    }}
                    >
                      <View style={styles.ingredientIconContainer}>
                        <BurgerPiece type={ingredient} scale={1.0} />
                      </View>
                      <Text style={styles.ingredientName}>
                        {t[`ing_${ingredient}` as keyof typeof t]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noIngredientsContainer}>
                  <Text style={styles.noIngredientsText}>
                    No hay ingredientes disponibles para inhibir en este nivel
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  onPlaySound?.();
                  setShowInhibitorModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>{t.cancel || 'Cancelar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default IntroScreen;

