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
  titleBadge: {
    backgroundColor: '#ff9500',
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
    backgroundColor: '#fff4e6',
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ffd0a3'
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ff9500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  arcadeIcon: {
    width: 45,
    height: 45
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 10
  },
  description: { 
    textAlign: 'center', 
    fontSize: 15, 
    color: '#666',
    lineHeight: 22,
    marginBottom: 25,
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
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ff9500'
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  recordValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4a4a4a'
  },
  recordCoin: {
    width: 20,
    height: 20,
    marginLeft: 5
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 5
  },
  playButtonInline: { 
    flex: 3,
    backgroundColor: '#ff9500', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#ff9500',
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
    color: '#868e96',
    fontWeight: '900',
    fontSize: 14,
    textAlign: 'center'
  }
});

