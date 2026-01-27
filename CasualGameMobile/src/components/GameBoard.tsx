import React, { useRef, useEffect, useMemo } from 'react';
import { View, PanResponder, StyleSheet, Animated } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import BurgerPiece from './BurgerPiece';
import { Cell } from '../types';
import { styles, BOARD_PADDING, BOARD_SIZE, BOARD_BORDER_WIDTH } from '../styles/GameBoard.styles';

interface GameBoardProps {
  grid: Cell[];
  currentSelection: number[];
  isGameOver: boolean;
  gridSize: number;
  onSelectionUpdate: (index: number, isGrant?: boolean) => void;
  onSelectionEnd: () => void;
  selectionType?: 'burger' | 'delete'; // Nuevo: tipo de selección
}

// Función para generar un valor pseudoaleatorio basado en un ID (consistente)
const seededRandom = (seed: number) => {
  if (typeof seed !== 'number' || isNaN(seed)) return 0.5;
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Componente memoizado para animar cada pieza individualmente fuera del render principal
const AnimatedPiece = React.memo(({ piece, cellSize, gridSize }: { piece: any, cellSize: number, gridSize: number }) => {
  // Calculamos la posición inicial: solo si es nueva de verdad empezamos arriba
  const initialY = piece.isNew ? -cellSize * 2 : piece.row * cellSize;
  const animX = useRef(new Animated.Value(piece.col * cellSize)).current;
  const animY = useRef(new Animated.Value(initialY)).current;
  
  // Generar valores aleatorios únicos para cada pieza basados en su ID (una sola vez)
  const pieceSeed = typeof piece.id === 'number' ? piece.id : (piece.row || 0) * 1000 + (piece.col || 0);
  const rotationOffsetRef = useRef((seededRandom(pieceSeed) - 0.5) * 4); // Offset inicial entre -2 y 2 grados
  const baseDurationRef = useRef(1500 + seededRandom(pieceSeed + 100) * 1000); // Duración base entre 1500-2500ms
  const maxRotationRef = useRef(3 + seededRandom(pieceSeed + 200) * 2); // Rotación máxima entre 3-5 grados
  
  // Asegurar que los valores sean números válidos
  const rotationOffset = isNaN(rotationOffsetRef.current) ? 0 : rotationOffsetRef.current;
  const baseDuration = isNaN(baseDurationRef.current) ? 2000 : Math.max(1000, baseDurationRef.current);
  const maxRotation = isNaN(maxRotationRef.current) ? 4 : Math.max(2, maxRotationRef.current);
  
  // Inicializar la animación en un punto aleatorio del ciclo para evitar sincronización
  const initialRotationValue = useRef(
    rotationOffset + (seededRandom(pieceSeed + 300) - 0.5) * maxRotation * 2
  ).current;
  const rotationAnim = useRef(new Animated.Value(initialRotationValue)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animX, {
        toValue: piece.col * cellSize,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.spring(animY, {
        toValue: piece.row * cellSize,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      })
    ]).start();
  }, [piece.row, piece.col, cellSize]);

  // Animación de rotación sutil en vaivén fluida y continua (sin saltos)
  useEffect(() => {
    const target1 = rotationOffset + maxRotation;
    const target2 = rotationOffset - maxRotation;
    
    // Inicializar desde un punto que permita transición suave
    rotationAnim.setValue(initialRotationValue);
    
    // Función recursiva para crear animación continua sin saltos
    const createContinuousAnimation = (currentValue: number, direction: 'up' | 'down') => {
      const nextTarget = direction === 'up' ? target1 : target2;
      const nextDirection = direction === 'up' ? 'down' : 'up';
      
      return Animated.timing(rotationAnim, {
        toValue: nextTarget,
        duration: baseDuration,
        useNativeDriver: true,
      }).start((finished) => {
        if (finished) {
          // Cuando termina, iniciar la siguiente animación inmediatamente
          createContinuousAnimation(nextTarget, nextDirection);
        }
      });
    };
    
    // Determinar la dirección inicial basada en el valor inicial
    const range = maxRotation * 2;
    const normalizedStart = Math.max(0, Math.min(1, (initialRotationValue - target2) / range));
    const initialDirection = normalizedStart < 0.5 ? 'up' : 'down';
    
    // Pequeño delay para evitar que todas las piezas empiecen al mismo tiempo
    const startDelay = setTimeout(() => {
      createContinuousAnimation(initialRotationValue, initialDirection);
    }, (pieceSeed % 100) * 10);
    
    return () => {
      clearTimeout(startDelay);
      rotationAnim.stopAnimation();
    };
  }, [rotationAnim, rotationOffset, maxRotation, baseDuration, initialRotationValue, pieceSeed]);

  return (
    <Animated.View 
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        transform: [
          { translateX: animX },
          { translateY: animY },
          {
            rotate: rotationAnim.interpolate({
              inputRange: [rotationOffset - maxRotation, rotationOffset + maxRotation],
              outputRange: [
                `${rotationOffset - maxRotation}deg`, 
                `${rotationOffset + maxRotation}deg`
              ],
              extrapolate: 'clamp',
            }),
          },
        ],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BurgerPiece 
        type={piece.type} 
        gridSize={gridSize} 
        isRemoving={piece.isRemoving}
      />
    </Animated.View>
  );
});

const GameBoard: React.FC<GameBoardProps> = (props) => {
  const { grid, currentSelection, gridSize, onSelectionUpdate, onSelectionEnd, selectionType = 'burger' } = props;
  const cellSize = (BOARD_SIZE - (BOARD_PADDING * 2) - (BOARD_BORDER_WIDTH * 2)) / gridSize;
  
  const propsRef = useRef(props);
  useEffect(() => { propsRef.current = props; }, [props]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => handleGesture(evt.nativeEvent.locationX, evt.nativeEvent.locationY, true),
    onPanResponderMove: (evt) => handleGesture(evt.nativeEvent.locationX, evt.nativeEvent.locationY, false),
    onPanResponderRelease: () => propsRef.current.onSelectionEnd(),
    onPanResponderTerminate: () => propsRef.current.onSelectionEnd()
  }), [gridSize]);

  const handleGesture = (x: number, y: number, isGrant: boolean) => {
    const offset = BOARD_PADDING + BOARD_BORDER_WIDTH;
    const col = Math.floor((x - offset) / cellSize);
    const row = Math.floor((y - offset) / cellSize);
    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      propsRef.current.onSelectionUpdate(row * gridSize + col, isGrant);
    }
  };

  // Extraemos todas las piezas a una lista plana para animarlas independientemente de las celdas
  const activePieces = useMemo(() => {
    return grid
      .filter(cell => cell.piece !== null)
      .map(cell => ({
        ...cell.piece!,
        row: cell.row,
        col: cell.col,
      }));
  }, [grid]);

  return (
    <View style={styles.board} {...panResponder.panHandlers}>
      {/* Capa 1: Fondo de selección */}
      <View style={styles.gridBackground} pointerEvents="none">
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          return (
            <View key={`bg-${i}`} style={[
              styles.cellBase, 
              { 
                width: cellSize, 
                height: cellSize,
                left: col * cellSize,
                top: row * cellSize
              },
              currentSelection.includes(i) && styles.selectedCell,
            ]} />
          );
        })}
      </View>

      {/* Capa 2: Ingredientes */}
      <View style={styles.piecesLayer} pointerEvents="none">
        {activePieces.map((piece) => (
          <AnimatedPiece 
            key={piece.id} 
            piece={piece} 
            cellSize={cellSize} 
            gridSize={gridSize} 
          />
        ))}
      </View>

      {/* Capa 3: Líneas de selección */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {currentSelection.map((idx, i) => {
          if (i === 0) return null;
          const sCol = currentSelection[i - 1] % gridSize;
          const sRow = Math.floor(currentSelection[i - 1] / gridSize);
          const eCol = idx % gridSize;
          const eRow = Math.floor(idx / gridSize);
          const offset = BOARD_PADDING + BOARD_BORDER_WIDTH;
          const lineColor = selectionType === 'delete' ? '#ff4757' : '#40c057'; // Rojo para eliminación, verde para hamburguesas
          return (
            <Line key={i}
              x1={offset + sCol * cellSize + cellSize / 2}
              y1={offset + sRow * cellSize + cellSize / 2}
              x2={offset + eCol * cellSize + cellSize / 2}
              y2={offset + eRow * cellSize + cellSize / 2}
              stroke={lineColor} strokeWidth="6" strokeLinecap="round" opacity={0.8}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default GameBoard;
