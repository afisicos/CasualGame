import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/MenuScreen.styles';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ArcadeTabProps {
  arcadeUnlockedLevel: number;
  arcadeHighScore: number;
  energy: number;
  maxEnergy: number;
  onStartArcade: () => void;
  onWatchAdForEnergy?: () => void;
  onPlaySound?: () => void;
  t: any;
  isFirstTime?: boolean;
  tutorialStep?: number;
}

const ArcadeTab: React.FC<ArcadeTabProps> = ({
  arcadeUnlockedLevel,
  arcadeHighScore,
  energy,
  maxEnergy,
  onStartArcade,
  onWatchAdForEnergy,
  onPlaySound,
  t,
  isFirstTime = false,
  tutorialStep = 0,
}) => {
  const arcadeButtonScale = useRef(new Animated.Value(1)).current;
  const [showEnergyPanel, setShowEnergyPanel] = useState(false);

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
    return () => arcadeAnimation.stop();
  }, []);

  return (
    <View style={styles.tabContent}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity
          style={[
            styles.arcadeSection,
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
            style={styles.arcadeGradient}
          >
            <View style={styles.arcadeHeader}>
              <View style={styles.arcadeTitleContainer}>
                <Text style={styles.arcadeTitle}>{t.arcade_title}</Text>
              </View>

              <View style={styles.arcadeRecordCenter}>
                <Text style={styles.arcadeRecordLabel}>{t.record}</Text>
                <View style={styles.arcadeRecordValueRow}>
                  <Text style={styles.arcadeRecordValue}>{arcadeHighScore}</Text>
                  <Image source={require('../assets/Iconos/coin.png')} style={styles.arcadeRecordCoin} resizeMethod="resize" />
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: arcadeButtonScale }] }}>
                <View style={styles.arcadeButton}>
                  <Image source={require('../assets/Iconos/arcade.png')} style={styles.arcadeIcon} resizeMode="contain" />
                  <View style={styles.costBadge}>
                    <Image source={require('../assets/Iconos/Lighting.png')} style={styles.costEnergyIconImage} resizeMethod="resize" />
                  </View>
                </View>
              </Animated.View>
            </View>
            <Text style={styles.arcadeDescription}>{t.arcade_desc}</Text>
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

export default ArcadeTab;
