import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/MenuScreen.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface RecipesTabProps {
  onRecipesBook?: () => void;
  onPlaySound?: () => void;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
}

const RecipesTab: React.FC<RecipesTabProps> = ({
  onRecipesBook,
  onPlaySound,
  t,
  isFirstTime = false,
  tutorialStep = 0,
}) => {
  const recipesButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
    return () => recipesAnimation.stop();
  }, []);

  return (
    <View style={styles.tabContent}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity
          style={[
            styles.recipeBookSection,
            isFirstTime && tutorialStep === 1 && { opacity: 0.3 }
          ]}
          onPress={() => {
            if (!isFirstTime || tutorialStep !== 1) {
              Vibration.vibrate(50);
              onPlaySound?.();
              if (onRecipesBook) onRecipesBook();
            }
          }}
          activeOpacity={isFirstTime && tutorialStep === 1 ? 1 : 0.9}
          disabled={isFirstTime && tutorialStep === 1}
        >
          <LinearGradient
            colors={['#ff13d9', '#ff99cc']}
            style={styles.arcadeGradient}
          >
            <View style={styles.arcadeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.campaignTitle}>{t.recipes}</Text>
                <Text style={styles.campaignLevelName}>{t.recipes_panel_subtitle}</Text>
              </View>
              <Animated.View style={[{ transform: [{ scale: recipesButtonScale }] }]}>
                <View style={styles.playLevelButton}>
                  <Image source={require('../assets/Iconos/book.png')} style={styles.playLevelIcon} resizeMode="contain" />
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.recipes_panel_description}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RecipesTab;
