import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { styles } from '../styles/ProgressBar.styles';

interface ProgressBarProps {
  current: number;
  max: number;
  type: 'time' | 'destruction';
  label: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  type,
  label,
  color = type === 'time' ? '#FF6B6B' : '#4ECDC4'
}) => {
  // Animación para el parpadeo
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const starOpacityAnim = useRef(new Animated.Value(1)).current;

  // Calcular porcentaje completado
  // Para tiempo: cuanto más tiempo queda, menos llena está la barra (tiempo "gastado")
  // Para eliminaciones: cuanto más eliminaciones usadas, más llena está la barra
  const percentage = type === 'time'
    ? Math.min(Math.max((max - current) / max, 0), 1)  // Tiempo: barra se llena conforme pasa el tiempo
    : Math.min(Math.max(current / max, 0), 1);         // Eliminaciones: barra se llena conforme se usan

  // Determinar si está cerca del límite (80% o más)
  // Para tiempo: cerca del límite cuando queda poco tiempo (barra casi llena)
  // Para eliminaciones: cerca del límite cuando se han usado muchas (barra casi llena)
  const isNearLimit = percentage >= 0.8;
  const isOverLimit = type === 'time'
    ? current <= 0  // Tiempo: sobre límite cuando se acaba el tiempo
    : percentage >= 1.0; // Eliminaciones: sobre límite cuando se alcanza el máximo

  // Determinar color basado en el progreso
  const getBarColor = () => {
    if (isOverLimit) return '#F44336'; // Rojo - límite sobrepasado
    if (isNearLimit) return '#FF9800'; // Naranja - cerca del límite
    return '#4CAF50'; // Verde - buen progreso
  };

  const barColor = getBarColor();

  // No hay parpadeo, mantener siempre opaco
  useEffect(() => {
    blinkAnim.setValue(1);
  }, [blinkAnim]);

  // Efecto para la estrella cuando se sobrepasa el límite
  useEffect(() => {
    if (isOverLimit) {
      Animated.timing(starOpacityAnim, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(starOpacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isOverLimit, starOpacityAnim]);

  // Determinar el texto del label y valor
  const getDisplayText = () => {
    if (type === 'time') {
      if (current <= 0) {
        return { label: 'Tiempo de más', value: '' };
      }
      return { label: label, value: `${Math.floor(current)}s` };
    }
    return { label: label, value: `${current}/${max}` };
  };

  const displayText = getDisplayText();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Animated.Image
            source={require('../assets/Iconos/star.png')}
            style={[styles.star, { opacity: starOpacityAnim }]}
            resizeMode="contain"
          />
          <Text style={styles.label}>{displayText.label}</Text>
        </View>
        {displayText.value ? (
          <Text style={styles.value}>
            {displayText.value}
          </Text>
        ) : null}
      </View>

      <View style={styles.barContainer}>
        <Animated.View style={[styles.barBackground, { opacity: blinkAnim }]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage * 100}%`,
                backgroundColor: barColor,
              }
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default ProgressBar;