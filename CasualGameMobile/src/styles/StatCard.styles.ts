import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 15,
    minHeight: 60,
  },
  cardVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minHeight: 80,
    height: 80,
  },
  iconContainer: { 
    width: 50,
    height: 50,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 8 
  },
  iconContainerVertical: {
    marginRight: 0,
    marginBottom: 4,
    width: 32,
    height: 32,
  },
  moneyIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 6 
  },
  iconImage: {
    width: '100%', // Que ocupe todo el contenedor
    height: '100%',
  },
  content: { 
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    flexShrink: 1
  },
  contentVertical: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  label: { 
    fontSize: 9, 
    fontWeight: '800', 
    color: '#8c8c8c',
    textTransform: 'uppercase'
  },
  value: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#4a4a4a',
    marginTop: -2,
    minWidth: 0,
    flexShrink: 1
  },
  valueVertical: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4a4a4a',
    marginTop: 0,
    minWidth: 0,
    flexShrink: 1,
  },
  moneyValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4a4a4a',
    marginTop: -2,
    minWidth: 0,
    flexShrink: 1,
  },
  moneyValueVertical: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4a4a4a',
    marginTop: 0,
    minWidth: 0,
    flexShrink: 1,
  },
  lowTimeValue: { color: '#e74c3c' },
  touchableContainer: {
    backgroundColor: '#efe5d9', // Mismo color que el fondo del tablero
    borderRadius: 15,
    elevation: 12,
    shadowColor: '#8b4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minHeight: 50,
  },
  touchableContainerVertical: {
    backgroundColor: '#efe5d9', // Mismo color que el fondo del tablero
    borderRadius: 15,
    elevation: 12,
    shadowColor: '#8b4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minHeight: 80,
    height: 80,
  },
});

