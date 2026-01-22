import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/ArcadeIntroScreen.styles';

interface ArcadeIntroScreenProps {
  highScore: number;
  onPlay: () => void;
  onBack: () => void;
  onPlaySound?: () => void;
  t: any;
}

const ArcadeIntroScreen: React.FC<ArcadeIntroScreenProps> = ({ 
  highScore,
  onPlay, 
  onBack,
  onPlaySound,
  t 
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <LinearGradient
        colors={['#ffa94d', '#ff9500']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.card}>
        <Text style={styles.titleBadge}>{t.arcade_title}</Text>
        
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Image 
              source={require('../assets/Iconos/arcade.png')} 
              style={styles.arcadeIcon} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.description}>{t.arcade_intro_desc}</Text>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>{t.record}</Text>
            <View style={styles.recordRow}>
              <Text style={styles.recordValue}>{highScore}</Text>
              <Image
                source={require('../assets/Iconos/coin.png')}
                style={styles.recordCoin}
                resizeMethod="resize"
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButtonInline} onPress={() => { onPlaySound?.(); onBack(); }}>
            <Text style={styles.backTextInline}>{t.back}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButtonInline} onPress={() => { onPlaySound?.(); onPlay(); }}>
            <Text style={styles.buttonText}>{t.cook}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ArcadeIntroScreen;

