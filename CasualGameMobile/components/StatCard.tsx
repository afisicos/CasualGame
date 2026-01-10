import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  type: 'time' | 'money' | 'record';
  isLowTime?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, type, isLowTime }) => {
  const borderColors = {
    time: '#e74c3c',
    money: '#27ae60',
    record: '#fcc419',
  };

  return (
    <View style={[styles.card, { borderLeftColor: borderColors[type] }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text 
          style={[styles.value, isLowTime && styles.lowTimeValue]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 15, 
    borderLeftWidth: 5, 
    elevation: 3,
    minHeight: 60,
  },
  iconContainer: { 
    width: 35, 
    height: 35, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 8 
  },
  iconText: { fontSize: 18 },
  content: { 
    flex: 1,
    justifyContent: 'center'
  },
  label: { 
    fontSize: 9, 
    fontWeight: '800', 
    color: '#8c8c8c',
    textTransform: 'uppercase'
  },
  value: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#4a4a4a',
    marginTop: -2
  },
  lowTimeValue: { color: '#e74c3c' }
});

export default StatCard;
