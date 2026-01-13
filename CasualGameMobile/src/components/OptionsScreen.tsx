import React from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/OptionsScreen.styles';

interface OptionsScreenProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onBack: () => void;
  language: 'es' | 'en';
  onToggleLanguage: () => void;
  onPlaySound?: () => void;
  t: any;
}

const OptionsScreen: React.FC<OptionsScreenProps> = ({ 
  isSoundEnabled, onToggleSound, onResetProgress, onBack, language, onToggleLanguage, onPlaySound, t
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9966', '#FF5E62']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { onPlaySound?.(); onBack(); }} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t.options}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.sound}</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>{t.sound_fx}</Text>
            <Switch 
              value={isSoundEnabled} 
              onValueChange={(value) => { onPlaySound?.(); onToggleSound(); }}
              trackColor={{ false: "#767577", true: "#40c057" }}
              thumbColor={isSoundEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.language}</Text>
          <TouchableOpacity style={styles.optionRow} onPress={() => { onPlaySound?.(); onToggleLanguage(); }}>
            <Text style={styles.optionLabel}>{t.lang_name}</Text>
            <Text style={styles.langFlag}>{language === 'es' ? '🇪🇸' : '🇺🇸'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.danger_zone}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={() => {
            onPlaySound?.();
            Alert.alert(
              t.reset_confirm_title,
              t.reset_confirm_msg,
              [
                { text: t.cancel, style: "cancel" },
                { text: t.delete_all, style: "destructive", onPress: onResetProgress }
              ]
            );
          }}>
            <Text style={styles.resetButtonText}>{t.reset_progress}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

export default OptionsScreen;

