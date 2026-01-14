import { StyleSheet, Dimensions } from 'react-native';

const getWindowWidth = () => {
  try {
    return Dimensions.get('window').width || 375;
  } catch {
    return 375; // Valor por defecto
  }
};

const width = getWindowWidth();
export const BOARD_PADDING = 12;
export const BOARD_SIZE = width * 0.95;
export const BOARD_BORDER_WIDTH = 0;

export const styles = StyleSheet.create({
  board: { 
    width: BOARD_SIZE, 
    height: BOARD_SIZE, 
    backgroundColor: '#efe5d9', 
    borderRadius: 30, 
    elevation: 12,
    shadowColor: '#8b4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    overflow: 'hidden',
    position: 'relative'
  },
  piecesLayer: {
    ...StyleSheet.absoluteFillObject,
    margin: BOARD_PADDING + BOARD_BORDER_WIDTH,
    overflow: 'visible'
  },
  gridBackground: { 
    ...StyleSheet.absoluteFillObject,
    margin: BOARD_PADDING + BOARD_BORDER_WIDTH,
  },
  cellBase: { 
    position: 'absolute',
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  selectedCell: { backgroundColor: 'rgba(64, 192, 87, 0.2)', borderRadius: 15 }
});

