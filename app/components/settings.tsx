import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
  Appearance,
  useColorScheme
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

// Tipos para las preferencias
type ThemeMode = 'light' | 'dark' | 'auto';

interface AppSettings {
  theme: ThemeMode;
  databasePath: string;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'auto',
    databasePath: 'app.db'
  });
  const [loading, setLoading] = useState(true);
  const [applyingTheme, setApplyingTheme] = useState(false);

  // Cargar ajustes al iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  // Cargar ajustes desde AsyncStorage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings: AppSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Aplicar el tema guardado
        applyTheme(parsedSettings.theme);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar ajustes en AsyncStorage
  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Aplicar el nuevo tema
      applyTheme(newSettings.theme);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'No se pudieron guardar los ajustes');
    }
  };

  // Aplicar el tema seleccionado
  const applyTheme = (theme: ThemeMode) => {
    setApplyingTheme(true);
    
    // Aquí implementarías la lógica para cambiar el tema de tu app
    // Por ejemplo, usando un contexto de tema o actualizando el estado global
    
    setTimeout(() => {
      setApplyingTheme(false);
    }, 300);
  };

  // Cambiar el tema
  const handleThemeChange = (theme: ThemeMode) => {
    saveSettings({ ...settings, theme });
  };

  // Cambiar directorio de la base de datos
  const changeDatabaseLocation = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Info', 'Cambio de ubicación de base de datos no disponible en web');
      return;
    }

    try {
      Alert.alert(
        'Cambiar ubicación de BD',
        '¿Estás seguro de que quieres cambiar la ubicación de la base de datos?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Seleccionar carpeta',
            onPress: async () => {
              // En una implementación real, aquí abrirías un selector de directorios
              // Para este ejemplo, simulamos la selección de una nueva ruta
              const newPath = `${FileSystem.documentDirectory}backup/app.db`;
              
              try {
                // Crear directorio si no existe
                await FileSystem.makeDirectoryAsync(
                  `${FileSystem.documentDirectory}backup`,
                  { intermediates: true }
                );
                
                // Copiar la base de datos existente a la nueva ubicación
                const currentDb = SQLite.openDatabaseSync('app.db');
                // Nota: En una app real, necesitarías una forma de migrar los datos
                
                saveSettings({ ...settings, databasePath: newPath });
                Alert.alert('Éxito', 'Ubicación de base de datos cambiada');
              } catch (error) {
                console.error('Error changing database location:', error);
                Alert.alert('Error', 'No se pudo cambiar la ubicación de la base de datos');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error changing database location:', error);
      Alert.alert('Error', 'No se pudo cambiar la ubicación de la base de datos');
    }
  };

  // Restablecer ajustes por defecto
  const resetToDefaults = () => {
    Alert.alert(
      'Restablecer ajustes',
      '¿Estás seguro de que quieres restablecer todos los ajustes a sus valores por defecto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: async () => {
            const defaultSettings: AppSettings = {
              theme: 'auto',
              databasePath: 'app.db'
            };
            await saveSettings(defaultSettings);
            Alert.alert('Éxito', 'Ajustes restablecidos correctamente');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando ajustes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajustes</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Contenido */}
      <ScrollView style={styles.content}>
        {/* Sección de Apariencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          
          <View style={styles.optionCard}>
            <View style={styles.optionInfo}>
              <Ionicons name="contrast" size={22} color="#007AFF" style={styles.optionIcon} />
              <View>
                <Text style={styles.optionTitle}>Modo de tema</Text>
                <Text style={styles.optionDescription}>
                  Elige entre modo claro, oscuro o automático
                </Text>
              </View>
            </View>
            
            {applyingTheme ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <View style={styles.themeOptions}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    settings.theme === 'light' && styles.themeOptionSelected
                  ]}
                  onPress={() => handleThemeChange('light')}
                >
                  <Ionicons
                    name="sunny"
                    size={18}
                    color={settings.theme === 'light' ? '#007AFF' : '#666'}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      settings.theme === 'light' && styles.themeOptionTextSelected
                    ]}
                  >
                    Claro
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    settings.theme === 'dark' && styles.themeOptionSelected
                  ]}
                  onPress={() => handleThemeChange('dark')}
                >
                  <Ionicons
                    name="moon"
                    size={18}
                    color={settings.theme === 'dark' ? '#007AFF' : '#666'}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      settings.theme === 'dark' && styles.themeOptionTextSelected
                    ]}
                  >
                    Oscuro
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    settings.theme === 'auto' && styles.themeOptionSelected
                  ]}
                  onPress={() => handleThemeChange('auto')}
                >
                  <Ionicons
                    name="phone-portrait"
                    size={18}
                    color={settings.theme === 'auto' ? '#007AFF' : '#666'}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      settings.theme === 'auto' && styles.themeOptionTextSelected
                    ]}
                  >
                    Automático
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Sección de Almacenamiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Almacenamiento</Text>
          
          <TouchableOpacity style={styles.optionCard} onPress={changeDatabaseLocation}>
            <View style={styles.optionInfo}>
              <Ionicons name="folder" size={22} color="#007AFF" style={styles.optionIcon} />
              <View>
                <Text style={styles.optionTitle}>Ubicación de base de datos</Text>
                <Text style={styles.optionDescription} numberOfLines={1}>
                  {settings.databasePath}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Sección de Avanzado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avanzado</Text>
          
          <TouchableOpacity style={styles.optionCard} onPress={resetToDefaults}>
            <View style={styles.optionInfo}>
              <Ionicons name="refresh" size={22} color="#FF9500" style={styles.optionIcon} />
              <View>
                <Text style={styles.optionTitle}>Restablecer ajustes</Text>
                <Text style={styles.optionDescription}>
                  Vuelve a los valores predeterminados
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Información de la app */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Versión 1.0.0
          </Text>
          <Text style={styles.infoText}>
            © 2025 Tu App
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    top: 10
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 8,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  themeOptions: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  themeOptionSelected: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeOptionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  themeOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
});