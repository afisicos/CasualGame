import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Vibration } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import BurgerPiece from './BurgerPiece';
import { Cell } from '../types';

const { width } = Dimensions.get('window');
const GRID_SIZE = 8;
const BOARD_PADDING = 10;
const BOARD_SIZE = width * 0.95;
const CELL_SIZE = (BOARD_SIZE - (BOARD_PADDING * 2)) / GRID_SIZE;

interface GameBoardProps {
  grid: Cell[];
  currentSelection: number[];
  isGameOver: boolean;
  onSelectionUpdate: (index: number) => void;
  onSelectionEnd: () => void;
}

const GameBoard: React.FC<GameBoardProps> = (props) => {
  const { grid, currentSelection, isGameOver, onSelectionUpdate, onSelectionEnd } = props;
  const lastIndex = useRef<number | null>(null);
  
  // TRUCO: Usamos una referencia para que el PanResponder siempre tenga las props frescas
  const propsRef = useRef(props);
  useEffect(() => { propsRef.current = props; }, [props]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleGesture(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        handleGesture(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderRelease: () => {
        lastIndex.current = null;
        propsRef.current.onSelectionEnd();
      },
      onPanResponderTerminate: () => {
        lastIndex.current = null;
        propsRef.current.onSelectionEnd();
      }
    })
  ).current;

  const handleGesture = (x: number, y: number) => {
    const col = Math.floor((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.floor((y - BOARD_PADDING) / CELL_SIZE);

    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
      const index = row * GRID_SIZE + col;
      if (index !== lastIndex.current) {
        lastIndex.current = index;
        propsRef.current.onSelectionUpdate(index);
      }
    }
  };

  return (
    <View style={styles.board} {...panResponder.panHandlers}>
      <View style={styles.grid} pointerEvents="none">
        {grid.map((cell, index) => (
          <View key={index} style={[
            styles.cell, 
            currentSelection.includes(index) && styles.selectedCell,
          ]}>
            {cell.piece && <BurgerPiece type={cell.piece.type} />}
          </View>
        ))}
      </View>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {currentSelection.map((idx, i) => {
          if (i === 0) return null;
          const start = grid[currentSelection[i - 1]];
          const end = grid[idx];
          return (
            <Line key={i}
              x1={BOARD_PADDING + start.col * CELL_SIZE + CELL_SIZE / 2}
              y1={BOARD_PADDING + start.row * CELL_SIZE + CELL_SIZE / 2}
              x2={BOARD_PADDING + end.col * CELL_SIZE + CELL_SIZE / 2}
              y2={BOARD_PADDING + end.row * CELL_SIZE + CELL_SIZE / 2}
              stroke="#27ae60" strokeWidth="8" strokeLinecap="round" opacity={0.7}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  board: { width: BOARD_SIZE, height: BOARD_SIZE, backgroundColor: '#e2dcd5', borderRadius: 20, padding: BOARD_PADDING, elevation: 8 },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 0.5, borderColor: '#eee' },
  selectedCell: { backgroundColor: '#ebfbee', borderColor: '#27ae60', borderWidth: 2 }
});

export default GameBoard;
