import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#333', // Gris oscuro siempre
  },
  value: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333', // Gris oscuro siempre
  },
  barContainer: {
    height: 12,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barBackground: {
    flex: 1,
    backgroundColor: 'rgb(183, 183, 183)',
    borderRadius: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.95,
    shadowRadius: 3.84,
    elevation: 4,
  },
});