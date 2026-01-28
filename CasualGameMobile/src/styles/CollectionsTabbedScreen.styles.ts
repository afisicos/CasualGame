import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  
  // Panel styles
  panelSection: {
    padding: 15,
    marginBottom: 15,
  },
  panelGradient: {
    borderRadius: 15,
    padding: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  panelTitleContainer: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  panelSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  panelDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playIcon: {
    width: 50,
    height: 50,
  },
  arcadeRecordCenter: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  arcadeRecordLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  arcadeRecordValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arcadeRecordValue: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
    marginRight: 5,
  },
  arcadeRecordCoin: {
    width: 18,
    height: 18,
  },
  costBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#ff3366',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  costEnergyIconImage: {
    width: 16,
    height: 16,
  },

  // Energy panel
  energyPanelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  energyPanel: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
  },
  energyPanelTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  energyPanelMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  energyPanelButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  energyPanelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  energyPanelCancel: {
    backgroundColor: '#ccc',
  },
  energyPanelWatch: {
    backgroundColor: '#4CAF50',
  },
  energyPanelCancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  energyPanelWatchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
