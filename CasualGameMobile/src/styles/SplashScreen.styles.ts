import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9966', // Fallback color
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
    marginBottom: 10,
  },
  titleFood: {
    fontSize: 72,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 12,
  },
  titleForFun: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 10,
    marginTop: -10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loader: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    marginTop: 40,
  }
});

