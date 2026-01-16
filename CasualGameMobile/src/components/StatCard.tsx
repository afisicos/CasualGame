import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { styles } from '../styles/StatCard.styles';

interface StatCardProps {
  label?: string;
  value: string | number;
  type: 'time' | 'money' | 'record' | 'destruction' | 'burgers';
  isLowTime?: boolean;
  isVeryLowTime?: boolean;
  shouldBlink?: boolean;
  flex?: number;
  verticalLayout?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, type, isLowTime, isVeryLowTime, shouldBlink = false, flex = 1, verticalLayout = false }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const blinkAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (shouldBlink) {
      // Animación de crecimiento rápido (flash)
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldBlink, value]);

  React.useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isLowTime || isVeryLowTime) {
      // Animación de parpadeo continuo
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.4,
            duration: isVeryLowTime ? 250 : 400,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: isVeryLowTime ? 250 : 400,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      blinkAnim.setValue(1);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isLowTime, isVeryLowTime]);

  React.useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isVeryLowTime) {
      // Animación de pulso continuo (agrandarse y empequeñecerse)
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isVeryLowTime]);

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
      case 'destruction': return require('../assets/Iconos/rubber.png');
      case 'burgers': return require('../assets/Iconos/burger.png');
      default: return null;
    }
  };

  return (
    <View style={[
      styles.card, 
      { flex },
      verticalLayout && styles.cardVertical
    ]}>
      <Animated.View style={[
        (type === 'money' || type === 'burgers') ? styles.moneyIconContainer : styles.iconContainer,
        verticalLayout && styles.iconContainerVertical,
        { 
          opacity: (type === 'time' && (isLowTime || isVeryLowTime)) ? blinkAnim : 1,
          transform: [
            { scale: scaleAnim },
            { scale: (type === 'time' && isVeryLowTime) ? pulseAnim : 1 }
          ] 
        }
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
            { 
              opacity: blinkAnim,
              transform: [{ scale: scaleAnim }] 
            }
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
