import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Platform,
  SafeAreaView
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { 
  initDatabase, 
  addRoute, 
  addRoutePoint, 
  getRoutes, 
  getRoutePoints, 
  deleteRoute,
  Route
} from '../../services/database';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const sampleMarkers = [
  {
    id: 1,
    title: "Ubicación 1",
    description: "Primer punto de interés",
    latitude: 22.97,
    longitude: -82.275,
  },
];

export default function MapScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [currentRoutePoints, setCurrentRoutePoints] = useState<{latitude: number; longitude: number}[]>([]);
  const [routeName, setRouteName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState<any[]>([]);
  const [db, setDb] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  // Inicializar base de datos
  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
        await loadSavedRoutes(database);
        
        // Pequeño delay para evitar issues de layout en iOS
        setTimeout(() => {
          const defaultRegion = {
            latitude: -22.2725,
            longitude: -80.5557,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setRegion(defaultRegion);
          setLoading(false);
        }, 50);
      } catch (error) {
        console.error('Error inicializando base de datos:', error);
        setLoading(false);
      }
    };

    initializeDb();
  }, []);

  const loadSavedRoutes = async (database: any) => {
    if (!database) return;
    const routes = await getRoutes(database);
    setSavedRoutes(routes);
  };

  const handleMapPress = (event: any) => {
    if (!isCreatingRoute || !db) return;

    const { coordinate } = event.nativeEvent;
    const newPoint = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    };

    setCurrentRoutePoints(prev => [...prev, newPoint]);
  };

  const startCreatingRoute = () => {
    setIsCreatingRoute(true);
    setCurrentRoutePoints([]);
    setRouteName('');
  };

  const cancelCreatingRoute = () => {
    setIsCreatingRoute(false);
    setCurrentRoutePoints([]);
  };

  const saveRoute = async () => {
    if (!db || currentRoutePoints.length === 0 || !routeName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la ruta y asegúrate de tener al menos un punto');
      return;
    }

    try {
      const routeId = await addRoute(db, routeName.trim());
      
      for (const point of currentRoutePoints) {
        await addRoutePoint(db, routeId, point.latitude, point.longitude);
      }

      Alert.alert('Éxito', 'Ruta guardada correctamente');
      setIsCreatingRoute(false);
      setCurrentRoutePoints([]);
      setRouteName('');
      setShowSaveModal(false);
      await loadSavedRoutes(db);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la ruta');
    }
  };

  const loadRoute = async (route: Route) => {
    if (!db) return;

    try {
      const points = await getRoutePoints(db, route.id!);
      setSelectedRoute(route);
      setSelectedRoutePoints(points);
      
      if (points.length > 0) {
        const firstPoint = points[0];
        mapRef.current?.animateToRegion({
          latitude: firstPoint.latitude,
          longitude: firstPoint.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la ruta');
    }
  };

  const deleteSavedRoute = async (routeId: number) => {
    if (!db) return;

    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres eliminar esta ruta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await deleteRoute(db, routeId);
            await loadSavedRoutes(db);
            if (selectedRoute?.id === routeId) {
              setSelectedRoute(null);
              setSelectedRoutePoints([]);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }


  return (
    
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {region && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            mapType={mapType}
            showsCompass={true}
            zoomEnabled={true}
            scrollEnabled={true}
            rotateEnabled={true}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {/* Marcadores de ejemplo */}
            {/* {sampleMarkers.map(marker => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude
                }}
                title={marker.title}
                description={marker.description}
                pinColor="#4CAF50"
              />
            ))} */}

            {/* Puntos de la ruta actual */}
            {currentRoutePoints.map((point, index) => (
              <Marker
                key={`current-${index}`}
                coordinate={point}
                pinColor="#007AFF"
                title={`Punto ${index + 1}`}
              />
            ))}

            {/* Línea de la ruta actual */}
            {currentRoutePoints.length > 1 && (
              <Polyline
                coordinates={currentRoutePoints}
                strokeColor="#007AFF"
                strokeWidth={4}
              />
            )}

            {/* Ruta seleccionada */}
            {selectedRoutePoints.length > 0 && (
              <>
                {selectedRoutePoints.map((point, index) => (
                  <Marker
                    key={`saved-${point.id}`}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude
                    }}
                    pinColor="#FF6B00"
                    title={`${selectedRoute?.name} - Punto ${index + 1}`}
                  />
                ))}
                <Polyline
                  coordinates={selectedRoutePoints.map(p => ({
                    latitude: p.latitude,
                    longitude: p.longitude
                  }))}
                  strokeColor="#FF6B00"
                  strokeWidth={4}
                />
              </>
            )}
          </MapView>
        )}

        {/* Botones de control */}
        <View style={styles.controlsContainer}>
          {/* Botón para crear ruta */}
          <TouchableOpacity 
            style={[
              styles.controlButton,
              isCreatingRoute && styles.controlButtonActive
            ]}
            onPress={isCreatingRoute ? cancelCreatingRoute : startCreatingRoute}
          >
            <Ionicons 
              name={isCreatingRoute ? "close" : "trail-sign"} 
              size={24} 
              color={isCreatingRoute ? "#FF3B30" : "#007AFF"} 
            />
            <Text style={styles.controlButtonText}>
              {isCreatingRoute ? 'Cancelar' : 'Crear Ruta'}
            </Text>
          </TouchableOpacity>

          {/* Botón para ver rutas guardadas */}
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setShowRoutesModal(true)}
          >
            <Ionicons name="list" size={24} color="#007AFF" />
            <Text style={styles.controlButtonText}>Rutas Guardadas</Text>
          </TouchableOpacity>

          {/* Botón para guardar ruta */}
          {isCreatingRoute && currentRoutePoints.length > 0 && (
            <TouchableOpacity 
              style={[styles.controlButton, styles.saveButton]}
              onPress={() => setShowSaveModal(true)}
            >
              <Ionicons name="save" size={24} color="white" />
              <Text style={[styles.controlButtonText, { color: 'white' }]}>
                Guardar Ruta
              </Text>
            </TouchableOpacity>
          )}

          {/* Botón para limpiar ruta seleccionada */}
          {selectedRoute && (
            <TouchableOpacity 
              style={[styles.controlButton, styles.clearButton]}
              onPress={() => {
                setSelectedRoute(null);
                setSelectedRoutePoints([]);
              }}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
              <Text style={[styles.controlButtonText, { color: '#FF3B30' }]}>
                Limpiar Ruta
              </Text>
            </TouchableOpacity>
          )}
        </View>

      {/* Modal para guardar ruta */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Guardar Ruta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la ruta"
              value={routeName}
              onChangeText={setRouteName}
              maxLength={50}
            />
            <Text style={styles.pointsCount}>
              Puntos en la ruta: {currentRoutePoints.length}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={saveRoute}
                disabled={!routeName.trim()}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para ver rutas guardadas */}
      <Modal
        visible={showRoutesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRoutesModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.routesModal]}>
            <Text style={styles.modalTitle}>Rutas Guardadas</Text>
            
            {savedRoutes.length === 0 ? (
              <Text style={styles.noRoutesText}>No hay rutas guardadas</Text>
            ) : (
              <FlatList
                data={savedRoutes}
                keyExtractor={(item) => item.id?.toString() || ''}
                renderItem={({ item }) => (
                  <View style={styles.routeItem}>
                    <TouchableOpacity 
                      style={styles.routeName}
                      onPress={() => loadRoute(item)}
                    >
                      <Text style={styles.routeText}>{item.name}</Text>
                      <Text style={styles.routeDate}>
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => deleteSavedRoute(item.id!)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            <TouchableOpacity 
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowRoutesModal(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Botón de volver */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#007AFF" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  controlButtonActive: {
    backgroundColor: '#FFF0F0',
  },
  controlButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FFF0F0',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  controlButtonActive: {
    backgroundColor: '#FFF0F0',
  },
  controlButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FFF0F0',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxWidth: 400,
  },
  routesModal: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pointsCount: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    marginTop: 15,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  routeName: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  routeDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  noRoutesText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
    fontStyle: 'italic',
  },
});