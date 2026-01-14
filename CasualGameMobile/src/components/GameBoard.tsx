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
}

// Componente memoizado para animar cada pieza individualmente fuera del render principal
const AnimatedPiece = React.memo(({ piece, cellSize, gridSize }: { piece: any, cellSize: number, gridSize: number }) => {
  // Calculamos la posición inicial: solo si es nueva de verdad empezamos arriba
  const initialY = piece.isNew ? -cellSize * 2 : piece.row * cellSize;
  const animX = useRef(new Animated.Value(piece.col * cellSize)).current;
  const animY = useRef(new Animated.Value(initialY)).current;

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

  return (
    <Animated.View 
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        transform: [
          { translateX: animX },
          { translateY: animY }
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
  const { grid, currentSelection, gridSize, onSelectionUpdate, onSelectionEnd } = props;
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
          return (
            <Line key={i}
              x1={offset + sCol * cellSize + cellSize / 2}
              y1={offset + sRow * cellSize + cellSize / 2}
              x2={offset + eCol * cellSize + cellSize / 2}
              y2={offset + eRow * cellSize + cellSize / 2}
              stroke="#40c057" strokeWidth="6" strokeLinecap="round" opacity={0.8}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default GameBoard;
