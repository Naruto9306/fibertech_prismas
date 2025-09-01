import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Función para abrir la base de datos
const openDatabase = () => {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  return SQLite.openDatabaseSync('app.db');
};

// Tipos de datos
interface Route {
  id: number;
  name: string;
  coordinates: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  route_id: number;
  connectivity_devices: string;
  media_items: string;
}

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [connectivityDevices, setConnectivityDevices] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);

  // Dispositivos disponibles
  const availableDevices = [
    'WiFi',
    'Bluetooth',
    '4G/LTE',
    '5G',
    'LoRaWAN',
    'Satelital',
    'RFID',
    'Zigbee'
  ];

  // Cargar datos del proyecto y rutas
  useEffect(() => {
    loadProjectData();
    loadSavedRoutes();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const db = openDatabase();
      
      // Cargar proyecto
      const project = await db.getFirstAsync(
        'SELECT * FROM projects WHERE id = ?',
        [id]
      );

      if (project) {
        setProjectName(project.name);
        setDescription(project.description || '');
        setConnectivityDevices(JSON.parse(project.connectivity_devices || '[]'));
        setMediaItems(JSON.parse(project.media_items || '[]'));

        // Cargar ruta si existe
        if (project.route_id) {
          const route = await db.getFirstAsync(
            'SELECT * FROM routes WHERE id = ?',
            [project.route_id]
          );
          if (route) {
            setSelectedRoute(route);
          }
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
      Alert.alert('Error', 'No se pudo cargar el proyecto');
    }
  };

  const loadSavedRoutes = async () => {
    try {
      const db = openDatabase();
      
      // Verificar si la tabla routes existe
      const tableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='routes'"
      );
      
      if (tableExists) {
        const routes = await db.getAllAsync('SELECT * FROM routes');
        setSavedRoutes(routes);
      }
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  // Seleccionar medios multimedia
  const pickMedia = async (type: 'image' | 'video' | 'audio') => {
    try {
      // Solicitar permisos primero
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      let result;
      
      if (type === 'image') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      } else if (type === 'video') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });
      } else {
        Alert.alert('Info', 'Funcionalidad de audio en desarrollo');
        return;
      }

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: MediaItem = {
          id: Date.now().toString(),
          type,
          uri: asset.uri,
          name: asset.fileName || `media_${Date.now()}`
        };
        setMediaItems([...mediaItems, newMedia]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  // Actualizar proyecto
  const updateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'El nombre del proyecto es requerido');
      return;
    }

    if (!selectedRoute) {
      Alert.alert('Error', 'Debes seleccionar una ruta');
      return;
    }

    setIsSaving(true);

    try {
      const db = openDatabase();
      
      // Actualizar proyecto en la base de datos
      await db.runAsync(
        `UPDATE projects SET 
          name = ?, 
          description = ?, 
          route_id = ?, 
          connectivity_devices = ?, 
          media_items = ?
        WHERE id = ?`,
        [
          projectName,
          description,
          selectedRoute.id,
          JSON.stringify(connectivityDevices),
          JSON.stringify(mediaItems.map(item => ({
            id: item.id,
            type: item.type,
            uri: item.uri,
            name: item.name
          }))),
          id
        ]
      );

      Alert.alert(
        'Éxito', 
        'Proyecto actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert('Error', 'No se pudo actualizar el proyecto');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle dispositivo de conectividad
  const toggleDevice = (device: string) => {
    setConnectivityDevices(prev =>
      prev.includes(device)
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  // Eliminar medio multimedia
  const removeMedia = (mediaId: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== mediaId));
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando proyecto...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Proyecto</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.form}>
        {/* Nombre del Proyecto */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Proyecto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre del proyecto"
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu proyecto..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Selección de Ruta */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ruta *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setShowRouteModal(true)}
          >
            <Text style={styles.selectorText}>
              {selectedRoute ? selectedRoute.name : 'Seleccionar ruta...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Dispositivos de Conectividad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medios de Conectividad</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setShowDevicesModal(true)}
          >
            <Text style={styles.selectorText}>
              {connectivityDevices.length > 0 
                ? `${connectivityDevices.length} seleccionados` 
                : 'Seleccionar dispositivos...'
              }
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Multimedia */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Multimedia</Text>
          <View style={styles.mediaButtons}>
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => pickMedia('image')}
            >
              <Ionicons name="image" size={20} color="#007AFF" />
              <Text style={styles.mediaButtonText}>Imagen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => pickMedia('video')}
            >
              <Ionicons name="videocam" size={20} color="#007AFF" />
              <Text style={styles.mediaButtonText}>Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={() => pickMedia('audio')}
            >
              <Ionicons name="musical-notes" size={20} color="#007AFF" />
              <Text style={styles.mediaButtonText}>Audio</Text>
            </TouchableOpacity>
          </View>

          {/* Vista previa de medios */}
          {mediaItems.length > 0 && (
            <View style={styles.mediaPreview}>
              {mediaItems.map(item => (
                <View key={item.id} style={styles.mediaItem}>
                  {item.type === 'image' && (
                    <Image 
                      source={{ uri: item.uri }} 
                      style={styles.mediaThumbnail} 
                      resizeMode="cover"
                    />
                  )}
                  {item.type === 'video' && (
                    <View style={styles.mediaThumbnail}>
                      <Ionicons name="videocam" size={24} color="#666" />
                    </View>
                  )}
                  {item.type === 'audio' && (
                    <View style={styles.mediaThumbnail}>
                      <Ionicons name="musical-notes" size={24} color="#666" />
                    </View>
                  )}
                  <Text style={styles.mediaName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity 
                    style={styles.removeMediaButton}
                    onPress={() => removeMedia(item.id)}
                  >
                    <Ionicons name="close-circle" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={updateProject}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Selección de Rutas */}
      <Modal visible={showRouteModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Ruta</Text>
              <TouchableOpacity onPress={() => setShowRouteModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={savedRoutes}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.routeItem}
                  onPress={() => {
                    setSelectedRoute(item);
                    setShowRouteModal(false);
                  }}
                >
                  <Text style={styles.routeName}>{item.name}</Text>
                  <Ionicons 
                    name={selectedRoute?.id === item.id ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color="#007AFF" 
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="map" size={40} color="#ccc" />
                  <Text style={styles.emptyStateText}>No hay rutas guardadas</Text>
                  <TouchableOpacity 
                    style={styles.createRouteButton}
                    onPress={() => {
                      setShowRouteModal(false);
                      router.push('/map?from=edit-project');
                    }}
                  >
                    <Text style={styles.createRouteText}>Crear Nueva Ruta</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Dispositivos */}
      <Modal visible={showDevicesModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Dispositivos</Text>
              <TouchableOpacity onPress={() => setShowDevicesModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableDevices}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.deviceItem}
                  onPress={() => toggleDevice(item)}
                >
                  <Text style={styles.deviceName}>{item}</Text>
                  <Ionicons 
                    name={connectivityDevices.includes(item) ? "checkbox" : "square-outline"} 
                    size={20} 
                    color="#007AFF" 
                  />
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity 
              style={styles.modalDoneButton}
              onPress={() => setShowDevicesModal(false)}
            >
              <Text style={styles.modalDoneText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 80,
  },
  mediaButtonText: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaItem: {
    width: 80,
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  mediaName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#66a3ff',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  routeName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 20,
  },
  createRouteButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  createRouteText: {
    color: 'white',
    fontWeight: '600',
  },
  modalDoneButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalDoneText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});