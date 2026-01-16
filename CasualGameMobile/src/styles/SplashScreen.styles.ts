import { StyleSheet, Dimensions } from 'react-native';

const getWindowWidth = () => {
  try {
    return Dimensions.get('window').width || 375;
  } catch {
    return 375; // Valor por defecto
  }
};

const width = getWindowWidth();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  titleFood: {
    fontSize: 72,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 12,
  },
  titleForFun: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
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

