import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 0,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: { flex: 1, padding: 20 },
  section: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#adb5bd',
    marginBottom: 15,
    letterSpacing: 1
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionLabel: { fontSize: 16, fontWeight: '700', color: '#4a4a4a' },
  langFlag: { fontSize: 24 },
  resetButton: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    alignItems: 'center'
  },
  resetButtonText: { color: '#ff6b6b', fontWeight: '800', fontSize: 14 },
  footer: { marginTop: 'auto', alignItems: 'center', paddingBottom: 20 },
  versionText: { color: '#adb5bd', fontSize: 12 }
});

