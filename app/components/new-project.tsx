// // import React, { useState, useEffect } from 'react';
// // import { 
// //   View, 
// //   Text, 
// //   TextInput, 
// //   TouchableOpacity, 
// //   ScrollView, 
// //   Alert,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Modal,
// //   FlatList,
// //   Image,
// //   Platform
// // } from 'react-native';
// // import { router } from 'expo-router';
// // import * as SQLite from 'expo-sqlite';
// // import { Ionicons } from '@expo/vector-icons';
// // import * as ImagePicker from 'expo-image-picker';
// // import * as DocumentPicker from 'expo-document-picker';

// // // Función para abrir la base de datos corregida
// // const openDatabase = () => {
// //   if (Platform.OS === 'web') {
// //     return {
// //       transaction: (callback: any) => {
// //         callback({
// //           executeSql: () => {},
// //         });
// //       },
// //     };
// //   }
  
// //   try {
// //     const db = SQLite.openDatabaseSync('app.db');
// //     return db;
// //   } catch (error) {
// //     console.error('Error opening database:', error);
// //     // Retornar objeto simulado para web/error
// //     return {
// //       transaction: (callback: any) => {
// //         callback({
// //           executeSql: () => {},
// //         });
// //       },
// //     };
// //   }
// // };

// // // Tipos de datos
// // interface Route {
// //   id: number;
// //   name: string;
// //   coordinates: string;
// // }

// // interface MediaItem {
// //   id: string;
// //   type: 'image' | 'video' | 'document';
// //   uri: string;
// //   name: string;
// // }

// // export default function NewProjectScreen() {
// //   const [projectName, setProjectName] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [responsible, setResponsible] = useState('');
// //   const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
// //   const [connectivityDevices, setConnectivityDevices] = useState<string[]>([]);
// //   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [showRouteModal, setShowRouteModal] = useState(false);
// //   const [showDevicesModal, setShowDevicesModal] = useState(false);
// //   const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);

// //   // Dispositivos disponibles
// //   const availableDevices = [
// //     'WiFi',
// //     'Bluetooth',
// //     '4G/LTE',
// //     '5G',
// //     'LoRaWAN',
// //     'Satelital',
// //     'RFID',
// //     'Zigbee',
// //     'Fibra Óptica',
// //     'Radio Frecuencia'
// //   ];

// //   // Cargar rutas guardadas
// //   useEffect(() => {
// //     loadSavedRoutes();
// //   }, []);

// //   const loadSavedRoutes = () => {
// //     try {
// //       const db = openDatabase();
      
// //       db.transaction(tx => {
// //         tx.executeSql(
// //           "SELECT name FROM sqlite_master WHERE type='table' AND name='routes'",
// //           [],
// //           (_, { rows }) => {
// //             if (rows.length > 0) {
// //               // La tabla existe, obtener las rutas
// //               tx.executeSql(
// //                 'SELECT * FROM routes ORDER BY name',
// //                 [],
// //                 (_, { rows }) => {
// //                   const routes: Route[] = [];
// //                   for (let i = 0; i < rows.length; i++) {
// //                     routes.push(rows.item(i));
// //                   }
// //                   setSavedRoutes(routes);
// //                 },
// //                 (_, error) => {
// //                   console.error('Error loading routes:', error);
// //                   return false;
// //                 }
// //               );
// //             } else {
// //               console.log('La tabla routes no existe aún');
// //               setSavedRoutes([]);
// //             }
// //           },
// //           (_, error) => {
// //             console.error('Error checking table:', error);
// //             return false;
// //           }
// //         );
// //       });
// //     } catch (error) {
// //       console.error('Error loading routes:', error);
// //       Alert.alert('Error', 'No se pudieron cargar las rutas');
// //       setSavedRoutes([]);
// //     }
// //   };

// //   // Seleccionar medios multimedia
// //   const pickMedia = async (type: 'image' | 'video' | 'document') => {
// //     try {
// //       if (type === 'document') {
// //         // Para documentos
// //         const result = await DocumentPicker.getDocumentAsync({
// //           type: '*/*',
// //           copyToCacheDirectory: true,
// //         });
        
// //         if (result.canceled === false && result.assets[0]) {
// //           const asset = result.assets[0];
// //           const newMedia: MediaItem = {
// //             id: Date.now().toString(),
// //             type: 'document',
// //             uri: asset.uri,
// //             name: asset.name || `documento_${Date.now()}`
// //           };
// //           setMediaItems([...mediaItems, newMedia]);
// //         }
// //       } else {
// //         // Para imágenes y videos
// //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //         if (status !== 'granted') {
// //           Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la galería');
// //           return;
// //         }

// //         let result;
        
// //         if (type === 'image') {
// //           result = await ImagePicker.launchImageLibraryAsync({
// //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //             allowsEditing: true,
// //             quality: 0.8,
// //           });
// //         } else {
// //           result = await ImagePicker.launchImageLibraryAsync({
// //             mediaTypes: ImagePicker.MediaTypeOptions.Videos,
// //             allowsEditing: true,
// //             quality: 0.8,
// //           });
// //         }

// //         if (!result.canceled && result.assets[0]) {
// //           const asset = result.assets[0];
// //           const newMedia: MediaItem = {
// //             id: Date.now().toString(),
// //             type,
// //             uri: asset.uri,
// //             name: asset.fileName || `media_${Date.now()}`
// //           };
// //           setMediaItems([...mediaItems, newMedia]);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error picking media:', error);
// //       Alert.alert('Error', 'No se pudo seleccionar el archivo');
// //     }
// //   };

// //   // Guardar proyecto
// //   const saveProject = () => {
// //     if (!projectName.trim()) {
// //       Alert.alert('Error', 'El nombre del proyecto es requerido');
// //       return;
// //     }

// //     if (!responsible.trim()) {
// //       Alert.alert('Error', 'El responsable del proyecto es requerido');
// //       return;
// //     }

// //     if (!selectedRoute) {
// //       Alert.alert('Error', 'Debes seleccionar una ruta');
// //       return;
// //     }

// //     setIsLoading(true);

// //     try {
// //       const db = openDatabase();
// //       const projectId = Date.now().toString();
      
// //       db.transaction(tx => {
// //         // Crear tabla projects si no existe
// //         tx.executeSql(`
// //           CREATE TABLE IF NOT EXISTS projects (
// //             id TEXT PRIMARY KEY,
// //             name TEXT NOT NULL,
// //             description TEXT,
// //             responsible TEXT,
// //             route_id INTEGER,
// //             route_name TEXT,
// //             connectivity_devices TEXT,
// //             media_items TEXT,
// //             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// //           )
// //         `);
        
// //         // Guardar proyecto en la base de datos
// //         tx.executeSql(
// //           `INSERT INTO projects (
// //             id, name, description, responsible, route_id, route_name, 
// //             connectivity_devices, media_items
// //           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
// //           [
// //             projectId,
// //             projectName.trim(),
// //             description.trim(),
// //             responsible.trim(),
// //             selectedRoute.id,
// //             selectedRoute.name,
// //             JSON.stringify(connectivityDevices),
// //             JSON.stringify(mediaItems.map(item => ({
// //               id: item.id,
// //               type: item.type,
// //               uri: item.uri,
// //               name: item.name
// //             })))
// //           ],
// //           (_, result) => {
// //             Alert.alert(
// //               'Éxito', 
// //               'Proyecto creado correctamente',
// //               [
// //                 {
// //                   text: 'Ver Detalles',
// //                   onPress: () => router.push(`/project-details?id=${projectId}`)
// //                 },
// //                 {
// //                   text: 'Crear Otro',
// //                   onPress: () => resetForm()
// //                 },
// //                 {
// //                   text: 'Volver',
// //                   onPress: () => router.back()
// //                 }
// //               ]
// //             );
// //           },
// //           (_, error) => {
// //             console.error('Error saving project:', error);
// //             Alert.alert('Error', 'No se pudo guardar el proyecto');
// //             return false;
// //           }
// //         );
// //       });
// //     } catch (error) {
// //       console.error('Error saving project:', error);
// //       Alert.alert('Error', 'No se pudo guardar el proyecto');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Resetear formulario
// //   const resetForm = () => {
// //     setProjectName('');
// //     setDescription('');
// //     setResponsible('');
// //     setSelectedRoute(null);
// //     setConnectivityDevices([]);
// //     setMediaItems([]);
// //   };

// //   // Toggle dispositivo de conectividad
// //   const toggleDevice = (device: string) => {
// //     setConnectivityDevices(prev =>
// //       prev.includes(device)
// //         ? prev.filter(d => d !== device)
// //         : [...prev, device]
// //     );
// //   };

// //   // Eliminar medio multimedia
// //   const removeMedia = (id: string) => {
// //     setMediaItems(mediaItems.filter(item => item.id !== id));
// //   };

// //   // Obtener información de la ruta seleccionada
// //   const getRouteInfo = () => {
// //     if (!selectedRoute) return null;
    
// //     try {
// //       const coordinates = JSON.parse(selectedRoute.coordinates);
// //       return {
// //         points: coordinates.length,
// //         type: coordinates.length > 0 ? 'Ruta con puntos' : 'Ruta vacía'
// //       };
// //     } catch {
// //       return {
// //         points: 0,
// //         type: 'Información no disponible'
// //       };
// //     }
// //   };

// //   const routeInfo = getRouteInfo();

// //   return (
// //     <ScrollView style={styles.container}>
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
// //           <Ionicons name="arrow-back" size={24} color="#007AFF" />
// //         </TouchableOpacity>
// //         <Text style={styles.title}>Nuevo Proyecto</Text>
// //         <View style={styles.headerRight} />
// //       </View>

// //       <View style={styles.form}>
// //         {/* Nombre del Proyecto */}
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Nombre del Proyecto *</Text>
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Ingresa el nombre del proyecto"
// //             value={projectName}
// //             onChangeText={setProjectName}
// //           />
// //         </View>

// //         {/* Responsable */}
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Responsable *</Text>
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Nombre del responsable"
// //             value={responsible}
// //             onChangeText={setResponsible}
// //           />
// //         </View>

// //         {/* Descripción */}
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Descripción</Text>
// //           <TextInput
// //             style={[styles.input, styles.textArea]}
// //             placeholder="Describe tu proyecto, objetivos, alcance..."
// //             value={description}
// //             onChangeText={setDescription}
// //             multiline
// //             numberOfLines={4}
// //           />
// //         </View>

// //         {/* Selección de Ruta */}
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Ruta Asociada *</Text>
// //           <TouchableOpacity 
// //             style={styles.selectorButton}
// //             onPress={() => setShowRouteModal(true)}
// //           >
// //             <Text style={styles.selectorText}>
// //               {selectedRoute ? selectedRoute.name : 'Seleccionar ruta...'}
// //             </Text>
// //             <Ionicons name="chevron-down" size={20} color="#666" />
// //           </TouchableOpacity>
          
// //           {selectedRoute && routeInfo && (
// //             <View style={styles.routeInfo}>
// //               <Text style={styles.routeInfoText}>
// //                 {routeInfo.points} puntos • {routeInfo.type}
// //               </Text>
// //             </View>
// //           )}
// //         </View>

// //         {/* Dispositivos de Conectividad */}
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Tecnologías de Conectividad</Text>
// //           <TouchableOpacity 
// //             style={styles.selectorButton}
// //             onPress={() => setShowDevicesModal(true)}
// //           >
// //             <Text style={styles.selectorText}>
// //               {connectivityDevices.length > 0 
// //                 ? `${connectivityDevices.length} tecnología(s) seleccionada(s)` 
// //                 : 'Seleccionar tecnologías...'
// //               }
// //             </Text>
// //             <Ionicons name="chevron-down" size={20} color="#666" />
// //           </TouchableOpacity>
          
// //           {connectivityDevices.length > 0 && (
// //             <View style={styles.selectedDevices}>
// //               {connectivityDevices.map(device => (
// //                 <View key={device} style={styles.deviceTag}>
// //                   <Text style={styles.deviceTagText}>{device}</Text>
// //                   <TouchableOpacity onPress={() => toggleDevice(device)}>
// //                     <Ionicons name="close" size={16} color="#666" />
// //                   </TouchableOpacity>
// //                 </View>
// //               ))}
// //             </View>
// //           )}
// //         </View>

// //         {/* Multimedia */}
// //         <View style={styles.inputGroup}>
// //           <Text style={styles.label}>Documentación y Multimedia</Text>
// //           <Text style={styles.subLabel}>Imágenes, diagramas, documentos relevantes</Text>
          
// //           <View style={styles.mediaButtons}>
// //             <TouchableOpacity 
// //               style={styles.mediaButton}
// //               onPress={() => pickMedia('image')}
// //             >
// //               <Ionicons name="image" size={20} color="#007AFF" />
// //               <Text style={styles.mediaButtonText}>Imagen</Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={styles.mediaButton}
// //               onPress={() => pickMedia('video')}
// //             >
// //               <Ionicons name="videocam" size={20} color="#007AFF" />
// //               <Text style={styles.mediaButtonText}>Video</Text>
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={styles.mediaButton}
// //               onPress={() => pickMedia('document')}
// //             >
// //               <Ionicons name="document" size={20} color="#007AFF" />
// //               <Text style={styles.mediaButtonText}>Documento</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Vista previa de medios */}
// //           {mediaItems.length > 0 && (
// //             <View style={styles.mediaPreview}>
// //               <Text style={styles.mediaCount}>
// //                 {mediaItems.length} archivo(s) adjunto(s)
// //               </Text>
// //               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //                 {mediaItems.map(item => (
// //                   <View key={item.id} style={styles.mediaItem}>
// //                     {item.type === 'image' && (
// //                       <Image 
// //                         source={{ uri: item.uri }} 
// //                         style={styles.mediaThumbnail} 
// //                         resizeMode="cover"
// //                       />
// //                     )}
// //                     {(item.type === 'video' || item.type === 'document') && (
// //                       <View style={styles.mediaThumbnail}>
// //                         <Ionicons 
// //                           name={item.type === 'video' ? "videocam" : "document"} 
// //                           size={24} 
// //                           color="#666" 
// //                         />
// //                       </View>
// //                     )}
// //                     <Text style={styles.mediaName} numberOfLines={1}>
// //                       {item.name}
// //                     </Text>
// //                     <TouchableOpacity 
// //                       style={styles.removeMediaButton}
// //                       onPress={() => removeMedia(item.id)}
// //                     >
// //                       <Ionicons name="close-circle" size={20} color="#ff3b30" />
// //                     </TouchableOpacity>
// //                   </View>
// //                 ))}
// //               </ScrollView>
// //             </View>
// //           )}
// //         </View>

// //         {/* Botón Guardar */}
// //         <TouchableOpacity 
// //           style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
// //           onPress={saveProject}
// //           disabled={isLoading}
// //         >
// //           {isLoading ? (
// //             <ActivityIndicator color="white" />
// //           ) : (
// //             <Text style={styles.saveButtonText}>Crear Proyecto</Text>
// //           )}
// //         </TouchableOpacity>
// //       </View>

// //       {/* Modal de Selección de Rutas */}
// //       <Modal visible={showRouteModal} animationType="slide" transparent>
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Seleccionar Ruta</Text>
// //               <TouchableOpacity onPress={() => setShowRouteModal(false)}>
// //                 <Ionicons name="close" size={24} color="#666" />
// //               </TouchableOpacity>
// //             </View>
            
// //             <FlatList
// //               data={savedRoutes}
// //               keyExtractor={item => item.id.toString()}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.routeItem}
// //                   onPress={() => {
// //                     setSelectedRoute(item);
// //                     setShowRouteModal(false);
// //                   }}
// //                 >
// //                   <View style={styles.routeInfoContainer}>
// //                     <Text style={styles.routeName}>{item.name}</Text>
// //                     <Text style={styles.routeDetails}>
// //                       {JSON.parse(item.coordinates || '[]').length} puntos
// //                     </Text>
// //                   </View>
// //                   <Ionicons 
// //                     name={selectedRoute?.id === item.id ? "radio-button-on" : "radio-button-off"} 
// //                     size={20} 
// //                     color="#007AFF" 
// //                   />
// //                 </TouchableOpacity>
// //               )}
// //               ListEmptyComponent={
// //                 <View style={styles.emptyState}>
// //                   <Ionicons name="map" size={40} color="#ccc" />
// //                   <Text style={styles.emptyStateText}>No hay rutas guardadas</Text>
// //                   <Text style={styles.emptyStateSubtext}>
// //                     Crea una ruta primero para asociarla a un proyecto
// //                   </Text>
// //                 </View>
// //               }
// //             />
            
// //             <TouchableOpacity 
// //               style={styles.createRouteButton}
// //               onPress={() => {
// //                 setShowRouteModal(false);
// //                 router.push('../map');
// //               }}
// //             >
// //               <Ionicons name="add" size={20} color="white" />
// //               <Text style={styles.createRouteText}>Crear Nueva Ruta</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>

// //       {/* Modal de Dispositivos */}
// //       <Modal visible={showDevicesModal} animationType="slide" transparent>
// //         <View style={styles.modalContainer}>
// //           <View style={[styles.modalContent, styles.devicesModal]}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Tecnologías de Conectividad</Text>
// //               <TouchableOpacity onPress={() => setShowDevicesModal(false)}>
// //                 <Ionicons name="close" size={24} color="#666" />
// //               </TouchableOpacity>
// //             </View>
            
// //             <FlatList
// //               data={availableDevices}
// //               keyExtractor={item => item}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.deviceItem}
// //                   onPress={() => toggleDevice(item)}
// //                 >
// //                   <Text style={styles.deviceName}>{item}</Text>
// //                   <Ionicons 
// //                     name={connectivityDevices.includes(item) ? "checkbox" : "square-outline"} 
// //                     size={20} 
// //                     color="#007AFF" 
// //                   />
// //                 </TouchableOpacity>
// //               )}
// //             />
            
// //             <TouchableOpacity 
// //               style={styles.modalDoneButton}
// //               onPress={() => setShowDevicesModal(false)}
// //             >
// //               <Text style={styles.modalDoneText}>Aplicar Selección</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </ScrollView>
// //   );
// // }
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   ScrollView, 
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   Image,
//   Platform
// } from 'react-native';
// import { router } from 'expo-router';
// import * as SQLite from 'expo-sqlite';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';

// // Función para abrir la base de datos para expo-sqlite v15.2.14
// const openDatabase = () => {
//   if (Platform.OS === 'web') {
//     return {
//       // Métodos simulados para web
//       execAsync: async () => {},
//       getFirstAsync: async () => null,
//       getAllAsync: async () => [],
//       runAsync: async () => ({ lastInsertRowId: Date.now() }),
//     };
//   }
  
//   try {
//     const db = SQLite.openDatabaseSync('app.db');
//     return db;
//   } catch (error) {
//     console.error('Error opening database:', error);
//     // Retornar objeto simulado para error
//     return {
//       execAsync: async () => {},
//       getFirstAsync: async () => null,
//       getAllAsync: async () => [],
//       runAsync: async () => ({ lastInsertRowId: Date.now() }),
//     };
//   }
// };

// // Tipos de datos
// interface Route {
//   id: number;
//   name: string;
//   coordinates: string;
// }

// interface MediaItem {
//   id: string;
//   type: 'image' | 'video' | 'document';
//   uri: string;
//   name: string;
// }

// export default function NewProjectScreen() {
//   const [projectName, setProjectName] = useState('');
//   const [description, setDescription] = useState('');
//   const [responsible, setResponsible] = useState('');
//   const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
//   const [connectivityDevices, setConnectivityDevices] = useState<string[]>([]);
//   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRouteModal, setShowRouteModal] = useState(false);
//   const [showDevicesModal, setShowDevicesModal] = useState(false);
//   const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);

//   // Dispositivos disponibles
//   const availableDevices = [
//     'WiFi',
//     'Bluetooth',
//     '4G/LTE',
//     '5G',
//     'LoRaWAN',
//     'Satelital',
//     'RFID',
//     'Zigbee',
//     'Fibra Óptica',
//     'Radio Frecuencia'
//   ];

//   // Cargar rutas guardadas
//   useEffect(() => {
//     loadSavedRoutes();
//   }, []);

//   const loadSavedRoutes = async () => {
//     try {
//       const db = openDatabase();
      
//       // Verificar si la tabla routes existe
//       const tableExists = await db.getFirstAsync(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name='routes'"
//       );
      
//       if (tableExists) {
//         // Obtener las rutas
//         const routes = await db.getAllAsync('SELECT * FROM routes ORDER BY name');
//         setSavedRoutes(routes as Route[]);
//       } else {
//         console.log('La tabla routes no existe aún');
//         setSavedRoutes([]);
//       }
//     } catch (error) {
//       console.error('Error loading routes:', error);
//       Alert.alert('Error', 'No se pudieron cargar las rutas');
//       setSavedRoutes([]);
//     }
//   };

//   // Seleccionar medios multimedia
//   const pickMedia = async (type: 'image' | 'video' | 'document') => {
//     try {
//       if (type === 'document') {
//         // Para documentos
//         const result = await DocumentPicker.getDocumentAsync({
//           type: '*/*',
//           copyToCacheDirectory: true,
//         });
        
//         if (result.canceled === false && result.assets[0]) {
//           const asset = result.assets[0];
//           const newMedia: MediaItem = {
//             id: Date.now().toString(),
//             type: 'document',
//             uri: asset.uri,
//             name: asset.name || `documento_${Date.now()}`
//           };
//           setMediaItems([...mediaItems, newMedia]);
//         }
//       } else {
//         // Para imágenes y videos
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la galería');
//           return;
//         }

//         let result;
        
//         if (type === 'image') {
//           result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 0.8,
//           });
//         } else {
//           result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//             allowsEditing: true,
//             quality: 0.8,
//           });
//         }

//         if (!result.canceled && result.assets[0]) {
//           const asset = result.assets[0];
//           const newMedia: MediaItem = {
//             id: Date.now().toString(),
//             type,
//             uri: asset.uri,
//             name: asset.fileName || `media_${Date.now()}`
//           };
//           setMediaItems([...mediaItems, newMedia]);
//         }
//       }
//     } catch (error) {
//       console.error('Error picking media:', error);
//       Alert.alert('Error', 'No se pudo seleccionar el archivo');
//     }
//   };

//   // Guardar proyecto
//   const saveProject = async () => {
//     if (!projectName.trim()) {
//       Alert.alert('Error', 'El nombre del proyecto es requerido');
//       return;
//     }

//     if (!responsible.trim()) {
//       Alert.alert('Error', 'El responsable del proyecto es requerido');
//       return;
//     }

//     if (!selectedRoute) {
//       Alert.alert('Error', 'Debes seleccionar una ruta');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const db = openDatabase();
//       const projectId = Date.now().toString();
      
//       // Crear tabla projects si no existe
//       await db.execAsync(`
//         CREATE TABLE IF NOT EXISTS projects (
//           id TEXT PRIMARY KEY,
//           name TEXT NOT NULL,
//           description TEXT,
//           responsible TEXT,
//           route_id INTEGER,
//           route_name TEXT,
//           connectivity_devices TEXT,
//           media_items TEXT,
//           created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         )
//       `);
      
//       // Guardar proyecto en la base de datos
//       await db.runAsync(
//         `INSERT INTO projects (
//           id, name, description, responsible, route_id, route_name, 
//           connectivity_devices, media_items
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           projectId,
//           projectName.trim(),
//           description.trim(),
//           responsible.trim(),
//           selectedRoute.id,
//           selectedRoute.name,
//           JSON.stringify(connectivityDevices),
//           JSON.stringify(mediaItems.map(item => ({
//             id: item.id,
//             type: item.type,
//             uri: item.uri,
//             name: item.name
//           })))
//         ]
//       );

//       Alert.alert(
//         'Éxito', 
//         'Proyecto creado correctamente',
//         [
//           {
//             text: 'Ver Detalles',
//             onPress: () => router.push(`/project-details?id=${projectId}`)
//           },
//           {
//             text: 'Crear Otro',
//             onPress: () => resetForm()
//           },
//           {
//             text: 'Volver',
//             onPress: () => router.back()
//           }
//         ]
//       );
//     } catch (error) {
//       console.error('Error saving project:', error);
//       Alert.alert('Error', 'No se pudo guardar el proyecto');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Resetear formulario
//   const resetForm = () => {
//     setProjectName('');
//     setDescription('');
//     setResponsible('');
//     setSelectedRoute(null);
//     setConnectivityDevices([]);
//     setMediaItems([]);
//   };

//   // Toggle dispositivo de conectividad
//   const toggleDevice = (device: string) => {
//     setConnectivityDevices(prev =>
//       prev.includes(device)
//         ? prev.filter(d => d !== device)
//         : [...prev, device]
//     );
//   };

//   // Eliminar medio multimedia
//   const removeMedia = (id: string) => {
//     setMediaItems(mediaItems.filter(item => item.id !== id));
//   };

//   // Obtener información de la ruta seleccionada
//   const getRouteInfo = () => {
//     if (!selectedRoute) return null;
    
//     try {
//       const coordinates = JSON.parse(selectedRoute.coordinates);
//       return {
//         points: coordinates.length,
//         type: coordinates.length > 0 ? 'Ruta con puntos' : 'Ruta vacía'
//       };
//     } catch {
//       return {
//         points: 0,
//         type: 'Información no disponible'
//       };
//     }
//   };

//   const routeInfo = getRouteInfo();

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Nuevo Proyecto</Text>
//         <View style={styles.headerRight} />
//       </View>

//       <View style={styles.form}>
//         {/* Nombre del Proyecto */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Nombre del Proyecto *</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Ingresa el nombre del proyecto"
//             value={projectName}
//             onChangeText={setProjectName}
//           />
//         </View>

//         {/* Responsable */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Responsable *</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Nombre del responsable"
//             value={responsible}
//             onChangeText={setResponsible}
//           />
//         </View>

//         {/* Descripción */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Descripción</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Describe tu proyecto, objetivos, alcance..."
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             numberOfLines={4}
//           />
//         </View>

//         {/* Selección de Ruta */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Ruta Asociada *</Text>
//           <TouchableOpacity 
//             style={styles.selectorButton}
//             onPress={() => setShowRouteModal(true)}
//           >
//             <Text style={styles.selectorText}>
//               {selectedRoute ? selectedRoute.name : 'Seleccionar ruta...'}
//             </Text>
//             <Ionicons name="chevron-down" size={20} color="#666" />
//           </TouchableOpacity>
          
//           {selectedRoute && routeInfo && (
//             <View style={styles.routeInfo}>
//               <Text style={styles.routeInfoText}>
//                 {routeInfo.points} puntos • {routeInfo.type}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Dispositivos de Conectividad */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Tecnologías de Conectividad</Text>
//           <TouchableOpacity 
//             style={styles.selectorButton}
//             onPress={() => setShowDevicesModal(true)}
//           >
//             <Text style={styles.selectorText}>
//               {connectivityDevices.length > 0 
//                 ? `${connectivityDevices.length} tecnología(s) seleccionada(s)` 
//                 : 'Seleccionar tecnologías...'
//               }
//             </Text>
//             <Ionicons name="chevron-down" size={20} color="#666" />
//           </TouchableOpacity>
          
//           {connectivityDevices.length > 0 && (
//             <View style={styles.selectedDevices}>
//               {connectivityDevices.map(device => (
//                 <View key={device} style={styles.deviceTag}>
//                   <Text style={styles.deviceTagText}>{device}</Text>
//                   <TouchableOpacity onPress={() => toggleDevice(device)}>
//                     <Ionicons name="close" size={16} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>

//         {/* Multimedia */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Documentación y Multimedia</Text>
//           <Text style={styles.subLabel}>Imágenes, diagramas, documentos relevantes</Text>
          
//           <View style={styles.mediaButtons}>
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => pickMedia('image')}
//             >
//               <Ionicons name="image" size={20} color="#007AFF" />
//               <Text style={styles.mediaButtonText}>Imagen</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => pickMedia('video')}
//             >
//               <Ionicons name="videocam" size={20} color="#007AFF" />
//               <Text style={styles.mediaButtonText}>Video</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.mediaButton}
//               onPress={() => pickMedia('document')}
//             >
//               <Ionicons name="document" size={20} color="#007AFF" />
//               <Text style={styles.mediaButtonText}>Documento</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Vista previa de medios */}
//           {mediaItems.length > 0 && (
//             <View style={styles.mediaPreview}>
//               <Text style={styles.mediaCount}>
//                 {mediaItems.length} archivo(s) adjunto(s)
//               </Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {mediaItems.map(item => (
//                   <View key={item.id} style={styles.mediaItem}>
//                     {item.type === 'image' && (
//                       <Image 
//                         source={{ uri: item.uri }} 
//                         style={styles.mediaThumbnail} 
//                         resizeMode="cover"
//                       />
//                     )}
//                     {(item.type === 'video' || item.type === 'document') && (
//                       <View style={styles.mediaThumbnail}>
//                         <Ionicons 
//                           name={item.type === 'video' ? "videocam" : "document"} 
//                           size={24} 
//                           color="#666" 
//                         />
//                       </View>
//                     )}
//                     <Text style={styles.mediaName} numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                     <TouchableOpacity 
//                       style={styles.removeMediaButton}
//                       onPress={() => removeMedia(item.id)}
//                     >
//                       <Ionicons name="close-circle" size={20} color="#ff3b30" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </ScrollView>
//             </View>
//           )}
//         </View>

//         {/* Botón Guardar */}
//         <TouchableOpacity 
//           style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
//           onPress={saveProject}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.saveButtonText}>Crear Proyecto</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Modal de Selección de Rutas */}
//       <Modal visible={showRouteModal} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Seleccionar Ruta</Text>
//               <TouchableOpacity onPress={() => setShowRouteModal(false)}>
//                 <Ionicons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <FlatList
//               data={savedRoutes}
//               keyExtractor={item => item.id.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.routeItem}
//                   onPress={() => {
//                     setSelectedRoute(item);
//                     setShowRouteModal(false);
//                   }}
//                 >
//                   <View style={styles.routeInfoContainer}>
//                     <Text style={styles.routeName}>{item.name}</Text>
//                     <Text style={styles.routeDetails}>
//                       {JSON.parse(item.coordinates || '[]').length} puntos
//                     </Text>
//                   </View>
//                   <Ionicons 
//                     name={selectedRoute?.id === item.id ? "radio-button-on" : "radio-button-off"} 
//                     size={20} 
//                     color="#007AFF" 
//                   />
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={
//                 <View style={styles.emptyState}>
//                   <Ionicons name="map" size={40} color="#ccc" />
//                   <Text style={styles.emptyStateText}>No hay rutas guardadas</Text>
//                   <Text style={styles.emptyStateSubtext}>
//                     Crea una ruta primero para asociarla a un proyecto
//                   </Text>
//                 </View>
//               }
//             />
            
//             <TouchableOpacity 
//               style={styles.createRouteButton}
//               onPress={() => {
//                 setShowRouteModal(false);
//                 router.push('../map');
//               }}
//             >
//               <Ionicons name="add" size={20} color="white" />
//               <Text style={styles.createRouteText}>Crear Nueva Ruta</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Modal de Dispositivos */}
//       <Modal visible={showDevicesModal} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={[styles.modalContent, styles.devicesModal]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Tecnologías de Conectividad</Text>
//               <TouchableOpacity onPress={() => setShowDevicesModal(false)}>
//                 <Ionicons name="close" size={24} color="#666" />
//               </TouchableOpacity>
//             </View>
            
//             <FlatList
//               data={availableDevices}
//               keyExtractor={item => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.deviceItem}
//                   onPress={() => toggleDevice(item)}
//                 >
//                   <Text style={styles.deviceName}>{item}</Text>
//                   <Ionicons 
//                     name={connectivityDevices.includes(item) ? "checkbox" : "square-outline"} 
//                     size={20} 
//                     color="#007AFF" 
//                   />
//                 </TouchableOpacity>
//               )}
//             />
            
//             <TouchableOpacity 
//               style={styles.modalDoneButton}
//               onPress={() => setShowDevicesModal(false)}
//             >
//               <Text style={styles.modalDoneText}>Aplicar Selección</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }


// // Estilos (se mantienen igual que en tu código original)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   backButton: {
//     padding: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   headerRight: {
//     width: 40,
//   },
//   form: {
//     padding: 20,
//   },
//   inputGroup: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   subLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     fontSize: 16,
//   },
//   textArea: {
//     minHeight: 100,
//     textAlignVertical: 'top',
//   },
//   selectorButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   selectorText: {
//     fontSize: 16,
//     color: '#2c3e50',
//   },
//   routeInfo: {
//     marginTop: 8,
//     padding: 8,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 6,
//   },
//   routeInfoText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   selectedDevices: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//   },
//   deviceTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#e3f2fd',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     gap: 4,
//   },
//   deviceTagText: {
//     color: '#1976d2',
//     fontSize: 14,
//   },
//   mediaButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 12,
//   },
//   mediaButton: {
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#007AFF',
//     minWidth: 80,
//   },
//   mediaButtonText: {
//     color: '#007AFF',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   mediaPreview: {
//     marginTop: 8,
//   },
//   mediaCount: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 8,
//   },
//   mediaItem: {
//     width: 80,
//     alignItems: 'center',
//     marginRight: 12,
//     position: 'relative',
//   },
//   mediaThumbnail: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   mediaName: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   removeMediaButton: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   saveButton: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   saveButtonDisabled: {
//     backgroundColor: '#66a3ff',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',
//   },
//   devicesModal: {
//     maxHeight: '90%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2c3e50',
//   },
//   routeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   routeInfoContainer: {
//     flex: 1,
//   },
//   routeName: {
//     fontSize: 16,
//     color: '#2c3e50',
//     fontWeight: '500',
//   },
//   routeDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 2,
//   },
//   deviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   deviceName: {
//     fontSize: 16,
//     color: '#2c3e50',
//   },
//   emptyState: {
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     marginHorizontal: 20,
//   },
//   createRouteButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#007AFF',
//     padding: 16,
//     margin: 20,
//     borderRadius: 8,
//     gap: 8,
//   },
//   createRouteText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modalDoneButton: {
//     padding: 16,
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   modalDoneText: {
//     color: '#007AFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

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
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// Función para abrir la base de datos para expo-sqlite v15.2.14
const openDatabase = () => {
  if (Platform.OS === 'web') {
    return {
      // Métodos simulados para web
      execAsync: async () => {},
      getFirstAsync: async () => null,
      getAllAsync: async () => [],
      runAsync: async () => ({ lastInsertRowId: Date.now() }),
    };
  }
  
  try {
    const db = SQLite.openDatabaseSync('app.db');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    // Retornar objeto simulado para error
    return {
      execAsync: async () => {},
      getFirstAsync: async () => null,
      getAllAsync: async () => [],
      runAsync: async () => ({ lastInsertRowId: Date.now() }),
    };
  }
};

// Tipos de datos
interface Route {
  id: number;
  name: string;
  coordinates: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  uri: string;
  name: string;
}

export default function NewProjectScreen() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [connectivityDevices, setConnectivityDevices] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    'Zigbee',
    'Fibra Óptica',
    'Radio Frecuencia'
  ];

  // Cargar rutas guardadas cada vez que se abre el modal
  useEffect(() => {
    if (showRouteModal) {
      loadSavedRoutes();
    }
  }, [showRouteModal]);

  const loadSavedRoutes = async () => {
    try {
      const db = openDatabase();
      
      // Verificar si la tabla routes existe
      const tableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='routes'"
      );
      
      if (tableExists) {
        // Obtener las rutas
        const routes = await db.getAllAsync('SELECT * FROM routes ORDER BY name');
        setSavedRoutes(routes as Route[]);
      } else {
        console.log('La tabla routes no existe aún');
        setSavedRoutes([]);
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      Alert.alert('Error', 'No se pudieron cargar las rutas');
      setSavedRoutes([]);
    }
  };

  // Seleccionar medios multimedia
  const pickMedia = async (type: 'image' | 'video' | 'document') => {
    try {
      if (type === 'document') {
        // Para documentos
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });
        
        if (result.canceled === false && result.assets[0]) {
          const asset = result.assets[0];
          const newMedia: MediaItem = {
            id: Date.now().toString(),
            type: 'document',
            uri: asset.uri,
            name: asset.name || `documento_${Date.now()}`
          };
          setMediaItems([...mediaItems, newMedia]);
        }
      } else {
        // Para imágenes y videos
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
            quality: 0.8,
          });
        } else {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 0.8,
          });
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
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  // Guardar proyecto
  const saveProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'El nombre del proyecto es requerido');
      return;
    }

    if (!responsible.trim()) {
      Alert.alert('Error', 'El responsable del proyecto es requerido');
      return;
    }

    if (!selectedRoute) {
      Alert.alert('Error', 'Debes seleccionar una ruta');
      return;
    }

    setIsLoading(true);

    try {
      const db = openDatabase();
      const projectId = Date.now().toString();
      
      // Crear tabla projects si no existe
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          responsible TEXT,
          route_id INTEGER,
          route_name TEXT,
          connectivity_devices TEXT,
          media_items TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Guardar proyecto en la base de datos
      await db.runAsync(
        `INSERT INTO projects (
          id, name, description, responsible, route_id, route_name, 
          connectivity_devices, media_items
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          projectName.trim(),
          description.trim(),
          responsible.trim(),
          selectedRoute.id,
          selectedRoute.name,
          JSON.stringify(connectivityDevices),
          JSON.stringify(mediaItems.map(item => ({
            id: item.id,
            type: item.type,
            uri: item.uri,
            name: item.name
          })))
        ]
      );

      Alert.alert(
        'Éxito', 
        'Proyecto creado correctamente',
        [
          // {
          //   text: 'Ver Detalles',
          //   onPress: () => router.push(`/project-details?id=${projectId}`)
          // },
          {
            text: 'Crear Otro',
            onPress: () => resetForm()
          },
          {
            text: 'Volver',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'No se pudo guardar el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setProjectName('');
    setDescription('');
    setResponsible('');
    setSelectedRoute(null);
    setConnectivityDevices([]);
    setMediaItems([]);
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
  const removeMedia = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  // Obtener información de la ruta seleccionada
  const getRouteInfo = () => {
    if (!selectedRoute) return null;
    
    try {
      // Obtener información de la ruta desde la base de datos
      return {
        points: 0, // Se puede mejorar obteniendo el conteo real de nodos
        type: 'Ruta de fibra óptica'
      };
    } catch {
      return {
        points: 0,
        type: 'Información no disponible'
      };
    }
  };

  const routeInfo = getRouteInfo();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Proyecto</Text>
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

        {/* Responsable */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Responsable *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del responsable"
            value={responsible}
            onChangeText={setResponsible}
          />
        </View>

        {/* Descripción */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu proyecto, objetivos, alcance..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Selección de Ruta */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ruta Asociada *</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setShowRouteModal(true)}
          >
            <Text style={styles.selectorText}>
              {selectedRoute ? selectedRoute.name : 'Seleccionar ruta...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          {selectedRoute && routeInfo && (
            <View style={styles.routeInfo}>
              <Text style={styles.routeInfoText}>
                {routeInfo.points} puntos • {routeInfo.type}
              </Text>
            </View>
          )}
        </View>

        {/* Dispositivos de Conectividad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tecnologías de Conectividad</Text>
          <TouchableOpacity 
            style={styles.selectorButton}
            onPress={() => setShowDevicesModal(true)}
          >
            <Text style={styles.selectorText}>
              {connectivityDevices.length > 0 
                ? `${connectivityDevices.length} tecnología(s) seleccionada(s)` 
                : 'Seleccionar tecnologías...'
              }
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          {connectivityDevices.length > 0 && (
            <View style={styles.selectedDevices}>
              {connectivityDevices.map(device => (
                <View key={device} style={styles.deviceTag}>
                  <Text style={styles.deviceTagText}>{device}</Text>
                  <TouchableOpacity onPress={() => toggleDevice(device)}>
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Multimedia */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Documentación y Multimedia</Text>
          <Text style={styles.subLabel}>Imágenes, diagramas, documentos relevantes</Text>
          
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
              onPress={() => pickMedia('document')}
            >
              <Ionicons name="document" size={20} color="#007AFF" />
              <Text style={styles.mediaButtonText}>Documento</Text>
            </TouchableOpacity>
          </View>

          {/* Vista previa de medios */}
          {mediaItems.length > 0 && (
            <View style={styles.mediaPreview}>
              <Text style={styles.mediaCount}>
                {mediaItems.length} archivo(s) adjunto(s)
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mediaItems.map(item => (
                  <View key={item.id} style={styles.mediaItem}>
                    {item.type === 'image' && (
                      <Image 
                        source={{ uri: item.uri }} 
                        style={styles.mediaThumbnail} 
                        resizeMode="cover"
                      />
                    )}
                    {(item.type === 'video' || item.type === 'document') && (
                      <View style={styles.mediaThumbnail}>
                        <Ionicons 
                          name={item.type === 'video' ? "videocam" : "document"} 
                          size={24} 
                          color="#666" 
                        />
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
              </ScrollView>
            </View>
          )}
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={saveProject}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Crear Proyecto</Text>
          )}
        </TouchableOpacity>
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
                  <View style={styles.routeInfoContainer}>
                    <Text style={styles.routeName}>{item.name}</Text>
                    <Text style={styles.routeDetails}>
                      Ruta de fibra óptica
                    </Text>
                  </View>
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
                  <Text style={styles.emptyStateSubtext}>
                    Crea una ruta primero para asociarla a un proyecto
                  </Text>
                </View>
              }
            />
            
            <TouchableOpacity 
              style={styles.createRouteButton}
              onPress={() => {
                setShowRouteModal(false);
                router.push('../map');
              }}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.createRouteText}>Crear Nueva Ruta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Dispositivos */}
      <Modal visible={showDevicesModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.devicesModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tecnologías de Conectividad</Text>
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
              <Text style={styles.modalDoneText}>Aplicar Selección</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// Estilos (se mantienen igual que en tu código original)
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
  subLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  routeInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  routeInfoText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDevices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  deviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  deviceTagText: {
    color: '#1976d2',
    fontSize: 14,
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
    marginTop: 8,
  },
  mediaCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  mediaItem: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
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
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#66a3ff',
  },
  saveButtonText: {
    color: 'white',
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
  devicesModal: {
    maxHeight: '90%',
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
  routeInfoContainer: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  routeDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  createRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    gap: 8,
  },
  createRouteText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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