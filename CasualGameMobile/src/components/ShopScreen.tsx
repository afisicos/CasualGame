import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/ShopScreen.styles';

interface ShopScreenProps {
  globalMoney: number;
  energy: number;
  maxEnergy: number;
  timeBoostCount: number;
  superTimeBoostCount: number;
  destructionPackCount: number;
  superDestructionPackCount: number;
  onBuyTimeBoost: () => void;
  onBuySuperTimeBoost: () => void;
  onBuyDestructionPack: () => void;
  onBuySuperDestructionPack: () => void;
  onBuyEnergy: () => void;
  onPlaySound?: () => void;
  t: any;
}

const ShopScreen: React.FC<ShopScreenProps> = ({
  globalMoney,
  energy,
  maxEnergy,
  timeBoostCount,
  superTimeBoostCount,
  destructionPackCount,
  superDestructionPackCount,
  onBuyTimeBoost,
  onBuySuperTimeBoost,
  onBuyDestructionPack,
  onBuySuperDestructionPack,
  onBuyEnergy,
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
        {/* Energy Refill */}
        <View style={styles.powerUpCard}>
          <View style={styles.powerUpHeader}>
            <Text style={styles.powerUpEmoji}>⚡</Text>
            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpName}>{t.shop_energy_name}</Text>
              <Text style={styles.powerUpDesc}>{t.shop_energy_desc}</Text>
            </View>
          </View>
          <View style={styles.powerUpFooter}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>⚡ {energy}/{maxEnergy}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buyButton, 
                (globalMoney < 100 || energy >= maxEnergy) && styles.buyButtonDisabled
              ]}
              onPress={() => { onPlaySound?.(); onBuyEnergy(); }}
              disabled={globalMoney < 100 || energy >= maxEnergy}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.buyButtonText}>100</Text>
                <Image source={require('../assets/Iconos/coin.png')} style={styles.buyBtnCoin} resizeMethod="resize" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Super Time Boost */}
        <View style={styles.powerUpCard}>
          <View style={styles.powerUpHeader}>
            <Text style={styles.powerUpEmoji}>⏳</Text>
            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpName}>{t.powerup_super_time_name}</Text>
              <Text style={styles.powerUpDesc}>{t.powerup_super_time_desc}</Text>
            </View>
          </View>
          <View style={styles.powerUpFooter}>
            <View style={[styles.countBadge, { backgroundColor: '#fff4e6' }]}>
              <Text style={[styles.countText, { color: '#d9480f' }]}>{t.owned}: {superTimeBoostCount}</Text>
            </View>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: '#e8590c' }, globalMoney < 150 && styles.buyButtonDisabled]}
              onPress={() => { onPlaySound?.(); onBuySuperTimeBoost(); }}
              disabled={globalMoney < 150}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.buyButtonText}>150</Text>
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

        {/* Super Destruction Pack */}
        <View style={styles.powerUpCard}>
          <View style={styles.powerUpHeader}>
            <Text style={styles.powerUpEmoji}>🔥</Text>
            <View style={styles.powerUpInfo}>
              <Text style={styles.powerUpName}>{t.powerup_super_destruction_name}</Text>
              <Text style={styles.powerUpDesc}>{t.powerup_super_destruction_desc}</Text>
            </View>
          </View>
          <View style={styles.powerUpFooter}>
            <View style={[styles.countBadge, { backgroundColor: '#fff5f5' }]}>
              <Text style={[styles.countText, { color: '#c92a2a' }]}>{t.owned}: {superDestructionPackCount}</Text>
            </View>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: '#f03e3e' }, globalMoney < 250 && styles.buyButtonDisabled]}
              onPress={() => { onPlaySound?.(); onBuySuperDestructionPack(); }}
              disabled={globalMoney < 250}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.buyButtonText}>250</Text>
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

