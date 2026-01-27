import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, 
  },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 35, 
    padding: 30, 
    alignItems: 'center',
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70,
    borderWidth: 6,
    borderColor: 'white',
    elevation: 5
  },
  statusText: { fontSize: 40 },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#4a4a4a', 
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  resultBox: {
    backgroundColor: '#f8f9fa',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 25
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#adb5bd',
    letterSpacing: 1
  },
  resultCoin: {
    width: 48,
    height: 48,
    marginLeft: 10,
    marginTop: 6
  },
  money: { 
    fontSize: 56, 
    fontWeight: '900', 
    color: '#27ae60', 
    marginVertical: 5 
  },
  targetLabel: {
    fontSize: 14,
    color: '#868e96',
    fontWeight: '700'
  },
  targetCoin: {
    width: 18,
    height: 18,
    marginLeft: 4,
    marginTop: 2
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  recordLabelSmall: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '800'
  },
  recordCoin: {
    width: 18,
    height: 18,
    marginHorizontal: 4,
    marginTop: 2
  },
  recordValueSmall: {
    fontSize: 14,
    color: '#ff9500',
    fontWeight: '900'
  },
  button: { 
    backgroundColor: '#ff922b', 
    paddingVertical: 18, 
    borderRadius: 20, 
    width: '100%', 
    alignItems: 'center',
    elevation: 5
  },
  buttonText: { color: 'white', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  backButton: { marginTop: 20 },
  backText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#adb5bd',
    letterSpacing: 1
  },
  // Estilos para resultados de recetas
  recipesContainer: {
    width: '100%',
    marginTop: 10,
    gap: 8
  },
  recipeResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  recipeResultItemCompleted: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745'
  },
  recipeResultInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  recipeResultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginRight: 8
  },
  recipeResultNameCompleted: {
    color: '#155724'
  },
  recipeResultIngredients: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  recipeResultIngredientIcon: {
    width: 18,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -5
  },
  recipeResultProgress: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ff922b'
  },
  recipeResultProgressCompleted: {
    color: '#155724'
  },
  starsContainer: {
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  starsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 12,
    alignItems: 'center',
  },
  starWithIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  star: {
    width: 32,
    height: 32,
  },
  starIcon: {
    width: 28,
    height: 28,
  },
  starsDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
});

