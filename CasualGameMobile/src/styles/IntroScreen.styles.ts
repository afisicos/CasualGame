import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 35, 
    padding: 25, 
    alignItems: 'center',
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  levelBadge: {
    backgroundColor: '#ff922b',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 20
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fcf8f2',
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#efe5d9'
  },
  ingredientSection: {
    backgroundColor: '#e7f5ff',
    borderColor: '#d0ebff'
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#adb5bd',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recipeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8
  },
  pricePill: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pillCoin: {
    width: 14,
    height: 14,
  },
  pricePillText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900'
  },
  burgerName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 12
  },
  recipePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    gap: -22 // Más juntos para que parezca una burger compacta
  },
  recipeIngIcon: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  ingredientIconBg: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1864ab'
  },
  description: { 
    textAlign: 'center', 
    fontSize: 15, 
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '600',
    paddingHorizontal: 10
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 25,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 15
  },
  statBox: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#adb5bd',
    marginBottom: 5
  },
  statCoin: {
    width: 24,
    height: 24,
    marginLeft: 5,
    marginTop: 2 // Pequeño ajuste para centrar visualmente con el texto
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#27ae60'
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 5
  },
  playButtonInline: { 
    flex: 3,
    backgroundColor: '#ff922b', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#ff922b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  backButtonInline: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  buttonText: { 
    color: 'white', 
    fontWeight: '900', 
    fontSize: 18,
    letterSpacing: 1
  },
  backTextInline: {
    color: '#adb5bd', // Gris para que sea menos prominente
    fontWeight: '900',
    fontSize: 16,
    textAlign: 'center'
  },
  powerUpBar: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  powerUpToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  powerUpEmoji: {
    fontSize: 20
  },
  powerUpIcon: {
    width: 20,
    height: 20
  },
  powerUpLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#495057',
    flex: 1
  },
  ingredientSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10
  },
  ingredientOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.1)',
    minWidth: 70
  },
  ingredientOptionSelected: {
    borderColor: '#7048e8',
    backgroundColor: 'rgba(112, 72, 232, 0.1)'
  },
  ingredientOptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    marginTop: 4
  },
  ingredientOptionTextSelected: {
    color: '#7048e8'
  },
  inhibitorButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
    minWidth: 70,
    alignItems: 'center'
  },
  inhibitorButtonActive: {
    backgroundColor: '#7048e8',
    borderColor: '#7048e8'
  },
  inhibitorButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6c757d'
  },
  inhibitorButtonTextActive: {
    color: '#fff'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529'
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600'
  },
  modalScrollView: {
    maxHeight: 300
  },
  modalScrollContent: {
    padding: 20
  },
  modalDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12
  },
  ingredientCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  ingredientIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  ingredientName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center'
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center'
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  noIngredientsContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  noIngredientsText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic'
  },
});

