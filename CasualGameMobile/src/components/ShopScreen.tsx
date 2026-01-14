import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/ShopScreen.styles';

interface ShopScreenProps {
  globalMoney: number;
  timeBoostCount: number;
  destructionPackCount: number;
  onBuyTimeBoost: () => void;
  onBuyDestructionPack: () => void;
  onBack: () => void;
  onPlaySound?: () => void;
  t: any;
}

const ShopScreen: React.FC<ShopScreenProps> = ({
  globalMoney,
  timeBoostCount,
  destructionPackCount,
  onBuyTimeBoost,
  onBuyDestructionPack,
  onBack,
  onPlaySound,
  t
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>{t.shop_title}</Text>
      </View>

      <View style={styles.moneyDisplay}>
        <Text style={styles.moneyLabel}>{t.money}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.moneyValue}>{globalMoney}</Text>
          <Image source={require('../assets/Iconos/coin.png')} style={styles.headerCoin} resizeMethod="resize" />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Time Boost */}
        <View style={styles.powerUpCard}>
          <View style={styles.powerUpHeader}>
            <Text style={styles.powerUpEmoji}>⏱️</Text>
            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpName}>{t.powerup_time_name}</Text>
              <Text style={styles.powerUpDesc}>{t.powerup_time_desc}</Text>
            </View>
          </View>
          <View style={styles.powerUpFooter}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{t.owned}: {timeBoostCount}</Text>
            </View>
            <TouchableOpacity
              style={[styles.buyButton, globalMoney < 50 && styles.buyButtonDisabled]}
              onPress={() => { onPlaySound?.(); onBuyTimeBoost(); }}
              disabled={globalMoney < 50}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.buyButtonText}>50</Text>
                <Image source={require('../assets/Iconos/coin.png')} style={styles.buyBtnCoin} resizeMethod="resize" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Destruction Pack */}
        <View style={styles.powerUpCard}>
          <View style={styles.powerUpHeader}>
            <Text style={styles.powerUpEmoji}>💥</Text>
            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpName}>{t.powerup_destruction_name}</Text>
              <Text style={styles.powerUpDesc}>{t.powerup_destruction_desc}</Text>
            </View>
          </View>
          <View style={styles.powerUpFooter}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{t.owned}: {destructionPackCount}</Text>
            </View>
            <TouchableOpacity
              style={[styles.buyButton, globalMoney < 100 && styles.buyButtonDisabled]}
              onPress={() => { onPlaySound?.(); onBuyDestructionPack(); }}
              disabled={globalMoney < 100}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.buyButtonText}>100</Text>
                <Image source={require('../assets/Iconos/coin.png')} style={styles.buyBtnCoin} resizeMethod="resize" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopScreen;

