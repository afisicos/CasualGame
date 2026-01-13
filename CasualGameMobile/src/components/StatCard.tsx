import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { styles } from '../styles/StatCard.styles';

interface StatCardProps {
  label?: string;
  value: string | number;
  type: 'time' | 'money' | 'record' | 'destruction' | 'burgers';
  isLowTime?: boolean;
  shouldBlink?: boolean;
  flex?: number;
  verticalLayout?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, type, isLowTime, shouldBlink = false, flex = 1, verticalLayout = false }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (shouldBlink) {
      // Animación de crecimiento rápido: crece a 1.4 y vuelve a 1 en 300ms total
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [shouldBlink]);
  const borderColors = {
    time: '#e74c3c',
    money: '#27ae60',
    record: '#fcc419',
    destruction: '#ff6b6b',
    burgers: '#8b4513',
  };

  const getIcon = () => {
    switch (type) {
      case 'time': return require('../assets/Iconos/time.png');
      case 'money': return require('../assets/Iconos/coin.png');
      case 'record': return require('../assets/Iconos/arcade.png');
      case 'destruction': return '💥'; // Emoji de explosión como en la tienda
      case 'burgers': return require('../assets/Iconos/burger.png');
      default: return null;
    }
  };

  return (
    <View style={[
      styles.card, 
      { borderLeftColor: borderColors[type], flex },
      verticalLayout && styles.cardVertical
    ]}>
      <Animated.View style={[
        (type === 'money' || type === 'burgers') ? styles.moneyIconContainer : styles.iconContainer,
        verticalLayout && styles.iconContainerVertical,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        {typeof getIcon() === 'string' ? (
          <Text style={[styles.iconImage, { fontSize: verticalLayout ? 18 : 20 }]}>{getIcon()}</Text>
        ) : (
          <Image source={getIcon()} style={styles.iconImage} resizeMode="contain" resizeMethod="resize" />
        )}
      </Animated.View>
      <View style={[styles.content, verticalLayout && styles.contentVertical]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Animated.Text
          style={[
            verticalLayout 
              ? ((type === 'money' || type === 'burgers') ? styles.moneyValueVertical : styles.valueVertical)
              : ((type === 'money' || type === 'burgers') ? styles.moneyValue : styles.value),
            isLowTime && styles.lowTimeValue,
            { transform: [{ scale: scaleAnim }] }
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {value}
        </Animated.Text>
      </View>
    </View>
  );
};

export default StatCard;
