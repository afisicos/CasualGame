import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { DailyAchievement, PieceType } from '../types';
import { INGREDIENT_IMAGES } from '../constants/gameData';
import { styles } from '../styles/DailyAchievementsTab.styles';

interface DailyAchievementsTabProps {
  achievements: DailyAchievement[];
  onClaimReward: (achievementId: string) => void;
  onPlaySound?: () => void;
  t: any;
}

const DailyAchievementsTab: React.FC<DailyAchievementsTabProps> = ({
  achievements,
  onClaimReward,
  onPlaySound,
  t,
}) => {
  const getAchievementDescription = (achievement: DailyAchievement) => {
    let desc = t[achievement.description] || achievement.description;
    desc = desc.replace('{target}', achievement.target.toString());
    if (achievement.ingredient) {
      const ingName = t[`ing_${achievement.ingredient}`] || achievement.ingredient;
      desc = desc.replace('{ingredient}', ingName);
    }
    return desc;
  };

  const getAchievementIcon = (achievement: DailyAchievement) => {
    if (achievement.ingredient) {
      return INGREDIENT_IMAGES[achievement.ingredient];
    }
    if (achievement.type === 'CREATE_BURGER') {
      return require('../assets/Iconos/burger.png');
    }
    return require('../assets/Iconos/star.png');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t.daily_achievements}</Text>
        
        {achievements.map((achievement) => {
          const progress = Math.min(1, achievement.current / achievement.target);
          const isCompleted = achievement.current >= achievement.target;
          
          return (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Image source={getAchievementIcon(achievement)} style={styles.achievementIcon} resizeMode="contain" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.achievementDescription}>
                    {getAchievementDescription(achievement)}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.current} / {achievement.target}
                  </Text>
                </View>
              </View>

              <View style={styles.rewardContainer}>
                <View style={styles.rewardTextContainer}>
                  <Text style={styles.rewardLabel}>Recompensa:</Text>
                  <Text style={styles.rewardValue}>{achievement.reward}</Text>
                  <Image source={require('../assets/Iconos/coin.png')} style={styles.rewardIcon} />
                </View>

                {achievement.claimed ? (
                  <View style={styles.claimedContainer}>
                    <Text style={styles.claimedText}>{t.claimed}</Text>
                    <Image source={require('../assets/Iconos/star.png')} style={styles.checkIcon} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.claimButton, !isCompleted && styles.claimButtonDisabled]}
                    onPress={() => {
                      if (isCompleted) {
                        onPlaySound?.();
                        onClaimReward(achievement.id);
                      }
                    }}
                    disabled={!isCompleted}
                  >
                    <Text style={styles.claimButtonText}>{t.claim_reward}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DailyAchievementsTab;
