import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50
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
    marginBottom: 12,
    backgroundColor: '#fcf8f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#efe5d9'
  },
  ingredientSection: {
    backgroundColor: '#e7f5ff',
    borderColor: '#d0ebff',
    paddingVertical: 1,
    marginBottom: 8
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#adb5bd',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2
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
    fontSize: 20,
    fontWeight: '900',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 4
  },
  recipePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    gap: -20 // Más juntos para que parezca una burger compacta
  },
  recipeIngIcon: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ingredientRowInline: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  ingredientNameInline: {
    fontSize: 20,
    gap: 10,
    fontWeight: '700',
    color: '#1864ab'
  },
  description: {
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    lineHeight: 16,
    marginBottom: 10,
    fontWeight: '600',
    paddingHorizontal: 2
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 15,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 10
  },
  statBox: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9da5ad',
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
    gap: 0,
    marginBottom: 5,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#c8c9ca',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  powerUpToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  powerUpEmoji: {
    fontSize: 20
  },
  powerUpIcon: {
    width: 24,
    height: 24
  },
  powerUpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    flex: 1
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
  // Estilos para objetivos en pantalla de introducción
  objectivesContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 220,
    flex: 1
  },
  objectiveRecipeName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#495057',
    flex: 1
  },
  objectiveIngredients: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginHorizontal: 8
  },
  objectiveIngredientIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6
  },
  objectiveCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ff922b'
  },
  starsRequirementsSection: {
    backgroundColor: 'rgb(234, 234, 234)',
    borderRadius: 12,
    minWidth: 300,
    padding: 2,
    marginVertical: 7,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  starsRequirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  requirementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  requirementItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  requirementIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  requirementDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  starsPreview: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  starsPreviewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff922b',
    marginBottom: 2,
  },
  starsPreviewDesc: {
    fontSize: 12,
    color: '#666',
  },
});

