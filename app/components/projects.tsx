// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   FlatList, 
//   StyleSheet, 
//   Alert,
//   ActivityIndicator,
//   Modal,
//   Image,
//   ScrollView,
//   Platform,
//   Linking,
//   Dimensions
// } from 'react-native';
// import { router } from 'expo-router';
// import * as SQLite from 'expo-sqlite';
// import { Ionicons } from '@expo/vector-icons';
// import { Audio } from 'expo-av';

// // Función para abrir la base de datos
// const openDatabase = () => {
//   if (Platform.OS === 'web') {
//     return {
//       transaction: () => {
//         return {
//           executeSql: () => {},
//         };
//       },
//     };
//   }
//   return SQLite.openDatabaseSync('app.db');
// };

// // Tipos de datos
// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   route_id: number;
//   connectivity_devices: string;
//   media_items: string;
//   created_at: string;
//   route_name?: string;
// }

// interface MediaItem {
//   id: string;
//   type: 'image' | 'video' | 'audio';
//   uri: string;
//   name: string;
// }

// const { width, height } = Dimensions.get('window');

// export default function ProjectsScreen() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showMediaModal, setShowMediaModal] = useState(false);
//   const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showRouteModal, setShowRouteModal] = useState(false);
//   const [selectedRoute, setSelectedRoute] = useState<any>(null);

//   // Cargar proyectos
//   const loadProjects = async () => {
//     try {
//       const db = openDatabase();
      
//       // Verificar si la tabla projects existe
//       const tableExists = await db.getFirstAsync(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name='projects'"
//       );
      
//       if (tableExists) {
//         // Obtener proyectos con información de la ruta
//         const projectsData = await db.getAllAsync(`
//           SELECT p.*, r.name as route_name 
//           FROM projects p 
//           LEFT JOIN routes r ON p.route_id = r.id 
//           ORDER BY p.created_at DESC
//         `);
        
//         setProjects(projectsData);
//       } else {
//         setProjects([]);
//       }
//     } catch (error) {
//       console.error('Error loading projects:', error);
//       Alert.alert('Error', 'No se pudieron cargar los proyectos');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const openRouteDetails = async (routeId: number) => {
//     try {
//       const db = openDatabase();
//       const routeData = await db.getFirstAsync(
//         'SELECT * FROM routes WHERE id = ?',
//         [routeId]
//       );
      
//       if (routeData) {
//         setSelectedRoute(routeData);
//         setShowRouteModal(true);
//       } else {
//         Alert.alert('Error', 'No se encontró información de la ruta');
//       }
//     } catch (error) {
//       console.error('Error loading route details:', error);
//       Alert.alert('Error', 'No se pudieron cargar los detalles de la ruta');
//     }
//   };

//   useEffect(() => {
//     loadProjects();
    
//     return () => {
//       // Limpiar el sonido al desmontar
//       if (sound) {
//         sound.unloadAsync();
//       }
//     };
//   }, []);

//   // Reproducir/pausar audio
//   const toggleAudio = async (media: MediaItem) => {
//     try {
//       if (sound) {
//         if (isPlaying) {
//           await sound.pauseAsync();
//           setIsPlaying(false);
//         } else {
//           await sound.playAsync();
//           setIsPlaying(true);
//         }
//       } else {
//         const { sound: newSound } = await Audio.Sound.createAsync(
//           { uri: media.uri },
//           { shouldPlay: true }
//         );
//         setSound(newSound);
//         setIsPlaying(true);

//         newSound.setOnPlaybackStatusUpdate((status: any) => {
//           if (status.didJustFinish) {
//             setIsPlaying(false);
//           }
//         });
//       }
//     } catch (error) {
//       console.error('Error playing audio:', error);
//       Alert.alert('Error', 'No se pudo reproducir el audio');
//     }
//   };

//   // Abrir imagen en modal
//   const openImage = (media: MediaItem) => {
//     setSelectedMedia(media);
//     setShowMediaModal(true);
//   };

//   // Abrir video (intentar abrir con app externa)
//   // const openVideo = async (media: MediaItem) => {
//   //   try {
//   //     const canOpen = await Linking.canOpenURL(media.uri);
//   //     if (canOpen) {
//   //       await Linking.openURL(media.uri);
//   //     } else {
//   //       Alert.alert('Error', 'No se puede abrir el video');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error opening video:', error);
//   //     Alert.alert('Error', 'No se pudo abrir el video');
//   //   }
//   // };
//   const openVideo = async (media: MediaItem) => {
//   try {
//     // Verificar si el archivo existe localmente primero
//     const fileInfo = await FileSystem.getInfoAsync(media.uri);
    
//     if (!fileInfo.exists) {
//       Alert.alert('Error', 'El archivo de video no se encuentra disponible');
//       return;
//     }

//     const supported = await Linking.canOpenURL(media.uri);
    
//     if (supported) {
//       await Linking.openURL(media.uri);
//     } else {
//       // Si no se puede abrir con una app externa, mostrar un mensaje
//       Alert.alert(
//         'No se puede abrir el video',
//         'No hay aplicaciones disponibles para reproducir este video. ¿Quieres intentar copiar la ruta del archivo?',
//         [
//           {
//             text: 'Cancelar',
//             style: 'cancel'
//           },
//           {
//             text: 'Copiar ruta',
//             onPress: async () => {
//               try {
//                 await Clipboard.setStringAsync(media.uri);
//                 Alert.alert('Éxito', 'Ruta del video copiada al portapapeles');
//               } catch (error) {
//                 console.error('Error copying to clipboard:', error);
//               }
//             }
//           }
//         ]
//       );
//     }
//   } catch (error) {
//     console.error('Error opening video:', error);
//     Alert.alert('Error', 'No se pudo abrir el video');
//   }
// };

//   // Eliminar proyecto
//   const deleteProject = async (projectId: string) => {
//     Alert.alert(
//       'Confirmar eliminación',
//       '¿Estás seguro de que quieres eliminar este proyecto?',
//       [
//         {
//           text: 'Cancelar',
//           style: 'cancel'
//         },
//         {
//           text: 'Eliminar',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const db = openDatabase();
//               await db.runAsync('DELETE FROM projects WHERE id = ?', [projectId]);
//               Alert.alert('Éxito', 'Proyecto eliminado correctamente');
//               loadProjects(); // Recargar la lista
//             } catch (error) {
//               console.error('Error deleting project:', error);
//               Alert.alert('Error', 'No se pudo eliminar el proyecto');
//             }
//           }
//         }
//       ]
//     );
//   };

//   // Formatear fecha
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('es-ES', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Renderizar cada item de proyecto
//   const renderProjectItem = ({ item }: { item: Project }) => (
//     <TouchableOpacity 
//       style={styles.projectCard}
//       onPress={() => {
//         setSelectedProject(item);
//         setShowDetailsModal(true);
//       }}
//     >
//       <View style={styles.cardHeader}>
//         <Text style={styles.projectName} numberOfLines={1}>
//           {item.name}
//         </Text>
//         <TouchableOpacity 
//           onPress={(e) => {
//             e.stopPropagation();
//             deleteProject(item.id);
//           }}
//         >
//           <Ionicons name="trash" size={20} color="#ff3b30" />
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.projectDescription} numberOfLines={2}>
//         {item.description || 'Sin descripción'}
//       </Text>

//       <View style={styles.cardFooter}>
//         <View style={styles.footerInfo}>
//           <Ionicons name="map" size={16} color="#666" />
//           <Text style={styles.routeName}>
//             {item.route_name || 'Ruta no disponible'}
//           </Text>
//         </View>
        
//         <View style={styles.footerInfo}>
//           <Ionicons name="time" size={16} color="#666" />
//           <Text style={styles.dateText}>
//             {formatDate(item.created_at)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.dispositivosContainer}>
//         {JSON.parse(item.connectivity_devices || '[]').slice(0, 3).map((device: string, index: number) => (
//           <View key={index} style={styles.dispositivoTag}>
//             <Text style={styles.dispositivoText}>{device}</Text>
//           </View>
//         ))}
//         {JSON.parse(item.connectivity_devices || '[]').length > 3 && (
//           <View style={styles.moreTag}>
//             <Text style={styles.moreText}>
//               +{JSON.parse(item.connectivity_devices || '[]').length - 3}
//             </Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   // Modal de detalles del proyecto
//   const renderDetailsModal = () => (
//     <Modal 
//       visible={showDetailsModal} 
//       animationType="slide" 
//       transparent
//       onRequestClose={() => {
//         setShowDetailsModal(false);
//         if (sound) {
//           sound.stopAsync();
//           setIsPlaying(false);
//         }
//       }}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Detalles del Proyecto</Text>
//             <TouchableOpacity onPress={() => {
//               setShowDetailsModal(false);
//               if (sound) {
//                 sound.stopAsync();
//                 setIsPlaying(false);
//               }
//             }}>
//               <Ionicons name="close" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {selectedProject && (
//             <ScrollView style={styles.modalBody}>
//               {/* Información básica */}
//               <View style={styles.detailSection}>
//                 <Text style={styles.detailLabel}>Nombre</Text>
//                 <Text style={styles.detailValue}>{selectedProject.name}</Text>
//               </View>

//               <View style={styles.detailSection}>
//                 <Text style={styles.detailLabel}>Descripción</Text>
//                 <Text style={[styles.detailValue, !selectedProject.description && styles.placeholderText]}>
//                   {selectedProject.description || 'No hay descripción'}
//                 </Text>
//               </View>

//               <View style={styles.detailSection}>
//                 <Text style={styles.detailLabel}>Ruta asociada</Text>
//                 <View style={styles.routeContainer}>
//                   <Text style={styles.detailValue}>
//                     {selectedProject.route_name || 'Ruta no disponible'}
//                   </Text>
//                   {selectedProject.route_id && (
//                     <TouchableOpacity 
//                       style={styles.routeButton}
//                       onPress={() => openRouteDetails(selectedProject.route_id)}
//                     >
//                       <Ionicons name="eye" size={20} color="#007AFF" />
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>

//               <View style={styles.detailSection}>
//                 <Text style={styles.detailLabel}>Fecha de creación</Text>
//                 <Text style={styles.detailValue}>
//                   {formatDate(selectedProject.created_at)}
//                 </Text>
//               </View>

//               {/* Dispositivos de conectividad */}
//               <View style={styles.detailSection}>
//                 <Text style={styles.detailLabel}>Dispositivos de conectividad</Text>
//                 <View style={styles.dispositivosGrid}>
//                   {JSON.parse(selectedProject.connectivity_devices || '[]').map((device: string, index: number) => (
//                     <View key={index} style={styles.dispositivoTagLarge}>
//                       <Text style={styles.dispositivoText}>{device}</Text>
//                     </View>
//                   ))}
//                   {JSON.parse(selectedProject.connectivity_devices || '[]').length === 0 && (
//                     <Text style={styles.placeholderText}>No hay dispositivos seleccionados</Text>
//                   )}
//                 </View>
//               </View>

//               {/* Multimedia con funcionalidad de reproducción */}
//               <View style={styles.detailSection}>
//                 <Text style={styles.detailLabel}>Archivos multimedia</Text>
//                 <View style={styles.mediaGrid}>
//                   {JSON.parse(selectedProject.media_items || '[]').map((media: any, index: number) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={styles.mediaItem}
//                       onPress={() => {
//                         if (media.type === 'image') {
//                           openImage(media);
//                         } else if (media.type === 'video') {
//                           openVideo(media);
//                         } else if (media.type === 'audio') {
//                           toggleAudio(media);
//                         }
//                       }}
//                     >
//                       {media.type === 'image' ? (
//                         <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
//                       ) : media.type === 'video' ? (
//                         // <View style={[styles.mediaThumbnail, styles.videoPlaceholder]}>
//                         //   <Ionicons name="videocam" size={24} color="#666" />
//                         // </View>
//                         <TouchableOpacity
//       onPress={() => openVideo(media)}
//       style={[styles.mediaThumbnail, styles.videoPlaceholder]}
//     >
//       <Ionicons name="videocam" size={24} color="#666" />
//       <Text style={styles.playButtonText}>Reproducir</Text>
//     </TouchableOpacity>
//                       ) : (
//                         <View style={[styles.mediaThumbnail, styles.audioPlaceholder]}>
//                           <Ionicons 
//                             name={isPlaying && selectedMedia?.id === media.id ? "pause" : "play"} 
//                             size={24} 
//                             color="#666" 
//                           />
//                         </View>
//                       )}
//                       <Text style={styles.mediaName} numberOfLines={1}>
//                         {media.name}
//                       </Text>
//                       {/* Icono indicador del tipo de archivo */}
//                       <View style={styles.mediaTypeBadge}>
//                         <Ionicons 
//                           name={
//                             media.type === 'image' ? 'image' : 
//                             media.type === 'video' ? 'videocam' : 'musical-notes'
//                           } 
//                           size={12} 
//                           color="white" 
//                         />
//                       </View>
//                     </TouchableOpacity>
//                   ))}
//                   {JSON.parse(selectedProject.media_items || '[]').length === 0 && (
//                     <Text style={styles.placeholderText}>No hay archivos multimedia</Text>
//                   )}
//                 </View>
//               </View>
//             </ScrollView>
//           )}

//           <View style={styles.modalActions}>
//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => {
//                 setShowDetailsModal(false);
//                 if (sound) {
//                   sound.stopAsync();
//                   setIsPlaying(false);
//                 }
//                 router.push(`./edit-project?id=${selectedProject?.id}`);
//               }}
//             >
//               <Ionicons name="create" size={20} color="#007AFF" />
//               <Text style={styles.actionText}>Editar</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => {
//                 setShowDetailsModal(false);
//                 if (sound) {
//                   sound.stopAsync();
//                   setIsPlaying(false);
//                 }
//                 router.push(`./project-qr?id=${selectedProject?.id}`);
//               }}
//             >
//               <Ionicons name="qr-code" size={20} color="#007AFF" />
//               <Text style={styles.actionText}>Ver QR</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );

//   // Modal para ver imagen en grande
//   // const renderMediaModal = () => (
//   //   <Modal 
//   //     visible={showMediaModal} 
//   //     animationType="fade" 
//   //     transparent={true}
//   //     onRequestClose={() => setShowMediaModal(false)}
//   //   >
//   //     <View style={styles.mediaModalContainer}>
//   //       <TouchableOpacity 
//   //         style={styles.mediaModalBackdrop}
//   //         onPress={() => setShowMediaModal(false)}
//   //         activeOpacity={1}
//   //       >
//   //         {selectedMedia && selectedMedia.type === 'image' && (
//   //           <Image 
//   //             source={{ uri: selectedMedia.uri }} 
//   //             style={styles.mediaModalImage}
//   //             resizeMode="contain"
//   //           />
//   //         )}
//   //       </TouchableOpacity>
        
//   //       <TouchableOpacity 
//   //         style={styles.mediaModalClose}
//   //         onPress={() => setShowMediaModal(false)}
//   //       >
//   //         <Ionicons name="close" size={30} color="white" />
//   //       </TouchableOpacity>
//   //     </View>
//   //   </Modal>
//   // );

//   const renderMediaModal = () => (
//   <Modal 
//     visible={showMediaModal} 
//     animationType="fade" 
//     transparent={true}
//     onRequestClose={() => setShowMediaModal(false)}
//   >
//     <View style={styles.mediaModalContainer}>
//       <TouchableOpacity 
//         style={styles.mediaModalBackdrop}
//         onPress={() => setShowMediaModal(false)}
//         activeOpacity={1}
//       >
//         {selectedMedia && selectedMedia.type === 'image' && (
//           <Image 
//             source={{ uri: selectedMedia.uri }} 
//             style={styles.mediaModalImage}
//             resizeMode="contain"
//           />
//         )}
//       </TouchableOpacity>
      
//       <TouchableOpacity 
//         style={styles.mediaModalClose}
//         onPress={() => setShowMediaModal(false)}
//       >
//         <Ionicons name="close" size={30} color="white" />
//       </TouchableOpacity>
//     </View>
//   </Modal>
// );

//   // Modal para ver detalles de la ruta
//   // const renderRouteModal = () => (
//   //   <Modal 
//   //     visible={showRouteModal} 
//   //     animationType="slide" 
//   //     transparent
//   //     onRequestClose={() => setShowRouteModal(false)}
//   //   >
//   //     <View style={styles.modalContainer}>
//   //       <View style={styles.modalContent}>
//   //         <View style={styles.modalHeader}>
//   //           <Text style={styles.modalTitle}>Detalles de la Ruta</Text>
//   //           <TouchableOpacity onPress={() => setShowRouteModal(false)}>
//   //             <Ionicons name="close" size={24} color="#666" />
//   //           </TouchableOpacity>
//   //         </View>

//   //         {selectedRoute && (
//   //           <ScrollView style={styles.modalBody}>
//   //             <View style={styles.detailSection}>
//   //               <Text style={styles.detailLabel}>Nombre</Text>
//   //               <Text style={styles.detailValue}>{selectedRoute.name}</Text>
//   //             </View>

//   //             <View style={styles.detailSection}>
//   //               <Text style={styles.detailLabel}>Descripción</Text>
//   //               <Text style={[styles.detailValue, !selectedRoute.description && styles.placeholderText]}>
//   //                 {selectedRoute.description || 'No hay descripción'}
//   //               </Text>
//   //             </View>

//   //             <View style={styles.detailSection}>
//   //               <Text style={styles.detailLabel}>Distancia</Text>
//   //               <Text style={styles.detailValue}>
//   //                 {selectedRoute.distance ? `${selectedRoute.distance} km` : 'No especificada'}
//   //               </Text>
//   //             </View>

//   //             <View style={styles.detailSection}>
//   //               <Text style={styles.detailLabel}>Dificultad</Text>
//   //               <Text style={styles.detailValue}>
//   //                 {selectedRoute.difficulty || 'No especificada'}
//   //               </Text>
//   //             </View>
//   //           </ScrollView>
//   //         )}
//   //       </View>
//   //     </View>
//   //   </Modal>
//   // );

//   const renderRouteModal = () => (
//   <Modal 
//     visible={showRouteModal} 
//     animationType="slide" 
//     transparent
//     onRequestClose={() => setShowRouteModal(false)}
//   >
//     <View style={styles.modalFullScreenContainer}>
//       <View style={styles.modalFullScreenContent}>
//         <View style={styles.modalHeader}>
//           <Text style={styles.modalTitle}>Detalles de la Ruta</Text>
//           <TouchableOpacity onPress={() => setShowRouteModal(false)}>
//             <Ionicons name="close" size={24} color="#666" />
//           </TouchableOpacity>
//         </View>

//         {selectedRoute && (
//           <ScrollView style={styles.modalBody}>
//             <View style={styles.detailSection}>
//               <Text style={styles.detailLabel}>Nombre</Text>
//               <Text style={styles.detailValue}>{selectedRoute.name}</Text>
//             </View>

//             <View style={styles.detailSection}>
//               <Text style={styles.detailLabel}>Descripción</Text>
//               <Text style={[styles.detailValue, !selectedRoute.description && styles.placeholderText]}>
//                 {selectedRoute.description || 'No hay descripción'}
//               </Text>
//             </View>

//             <View style={styles.detailSection}>
//               <Text style={styles.detailLabel}>Distancia</Text>
//               <Text style={styles.detailValue}>
//                 {selectedRoute.distance ? `${selectedRoute.distance} km` : 'No especificada'}
//               </Text>
//             </View>

//             <View style={styles.detailSection}>
//               <Text style={styles.detailLabel}>Dificultad</Text>
//               <Text style={styles.detailValue}>
//                 {selectedRoute.difficulty || 'No especificada'}
//               </Text>
//             </View>
//           </ScrollView>
//         )}
//       </View>
//     </View>
//   </Modal>
// );

//   if (loading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Cargando proyectos...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Proyectos Creados</Text>
//         <TouchableOpacity onPress={loadProjects} style={styles.refreshButton}>
//           <Ionicons name="refresh" size={24} color="#007AFF" />
//         </TouchableOpacity>
//       </View>

//       {projects.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Ionicons name="folder-open" size={60} color="#ccc" />
//           <Text style={styles.emptyStateText}>No hay proyectos creados</Text>
//           <Text style={styles.emptyStateSubtext}>
//             Crea tu primer proyecto para comenzar
//           </Text>
//           <TouchableOpacity 
//             style={styles.createButton}
//             onPress={() => router.push('./new-project')}
//           >
//             <Text style={styles.createButtonText}>Crear Primer Proyecto</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={projects}
//           renderItem={renderProjectItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContent}
//           refreshing={refreshing}
//           onRefresh={() => {
//             setRefreshing(true);
//             loadProjects();
//           }}
//         />
//       )}

//       {renderDetailsModal()}
//       {renderMediaModal()}
//       {renderRouteModal()}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   modalFullScreenContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalFullScreenContent: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     width: '90%',
//     maxHeight: '80%',
//     margin: 20,
//   },
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
//     top: 10
//   },
//   routeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   routeButton: {
//     padding: 8,
//     marginLeft: 10,
//   },
//   backButton: {
//     padding: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   refreshButton: {
//     padding: 8,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     marginTop: 16,
//     color: '#666',
//     fontSize: 16,
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 20,
//   },
//   projectCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: '#f1f2f6',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   projectName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     flex: 1,
//     marginRight: 12,
//   },
//   projectDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   footerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   routeName: {
//     fontSize: 12,
//     color: '#666',
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   dispositivosContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   dispositivoTag: {
//     backgroundColor: '#e3f2fd',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   dispositivoTagLarge: {
//     backgroundColor: '#e3f2fd',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//     margin: 4,
//   },
//   dispositivoText: {
//     fontSize: 12,
//     color: '#1976d2',
//     fontWeight: '500',
//   },
//   moreTag: {
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   moreText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyStateText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   createButton: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   createButtonText: {
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
//   modalBody: {
//     padding: 20,
//   },
//   detailSection: {
//     marginBottom: 24,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 8,
//   },
//   detailValue: {
//     fontSize: 16,
//     color: '#2c3e50',
//     lineHeight: 24,
//   },
//   placeholderText: {
//     color: '#888',
//     fontStyle: 'italic',
//   },
//   dispositivosGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 8,
//   },
//   mediaGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginTop: 8,
//   },
//   mediaItem: {
//     alignItems: 'center',
//     width: 80,
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
//   mediaTypeBadge: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderRadius: 8,
//     padding: 4,
//   },
//   videoPlaceholder: {
//     backgroundColor: '#ffe0e0',
//   },
//   audioPlaceholder: {
//     backgroundColor: '#e0ffe0',
//   },
//   mediaName: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     gap: 16,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     padding: 12,
//     backgroundColor: '#f0f8ff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#007AFF',
//   },
//   actionText: {
//     color: '#007AFF',
//     fontWeight: '600',
//   },
//   mediaModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // mediaModalBackdrop: {
//   //   flex: 1,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   width: '100%',
//   // },
//   // mediaModalImage: {
//   //   width: '100%',
//   //   height: '80%',
//   // },
//   // mediaModalClose: {
//   //   position: 'absolute',
//   //   top: 40,
//   //   right: 20,
//   //   backgroundColor: 'rgba(0,0,0,0.5)',
//   //   borderRadius: 20,
//   //   padding: 8,
//   // },

//   mediaModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mediaModalBackdrop: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//   },
//   mediaModalImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain'
//   },
//   mediaModalClose: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderRadius: 20,
//     padding: 10,
//     zIndex: 1000,
//   },
// });


import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  ScrollView,
  Platform,
  Linking,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';

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
interface Project {
  id: string;
  name: string;
  description: string;
  route_id: number;
  connectivity_devices: string;
  media_items: string;
  created_at: string;
  route_name?: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  name: string;
}

const { width, height } = Dimensions.get('window');

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  // Cargar proyectos
  const loadProjects = async () => {
    try {
      const db = openDatabase();
      
      // Verificar si la tabla projects existe
      const tableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='projects'"
      );
      
      if (tableExists) {
        // Obtener proyectos con información de la ruta
        const projectsData = await db.getAllAsync(`
          SELECT p.*, r.name as route_name 
          FROM projects p 
          LEFT JOIN routes r ON p.route_id = r.id 
          ORDER BY p.created_at DESC
        `);
        
        setProjects(projectsData);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      Alert.alert('Error', 'No se pudieron cargar los proyectos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openRouteDetails = async (routeId: number) => {
    try {
      const db = openDatabase();
      const routeData = await db.getFirstAsync(
        'SELECT * FROM routes WHERE id = ?',
        [routeId]
      );
      
      if (routeData) {
        setSelectedRoute(routeData);
        setShowRouteModal(true);
      } else {
        Alert.alert('Error', 'No se encontró información de la ruta');
      }
    } catch (error) {
      console.error('Error loading route details:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles de la ruta');
    }
  };

  useEffect(() => {
    loadProjects();
    
    return () => {
      // Limpiar el sonido al desmontar
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Reproducir/pausar audio
  const toggleAudio = async (media: MediaItem) => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: media.uri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'No se pudo reproducir el audio');
    }
  };

  // Abrir imagen en modal
  const openImage = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowMediaModal(true);
  };

  // Abrir video
  const openVideo = async (media: MediaItem) => {
    try {
      // Verificar si el archivo existe localmente primero
      const fileInfo = await FileSystem.getInfoAsync(media.uri);
      
      if (!fileInfo.exists) {
        Alert.alert('Error', 'El archivo de video no se encuentra disponible');
        return;
      }

      const supported = await Linking.canOpenURL(media.uri);
      
      if (supported) {
        await Linking.openURL(media.uri);
      } else {
        // Si no se puede abrir con una app externa, mostrar un mensaje
        Alert.alert(
          'No se puede abrir el video',
          'No hay aplicaciones disponibles para reproducir este video. ¿Quieres intentar copiar la ruta del archivo?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {
              text: 'Copiar ruta',
              onPress: async () => {
                try {
                  await Clipboard.setStringAsync(media.uri);
                  Alert.alert('Éxito', 'Ruta del video copiada al portapapeles');
                } catch (error) {
                  console.error('Error copying to clipboard:', error);
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening video:', error);
      Alert.alert('Error', 'No se pudo abrir el video');
    }
  };

  // Eliminar proyecto
  const deleteProject = async (projectId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este proyecto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = openDatabase();
              await db.runAsync('DELETE FROM projects WHERE id = ?', [projectId]);
              Alert.alert('Éxito', 'Proyecto eliminado correctamente');
              loadProjects(); // Recargar la lista
            } catch (error) {
              console.error('Error deleting project:', error);
              Alert.alert('Error', 'No se pudo eliminar el proyecto');
            }
          }
        }
      ]
    );
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar cada item de proyecto
  const renderProjectItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.projectCard}
      onPress={() => {
        setSelectedProject(item);
        setShowDetailsModal(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.projectName} numberOfLines={1}>
          {item.name}
        </Text>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            deleteProject(item.id);
          }}
        >
          <Ionicons name="trash" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>

      <Text style={styles.projectDescription} numberOfLines={2}>
        {item.description || 'Sin descripción'}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.footerInfo}>
          <Ionicons name="map" size={16} color="#666" />
          <Text style={styles.routeName}>
            {item.route_name || 'Ruta no disponible'}
          </Text>
        </View>
        
        <View style={styles.footerInfo}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.dateText}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </View>

      <View style={styles.dispositivosContainer}>
        {JSON.parse(item.connectivity_devices || '[]').slice(0, 3).map((device: string, index: number) => (
          <View key={index} style={styles.dispositivoTag}>
            <Text style={styles.dispositivoText}>{device}</Text>
          </View>
        ))}
        {JSON.parse(item.connectivity_devices || '[]').length > 3 && (
          <View style={styles.moreTag}>
            <Text style={styles.moreText}>
              +{JSON.parse(item.connectivity_devices || '[]').length - 3}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Modal de detalles del proyecto
  const renderDetailsModal = () => (
    <Modal 
      visible={showDetailsModal} 
      animationType="slide" 
      transparent
      onRequestClose={() => {
        setShowDetailsModal(false);
        if (sound) {
          sound.stopAsync();
          setIsPlaying(false);
        }
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Proyecto</Text>
            <TouchableOpacity onPress={() => {
              setShowDetailsModal(false);
              if (sound) {
                sound.stopAsync();
                setIsPlaying(false);
              }
            }}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedProject && (
            <ScrollView style={styles.modalBody}>
              {/* Información básica */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Nombre</Text>
                <Text style={styles.detailValue}>{selectedProject.name}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Responsable</Text>
                <Text style={styles.detailValue}>{selectedProject.responsible}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Descripción</Text>
                <Text style={[styles.detailValue, !selectedProject.description && styles.placeholderText]}>
                  {selectedProject.description || 'No hay descripción'}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Ruta asociada</Text>
                <View style={styles.routeContainer}>
                  <Text style={styles.detailValue}>
                    {selectedProject.route_name || 'Ruta no disponible'}
                  </Text>
                  {selectedProject.route_id && (
                    <TouchableOpacity 
                      style={styles.routeButton}
                      onPress={() => openRouteDetails(selectedProject.route_id)}
                    >
                      <Ionicons name="eye" size={20} color="#007AFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Fecha de creación</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedProject.created_at)}
                </Text>
              </View>

              {/* Dispositivos de conectividad */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Dispositivos de conectividad</Text>
                <View style={styles.dispositivosGrid}>
                  {JSON.parse(selectedProject.connectivity_devices || '[]').map((device: string, index: number) => (
                    <View key={index} style={styles.dispositivoTagLarge}>
                      <Text style={styles.dispositivoText}>{device}</Text>
                    </View>
                  ))}
                  {JSON.parse(selectedProject.connectivity_devices || '[]').length === 0 && (
                    <Text style={styles.placeholderText}>No hay dispositivos seleccionados</Text>
                  )}
                </View>
              </View>

              {/* Multimedia con funcionalidad de reproducción */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Archivos multimedia</Text>
                <View style={styles.mediaGrid}>
                  {JSON.parse(selectedProject.media_items || '[]').map((media: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.mediaItem}
                      onPress={() => {
                        if (media.type === 'image') {
                          openImage(media);
                        } else if (media.type === 'video') {
                          openVideo(media);
                        } else if (media.type === 'audio') {
                          toggleAudio(media);
                        }
                      }}
                    >
                      {media.type === 'image' ? (
                        <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
                      ) : media.type === 'video' ? (
                        <TouchableOpacity
                          onPress={() => openVideo(media)}
                          style={[styles.mediaThumbnail, styles.videoPlaceholder]}
                        >
                          <Ionicons name="videocam" size={24} color="#666" />
                          <Text style={styles.playButtonText}>Reproducir</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.mediaThumbnail, styles.audioPlaceholder]}>
                          <Ionicons 
                            name={isPlaying && selectedMedia?.id === media.id ? "pause" : "play"} 
                            size={24} 
                            color="#666" 
                          />
                        </View>
                      )}
                      <Text style={styles.mediaName} numberOfLines={1}>
                        {media.name}
                      </Text>
                      {/* Icono indicador del tipo de archivo */}
                      <View style={styles.mediaTypeBadge}>
                        <Ionicons 
                          name={
                            media.type === 'image' ? 'image' : 
                            media.type === 'video' ? 'videocam' : 'musical-notes'
                          } 
                          size={12} 
                          color="white" 
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                  {JSON.parse(selectedProject.media_items || '[]').length === 0 && (
                    <Text style={styles.placeholderText}>No hay archivos multimedia</Text>
                  )}
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowDetailsModal(false);
                if (sound) {
                  sound.stopAsync();
                  setIsPlaying(false);
                }
                router.push(`./edit-project?id=${selectedProject?.id}`);
              }}
            >
              <Ionicons name="create" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowDetailsModal(false);
                if (sound) {
                  sound.stopAsync();
                  setIsPlaying(false);
                }
                router.push(`./project-qr?id=${selectedProject?.id}`);
              }}
            >
              <Ionicons name="qr-code" size={20} color="#007AFF" />
              <Text style={styles.actionText}>Ver QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal para ver imagen en grande
  const renderMediaModal = () => (
    <Modal 
      visible={showMediaModal} 
      animationType="fade" 
      transparent={true}
      onRequestClose={() => setShowMediaModal(false)}
    >
      <View style={styles.mediaModalContainer}>
        <TouchableOpacity 
          style={styles.mediaModalBackdrop}
          onPress={() => setShowMediaModal(false)}
          activeOpacity={1}
        >
          {selectedMedia && selectedMedia.type === 'image' && (
            <Image 
              source={{ uri: selectedMedia.uri }} 
              style={styles.mediaModalImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mediaModalClose}
          onPress={() => setShowMediaModal(false)}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // Modal para ver detalles de la ruta
  const renderRouteModal = () => (
    <Modal 
      visible={showRouteModal} 
      animationType="slide" 
      transparent
      onRequestClose={() => setShowRouteModal(false)}
    >
      <View style={styles.modalFullScreenContainer}>
        <View style={styles.modalFullScreenContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de la Ruta</Text>
            <TouchableOpacity onPress={() => setShowRouteModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedRoute && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Nombre</Text>
                <Text style={styles.detailValue}>{selectedRoute.name}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Descripción</Text>
                <Text style={[styles.detailValue, !selectedRoute.description && styles.placeholderText]}>
                  {selectedRoute.description || 'No hay descripción'}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Distancia</Text>
                <Text style={styles.detailValue}>
                  {selectedRoute.distance ? `${selectedRoute.distance} km` : 'No especificada'}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Dificultad</Text>
                <Text style={styles.detailValue}>
                  {selectedRoute.difficulty || 'No especificada'}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando proyectos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Proyectos Creados</Text>
        <TouchableOpacity onPress={loadProjects} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No hay proyectos creados</Text>
          <Text style={styles.emptyStateSubtext}>
            Crea tu primer proyecto para comenzar
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('./new-project')}
          >
            <Text style={styles.createButtonText}>Crear Primer Proyecto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadProjects();
          }}
        />
      )}

      {renderDetailsModal()}
      {renderMediaModal()}
      {renderRouteModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  modalFullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFullScreenContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    margin: 20,
  },
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
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeButton: {
    padding: 8,
    marginLeft: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  refreshButton: {
    padding: 8,
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
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  projectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f2f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeName: {
    fontSize: 12,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  dispositivosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dispositivoTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dispositivoTagLarge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  dispositivoText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  moreTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
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
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
  },
  placeholderText: {
    color: '#888',
    fontStyle: 'italic',
  },
  dispositivosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  mediaItem: {
    alignItems: 'center',
    width: 80,
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
  mediaTypeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 4,
  },
  videoPlaceholder: {
    backgroundColor: '#ffe0e0',
  },
  audioPlaceholder: {
    backgroundColor: '#e0ffe0',
  },
  mediaName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  mediaModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaModalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  mediaModalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  mediaModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1000,
  },
  playButtonText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});