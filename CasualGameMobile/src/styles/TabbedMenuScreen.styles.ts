import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    padding: 0,
    marginBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  topBarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statPill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    height: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statEmoji: {
    width: 24,
    height: 24,
    marginRight: 3,
  },
  statIcon: {
    width: 20,
    height: 20,
    marginLeft: 3,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4a4a4a',
  },
  timeBadge: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white',
  },
  timeBadgeText: {
    color: 'white',
    fontSize: 7,
    fontWeight: '900',
  },
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
    shadowRadius: 3,
  },
  buttonIcon: {
    width: 26,
    height: 26,
  },
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
    shadowRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  tabContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    backgroundColor: 'white',
    width: 24,
  },
});
