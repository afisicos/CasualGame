import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  content: {
    padding: 20,
    paddingTop: 80, // Espacio para el header bar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9966',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIcon: {
    width: 35,
    height: 35,
  },
  textContainer: {
    flex: 1,
  },
  achievementDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#40c057',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  rewardTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  rewardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9966',
    marginRight: 3,
  },
  rewardIcon: {
    width: 20,
    height: 20,
  },
  claimButton: {
    backgroundColor: '#FF9966',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    elevation: 2,
  },
  claimButtonDisabled: {
    backgroundColor: '#ccc',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  claimedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimedText: {
    color: '#40c057',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: '#40c057',
  },
});
