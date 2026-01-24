import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameMode, LevelStars } from '../types';
import { BASE_RECIPES } from '../constants/gameData';
import BurgerPiece from './BurgerPiece';
import { styles } from '../styles/ResultScreen.styles';

interface ResultScreenProps {
  gameMode: GameMode;
  money: number;
  targetBurgers: number;
  burgersCreated: number;
  burgerTarget: number;
  arcadeHighScore: number;
  levelNumber?: number;
  recipeProgress?: Record<string, number>;
  levelTargets?: { id: string; count: number }[];
  levelStars?: LevelStars | null;
  onBack: () => void;
  onRetry: () => void;
  onPlaySound?: () => void;
  t: any;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  gameMode,
  money,
  targetBurgers,
  burgersCreated,
  burgerTarget,
  arcadeHighScore,
  levelNumber,
  recipeProgress,
  levelTargets,
  levelStars,
  onBack,
  onRetry,
  onPlaySound,
  t
}) => {
  const isCampaign = gameMode === 'CAMPAIGN';
  const isWin = isCampaign ? burgersCreated >= burgerTarget : false;
  const isNewRecord = !isCampaign && money >= arcadeHighScore && money > 0;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.card}>
        <View style={[styles.statusBadge, { backgroundColor: (isCampaign ? isWin : isNewRecord) ? '#40c057' : '#ff6b6b' }]}>
          <Text style={styles.statusText}>{isCampaign ? (isWin ? '🏆' : '⏰') : (isNewRecord ? '🔥' : '📈')}</Text>
        </View>
        
        <Text style={styles.title}>
          {isCampaign 
            ? (isWin ? t.win_title : t.lose_title) 
            : (isNewRecord ? t.arcade_win : t.arcade_lose)}
        </Text>
        
        <View style={styles.resultBox}>
          {isCampaign ? (
            <>
              <Text style={styles.resultLabel}>{t.level}</Text>
              <Text style={styles.money}>{levelNumber}</Text>
            </>
          ) : (
            <>
              <Text style={styles.resultLabel}>{t.money_earned}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.money}>{money}</Text>
                <Image source={require('../assets/Iconos/coin.png')} style={styles.resultCoin} resizeMethod="resize" />
              </View>
              <View style={styles.recordRow}>
                <Text style={styles.recordLabelSmall}>{t.record}: {arcadeHighScore} </Text>
                <Image source={require('../assets/Iconos/coin.png')} style={styles.recordCoin} resizeMethod="resize" />
              </View>
            </>
          )}
        </View>

        {/* Mostrar estrellas en modo campaña */}
        {isCampaign && levelStars && (
          <View style={styles.starsContainer}>
            <Text style={styles.starsLabel}>ESTRELLAS</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    { opacity: star <= levelStars.stars ? 1 : 0.3 }
                  ]}
                >
                  ⭐
                </Text>
              ))}
            </View>
            <Text style={styles.starsDescription}>
              {levelStars.stars === 3 ? '¡Mención de honor!' :
               levelStars.stars === 2 ? 'Logro especial' : 'Logro básico'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => { onPlaySound?.(); onRetry(); }}>
          <Text style={styles.buttonText}>
            {isCampaign ? (isWin ? t.continue : t.retry) : t.play_again}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => { onPlaySound?.(); onBack(); }}>
          <Text style={styles.backText}>{t.back_menu}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResultScreen;

