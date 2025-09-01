// // import React from 'react';
// // import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// // import { router } from 'expo-router';

// // export default function DashboardScreen() {
// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Text style={styles.title}>Dashboard</Text>
// //       <Text style={styles.subtitle}>Selecciona una opción</Text>
      
// //       <View style={styles.menuContainer}>
// //         {/* Opción Mapa */}
// //         <TouchableOpacity 
// //           style={styles.menuItem}
// //           onPress={() => router.push('/map')}
// //         >
// //           <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
// //             <Text style={styles.icon}>🗺️</Text>
// //           </View>
// //           <Text style={styles.menuText}>Mapa</Text>
// //         </TouchableOpacity>

// //         {/* Opción Escanear */}
// //         <TouchableOpacity 
// //           style={styles.menuItem}
// //           onPress={() => router.push('/scan')}
// //         >
// //           <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
// //             <Text style={styles.icon}>📷</Text>
// //           </View>
// //           <Text style={styles.menuText}>Escanear</Text>
// //         </TouchableOpacity>

// //         {/* Opción Otras */}
// //         <TouchableOpacity 
// //           style={styles.menuItem}
// //           onPress={() => router.push('/multimedia')}
// //         >
// //           <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
// //             <Text style={styles.icon}>⚙️</Text>
// //           </View>
// //           <Text style={styles.menuText}>Multimedia</Text>
// //         </TouchableOpacity>

// //         {/* Opción Otras */}
// //         <TouchableOpacity 
// //           style={styles.menuItem}
// //           onPress={() => router.push('/other')}
// //         >
// //           <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
// //             <Text style={styles.icon}>⚙️</Text>
// //           </View>
// //           <Text style={styles.menuText}>Otras</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     textAlign: 'center',
// //     marginTop: 20,
// //     marginBottom: 10,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: '#666',
// //     textAlign: 'center',
// //     marginBottom: 40,
// //   },
// //   menuContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 10,
// //   },
// //   menuItem: {
// //     width: '48%',
// //     backgroundColor: 'white',
// //     borderRadius: 12,
// //     padding: 20,
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3.84,
// //     elevation: 5,
// //   },
// //   iconContainer: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   icon: {
// //     fontSize: 24,
// //   },
// //   menuText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#333',
// //     textAlign: 'center',
// //   },
// // });

// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
// import { router } from 'expo-router';

// export default function DashboardScreen() {
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Dashboard</Text>
//       <Text style={styles.subtitle}>Selecciona una opción</Text>
      
//       <View style={styles.menuContainer}>
//         {/* Opción Mapa */}
//         <TouchableOpacity 
//           style={styles.menuItem}
//           onPress={() => router.push('/map')}
//         >
//           <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
//             <Text style={styles.icon}>🗺️</Text>
//           </View>
//           <Text style={styles.menuText}>Mapa</Text>
//         </TouchableOpacity>

//         {/* Opción Escanear */}
//         <TouchableOpacity 
//           style={styles.menuItem}
//           onPress={() => router.push('/scan')}
//         >
//           <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
//             <Text style={styles.icon}>📷</Text>
//           </View>
//           <Text style={styles.menuText}>Escanear</Text>
//         </TouchableOpacity>

//         {/* Opción Multimedia - COLOR E ICONO MODIFICADOS */}
//         <TouchableOpacity 
//           style={styles.menuItem}
//           onPress={() => router.push('/multimedia')}
//         >
//           <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' }]}>
//             <Text style={styles.icon}>🎬</Text>
//           </View>
//           <Text style={styles.menuText}>Multimedia</Text>
//         </TouchableOpacity>

//         {/* Opción Otras */}
//         <TouchableOpacity 
//           style={styles.menuItem}
//           onPress={() => router.push('/other')}
//         >
//           <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
//             <Text style={styles.icon}>⚙️</Text>
//           </View>
//           <Text style={styles.menuText}>Otras</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   menuContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   menuItem: {
//     width: '48%',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   iconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   icon: {
//     fontSize: 24,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
// });

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel Principal</Text>
        <Text style={styles.subtitle}>Gestiona tus proyectos y recursos</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.menuContainer}>
          {/* Sección de Proyectos */}
          <Text style={styles.sectionTitle}>Proyectos</Text>
          <View style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('./components/new-project')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="add-circle" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Nuevo Proyecto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('./components/projects')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="folder-open" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Proyectos Creados</Text>
            </TouchableOpacity>
          </View>

          {/* Sección de Herramientas */}
          <Text style={styles.sectionTitle}>Herramientas</Text>
          <View style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/map')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="map" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Mapa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/scan')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FFA726' }]}>
                <Ionicons name="scan" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Escanear</Text>
            </TouchableOpacity>
          </View>

          {/* Sección de Multimedia */}
          <Text style={styles.sectionTitle}>Multimedia</Text>
          <View style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/multimedia')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' }]}>
                <Ionicons name="images" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Galería Multimedia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/upload')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#66BB6A' }]}>
                <Ionicons name="cloud-upload" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Subir Archivos</Text>
            </TouchableOpacity>
          </View>

          {/* Sección de Configuración */}
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('./components/settings')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#78909C' }]}>
                <Ionicons name="settings" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Ajustes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('./components/profile')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#26A69A' }]}>
                <Ionicons name="person" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Perfil</Text>
            </TouchableOpacity>
          </View>

          {/* Sección de Ayuda */}
          <Text style={styles.sectionTitle}>Soporte</Text>
          <View style={styles.sectionContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/help')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#42A5F5' }]}>
                <Ionicons name="help-circle" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Ayuda</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/about')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#7E57C2' }]}>
                <Ionicons name="information-circle" size={28} color="white" />
              </View>
              <Text style={styles.menuText}>Acerca de</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  menuContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 5,
  },
  sectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  menuItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
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
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 18,
  },
});