import React, { useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Vibration } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import BurgerPiece from './BurgerPiece';
import { Cell } from '../types';

const { width } = Dimensions.get('window');
const BOARD_PADDING = 10;
const BOARD_SIZE = width * 0.95;

interface GameBoardProps {
  grid: Cell[];
  currentSelection: number[];
  isGameOver: boolean;
  gridSize: number;
  onSelectionUpdate: (index: number, isGrant?: boolean) => void;
  onSelectionEnd: () => void;
}

const GameBoard: React.FC<GameBoardProps> = (props) => {
  const { grid, currentSelection, gridSize, onSelectionUpdate, onSelectionEnd } = props;
  const cellSize = (BOARD_SIZE - (BOARD_PADDING * 2)) / gridSize;
  
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
    const col = Math.floor((x - BOARD_PADDING) / cellSize);
    const row = Math.floor((y - BOARD_PADDING) / cellSize);
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
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <View key={`bg-${i}`} style={[
            styles.cellBase, 
            { width: cellSize, height: cellSize },
            currentSelection.includes(i) && styles.selectedCell,
          ]} />
        ))}
      </View>

      {/* Capa 2: Ingredientes */}
      <View style={styles.piecesLayer} pointerEvents="none">
        {activePieces.map((piece) => {
          return (
            <View 
              key={piece.id} 
              style={{
                position: 'absolute',
                width: cellSize,
                height: cellSize,
                left: piece.col * cellSize,
                top: piece.row * cellSize,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BurgerPiece 
                type={piece.type} 
                gridSize={gridSize} 
                isRemoving={piece.isRemoving}
              />
            </View>
          );
        })}
      </View>

      {/* Capa 3: Líneas de selección */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {currentSelection.map((idx, i) => {
          if (i === 0) return null;
          const sCol = currentSelection[i - 1] % gridSize;
          const sRow = Math.floor(currentSelection[i - 1] / gridSize);
          const eCol = idx % gridSize;
          const eRow = Math.floor(idx / gridSize);
          return (
            <Line key={i}
              x1={BOARD_PADDING + sCol * cellSize + cellSize / 2}
              y1={BOARD_PADDING + sRow * cellSize + cellSize / 2}
              x2={BOARD_PADDING + eCol * cellSize + cellSize / 2}
              y2={BOARD_PADDING + eRow * cellSize + cellSize / 2}
              stroke="#40c057" strokeWidth="6" strokeLinecap="round" opacity={0.8}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  board: { 
    width: BOARD_SIZE, 
    height: BOARD_SIZE, 
    backgroundColor: '#efe5d9', 
    borderRadius: 30, 
    padding: BOARD_PADDING, 
    elevation: 12,
    shadowColor: '#8b4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    overflow: 'hidden'
  },
  piecesLayer: {
    ...StyleSheet.absoluteFillObject,
    margin: BOARD_PADDING,
    overflow: 'hidden' // Doble recorte para seguridad
  },
  gridBackground: { 
    flex: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap',
  },
  cellBase: { 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  selectedCell: { backgroundColor: 'rgba(64, 192, 87, 0.2)', borderRadius: 15 }
});

export default GameBoard;
