import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '900',
  },
  moneyDisplay: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moneyLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#adb5bd',
    marginBottom: 5,
  },
  headerCoin: {
    width: 36,
    height: 36,
    marginLeft: 10,
    marginTop: 4,
  },
  moneyValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#27ae60',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  powerUpCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  powerUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  powerUpEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  powerUpInfo: {
    flex: 1,
  },
  powerUpName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4a4a4a',
    marginBottom: 5,
  },
  powerUpDesc: {
    fontSize: 13,
    color: '#868e96',
    lineHeight: 18,
  },
  powerUpFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  countBadge: {
    backgroundColor: '#e7f5ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1864ab',
  },
  buyButton: {
    backgroundColor: '#ff922b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 2,
  },
  buyButtonDisabled: {
    backgroundColor: '#adb5bd',
    opacity: 0.6,
  },
  buyBtnCoin: {
    width: 22,
    height: 22,
    marginTop: 2,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
});

