import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectQRScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Código QR del Proyecto</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <QRCode
          value={id as string}
          size={250}
          backgroundColor="white"
          color="black"
        />
        
        <Text style={styles.projectId}>ID: {id}</Text>
        <Text style={styles.instructions}>
          Escanea este código QR para acceder rápidamente al proyecto
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    top: 10
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  projectId: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
});