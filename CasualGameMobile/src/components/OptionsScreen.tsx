import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface OptionsScreenProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onLoginGoogle: () => void;
  onBack: () => void;
}

const OptionsScreen: React.FC<OptionsScreenProps> = ({ 
  isSoundEnabled, onToggleSound, onResetProgress, onLoginGoogle, onBack 
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>OPCIONES</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SONIDO</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Efectos de sonido</Text>
            <Switch 
              value={isSoundEnabled} 
              onValueChange={onToggleSound}
              trackColor={{ false: "#767577", true: "#40c057" }}
              thumbColor={isSoundEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CUENTA</Text>
          <TouchableOpacity style={styles.googleButton} onPress={onLoginGoogle}>
            <Text style={styles.googleButtonText}>Conectar con Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PELIGRO</Text>
          <TouchableOpacity style={styles.resetButton} onPress={() => {
            Alert.alert(
              "Borrar Progreso",
              "¿Estás seguro? Esta acción no se puede deshacer.",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "BORRAR TODO", style: "destructive", onPress: onResetProgress }
              ]
            );
          }}>
            <Text style={styles.resetButtonText}>Reiniciar Progreso 🔄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 30, color: 'white', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: '900', color: 'white' },
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
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  googleButtonText: { color: 'white', fontWeight: '800', fontSize: 16 },
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

export default OptionsScreen;

