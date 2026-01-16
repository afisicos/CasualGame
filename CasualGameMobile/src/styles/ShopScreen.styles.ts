import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  moneyDisplay: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moneyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#adb5bd',
    marginBottom: 2,
  },
  headerCoin: {
    width: 24,
    height: 24,
    marginLeft: 6,
    marginTop: 2,
  },
  moneyValue: {
    fontSize: 24,
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
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  powerUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  powerUpEmoji: {
    fontSize: 30,
    marginRight: 12,
  },
  powerUpIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  powerUpInfo: {
    flex: 1,
  },
  powerUpName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4a4a4a',
    marginBottom: 2,
  },
  powerUpDesc: {
    fontSize: 11,
    color: '#868e96',
    lineHeight: 14,
  },
  powerUpFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  countBadge: {
    backgroundColor: '#e7f5ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1864ab',
  },
  countIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  buyButton: {
    backgroundColor: '#ff922b',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  buyButtonDisabled: {
    backgroundColor: '#adb5bd',
    opacity: 0.6,
  },
  buyBtnCoin: {
    width: 18,
    height: 18,
    marginTop: 1,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
});

