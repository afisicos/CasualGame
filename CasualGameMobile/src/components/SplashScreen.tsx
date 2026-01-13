import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/SplashScreen.styles';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Temporizador para salida
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1500); // Reducido a la mitad (1.5s)

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[
        styles.content, 
        { 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }] 
        }
      ]}>
        <View style={styles.logoShadow}>
          <Image 
            source={require('../assets/Iconos/burger.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </View>
        <Text style={styles.titleFood}>FOOD</Text>
        <Text style={styles.titleForFun}>FOR FUN</Text>
        <View style={styles.loader} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

