import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar, StyleSheet, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/SplashScreen.styles';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generamos una lista más amplia de ingredientes con configuraciones únicas
const INGREDIENT_ASSETS = [
  require('../assets/Ingredientes/bread.png'),
  require('../assets/Ingredientes/meat.png'),
  require('../assets/Ingredientes/cheese.png'),
  require('../assets/Ingredientes/lettuce.png'),
  require('../assets/Ingredientes/tomato.png'),
  require('../assets/Ingredientes/bacon.png'),
  require('../assets/Ingredientes/pickle.png'),
  require('../assets/Ingredientes/onion.png'),
  require('../assets/Ingredientes/ketchup.png'),
];

// Creamos 180 ingredientes para que la lluvia sea extremadamente densa y constante
const fallingItems = Array.from({ length: 180 }).map((_, i) => ({
  id: i,
  source: INGREDIENT_ASSETS[i % INGREDIENT_ASSETS.length],
  // Posición horizontal repartida aleatoriamente en píxeles
  left: Math.random() * SCREEN_WIDTH,
  // Duraciones variadas para romper la sincronía
  duration: 2500 + Math.random() * 2000,
  // Duración de la rotación (giro sobre sí mismo)
  rotateDuration: 3000 + Math.random() * 3000,
  // POSICIÓN INICIAL: Fuera de la pantalla arriba, escalonada
  // Reducimos el escalonado para que la densidad sea mayor en la entrada
  startY: -200 - (i * 35), 
  // Más variedad de tamaños para mayor profundidad
  size: i % 4 === 0 ? 35 : (i % 3 === 0 ? 55 : 75),
  // Opacidades variadas entre 0.2 y 0.9
  opacity: 0.2 + Math.random() * 0.7,
  zIndex: i % 4 === 0 ? 0 : 1,
}));

const AnimatedIngredient: React.FC<{ item: typeof fallingItems[0] }> = ({ item }) => {
  const translateY = useRef(new Animated.Value(item.startY)).current;
  // Empezamos en un ángulo aleatorio
  const rotate = useRef(new Animated.Value(Math.random())).current;

  useEffect(() => {
    // Rotación infinita REALMENTE fluida:
    // En lugar de un loop que resetea a 0, hacemos una animación que 
    // incrementa el valor continuamente. La interpolación se encarga del resto.
    const runRotation = (currentVal: number) => {
      Animated.timing(rotate, {
        toValue: currentVal + 1,
        duration: item.rotateDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          runRotation(currentVal + 1);
        }
      });
    };

    // Lógica de caída infinita asincrónica
    const runFall = (isFirstRun: boolean) => {
      const targetY = SCREEN_HEIGHT + 200;
      const startPos = isFirstRun ? item.startY : -200;
      const distance = targetY - startPos;
      const totalCycleDistance = targetY + 200;
      const currentDuration = (distance / totalCycleDistance) * item.duration;

      Animated.timing(translateY, {
        toValue: targetY,
        duration: currentDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          translateY.setValue(-200);
          runFall(false);
        }
      });
    };

    runRotation(0);
    runFall(true);

    return () => {
      translateY.stopAnimation();
      rotate.stopAnimation();
    };
  }, [item]);

  // La interpolación 'extend' permite que el giro sea infinito sin saltos
  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    position: 'absolute' as const,
    left: item.left,
    transform: [
      { translateY },
      { rotate: rotation }
    ],
    opacity: item.opacity,
    zIndex: item.zIndex,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Image source={item.source} style={{ width: item.size, height: item.size }} resizeMode="contain" />
    </Animated.View>
  );
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateYAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    // Entrada del título
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(translateYAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Salida
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        onFinish();
      });
    }, 3000); // 3 segundos para que se vea bien la lluvia

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={['#FF9966', '#FF5E62']} style={StyleSheet.absoluteFill} />
      
      {/* Lluvia constante de ingredientes */}
      {fallingItems.map((item) => (
        <AnimatedIngredient key={item.id} item={item} />
      ))}

      {/* Título centrado */}
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          zIndex: 10,
        }
      ]}>
        <Image source={require('../assets/Iconos/CetroAlce.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titleFood}>BURGER</Text>
        <Text style={styles.titleForFun}>MATCH</Text>
        <View style={styles.loader} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
