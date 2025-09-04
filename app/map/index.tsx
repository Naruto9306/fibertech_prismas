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
// import { 
//   initDatabase, 
//   addRoute, 
//   addRoutePoint, 
//   getRoutes, 
//   getRoutePoints, 
//   deleteRoute,
//   Route,
//   // Nuevas funciones para la base de datos
//   createNodesTable,
//   createConnectionsTable,
//   addNode,
//   addConnection,
//   getNodesByRoute,
//   getConnectionsByRoute
// } from '../../services/database';
import { 
  initDatabase, 
  addRoute, 
  getRoutes, 
  deleteRoute,
  addNode,
  addConnection,
  getNodesByRoute,
  getConnectionsByRoute,
  type Route,
  type Node,
  type Connection
} from '../../services/database';

// Interfaces para los tipos de nodos
interface BaseNode {
  id?: number;
  routeId: number;
  type: 'NDF' | 'pedestal' | 'IDF' | 'Unit' | 'fusionPoint';
  latitude: number;
  longitude: number;
  description?: string;
}

interface NDFNode extends BaseNode {
  type: 'NDF';
  capacity: number;
}

interface PedestalNode extends BaseNode {
  type: 'pedestal';
  connectivityType: string;
}

interface IDFNode extends BaseNode {
  type: 'IDF';
  equipment: string;
}

interface UnitNode extends BaseNode {
  type: 'Unit';
  address: string;
  client: string;
  status: 'activo' | 'inactivo' | 'mantenimiento';
}

interface FusionPointNode extends BaseNode {
  type: 'fusionPoint';
  fusionType: string;
}

type Node = NDFNode | PedestalNode | IDFNode | UnitNode | FusionPointNode;

// Interface para conexiones
interface Connection {
  id?: number;
  routeId: number;
  fromNodeId: number;
  toNodeId: number;
  cableType: 'fibra' | 'drop';
  length: number; // en metros
  pathType: 'subterranea' | 'aerea';
  status: 'activo' | 'mantenimiento';
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<Node[]>([]);
  const [currentConnections, setCurrentConnections] = useState<Connection[]>([]);
  const [routeName, setRouteName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedConnections, setSelectedConnections] = useState<Connection[]>([]);
  const [db, setDb] = useState<any>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<Node['type']>('NDF');
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [tempNode, setTempNode] = useState<{latitude: number; longitude: number} | null>(null);
  const [nodeDetails, setNodeDetails] = useState({
    description: '',
    capacity: '',
    connectivityType: '',
    equipment: '',
    address: '',
    client: '',
    status: 'activo',
    fusionType: ''
  });
  const [connectingNodes, setConnectingNodes] = useState<{from: number | null, to: number | null}>({from: null, to: null});
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState({
    cableType: 'fibra' as 'fibra' | 'drop',
    length: '',
    pathType: 'subterranea' as 'subterranea' | 'aerea',
    status: 'activo' as 'activo' | 'mantenimiento'
  });
  const mapRef = useRef<MapView>(null);

  // Inicializar base de datos
  // useEffect(() => {
  //   const initializeDb = async () => {
  //     try {
  //       const database = await initDatabase();
  //       // Crear tablas para nodos y conexiones
  //       await createNodesTable(database);
  //       await createConnectionsTable(database);
  //       setDb(database);
  //       await loadSavedRoutes(database);
        
  //       // Pequeño delay para evitar issues de layout en iOS
  //       setTimeout(() => {
  //         const defaultRegion = {
  //           latitude: -22.2725,
  //           longitude: -80.5557,
  //           latitudeDelta: 0.0922,
  //           longitudeDelta: 0.0421,
  //         };
  //         setRegion(defaultRegion);
  //         setLoading(false);
  //       }, 50);
  //     } catch (error) {
  //       console.error('Error inicializando base de datos:', error);
  //       setLoading(false);
  //     }
  //   };

  //   initializeDb();
  // }, []);
//   useEffect(() => {
//   const initializeDb = async () => {
//     try {
//       const database = await initDatabase();
//       setDb(database);
//       await loadSavedRoutes(database);
      
//       // Pequeño delay para evitar issues de layout en iOS
//       setTimeout(() => {
//         const defaultRegion = {
//           latitude: -22.2725,
//           longitude: -80.5557,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         };
//         setRegion(defaultRegion);
//         setLoading(false);
//       }, 50);
//     } catch (error) {
//       console.error('Error inicializando base de datos:', error);
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);
// useEffect(() => {
//   const initializeDb = async () => {
//     try {
//       const database = await initDatabase();
      
//       // Verifica que la base de datos tenga el método transaction
//       if (database && typeof database.transaction === 'function') {
//         setDb(database);
//         await loadSavedRoutes(database);
        
//         const defaultRegion = {
//           latitude: -22.2725,
//           longitude: -80.5557,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         };
//         setRegion(defaultRegion);
//       } else {
//         console.error('La base de datos no se inicializó correctamente');
//         Alert.alert('Error', 'No se pudo inicializar la base de datos');
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error inicializando base de datos:', error);
//       Alert.alert('Error', 'No se pudo inicializar la base de datos');
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);
// useEffect(() => {
//   const initializeDb = async () => {
//     try {
//       const database = await initDatabase();
      
//       // Verifica que la base de datos tenga el método transaction
//       if (database && typeof database.transaction === 'function') {
//         setDb(database);
//         await loadSavedRoutes(database);
        
//         const defaultRegion = {
//           latitude: 21.5218,    // Aproximadamente el centro de Cuba
//   longitude: -77.7812,  // Aproximadamente el centro de Cuba
//   latitudeDelta: 5.0,   // Zoom más amplio para ver toda la isla
//   longitudeDelta: 5.0,
//         };
//         setRegion(defaultRegion);
//       } else {
//         console.error('La base de datos no se inicializó correctamente');
//         Alert.alert('Error', 'No se pudo inicializar la base de datos');
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error inicializando base de datos:', error);
//       Alert.alert('Error', 'No se pudo inicializar la base de datos');
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);

// const createMockDatabase = () => {
//   return {
//     transaction: (callback: any) => {
//       console.warn('Usando base de datos mock - Modo desarrollo');
//       // Implementación mock simple para desarrollo
//       callback({
//         executeSql: (sql: string, params: any[], success: any, error: any) => {
//           console.log('Mock executeSql:', sql);
//           if (sql.includes('SELECT')) {
//             success({ rows: { _array: [] } });
//           } else {
//             success();
//           }
//         }
//       });
//     }
//   };
// };
// const createMockDatabase = () => {
//   return {
//     // Nuevos métodos para expo-sqlite 15.2.14
//     withTransactionSync: (callback: () => void) => {
//       console.warn('Mock withTransactionSync');
//       callback();
//     },
//     execSync: (sql: string) => {
//       console.log('Mock execSync:', sql);
//     },
//     getAllSync: (sql: string, params?: any[]): any[] => {
//       console.log('Mock getAllSync:', sql, params);
//       return [];
//     },
//     runSync: (sql: string, params?: any[]): { lastInsertRowId: number; changes: number } => {
//       console.log('Mock runSync:', sql, params);
//       return { lastInsertRowId: 1, changes: 1 };
//     },
//     getFirstSync: (sql: string, params?: any[]): any => {
//       console.log('Mock getFirstSync:', sql, params);
//       return null;
//     },
//     // Métodos legacy para compatibilidad (si otras funciones los usan)
//     transaction: (callback: any) => {
//       console.warn('Mock transaction (legacy)');
//       callback({
//         executeSql: (sql: string, params: any[], success: any, error: any) => {
//           console.log('Mock executeSql:', sql);
//           if (sql.includes('SELECT')) {
//             success({ rows: { _array: [] } });
//           } else {
//             success({ insertId: 1, rowsAffected: 1 });
//           }
//         }
//       });
//     }
//   };
// };
const createMockDatabase = () => {
  return {
    // Métodos de la nueva API
    withTransactionSync: (callback: () => void) => {
      console.warn('Mock withTransactionSync');
      callback();
    },
    execSync: (sql: string) => {
      console.log('Mock execSync:', sql);
    },
    getAllSync: (sql: string, params?: any[]): any[] => {
      console.log('Mock getAllSync:', sql, params);
      return [];
    },
    runSync: (sql: string, params?: any[]): { lastInsertRowId: number; changes: number } => {
      console.log('Mock runSync:', sql, params);
      return { lastInsertRowId: 1, changes: 1 };
    },
    getFirstSync: (sql: string, params?: any[]): any => {
      console.log('Mock getFirstSync:', sql, params);
      return null;
    },
    
    // Para compatibilidad con verificaciones antiguas
    transaction: (callback: any) => {
      console.warn('Mock transaction (legacy)');
      callback({
        executeSql: (sql: string, params: any[], success: any, error: any) => {
          console.log('Mock executeSql:', sql);
          if (sql.includes('SELECT')) {
            success({ rows: { _array: [] } });
          } else {
            success({ insertId: 1, rowsAffected: 1 });
          }
        }
      });
    }
  };
};

// useEffect(() => {
//   const initializeDb = async () => {
//     try {
//       console.log('Inicializando base de datos...');
//       const database = await initDatabase();
      
//       // Verificación más robusta de la base de datos
//       if (database && typeof database.transaction === 'function') {
//         console.log('Base de datos inicializada correctamente');
//         setDb(database);
        
//         // Cargar rutas guardadas
//         await loadSavedRoutes(database);
        
//         // Configurar región por defecto (centro de Cuba)
//         const defaultRegion = {
//           latitude: 21.5218,
//           longitude: -77.7812,
//           latitudeDelta: 5.0,
//           longitudeDelta: 5.0,
//         };
//         setRegion(defaultRegion);
//       } else {
//         console.error('La base de datos no tiene el método transaction');
//         Alert.alert('Error', 'No se pudo inicializar la base de datos correctamente');
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error crítico inicializando base de datos:', error);
//       Alert.alert('Error', 'No se pudo conectar con la base de datos. Reinicie la aplicación.');
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);
// useEffect(() => {
//   const initializeDb = async () => {
//     try {
//       console.log('Inicializando base de datos...');
//       let database;
      
//       try {
//         database = await initDatabase();
//       } catch (error) {
//         console.warn('Error con SQLite, usando modo mock:', error);
//         database = createMockDatabase();
//       }
      
//       if (database && typeof database.transaction === 'function') {
//         console.log('Base de datos disponible');
//         setDb(database);
//         await loadSavedRoutes(database);
        
//         const defaultRegion = {
//           latitude: 21.5218,
//           longitude: -77.7812,
//           latitudeDelta: 5.0,
//           longitudeDelta: 5.0,
//         };
//         setRegion(defaultRegion);
//       } else {
//         Alert.alert('Error', 'Base de datos no disponible');
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error crítico:', error);
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);
// useEffect(() => {
//   const initializeDb = async () => {
//     try {
//       console.log('Inicializando base de datos...');
      
//       // Verifica si el módulo SQLite está disponible
//       let database;
//       try {
//         const sqliteModule = await import('expo-sqlite');
//         if (!sqliteModule.default?.openDatabase) {
//           throw new Error('Módulo SQLite no disponible');
//         }
        
//         database = await initDatabase();
//         console.log('Base de datos SQLite inicializada correctamente');
//       } catch (sqliteError) {
//         console.warn('Error con SQLite, usando modo mock:', sqliteError);
//         database = createMockDatabase();
//       }
      
//       if (database && typeof database.transaction === 'function') {
//         console.log('Base de datos disponible');
//         setDb(database);
//         await loadSavedRoutes(database);
        
//         const defaultRegion = {
//           latitude: 21.5218,
//           longitude: -77.7812,
//           latitudeDelta: 5.0,
//           longitudeDelta: 5.0,
//         };
//         setRegion(defaultRegion);
//       } else {
//         console.error('Base de datos no válida');
//         Alert.alert('Error', 'No se pudo inicializar la base de datos');
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error crítico:', error);
//       Alert.alert('Error', 'Error inicializando la aplicación');
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);
// useEffect(() => {
//   if (Platform.OS === 'web') {
//   console.log('SQLite no disponible en web, usando mock');
//   setDb(createMockDatabase());
//   setLoading(false);
//   return;
// }

//   const initializeDb = async () => {
//     try {
//       console.log('Inicializando base de datos...');
      
//       let database;
//       try {
//         // Importación dinámica para asegurar que el módulo esté disponible
//         const SQLite = await import('expo-sqlite');
        
//         if (!SQLite.openDatabaseSync) {
//           throw new Error('openDatabaseSync no disponible');
//         }
        
//         database = await initDatabase();
//         console.log('Base de datos SQLite inicializada correctamente');
//       } catch (sqliteError) {
//         console.warn('Error con SQLite, usando modo mock:', sqliteError);
//         database = createMockDatabase();
//       }
      
//       if (database) {
//         console.log('Base de datos disponible');
//         setDb(database);
//         await loadSavedRoutes(database);
        
//         const defaultRegion = {
//           latitude: 21.5218,
//           longitude: -77.7812,
//           latitudeDelta: 5.0,
//           longitudeDelta: 5.0,
//         };
//         setRegion(defaultRegion);
//       } else {
//         console.error('Base de datos no válida');
//         Alert.alert('Error', 'No se pudo inicializar la base de datos');
//       }
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error crítico:', error);
//       Alert.alert('Error', 'Error inicializando la aplicación');
//       setLoading(false);
//     }
//   };

//   initializeDb();
// }, []);
useEffect(() => {
  if (Platform.OS === 'web') {
    console.log('SQLite no disponible en web, usando mock');
    setDb(createMockDatabase());
    
    const defaultRegion = {
      latitude: 21.5218,
      longitude: -77.7812,
      latitudeDelta: 5.0,
      longitudeDelta: 5.0,
    };
    setRegion(defaultRegion);
    setLoading(false);
    return;
  }

  const initializeDb = async () => {
    try {
      // console.log('Inicializando base de datos...');
      
      let database;
      try {
        // Usar la nueva API directamente
        database = await initDatabase();
        // console.log('Base de datos SQLite inicializada correctamente');
      } catch (sqliteError) {
        console.warn('Error con SQLite, usando modo mock:', sqliteError);
        database = createMockDatabase();
      }
      
      // Verificación para la nueva API
      if (database && typeof database.getAllSync === 'function') {
        // console.log('Base de datos disponible con métodos sync');
        setDb(database);
        await loadSavedRoutes(database);
        
        const defaultRegion = {
          latitude: 21.5218,
          longitude: -77.7812,
          latitudeDelta: 5.0,
          longitudeDelta: 5.0,
        };
        setRegion(defaultRegion);
      } else {
        // console.error('Base de datos no tiene métodos sync');
        Alert.alert('Error', 'No se pudo inicializar la base de datos correctamente');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error crítico:', error);
      Alert.alert('Error', 'Error inicializando la aplicación');
      setLoading(false);
    }
  };

  initializeDb();
}, []);



  // const loadSavedRoutes = async (database: any) => {
  //   if (!database) return;
  //   const routes = await getRoutes(database);
  //   setSavedRoutes(routes);
  // };
//   const loadSavedRoutes = async (database: any) => {
//   if (!database) return;
//   try {
//     const routes = await getRoutes(database);
//     setSavedRoutes(routes);
//   } catch (error) {
//     console.error('Error cargando rutas:', error);
//   }
// };

// const loadSavedRoutes = async (database: SQLite.SQLiteDatabase | null) => {
//   if (!database || typeof database.transaction !== 'function') {
//     console.error('Base de datos no válida');
//     return;
//   }
  
//   try {
//     const routes = await getRoutes(database);
//     setSavedRoutes(routes);
//   } catch (error) {
//     console.error('Error cargando rutas:', error);
//   }
// };
const loadSavedRoutes = async (database: any) => {
  if (!database || typeof database.getAllSync !== 'function') {
    console.error('Base de datos no válida o métodos sync no disponibles');
    return;
  }
  
  try {
    const routes = await getRoutes(database);
    setSavedRoutes(routes);
  } catch (error) {
    console.error('Error cargando rutas:', error);
  }
};

  const handleMapPress = (event: any) => {
    if (!isCreatingRoute || !db) return;

    const { coordinate } = event.nativeEvent;
    setTempNode({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
    setShowNodeModal(true);
  };

  const addNodeToRoute = () => {
    if (!tempNode) return;

    const baseNode = {
      routeId: 0, // Se asignará al guardar la ruta
      type: selectedNodeType,
      latitude: tempNode.latitude,
      longitude: tempNode.longitude,
      description: nodeDetails.description
    };

    let newNode: Node;

    switch (selectedNodeType) {
      case 'NDF':
        newNode = {
          ...baseNode,
          type: 'NDF',
          capacity: parseInt(nodeDetails.capacity) || 0
        };
        break;
      case 'pedestal':
        newNode = {
          ...baseNode,
          type: 'pedestal',
          connectivityType: nodeDetails.connectivityType
        };
        break;
      case 'IDF':
        newNode = {
          ...baseNode,
          type: 'IDF',
          equipment: nodeDetails.equipment
        };
        break;
      case 'Unit':
        newNode = {
          ...baseNode,
          type: 'Unit',
          address: nodeDetails.address,
          client: nodeDetails.client,
          status: nodeDetails.status as 'activo' | 'inactivo' | 'mantenimiento'
        };
        break;
      case 'fusionPoint':
        newNode = {
          ...baseNode,
          type: 'fusionPoint',
          fusionType: nodeDetails.fusionType
        };
        break;
      default:
        return;
    }

    setCurrentNodes(prev => [...prev, newNode]);
    setTempNode(null);
    setShowNodeModal(false);
    // Resetear detalles del nodo
    setNodeDetails({
      description: '',
      capacity: '',
      connectivityType: '',
      equipment: '',
      address: '',
      client: '',
      status: 'activo',
      fusionType: ''
    });
  };

  const startCreatingRoute = () => {
    setIsCreatingRoute(true);
    setCurrentNodes([]);
    setCurrentConnections([]);
    setRouteName('');
  };

  const cancelCreatingRoute = () => {
    setIsCreatingRoute(false);
    setCurrentNodes([]);
    setCurrentConnections([]);
  };

  // const saveRoute = async () => {
  //   // if (!db || currentNodes.length === 0 || !routeName.trim()) {
  //   //   Alert.alert('Error', 'Por favor ingresa un nombre para la ruta y asegúrate de tener al menos un nodo');
  //   //   return;
  //   // }
  //   if (!db || typeof db.transaction !== 'function' || currentNodes.length === 0 || !routeName.trim()) {
  //   Alert.alert('Error', 'Por favor ingresa un nombre para la ruta y asegúrate de tener al menos un nodo');
  //   return;
  // }

  //   try {
  //     const routeId = await addRoute(db, routeName.trim());
      
  //     // Guardar nodos
  //     for (const node of currentNodes) {
  //       await addNode(db, {...node, routeId});
  //     }

  //     // Guardar conexiones
  //     for (const connection of currentConnections) {
  //       await addConnection(db, {...connection, routeId});
  //     }

  //     Alert.alert('Éxito', 'Ruta guardada correctamente');
  //     setIsCreatingRoute(false);
  //     setCurrentNodes([]);
  //     setCurrentConnections([]);
  //     setRouteName('');
  //     setShowSaveModal(false);
  //     await loadSavedRoutes(db);
  //   } catch (error) {
  //     console.error('Error saving route:', error);
  //     Alert.alert('Error', 'No se pudo guardar la ruta');
  //   }
  // };
  const saveRoute = async () => {
  // Cambiar la verificación para la nueva API
  if (!db || typeof db.runSync !== 'function' || currentNodes.length === 0 || !routeName.trim()) {
    Alert.alert('Error', 'Por favor ingresa un nombre para la ruta y asegúrate de tener al menos un nodo');
    return;
  }

  try {
    const routeId = await addRoute(db, routeName.trim());
    
    // Guardar nodos
    for (const node of currentNodes) {
      await addNode(db, {...node, routeId});
    }

    // Guardar conexiones
    for (const connection of currentConnections) {
      await addConnection(db, {...connection, routeId});
    }

    Alert.alert('Éxito', 'Ruta guardada correctamente');
    setIsCreatingRoute(false);
    setCurrentNodes([]);
    setCurrentConnections([]);
    setRouteName('');
    setShowSaveModal(false);
    await loadSavedRoutes(db);
  } catch (error) {
    console.error('Error saving route:', error);
    Alert.alert('Error', 'No se pudo guardar la ruta');
  }
};

  // const loadRoute = async (route: Route) => {
  //   if (!db) return;

  //   try {
  //     const nodes = await getNodesByRoute(db, route.id!);
  //     const connections = await getConnectionsByRoute(db, route.id!);
      
  //     setSelectedRoute(route);
  //     setSelectedNodes(nodes);
  //     setSelectedConnections(connections);
      
  //     if (nodes.length > 0) {
  //       const firstNode = nodes[0];
  //       mapRef.current?.animateToRegion({
  //         latitude: firstNode.latitude,
  //         longitude: firstNode.longitude,
  //         latitudeDelta: 0.0922,
  //         longitudeDelta: 0.0421,
  //       }, 1000);
  //     }
  //   } catch (error) {
  //     console.error('Error loading route:', error);
  //     Alert.alert('Error', 'No se pudo cargar la ruta');
  //   }
  // };
  const loadRoute = async (route: Route) => {
  if (!db || typeof db.getAllSync !== 'function') return;

  try {
    const nodes = await getNodesByRoute(db, route.id!);
    const connections = await getConnectionsByRoute(db, route.id!);
    
    setSelectedRoute(route);
    setSelectedNodes(nodes);
    setSelectedConnections(connections);
    
    if (nodes.length > 0) {
      const firstNode = nodes[0];
      mapRef.current?.animateToRegion({
        latitude: firstNode.latitude,
        longitude: firstNode.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  } catch (error) {
    console.error('Error loading route:', error);
    Alert.alert('Error', 'No se pudo cargar la ruta');
  }
};

  const deleteSavedRoute = async (routeId: number) => {
    if (!db || typeof db.runSync !== 'function') return;

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
              setSelectedNodes([]);
              setSelectedConnections([]);
            }
          }
        }
      ]
    );
  };

  const handleNodePress = (nodeId: number) => {
    if (!isCreatingRoute) return;
    
    if (connectingNodes.from === null) {
      setConnectingNodes({from: nodeId, to: null});
    } else if (connectingNodes.from === nodeId) {
      setConnectingNodes({from: null, to: null});
    } else {
      setConnectingNodes({...connectingNodes, to: nodeId});
      setShowConnectionModal(true);
    }
  };

  const addConnectionToRoute = () => {
    if (connectingNodes.from === null || connectingNodes.to === null) return;

    const newConnection: Connection = {
      routeId: 0, // Se asignará al guardar la ruta
      fromNodeId: connectingNodes.from,
      toNodeId: connectingNodes.to,
      cableType: connectionDetails.cableType,
      length: parseInt(connectionDetails.length) || 0,
      pathType: connectionDetails.pathType,
      status: connectionDetails.status
    };

    setCurrentConnections(prev => [...prev, newConnection]);
    setConnectingNodes({from: null, to: null});
    setShowConnectionModal(false);
    // Resetear detalles de conexión
    setConnectionDetails({
      cableType: 'fibra',
      length: '',
      pathType: 'subterranea',
      status: 'activo'
    });
  };

  const getNodeColor = (type: Node['type']) => {
    switch (type) {
      case 'NDF': return '#FF0000'; // Rojo
      case 'pedestal': return '#00FF00'; // Verde
      case 'IDF': return '#0000FF'; // Azul
      case 'Unit': return '#FFFF00'; // Amarillo
      case 'fusionPoint': return '#FF00FF'; // Magenta
      default: return '#007AFF';
    }
  };

  const getConnectionColor = (status: Connection['status']) => {
    return status === 'activo' ? '#00FF00' : '#FF0000';
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
            {/* Nodos de la ruta actual */}
            {currentNodes.map((node, index) => (
              <Marker
                key={`current-${index}`}
                coordinate={{latitude: node.latitude, longitude: node.longitude}}
                pinColor={getNodeColor(node.type)}
                title={`${node.type} ${node.description || ''}`}
                onPress={() => handleNodePress(index)}
              />
            ))}

            {/* Conexiones de la ruta actual */}
            {currentConnections.map((connection, index) => {
              const fromNode = currentNodes.find(n => 
                currentNodes.indexOf(n) === connection.fromNodeId
              );
              const toNode = currentNodes.find(n => 
                currentNodes.indexOf(n) === connection.toNodeId
              );
              
              if (!fromNode || !toNode) return null;
              
              return (
                <Polyline
                  key={`connection-${index}`}
                  coordinates={[
                    {latitude: fromNode.latitude, longitude: fromNode.longitude},
                    {latitude: toNode.latitude, longitude: toNode.longitude}
                  ]}
                  strokeColor={getConnectionColor(connection.status)}
                  strokeWidth={4}
                />
              );
            })}

            {/* Nodos de la ruta seleccionada */}
            {selectedNodes.map((node) => (
              <Marker
                key={`saved-${node.id}`}
                coordinate={{latitude: node.latitude, longitude: node.longitude}}
                pinColor={getNodeColor(node.type)}
                title={`${node.type}: ${node.description || ''}`}
              />
            ))}

            {/* Conexiones de la ruta seleccionada */}
            {selectedConnections.map((connection) => {
              const fromNode = selectedNodes.find(n => n.id === connection.fromNodeId);
              const toNode = selectedNodes.find(n => n.id === connection.toNodeId);
              
              if (!fromNode || !toNode) return null;
              
              return (
                <Polyline
                  key={`saved-connection-${connection.id}`}
                  coordinates={[
                    {latitude: fromNode.latitude, longitude: fromNode.longitude},
                    {latitude: toNode.latitude, longitude: toNode.longitude}
                  ]}
                  strokeColor={getConnectionColor(connection.status)}
                  strokeWidth={4}
                />
              );
            })}
          </MapView>
        )}

        {/* Botones de control */}
        <View style={styles.controlsContainer}>
          {/* Selector de tipo de nodo */}
          {isCreatingRoute && (
            <View style={styles.nodeTypeSelector}>
              <Text style={styles.selectorTitle}>Tipo de Nodo:</Text>
              <View style={styles.selectorButtons}>
                {(['NDF', 'pedestal', 'IDF', 'Unit', 'fusionPoint'] as Node['type'][]).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.nodeTypeButton,
                      selectedNodeType === type && styles.nodeTypeButtonActive
                    ]}
                    onPress={() => setSelectedNodeType(type)}
                  >
                    <Text style={[
                      styles.nodeTypeButtonText,
                      selectedNodeType === type && styles.nodeTypeButtonTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

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
          {isCreatingRoute && currentNodes.length > 0 && (
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
                setSelectedNodes([]);
                setSelectedConnections([]);
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
                Nodos en la ruta: {currentNodes.length}
              </Text>
              <Text style={styles.pointsCount}>
                Conexiones en la ruta: {currentConnections.length}
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

        {/* Modal para agregar nodo */}
        <Modal
          visible={showNodeModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNodeModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, styles.nodeModal]}>
              <Text style={styles.modalTitle}>Agregar Nodo ({selectedNodeType})</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={nodeDetails.description}
                onChangeText={text => setNodeDetails({...nodeDetails, description: text})}
              />
              
              {selectedNodeType === 'NDF' && (
                <TextInput
                  style={styles.input}
                  placeholder="Capacidad"
                  value={nodeDetails.capacity}
                  onChangeText={text => setNodeDetails({...nodeDetails, capacity: text})}
                  keyboardType="numeric"
                />
              )}
              
              {selectedNodeType === 'pedestal' && (
                <TextInput
                  style={styles.input}
                  placeholder="Tipo de conectividad"
                  value={nodeDetails.connectivityType}
                  onChangeText={text => setNodeDetails({...nodeDetails, connectivityType: text})}
                />
              )}
              
              {selectedNodeType === 'IDF' && (
                <TextInput
                  style={styles.input}
                  placeholder="Equipos"
                  value={nodeDetails.equipment}
                  onChangeText={text => setNodeDetails({...nodeDetails, equipment: text})}
                />
              )}
              
              {selectedNodeType === 'Unit' && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Dirección"
                    value={nodeDetails.address}
                    onChangeText={text => setNodeDetails({...nodeDetails, address: text})}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Cliente"
                    value={nodeDetails.client}
                    onChangeText={text => setNodeDetails({...nodeDetails, client: text})}
                  />
                  <View style={styles.statusSelector}>
                    <Text>Estado:</Text>
                    {(['activo', 'inactivo', 'mantenimiento'] as const).map(status => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusButton,
                          nodeDetails.status === status && styles.statusButtonActive
                        ]}
                        onPress={() => setNodeDetails({...nodeDetails, status})}
                      >
                        <Text style={[
                          styles.statusButtonText,
                          nodeDetails.status === status && styles.statusButtonTextActive
                        ]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              
              {selectedNodeType === 'fusionPoint' && (
                <TextInput
                  style={styles.input}
                  placeholder="Tipo de fusión"
                  value={nodeDetails.fusionType}
                  onChangeText={text => setNodeDetails({...nodeDetails, fusionType: text})}
                />
              )}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowNodeModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={addNodeToRoute}
                >
                  <Text style={styles.modalButtonText}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal para agregar conexión */}
        <Modal
          visible={showConnectionModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowConnectionModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Agregar Conexión</Text>
              
              <View style={styles.connectionTypeSelector}>
                <Text>Tipo de cable:</Text>
                <View style={styles.selectorButtons}>
                  {(['fibra', 'drop'] as const).map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.connectionTypeButton,
                        connectionDetails.cableType === type && styles.connectionTypeButtonActive
                      ]}
                      onPress={() => setConnectionDetails({...connectionDetails, cableType: type})}
                    >
                      <Text style={[
                        styles.connectionTypeButtonText,
                        connectionDetails.cableType === type && styles.connectionTypeButtonTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Longitud (metros)"
                value={connectionDetails.length}
                onChangeText={text => setConnectionDetails({...connectionDetails, length: text})}
                keyboardType="numeric"
              />
              
              <View style={styles.connectionTypeSelector}>
                <Text>Trayectoria:</Text>
                <View style={styles.selectorButtons}>
                  {(['subterranea', 'aerea'] as const).map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.connectionTypeButton,
                        connectionDetails.pathType === type && styles.connectionTypeButtonActive
                      ]}
                      onPress={() => setConnectionDetails({...connectionDetails, pathType: type})}
                    >
                      <Text style={[
                        styles.connectionTypeButtonText,
                        connectionDetails.pathType === type && styles.connectionTypeButtonTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.connectionTypeSelector}>
                <Text>Estado:</Text>
                <View style={styles.selectorButtons}>
                  {(['activo', 'mantenimiento'] as const).map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.connectionTypeButton,
                        connectionDetails.status === status && styles.connectionTypeButtonActive
                      ]}
                      onPress={() => setConnectionDetails({...connectionDetails, status})}
                    >
                      <Text style={[
                        styles.connectionTypeButtonText,
                        connectionDetails.status === status && styles.connectionTypeButtonTextActive
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowConnectionModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={addConnectionToRoute}
                  disabled={!connectionDetails.length}
                >
                  <Text style={styles.modalButtonText}>Agregar</Text>
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
                        onPress={() => {
                          loadRoute(item);
                          setShowRoutesModal(false);
                        }}
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  nodeTypeSelector: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  selectorTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  nodeTypeButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  nodeTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  nodeTypeButtonText: {
    fontSize: 12,
  },
  nodeTypeButtonTextActive: {
    color: 'white',
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
  nodeModal: {
    maxHeight: '80%',
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
  statusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 5,
  },
  statusButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    fontSize: 12,
  },
  statusButtonTextActive: {
    color: 'white',
  },
  connectionTypeSelector: {
    marginBottom: 15,
  },
  connectionTypeButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginRight: 5,
  },
  connectionTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  connectionTypeButtonText: {
    fontSize: 12,
  },
  connectionTypeButtonTextActive: {
    color: 'white',
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