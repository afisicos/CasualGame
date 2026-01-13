import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { 
    flex: 1, 
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    alignItems: 'center',
    paddingTop: 35, // Margen extra para el notch y barra de estado de Android
  },
  iconButton: { padding: 5 },
  largePlayIcon: { width: 60, height: 60, marginBottom: 5 },
  mathIcon: { width: 28, height: 28 },
  complexityButton: { width: 45, height: 45, alignItems: 'center', justifyContent: 'center' },
  statsRow: { 
    flexDirection: 'row', 
    gap: 10, 
    width: '100%', 
    marginBottom: 25,
    zIndex: 1000,
    elevation: 5
  },
  orderCard: {
    backgroundColor: '#efe5d9', // Mismo color que el fondo del tablero
    padding: 15,
    borderRadius: 24,
    width: '100%',
    marginBottom: 25,
    marginTop: 15,
    elevation: 6,
    shadowColor: '#d2b48c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 100,
    overflow: 'hidden' // Recorte para que el scroll del recetario no se salga
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8, alignItems: 'center' },
  orderLabel: { fontSize: 10, fontWeight: '800', color: '#adb5bd', letterSpacing: 1 },
  burgerNameText: { fontSize: 14, fontWeight: '900', color: '#4a4a4a', marginTop: 2 },
  priceLabel: { fontSize: 18, fontWeight: '900', color: '#27ae60' },
  priceIcon: { width: 22, height: 22, marginTop: 2 },
  orderPieces: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    height: 80, 
    justifyContent: 'center', 
    width: '100%',
    paddingHorizontal: 5,
    overflow: 'visible' 
  },
  waitingContainer: { height: 100, justifyContent: 'center', alignItems: 'center', width: '100%' },
  waitingText: { fontSize: 12, fontWeight: '900', color: '#adb5bd', letterSpacing: 1 },
  countdownText: { fontSize: 32, fontWeight: '900', color: '#ff922b', letterSpacing: 2 },
  boardWrapper: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', width: '100%', paddingBottom: 0 },
  // Estilos Modo Arcade Integrado
  arcadeRecipeContainer: { width: '100%', height: 200 },
  recipeLabelIntegrated: { fontSize: 10, fontWeight: '900', color: '#495057', letterSpacing: 1, marginBottom: 8, textAlign: 'center' },
  recipeListIntegrated: { flex: 1 },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efe5d9', // Mismo color que el fondo del tablero
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#343a40',
  },
  recipeName: { fontSize: 11, fontWeight: '900', color: '#4a4a4a', width: 100, marginRight: 8 },
  recipeIngredients: { flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'nowrap' },
  recipeIngredientIcon: { width: 18, height: 22, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
  recipePriceContainer: { backgroundColor: 'white', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: '#27ae60' },
  recipeCoin: { width: 14, height: 14, marginTop: 1 },
  recipePrice: { fontSize: 12, fontWeight: '900', color: '#27ae60' },
  secretTextSmall: { fontSize: 12, fontWeight: '900', color: '#adb5bd' },
  helpTextContainerCenter: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  helpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center'
  },
  statTouchable: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  }
});

