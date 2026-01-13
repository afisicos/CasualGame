import React, { useEffect, useRef } from 'react';
import { Image, Dimensions, Animated } from 'react-native';
import { PieceType } from '../types';
import { styles } from '../styles/BurgerPiece.styles';

const { width } = Dimensions.get('window');
const BOARD_PADDING = 10;
const BOARD_SIZE = width * 0.95;

interface BurgerPieceProps {
  type: PieceType;
  scale?: number;
  gridSize?: number;
  isRemoving?: boolean;
}

const BurgerPiece: React.FC<BurgerPieceProps> = ({ type, scale = 1, gridSize = 7, isRemoving = false }) => {
  const cellSize = (BOARD_SIZE - (BOARD_PADDING * 2)) / gridSize;
  const multiplier = gridSize >= 6 ? 1.0 : 0.9;
  const imageSize = cellSize * multiplier;

  const opacity = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRemoving) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [isRemoving]);

  const getImage = () => {
    switch (type) {
      case 'BREAD': return require('../assets/Ingredientes/bread.png');
      case 'MEAT': return require('../assets/Ingredientes/meat.png');
      case 'CHEESE': return require('../assets/Ingredientes/cheese.png');
      case 'LETTUCE': return require('../assets/Ingredientes/lettuce.png');
      case 'TOMATO': return require('../assets/Ingredientes/tomato.png');
      case 'BACON': return require('../assets/Ingredientes/bacon.png');
      case 'KETCHUP': return require('../assets/Ingredientes/ketchup.png');
      case 'PICKLE': return require('../assets/Ingredientes/pickle.png');
      case 'ONION': return require('../assets/Ingredientes/onion.png');
      default: return null;
    }
  };

  return (
    <Animated.View style={[
      styles.container, 
      { 
        width: cellSize, 
        height: cellSize, 
        opacity: opacity,
        transform: [
          { scale: scale },
          { scale: scaleAnim }
        ] 
      }
    ]}>
      <Image 
        source={getImage()} 
        style={{ width: imageSize, height: imageSize }} 
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default BurgerPiece;
