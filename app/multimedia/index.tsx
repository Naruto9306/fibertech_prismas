// // import React, { useState, useRef, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   Image,
// //   Dimensions,
// //   Alert,
// //   ActivityIndicator,
// //   FlatList,
// //   Platform,
// //   Modal
// // } from 'react-native';
// // import { Video, useVideoPlayer, VideoView } from 'expo-av';
// // import { Audio } from 'expo-av';
// // import * as ImagePicker from 'expo-image-picker';
// // import { router } from 'expo-router';
// // import { Ionicons } from '@expo/vector-icons';
// // import * as SQLite from 'expo-sqlite';

// // // Función para abrir la base de datos
// // const openDatabase = () => {
// //   if (Platform.OS === 'web') {
// //     return {
// //       transaction: () => {
// //         return {
// //           executeSql: () => {},
// //         };
// //       },
// //     };
// //   }
// //   return SQLite.openDatabaseSync('app.db');
// // };

// // // Tipos de datos
// // interface Project {
// //   id: string;
// //   name: string;
// //   description: string;
// //   media_items: string;
// // }

// // interface MediaItem {
// //   id: string;
// //   type: 'image' | 'video' | 'audio';
// //   uri: string;
// //   name: string;
// // }

// // export default function MultimediaScreen() {
// //   const [projects, setProjects] = useState<Project[]>([]);
// //   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
// //   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
// //   const [activeTab, setActiveTab] = useState<'projects' | 'media'>('projects');
// //   const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
// //   const [isPlaying, setIsPlaying] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const videoRef = useRef<Video>(null);
// //   const soundRef = useRef<Audio.Sound>(null);
// //   // const player = useVideoPlayer(videoSource, player => {
// //   //   player.loop = true;
// //   //   player.play();
// //   // });

// //   // Cargar proyectos desde la base de datos
// //   const loadProjects = async () => {
// //     try {
// //       const db = openDatabase();
      
// //       // Verificar si la tabla projects existe
// //       const tableExists = await db.getFirstAsync(
// //         "SELECT name FROM sqlite_master WHERE type='table' AND name='projects'"
// //       );
      
// //       if (tableExists) {
// //         // Obtener proyectos con medios
// //         const projectsData = await db.getAllAsync(`
// //           SELECT id, name, description, media_items 
// //           FROM projects 
// //           ORDER BY created_at DESC
// //         `);
        
// //         setProjects(projectsData);
// //       } else {
// //         setProjects([]);
// //       }
// //     } catch (error) {
// //       console.error('Error loading projects:', error);
// //       Alert.alert('Error', 'No se pudieron cargar los proyectos');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Cargar medios de un proyecto específico
// //   const loadProjectMedia = (project: Project) => {
// //     try {
// //       const media = JSON.parse(project.media_items || '[]');
// //       setMediaItems(media);
// //       setSelectedProject(project);
// //       setActiveTab('media');
// //     } catch (error) {
// //       console.error('Error parsing media items:', error);
// //       Alert.alert('Error', 'No se pudieron cargar los medios del proyecto');
// //       setMediaItems([]);
// //     }
// //   };

// //   // Reproducir/pausar audio
// //   const toggleAudio = async (media: MediaItem) => {
// //     try {
// //       if (selectedMedia && selectedMedia.uri === media.uri) {
// //         if (isPlaying) {
// //           await soundRef.current?.pauseAsync();
// //           setIsPlaying(false);
// //         } else {
// //           await soundRef.current?.playAsync();
// //           setIsPlaying(true);
// //         }
// //       } else {
// //         // Detener y liberar el audio actual si existe
// //         if (soundRef.current) {
// //           await soundRef.current.unloadAsync();
// //           soundRef.current = null;
// //         }

// //         // Configurar modo de audio
// //         await Audio.setAudioModeAsync({
// //           allowsRecordingIOS: false,
// //           playsInSilentModeIOS: true,
// //           staysActiveInBackground: false,
// //           shouldDuckAndroid: true,
// //         });

// //         // Crear nuevo sonido
// //         const { sound } = await Audio.Sound.createAsync(
// //           { uri: media.uri },
// //           { shouldPlay: true }
// //         );

// //         soundRef.current = sound;
// //         setSelectedMedia(media);
// //         setIsPlaying(true);

// //         // Configurar listener para cuando termine la reproducción
// //         sound.setOnPlaybackStatusUpdate((status: any) => {
// //           if (status.isLoaded && status.didJustFinish) {
// //             setIsPlaying(false);
// //           }
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error con audio:', error);
// //       Alert.alert('Error', 'No se pudo reproducir el audio');
// //     }
// //   };

// //   // Seleccionar imagen de la galería
// //   const pickImage = async () => {
// //     try {
// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         aspect: [4, 3],
// //         quality: 1,
// //       });

// //       if (!result.canceled) {
// //         // Aquí podrías implementar la lógica para guardar la imagen en el proyecto
// //         Alert.alert('Éxito', 'Imagen seleccionada (función de guardado pendiente)');
// //       }
// //     } catch (error) {
// //       Alert.alert('Error', 'No se pudo seleccionar la imagen');
// //     }
// //   };

// //   // Renderizar lista de proyectos
// //   const renderProjects = () => (
// //     <View style={styles.tabContent}>
// //       <Text style={styles.sectionTitle}>Proyectos Creados</Text>
      
// //       {projects.length === 0 ? (
// //         <View style={styles.emptyState}>
// //           <Ionicons name="folder-open" size={60} color="#ccc" />
// //           <Text style={styles.emptyStateText}>No hay proyectos creados</Text>
// //           <Text style={styles.emptyStateSubtext}>
// //             Crea tu primer proyecto para ver sus medios
// //           </Text>
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={projects}
// //           keyExtractor={(item) => item.id}
// //           renderItem={({ item }) => (
// //             <TouchableOpacity 
// //               style={styles.projectItem}
// //               onPress={() => loadProjectMedia(item)}
// //             >
// //               <View style={styles.projectInfo}>
// //                 <Text style={styles.projectName}>{item.name}</Text>
// //                 <Text style={styles.projectDescription} numberOfLines={2}>
// //                   {item.description || 'Sin descripción'}
// //                 </Text>
// //               </View>
              
// //               <View style={styles.mediaCountBadge}>
// //                 <Ionicons name="images" size={16} color="#007AFF" />
// //                 <Text style={styles.mediaCountText}>
// //                   {JSON.parse(item.media_items || '[]').length} medios
// //                 </Text>
// //               </View>
              
// //               <Ionicons name="chevron-forward" size={24} color="#666" />
// //             </TouchableOpacity>
// //           )}
// //           contentContainerStyle={styles.listContent}
// //         />
// //       )}
// //     </View>
// //   );

// //   // Renderizar medios de un proyecto
// //   const renderMedia = () => (
// //     <View style={styles.tabContent}>
// //       {/* Header del proyecto seleccionado */}
// //       <View style={styles.projectHeader}>
// //         <TouchableOpacity 
// //           style={styles.backButton}
// //           onPress={() => {
// //             setActiveTab('projects');
// //             setSelectedProject(null);
// //             setSelectedMedia(null);
// //             if (soundRef.current) {
// //               soundRef.current.unloadAsync();
// //               setIsPlaying(false);
// //             }
// //           }}
// //         >
// //           <Ionicons name="arrow-back" size={24} color="#007AFF" />
// //         </TouchableOpacity>
        
// //         <View style={styles.projectHeaderInfo}>
// //           <Text style={styles.projectTitle} numberOfLines={1}>
// //             {selectedProject?.name}
// //           </Text>
// //           <Text style={styles.mediaCount}>
// //             {mediaItems.length} medios
// //           </Text>
// //         </View>
// //       </View>

// //       {mediaItems.length === 0 ? (
// //         <View style={styles.emptyMediaState}>
// //           <Ionicons name="image" size={60} color="#ccc" />
// //           <Text style={styles.emptyStateText}>No hay medios en este proyecto</Text>
// //           <Text style={styles.emptyStateSubtext}>
// //             Agrega imágenes, videos o audio a tu proyecto
// //           </Text>
// //           <TouchableOpacity style={styles.addMediaButton} onPress={pickImage}>
// //             <Ionicons name="add" size={20} color="white" />
// //             <Text style={styles.addMediaText}>Agregar Medio</Text>
// //           </TouchableOpacity>
// //         </View>
// //       ) : (
// //         <ScrollView>
// //           <Text style={styles.sectionTitle}>Medios del Proyecto</Text>
          
// //           {/* Imágenes */}
// //           {mediaItems.filter(item => item.type === 'image').length > 0 && (
// //             <>
// //               <Text style={styles.mediaSectionTitle}>Imágenes</Text>
// //               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
// //                 {mediaItems.filter(item => item.type === 'image').map((media, index) => (
// //                   <TouchableOpacity
// //                     key={index}
// //                     style={styles.mediaThumbnail}
// //                     onPress={() => setSelectedMedia(media)}
// //                   >
// //                     <Image
// //                       source={{ uri: media.uri }}
// //                       style={styles.thumbnailImage}
// //                       resizeMode="cover"
// //                     />
// //                     <Text style={styles.mediaName} numberOfLines={1}>
// //                       {media.name}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </ScrollView>
// //             </>
// //           )}

// //           {/* Videos */}
// //           {mediaItems.filter(item => item.type === 'video').length > 0 && (
// //             <>
// //               <Text style={styles.mediaSectionTitle}>Videos</Text>
// //               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
// //                 {mediaItems.filter(item => item.type === 'video').map((media, index) => (
// //                   <TouchableOpacity
// //                     key={index}
// //                     style={styles.mediaThumbnail}
// //                     onPress={() => setSelectedMedia(media)}
// //                   >
// //                     <View style={[styles.thumbnailImage, styles.videoPlaceholder]}>
// //                       <Ionicons name="videocam" size={32} color="#666" />
// //                     </View>
// //                     <Text style={styles.mediaName} numberOfLines={1}>
// //                       {media.name}
// //                     </Text>
// //                   </TouchableOpacity>
// //                 ))}
// //               </ScrollView>
// //             </>
// //           )}

// //           {/* Audio */}
// //           {mediaItems.filter(item => item.type === 'audio').length > 0 && (
// //             <>
// //               <Text style={styles.mediaSectionTitle}>Audio</Text>
// //               <View style={styles.audioList}>
// //                 {mediaItems.filter(item => item.type === 'audio').map((media, index) => (
// //                   <TouchableOpacity
// //                     key={index}
// //                     style={[
// //                       styles.audioItem,
// //                       selectedMedia?.uri === media.uri && styles.audioItemSelected
// //                     ]}
// //                     onPress={() => toggleAudio(media)}
// //                   >
// //                     <Ionicons
// //                       name={isPlaying && selectedMedia?.uri === media.uri ? "pause" : "play"}
// //                       size={24}
// //                       color="#007AFF"
// //                     />
// //                     <View style={styles.audioInfo}>
// //                       <Text style={styles.audioTitle}>{media.name}</Text>
// //                       <Text style={styles.audioDuration}>Audio</Text>
// //                     </View>
// //                     {isPlaying && selectedMedia?.uri === media.uri && (
// //                       <ActivityIndicator size="small" color="#007AFF" />
// //                     )}
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //             </>
// //           )}
// //         </ScrollView>
// //       )}

// //       {/* Modal para ver imagen/video en grande */}
// //       {selectedMedia && (
// //         <Modal visible={!!selectedMedia} transparent animationType="fade">
// //           <View style={styles.mediaModal}>
// //             <TouchableOpacity 
// //               style={styles.modalBackdrop}
// //               onPress={() => setSelectedMedia(null)}
// //             >
// //               {selectedMedia.type === 'image' ? (
// //                 <Image 
// //                   source={{ uri: selectedMedia.uri }} 
// //                   style={styles.modalImage}
// //                   resizeMode="contain"
// //                 />
// //               ) : selectedMedia.type === 'video' ? (
// //                 <Video
// //                   ref={videoRef}
// //                   source={{ uri: selectedMedia.uri }}
// //                   style={styles.modalVideo}
// //                   useNativeControls
// //                   resizeMode="contain"
// //                 />
// //               ) : null}
// //             </TouchableOpacity>
            
// //             <TouchableOpacity 
// //               style={styles.modalClose}
// //               onPress={() => setSelectedMedia(null)}
// //             >
// //               <Ionicons name="close" size={30} color="white" />
// //             </TouchableOpacity>
// //           </View>
// //         </Modal>
// //       )}
// //     </View>
// //   );

// //   // Cargar proyectos al montar el componente
// //   useEffect(() => {
// //     loadProjects();
    
// //     return () => {
// //       if (soundRef.current) {
// //         soundRef.current.unloadAsync();
// //       }
// //     };
// //   }, []);

// //   if (loading) {
// //     return (
// //       <View style={styles.centerContainer}>
// //         <ActivityIndicator size="large" color="#007AFF" />
// //         <Text style={styles.loadingText}>Cargando proyectos...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
// //           <Ionicons name="arrow-back" size={24} color="#007AFF" />
// //         </TouchableOpacity>
// //         <Text style={styles.title}>
// //           {activeTab === 'projects' ? 'Multimedia' : selectedProject?.name}
// //         </Text>
// //         <View style={styles.headerRight} />
// //       </View>

// //       {/* Content */}
// //       <View style={styles.content}>
// //         {activeTab === 'projects' && renderProjects()}
// //         {activeTab === 'media' && renderMedia()}
// //       </View>
// //     </View>
// //   );
// // }

// // const { width } = Dimensions.get('window');

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     backgroundColor: 'white',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //     top: 10
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   headerRight: {
// //     width: 40,
// //   },
// //   content: {
// //     flex: 1,
// //   },
// //   centerContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#f5f5f5',
// //   },
// //   loadingText: {
// //     marginTop: 16,
// //     color: '#666',
// //     fontSize: 16,
// //   },
// //   tabContent: {
// //     flex: 1,
// //     padding: 16,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 16,
// //   },
// //   listContent: {
// //     paddingBottom: 20,
// //   },
// //   projectItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'white',
// //     padding: 16,
// //     borderRadius: 12,
// //     marginBottom: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3,
// //     elevation: 3,
// //   },
// //   projectInfo: {
// //     flex: 1,
// //     marginRight: 12,
// //   },
// //   projectName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#333',
// //     marginBottom: 4,
// //   },
// //   projectDescription: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   mediaCountBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f8ff',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     marginRight: 12,
// //   },
// //   mediaCountText: {
// //     fontSize: 12,
// //     color: '#007AFF',
// //     marginLeft: 4,
// //   },
// //   emptyState: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 40,
// //   },
// //   emptyMediaState: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 40,
// //   },
// //   emptyStateText: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#666',
// //     marginTop: 16,
// //     marginBottom: 8,
// //     textAlign: 'center',
// //   },
// //   emptyStateSubtext: {
// //     fontSize: 14,
// //     color: '#888',
// //     textAlign: 'center',
// //     marginBottom: 24,
// //   },
// //   addMediaButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 20,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     gap: 8,
// //   },
// //   addMediaText: {
// //     color: 'white',
// //     fontWeight: '600',
// //   },
// //   projectHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   projectHeaderInfo: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   projectTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   mediaCount: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   mediaSectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#333',
// //     marginTop: 20,
// //     marginBottom: 12,
// //   },
// //   mediaRow: {
// //     marginBottom: 20,
// //   },
// //   mediaThumbnail: {
// //     width: 120,
// //     marginRight: 12,
// //   },
// //   thumbnailImage: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 8,
// //     backgroundColor: '#eee',
// //   },
// //   videoPlaceholder: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#ffe0e0',
// //   },
// //   mediaName: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginTop: 4,
// //     textAlign: 'center',
// //   },
// //   audioList: {
// //     marginBottom: 20,
// //   },
// //   audioItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'white',
// //     padding: 16,
// //     borderRadius: 8,
// //     marginBottom: 8,
// //   },
// //   audioItemSelected: {
// //     backgroundColor: '#f0f8ff',
// //     borderWidth: 1,
// //     borderColor: '#007AFF',
// //   },
// //   audioInfo: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   audioTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#333',
// //   },
// //   audioDuration: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   mediaModal: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.9)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalBackdrop: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   modalImage: {
// //     width: '100%',
// //     height: '80%',
// //   },
// //   modalVideo: {
// //     width: '100%',
// //     height: 300,
// //   },
// //   modalClose: {
// //     position: 'absolute',
// //     top: 40,
// //     right: 20,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     borderRadius: 20,
// //     padding: 8,
// //   },
// // });

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Dimensions,
//   Alert,
//   ActivityIndicator,
//   FlatList,
//   Platform,
//   Modal
// } from 'react-native';
// import { useVideoPlayer, VideoView } from 'expo-video'; // Cambiado de expo-av a expo-video
// import { Audio } from 'expo-av';
// import * as ImagePicker from 'expo-image-picker';
// import { router } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import * as SQLite from 'expo-sqlite';

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
//   media_items: string;
// }

// interface MediaItem {
//   id: string;
//   type: 'image' | 'video' | 'audio';
//   uri: string;
//   name: string;
// }

// export default function MultimediaScreen() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
//   const [activeTab, setActiveTab] = useState<'projects' | 'media'>('projects');
//   const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [videoPlayer, setVideoPlayer] = useState<any>(null); // Para controlar el reproductor de video
//   const soundRef = useRef<Audio.Sound>(null);

//   // Cargar proyectos desde la base de datos
//   const loadProjects = async () => {
//     try {
//       const db = openDatabase();
      
//       // Verificar si la tabla projects existe
//       const tableExists = await db.getFirstAsync(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name='projects'"
//       );
      
//       if (tableExists) {
//         // Obtener proyectos con medios
//         const projectsData = await db.getAllAsync(`
//           SELECT id, name, description, media_items 
//           FROM projects 
//           ORDER BY created_at DESC
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
//     }
//   };

//   // Cargar medios de un proyecto específico
//   const loadProjectMedia = (project: Project) => {
//     try {
//       const media = JSON.parse(project.media_items || '[]');
//       setMediaItems(media);
//       setSelectedProject(project);
//       setActiveTab('media');
//     } catch (error) {
//       console.error('Error parsing media items:', error);
//       Alert.alert('Error', 'No se pudieron cargar los medios del proyecto');
//       setMediaItems([]);
//     }
//   };

//   // Reproducir/pausar audio
//   const toggleAudio = async (media: MediaItem) => {
//     try {
//       if (selectedMedia && selectedMedia.uri === media.uri) {
//         if (isPlaying) {
//           await soundRef.current?.pauseAsync();
//           setIsPlaying(false);
//         } else {
//           await soundRef.current?.playAsync();
//           setIsPlaying(true);
//         }
//       } else {
//         // Detener y liberar el audio actual si existe
//         if (soundRef.current) {
//           await soundRef.current.unloadAsync();
//           soundRef.current = null;
//         }

//         // Configurar modo de audio
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: false,
//           playsInSilentModeIOS: true,
//           staysActiveInBackground: false,
//           shouldDuckAndroid: true,
//         });

//         // Crear nuevo sonido
//         const { sound } = await Audio.Sound.createAsync(
//           { uri: media.uri },
//           { shouldPlay: true }
//         );

//         soundRef.current = sound;
//         setSelectedMedia(media);
//         setIsPlaying(true);

//         // Configurar listener para cuando termine la reproducción
//         sound.setOnPlaybackStatusUpdate((status: any) => {
//           if (status.isLoaded && status.didJustFinish) {
//             setIsPlaying(false);
//           }
//         });
//       }
//     } catch (error) {
//       console.error('Error con audio:', error);
//       Alert.alert('Error', 'No se pudo reproducir el audio');
//     }
//   };

//   // Seleccionar imagen de la galería
//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         // Aquí podrías implementar la lógica para guardar la imagen en el proyecto
//         Alert.alert('Éxito', 'Imagen seleccionada (función de guardado pendiente)');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'No se pudo seleccionar la imagen');
//     }
//   };

//   // Inicializar reproductor de video cuando se selecciona un video
//   useEffect(() => {
//     if (selectedMedia && selectedMedia.type === 'video') {
//       const player = useVideoPlayer(selectedMedia.uri, (player) => {
//         player.loop = false;
//         player.play();
//       });
//       setVideoPlayer(player);
//     } else {
//       setVideoPlayer(null);
//     }
//   }, [selectedMedia]);

//   // Renderizar lista de proyectos
//   const renderProjects = () => (
//     <View style={styles.tabContent}>
//       <Text style={styles.sectionTitle}>Proyectos Creados</Text>
      
//       {projects.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Ionicons name="folder-open" size={60} color="#ccc" />
//           <Text style={styles.emptyStateText}>No hay proyectos creados</Text>
//           <Text style={styles.emptyStateSubtext}>
//             Crea tu primer proyecto para ver sus medios
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={projects}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity 
//               style={styles.projectItem}
//               onPress={() => loadProjectMedia(item)}
//             >
//               <View style={styles.projectInfo}>
//                 <Text style={styles.projectName}>{item.name}</Text>
//                 <Text style={styles.projectDescription} numberOfLines={2}>
//                   {item.description || 'Sin descripción'}
//                 </Text>
//               </View>
              
//               <View style={styles.mediaCountBadge}>
//                 <Ionicons name="images" size={16} color="#007AFF" />
//                 <Text style={styles.mediaCountText}>
//                   {JSON.parse(item.media_items || '[]').length} medios
//                 </Text>
//               </View>
              
//               <Ionicons name="chevron-forward" size={24} color="#666" />
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );

//   // Renderizar medios de un proyecto
//   const renderMedia = () => (
//     <View style={styles.tabContent}>
//       {/* Header del proyecto seleccionado */}
//       <View style={styles.projectHeader}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => {
//             setActiveTab('projects');
//             setSelectedProject(null);
//             setSelectedMedia(null);
//             if (soundRef.current) {
//               soundRef.current.unloadAsync();
//               setIsPlaying(false);
//             }
//           }}
//         >
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
        
//         <View style={styles.projectHeaderInfo}>
//           <Text style={styles.projectTitle} numberOfLines={1}>
//             {selectedProject?.name}
//           </Text>
//           <Text style={styles.mediaCount}>
//             {mediaItems.length} medios
//           </Text>
//         </View>
//       </View>

//       {mediaItems.length === 0 ? (
//         <View style={styles.emptyMediaState}>
//           <Ionicons name="image" size={60} color="#ccc" />
//           <Text style={styles.emptyStateText}>No hay medios en este proyecto</Text>
//           <Text style={styles.emptyStateSubtext}>
//             Agrega imágenes, videos o audio a tu proyecto
//           </Text>
//           <TouchableOpacity style={styles.addMediaButton} onPress={pickImage}>
//             <Ionicons name="add" size={20} color="white" />
//             <Text style={styles.addMediaText}>Agregar Medio</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <ScrollView>
//           <Text style={styles.sectionTitle}>Medios del Proyecto</Text>
          
//           {/* Imágenes */}
//           {mediaItems.filter(item => item.type === 'image').length > 0 && (
//             <>
//               <Text style={styles.mediaSectionTitle}>Imágenes</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
//                 {mediaItems.filter(item => item.type === 'image').map((media, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.mediaThumbnail}
//                     onPress={() => setSelectedMedia(media)}
//                   >
//                     <Image
//                       source={{ uri: media.uri }}
//                       style={styles.thumbnailImage}
//                       resizeMode="cover"
//                     />
//                     <Text style={styles.mediaName} numberOfLines={1}>
//                       {media.name}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* Videos */}
//           {mediaItems.filter(item => item.type === 'video').length > 0 && (
//             <>
//               <Text style={styles.mediaSectionTitle}>Videos</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
//                 {mediaItems.filter(item => item.type === 'video').map((media, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.mediaThumbnail}
//                     onPress={() => setSelectedMedia(media)}
//                   >
//                     <View style={[styles.thumbnailImage, styles.videoPlaceholder]}>
//                       <Ionicons name="videocam" size={32} color="#666" />
//                     </View>
//                     <Text style={styles.mediaName} numberOfLines={1}>
//                       {media.name}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* Audio */}
//           {mediaItems.filter(item => item.type === 'audio').length > 0 && (
//             <>
//               <Text style={styles.mediaSectionTitle}>Audio</Text>
//               <View style={styles.audioList}>
//                 {mediaItems.filter(item => item.type === 'audio').map((media, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.audioItem,
//                       selectedMedia?.uri === media.uri && styles.audioItemSelected
//                     ]}
//                     onPress={() => toggleAudio(media)}
//                   >
//                     <Ionicons
//                       name={isPlaying && selectedMedia?.uri === media.uri ? "pause" : "play"}
//                       size={24}
//                       color="#007AFF"
//                     />
//                     <View style={styles.audioInfo}>
//                       <Text style={styles.audioTitle}>{media.name}</Text>
//                       <Text style={styles.audioDuration}>Audio</Text>
//                     </View>
//                     {isPlaying && selectedMedia?.uri === media.uri && (
//                       <ActivityIndicator size="small" color="#007AFF" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </>
//           )}
//         </ScrollView>
//       )}

//       {/* Modal para ver imagen/video en grande */}
//       {selectedMedia && (
//         <Modal visible={!!selectedMedia} transparent animationType="fade">
//           <View style={styles.mediaModal}>
//             <TouchableOpacity 
//               style={styles.modalBackdrop}
//               onPress={() => setSelectedMedia(null)}
//             >
//               {selectedMedia.type === 'image' ? (
//                 <Image 
//                   source={{ uri: selectedMedia.uri }} 
//                   style={styles.modalImage}
//                   resizeMode="contain"
//                 />
//               ) : selectedMedia.type === 'video' && videoPlayer ? (
//                 <View style={styles.videoContainer}>
//                   <VideoView 
//                     style={styles.modalVideo}
//                     player={videoPlayer}
//                     allowsFullscreen
//                     allowsPictureInPicture
//                   />
//                   <View style={styles.videoControls}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         if (videoPlayer.playing) {
//                           videoPlayer.pause();
//                         } else {
//                           videoPlayer.play();
//                         }
//                       }}
//                       style={styles.controlButton}
//                     >
//                       <Ionicons
//                         name={videoPlayer.playing ? "pause" : "play"}
//                         size={24}
//                         color="white"
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               ) : null}
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.modalClose}
//               onPress={() => setSelectedMedia(null)}
//             >
//               <Ionicons name="close" size={30} color="white" />
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );

//   // Cargar proyectos al montar el componente
//   useEffect(() => {
//     loadProjects();
    
//     return () => {
//       if (soundRef.current) {
//         soundRef.current.unloadAsync();
//       }
//     };
//   }, []);

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
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
//         <Text style={styles.title}>
//           {activeTab === 'projects' ? 'Multimedia' : selectedProject?.name}
//         </Text>
//         <View style={styles.headerRight} />
//       </View>

//       {/* Content */}
//       <View style={styles.content}>
//         {activeTab === 'projects' && renderProjects()}
//         {activeTab === 'media' && renderMedia()}
//       </View>
//     </View>
//   );
// }

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     top: 10
//   },
//   backButton: {
//     padding: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   headerRight: {
//     width: 40,
//   },
//   content: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 16,
//     color: '#666',
//     fontSize: 16,
//   },
//   tabContent: {
//     flex: 1,
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 16,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   projectItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   projectInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   projectName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   projectDescription: {
//     fontSize: 14,
//     color: '#666',
//   },
//   mediaCountBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f8ff',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginRight: 12,
//   },
//   mediaCountText: {
//     fontSize: 12,
//     color: '#007AFF',
//     marginLeft: 4,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyMediaState: {
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
//     textAlign: 'center',
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   addMediaButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   addMediaText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   projectHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   projectHeaderInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   projectTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   mediaCount: {
//     fontSize: 14,
//     color: '#666',
//   },
//   mediaSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 20,
//     marginBottom: 12,
//   },
//   mediaRow: {
//     marginBottom: 20,
//   },
//   mediaThumbnail: {
//     width: 120,
//     marginRight: 12,
//   },
//   thumbnailImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#eee',
//   },
//   videoPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffe0e0',
//   },
//   mediaName: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   audioList: {
//     marginBottom: 20,
//   },
//   audioItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   audioItemSelected: {
//     backgroundColor: '#f0f8ff',
//     borderWidth: 1,
//     borderColor: '#007AFF',
//   },
//   audioInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   audioTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   audioDuration: {
//     fontSize: 14,
//     color: '#666',
//   },
//   mediaModal: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBackdrop: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
//   modalImage: {
//     width: '100%',
//     height: '80%',
//   },
//   videoContainer: {
//     width: '100%',
//     height: 300,
//     position: 'relative',
//   },
//   modalVideo: {
//     width: '100%',
//     height: '100%',
//   },
//   videoControls: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   controlButton: {
//     padding: 4,
//   },
//   modalClose: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
// });

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
  Modal
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

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
  media_items: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  name: string;
}

export default function MultimediaScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'media'>('projects');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const soundRef = useRef<Audio.Sound>(null);

  // Crear el reproductor de video en el nivel superior del componente
  const videoPlayer = useVideoPlayer(
    selectedMedia?.type === 'video' ? selectedMedia.uri : null,
    (player) => {
      player.loop = false;
    }
  );

  // Cargar proyectos desde la base de datos
  const loadProjects = async () => {
    try {
      const db = openDatabase();
      
      // Verificar si la tabla projects existe
      const tableExists = await db.getFirstAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='projects'"
      );
      
      if (tableExists) {
        // Obtener proyectos con medios
        const projectsData = await db.getAllAsync(`
          SELECT id, name, description, media_items 
          FROM projects 
          ORDER BY created_at DESC
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
    }
  };

  // Cargar medios de un proyecto específico
  const loadProjectMedia = (project: Project) => {
    try {
      const media = JSON.parse(project.media_items || '[]');
      setMediaItems(media);
      setSelectedProject(project);
      setActiveTab('media');
    } catch (error) {
      console.error('Error parsing media items:', error);
      Alert.alert('Error', 'No se pudieron cargar los medios del proyecto');
      setMediaItems([]);
    }
  };

  // Reproducir/pausar audio
  const toggleAudio = async (media: MediaItem) => {
    try {
      if (selectedMedia && selectedMedia.uri === media.uri) {
        if (isPlaying) {
          await soundRef.current?.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current?.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Detener y liberar el audio actual si existe
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Configurar modo de audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Crear nuevo sonido
        const { sound } = await Audio.Sound.createAsync(
          { uri: media.uri },
          { shouldPlay: true }
        );

        soundRef.current = sound;
        setSelectedMedia(media);
        setIsPlaying(true);

        // Configurar listener para cuando termine la reproducción
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Error con audio:', error);
      Alert.alert('Error', 'No se pudo reproducir el audio');
    }
  };

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Aquí podrías implementar la lógica para guardar la imagen en el proyecto
        Alert.alert('Éxito', 'Imagen seleccionada (función de guardado pendiente)');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Abrir modal de video
  const openVideoModal = (media: MediaItem) => {
    setSelectedMedia(media);
    setVideoModalVisible(true);
    if (videoPlayer && media.type === 'video') {
      videoPlayer.play();
    }
  };

  // Cerrar modal de video
  const closeVideoModal = () => {
    setVideoModalVisible(false);
    if (videoPlayer) {
      videoPlayer.pause();
    }
  };

  // Renderizar lista de proyectos
  const renderProjects = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Proyectos Creados</Text>
      
      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No hay proyectos creados</Text>
          <Text style={styles.emptyStateSubtext}>
            Crea tu primer proyecto para ver sus medios
          </Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.projectItem}
              onPress={() => loadProjectMedia(item)}
            >
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{item.name}</Text>
                <Text style={styles.projectDescription} numberOfLines={2}>
                  {item.description || 'Sin descripción'}
                </Text>
              </View>
              
              <View style={styles.mediaCountBadge}>
                <Ionicons name="images" size={16} color="#007AFF" />
                <Text style={styles.mediaCountText}>
                  {JSON.parse(item.media_items || '[]').length} medios
                </Text>
              </View>
              
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );

  // Renderizar medios de un proyecto
  const renderMedia = () => (
    <View style={styles.tabContent}>
      {/* Header del proyecto seleccionado */}
      <View style={styles.projectHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            setActiveTab('projects');
            setSelectedProject(null);
            setSelectedMedia(null);
            if (soundRef.current) {
              soundRef.current.unloadAsync();
              setIsPlaying(false);
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.projectHeaderInfo}>
          <Text style={styles.projectTitle} numberOfLines={1}>
            {selectedProject?.name}
          </Text>
          <Text style={styles.mediaCount}>
            {mediaItems.length} medios
          </Text>
        </View>
      </View>

      {mediaItems.length === 0 ? (
        <View style={styles.emptyMediaState}>
          <Ionicons name="image" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No hay medios en este proyecto</Text>
          <Text style={styles.emptyStateSubtext}>
            Agrega imágenes, videos o audio a tu proyecto
          </Text>
          <TouchableOpacity style={styles.addMediaButton} onPress={pickImage}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addMediaText}>Agregar Medio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.sectionTitle}>Medios del Proyecto</Text>
          
          {/* Imágenes */}
          {mediaItems.filter(item => item.type === 'image').length > 0 && (
            <>
              <Text style={styles.mediaSectionTitle}>Imágenes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
                {mediaItems.filter(item => item.type === 'image').map((media, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.mediaThumbnail}
                    onPress={() => setSelectedMedia(media)}
                  >
                    <Image
                      source={{ uri: media.uri }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.mediaName} numberOfLines={1}>
                      {media.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Videos */}
          {mediaItems.filter(item => item.type === 'video').length > 0 && (
            <>
              <Text style={styles.mediaSectionTitle}>Videos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
                {mediaItems.filter(item => item.type === 'video').map((media, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.mediaThumbnail}
                    onPress={() => openVideoModal(media)}
                  >
                    <View style={[styles.thumbnailImage, styles.videoPlaceholder]}>
                      <Ionicons name="videocam" size={32} color="#666" />
                    </View>
                    <Text style={styles.mediaName} numberOfLines={1}>
                      {media.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Audio */}
          {mediaItems.filter(item => item.type === 'audio').length > 0 && (
            <>
              <Text style={styles.mediaSectionTitle}>Audio</Text>
              <View style={styles.audioList}>
                {mediaItems.filter(item => item.type === 'audio').map((media, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.audioItem,
                      selectedMedia?.uri === media.uri && styles.audioItemSelected
                    ]}
                    onPress={() => toggleAudio(media)}
                  >
                    <Ionicons
                      name={isPlaying && selectedMedia?.uri === media.uri ? "pause" : "play"}
                      size={24}
                      color="#007AFF"
                    />
                    <View style={styles.audioInfo}>
                      <Text style={styles.audioTitle}>{media.name}</Text>
                      <Text style={styles.audioDuration}>Audio</Text>
                    </View>
                    {isPlaying && selectedMedia?.uri === media.uri && (
                      <ActivityIndicator size="small" color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Modal para ver imagen en grande */}
      {selectedMedia && selectedMedia.type === 'image' && (
        <Modal visible={!!selectedMedia} transparent animationType="fade">
          <View style={styles.mediaModal}>
            <TouchableOpacity 
              style={styles.modalBackdrop}
              onPress={() => setSelectedMedia(null)}
            >
              <Image 
                source={{ uri: selectedMedia.uri }} 
                style={styles.modalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setSelectedMedia(null)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {/* Modal para ver video */}
      <Modal visible={videoModalVisible} transparent animationType="fade">
        <View style={styles.mediaModal}>
          <View style={styles.modalBackdrop}>
            {selectedMedia?.type === 'video' && (
              <View style={styles.videoContainer}>
                <VideoView 
                  style={styles.modalVideo}
                  player={videoPlayer}
                  allowsFullscreen
                  allowsPictureInPicture
                />
                <View style={styles.videoControls}>
                  <TouchableOpacity
                    onPress={() => {
                      if (videoPlayer.playing) {
                        videoPlayer.pause();
                      } else {
                        videoPlayer.play();
                      }
                    }}
                    style={styles.controlButton}
                  >
                    <Ionicons
                      name={videoPlayer?.playing ? "pause" : "play"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeVideoModal}
                    style={styles.controlButton}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {activeTab === 'projects' ? 'Multimedia' : selectedProject?.name}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'media' && renderMedia()}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

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
    borderBottomColor: '#eee',
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
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
  mediaCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  mediaCountText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyMediaState: {
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
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addMediaText: {
    color: 'white',
    fontWeight: '600',
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  projectHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mediaCount: {
    fontSize: 14,
    color: '#666',
  },
  mediaSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  mediaRow: {
    marginBottom: 20,
  },
  mediaThumbnail: {
    width: 120,
    marginRight: 12,
  },
  thumbnailImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe0e0',
  },
  mediaName: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  audioList: {
    marginBottom: 20,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  audioItemSelected: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  audioDuration: {
    fontSize: 14,
    color: '#666',
  },
  mediaModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalVideo: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    gap: 10,
  },
  controlButton: {
    padding: 8,
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
});