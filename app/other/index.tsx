import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OtherScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Otras Opciones</Text>
      <Text style={styles.text}>Aquí irán otras funcionalidades...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});