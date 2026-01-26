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
  container: { flex: 1 },
  headerBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    padding: 0,
    marginBottom: 30 // Aumentado para dar más espacio antes del panel arcade
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  topBarGroup: { flexDirection: 'row', alignItems: 'center' },
  statPill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7, // Reducido de 10 para ser más compacto
    height: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  statEmoji: { fontSize: 14, marginRight: 3 },
  statIcon: { width: 20, height: 20, marginLeft: 3 },
  statValue: { fontSize: 13, fontWeight: '900', color: '#4a4a4a' },
  timeBadge: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white'
  },
  timeBadgeText: { color: 'white', fontSize: 7, fontWeight: '900' },
  settingsBtn: {
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  buttonIcon: { width: 26, height: 26 },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  shopBtn: {
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  shopEmoji: { fontSize: 20 },
  powerUpBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    gap: 44,
  },
  powerUpToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  content: { flex: 1 },
  tabContent: { flex: 1 },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 5,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
  },
  arcadeSection: { 
    marginHorizontal: 20,
    borderRadius: 24, 
    marginBottom: 30, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    overflow: 'hidden'
  },
  arcadeGradient: { padding: 20 },
  nextIngredientGradient: { padding: 12 },
  arcadeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  arcadeTitleContainer: { flex: 1 },
  arcadeTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
  },
  arcadeRecordCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  arcadeRecordLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
  },
  arcadeRecordValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arcadeRecordValue: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  arcadeRecordCoin: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  arcadeButton: { 
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  arcadeIcon: { width: 42, height: 42 },
  arcadeButtonText: { color: 'white', fontWeight: '900', fontSize: 14 },
  arcadeDescription: { 
    color: 'rgba(255, 255, 255, 0.9)', 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 12, 
    textAlign: 'center',
    lineHeight: 16
  },
  campaignSection: {
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden'
  },
  recipeBookSection: {
    marginHorizontal: 20,
    borderRadius: 24, 
    marginBottom: 30, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8,
    overflow: 'hidden'
  },
  campaignTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  campaignLevelName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    marginTop: -2,
    opacity: 0.9
  },
  playLevelButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  playLevelIcon: {
    width: 36,
    height: 36,
    marginLeft: 4 // Ajuste visual para centrar el triángulo del play
  },
  costBadge: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#aa1b1b',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  costBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  costEnergyIcon: {
    color: '#FFEA00', // Amarillo brillante
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  costEnergyIconImage: {
    width: 18,
    height: 18,
    margin: 0,
  },
  recordContainer: { alignItems: 'flex-end' },
  recordLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  recordCoin: { width: 22, height: 22, marginLeft: 5, marginTop: 2 },
  recordValue: { fontSize: 24, fontWeight: '900', color: 'white' },
  subtitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: 'white', 
    letterSpacing: 3, 
    marginBottom: 15, 
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  list: { flex: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },

  // Panel flotante para recuperar energía
  energyPanelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  energyPanel: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  energyPanelTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  energyPanelMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  energyPanelButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  energyPanelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  energyPanelCancel: {
    backgroundColor: '#f0f0f0',
  },
  energyPanelCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  energyPanelWatch: {
    backgroundColor: '#ff922b',
  },
  energyPanelWatchText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'white',
  },

  // Estilos para el componente del siguiente ingrediente
  nextIngredientSection: {
    marginHorizontal: 20,
    borderRadius: 24,
    marginBottom: 30,
    marginTop: -15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden'
  },
  nextIngredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  nextIngredientLeft: {
    flex: 1,
    paddingRight: 16
  },
  nextIngredientTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 2,
  },
  nextIngredientName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 1,
  },
  nextIngredientLevel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  nextIngredientRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextIngredientCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  nextIngredientCircleIcon: {
    width: 28,
    height: 28,
  },
  nextIngredientLockIcon: {
    width: 18,
    height: 18,
    tintColor: 'rgba(255, 255, 255, 0.8)',
  },
});

