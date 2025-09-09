// // // import * as SQLite from 'expo-sqlite';

// // // // Interfaces
// // // export interface Route {
// // //   id?: number;
// // //   name: string;
// // //   createdAt?: string;
// // //   updatedAt?: string;
// // // }

// // // // Función para abrir la base de datos (API moderna)
// // // export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
// // //   try {
// // //     // Usar openDatabaseSync para la nueva API
// // //     const db = SQLite.openDatabaseSync('app.db');
// // //     // console.log('Base de datos abierta correctamente');
    
// // //     // Inicializar las tablas usando withTransactionSync
// // //     db.withTransactionSync(() => {
// // //       // Tabla de rutas
// // //       db.execSync(`
// // //         CREATE TABLE IF NOT EXISTS routes (
// // //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //           name TEXT NOT NULL,
// // //           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
// // //           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
// // //         );
// // //       `);
      
// // //       // Tabla de nodos
// // //       db.execSync(`
// // //         CREATE TABLE IF NOT EXISTS nodes (
// // //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //           routeId INTEGER,
// // //           type TEXT NOT NULL,
// // //           latitude REAL NOT NULL,
// // //           longitude REAL NOT NULL,
// // //           description TEXT,
// // //           capacity INTEGER,
// // //           connectivityType TEXT,
// // //           equipment TEXT,
// // //           address TEXT,
// // //           client TEXT,
// // //           status TEXT,
// // //           fusionType TEXT,
// // //           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
// // //         );
// // //       `);
      
// // //       // Tabla de conexiones
// // //       db.execSync(`
// // //         CREATE TABLE IF NOT EXISTS connections (
// // //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// // //           routeId INTEGER,
// // //           fromNodeId INTEGER,
// // //           toNodeId INTEGER,
// // //           cableType TEXT NOT NULL,
// // //           length REAL NOT NULL,
// // //           pathType TEXT NOT NULL,
// // //           status TEXT NOT NULL,
// // //           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE,
// // //           FOREIGN KEY (fromNodeId) REFERENCES nodes (id),
// // //           FOREIGN KEY (toNodeId) REFERENCES nodes (id)
// // //         );
// // //       `);
// // //     });
    
// // //     // console.log('Tablas creadas correctamente');
// // //     return db;
// // //   } catch (error) {
// // //     console.error('Error al abrir la base de datos:', error);
// // //     throw error;
// // //   }
// // // };

// // // // Funciones para rutas
// // // export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
// // //   try {
// // //     const result = db.runSync('INSERT INTO routes (name) VALUES (?);', [name]);
// // //     return result.lastInsertRowId;
// // //   } catch (error) {
// // //     console.error('Error al agregar ruta:', error);
// // //     throw error;
// // //   }
// // // };

// // // export const getRoutes = async (db: SQLite.SQLiteDatabase): Promise<Route[]> => {
// // //   try {
// // //     const result = db.getAllSync('SELECT * FROM routes ORDER BY updatedAt DESC;');
// // //     return result as Route[];
// // //   } catch (error) {
// // //     console.error('Error al obtener rutas:', error);
// // //     throw error;
// // //   }
// // // };

// // // export const deleteRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<void> => {
// // //   try {
// // //     db.runSync('DELETE FROM routes WHERE id = ?;', [routeId]);
// // //   } catch (error) {
// // //     console.error('Error al eliminar ruta:', error);
// // //     throw error;
// // //   }
// // // };

// // // // Funciones para nodos
// // // export interface Node {
// // //   id?: number;
// // //   routeId: number;
// // //   type: 'NDF' | 'pedestal' | 'IDF' | 'Unit';
// // //   latitude: number;
// // //   longitude: number;
// // //   description?: string;
// // //   fiberCount?: number;
// // //   fiberColor?: string;
// // //   equipment?: string;
// // //   address?: string;
// // //   client?: string;
// // //   status?: 'activo' | 'inactivo' | 'mantenimiento';
// // // }

// // // export const addNode = async (db: SQLite.SQLiteDatabase, node: Node): Promise<number> => {
// // //   try {
// // //     const result = db.runSync(
// // //       `INSERT INTO nodes 
// // //       (routeId, type, latitude, longitude, description, capacity, connectivityType, equipment, address, client, status, fusionType) 
// // //       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
// // //       [
// // //         node.routeId,
// // //         node.type,
// // //         node.latitude,
// // //         node.longitude,
// // //         node.description || null,
// // //         node.type === 'NDF' ? node.capacity : null,
// // //         node.type === 'pedestal' ? node.connectivityType : null,
// // //         node.type === 'IDF' ? node.equipment : null,
// // //         node.type === 'Unit' ? node.address : null,
// // //         node.type === 'Unit' ? node.client : null,
// // //         node.type === 'Unit' ? node.status : null,
// // //         node.type === 'fusionPoint' ? node.fusionType : null
// // //       ]
// // //     );
// // //     return result.lastInsertRowId;
// // //   } catch (error) {
// // //     console.error('Error al agregar nodo:', error);
// // //     throw error;
// // //   }
// // // };

// // // export const getNodesByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Node[]> => {
// // //   try {
// // //     const result = db.getAllSync('SELECT * FROM nodes WHERE routeId = ?;', [routeId]);
// // //     return result as Node[];
// // //   } catch (error) {
// // //     console.error('Error al obtener nodos:', error);
// // //     throw error;
// // //   }
// // // };

// // // // Funciones para conexiones
// // // export interface Connection {
// // //   id?: number;
// // //   routeId: number;
// // //   fromNodeId: number;
// // //   toNodeId: number;
// // //   cableType: 'fibra' | 'drop';
// // //   length: number;
// // //   pathType: 'subterranea' | 'aerea';
// // //   status: 'activo' | 'mantenimiento';
// // // }

// // // export const addConnection = async (db: SQLite.SQLiteDatabase, connection: Connection): Promise<number> => {
// // //   try {
// // //     const result = db.runSync(
// // //       `INSERT INTO connections 
// // //       (routeId, fromNodeId, toNodeId, cableType, length, pathType, status) 
// // //       VALUES (?, ?, ?, ?, ?, ?, ?);`,
// // //       [
// // //         connection.routeId,
// // //         connection.fromNodeId,
// // //         connection.toNodeId,
// // //         connection.cableType,
// // //         connection.length,
// // //         connection.pathType,
// // //         connection.status
// // //       ]
// // //     );
// // //     return result.lastInsertRowId;
// // //   } catch (error) {
// // //     console.error('Error al agregar conexión:', error);
// // //     throw error;
// // //   }
// // // };

// // // export const getConnectionsByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Connection[]> => {
// // //   try {
// // //     const result = db.getAllSync('SELECT * FROM connections WHERE routeId = ?;', [routeId]);
// // //     return result as Connection[];
// // //   } catch (error) {
// // //     console.error('Error al obtener conexiones:', error);
// // //     throw error;
// // //   }
// // // };

// // // // Funciones obsoletas (para compatibilidad)
// // // export const addRoutePoint = async () => {
// // //   throw new Error('Esta función ha sido reemplazada por addNode');
// // // };

// // // export const getRoutePoints = async () => {
// // //   throw new Error('Esta función ha sido reemplazada por getNodesByRoute');
// // // };

// // // export const createNodesTable = async () => {
// // //   console.log('Las tablas ya se crean automáticamente en initDatabase');
// // // };

// // // export const createConnectionsTable = async () => {
// // //   console.log('Las tablas ya se crean automáticamente en initDatabase');
// // // };

// // import * as SQLite from 'expo-sqlite';

// // // Interfaces
// // export interface Route {
// //   id?: number;
// //   name: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // // Función para abrir la base de datos (API moderna)
// // export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
// //   try {
// //     // Usar openDatabaseSync para la nueva API
// //     const db = SQLite.openDatabaseSync('app.db');
    
// //     // Inicializar las tablas usando withTransactionSync
// //     db.withTransactionSync(() => {
// //       // Tabla de rutas
// //       db.execSync(`
// //         CREATE TABLE IF NOT EXISTS routes (
// //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// //           name TEXT NOT NULL,
// //           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
// //           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
// //         );
// //       `);
      
// //       // Tabla de nodos - ACTUALIZADA con nuevos campos
// //       db.execSync(`
// //         CREATE TABLE IF NOT EXISTS nodes (
// //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// //           routeId INTEGER,
// //           type TEXT NOT NULL,
// //           latitude REAL NOT NULL,
// //           longitude REAL NOT NULL,
// //           description TEXT,
// //           fiberCount INTEGER,
// //           fiberColor TEXT,
// //           equipment TEXT,
// //           address TEXT,
// //           client TEXT,
// //           status TEXT,
// //           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
// //         );
// //       `);
      
// //       // Tabla de conexiones
// //       db.execSync(`
// //         CREATE TABLE IF NOT EXISTS connections (
// //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// //           routeId INTEGER,
// //           fromNodeId INTEGER,
// //           toNodeId INTEGER,
// //           cableType TEXT NOT NULL,
// //           length REAL NOT NULL,
// //           pathType TEXT NOT NULL,
// //           status TEXT NOT NULL,
// //           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE,
// //           FOREIGN KEY (fromNodeId) REFERENCES nodes (id),
// //           FOREIGN KEY (toNodeId) REFERENCES nodes (id)
// //         );
// //       `);
// //     });
    
// //     return db;
// //   } catch (error) {
// //     console.error('Error al abrir la base de datos:', error);
// //     throw error;
// //   }
// // };

// // // Funciones para rutas
// // export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
// //   try {
// //     const result = db.runSync('INSERT INTO routes (name) VALUES (?);', [name]);
// //     return result.lastInsertRowId;
// //   } catch (error) {
// //     console.error('Error al agregar ruta:', error);
// //     throw error;
// //   }
// // };

// // export const getRoutes = async (db: SQLite.SQLiteDatabase): Promise<Route[]> => {
// //   try {
// //     const result = db.getAllSync('SELECT * FROM routes ORDER BY updatedAt DESC;');
// //     return result as Route[];
// //   } catch (error) {
// //     console.error('Error al obtener rutas:', error);
// //     throw error;
// //   }
// // };

// // export const deleteRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<void> => {
// //   try {
// //     db.runSync('DELETE FROM routes WHERE id = ?;', [routeId]);
// //   } catch (error) {
// //     console.error('Error al eliminar ruta:', error);
// //     throw error;
// //   }
// // };

// // // Funciones para nodos - INTERFAZ ACTUALIZADA
// // export interface Node {
// //   id?: number;
// //   routeId: number;
// //   type: 'NDF' | 'pedestal' | 'IDF' | 'Unit';
// //   latitude: number;
// //   longitude: number;
// //   description?: string;
// //   fiberCount?: number;
// //   fiberColor?: string;
// //   equipment?: string;
// //   address?: string;
// //   client?: string;
// //   status?: 'activo' | 'inactivo' | 'mantenimiento';
// // }

// // export const addNode = async (db: SQLite.SQLiteDatabase, node: Node): Promise<number> => {
// //   try {
// //     const result = db.runSync(
// //       `INSERT INTO nodes 
// //       (routeId, type, latitude, longitude, description, fiberCount, fiberColor, equipment, address, client, status) 
// //       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
// //       [
// //         node.routeId,
// //         node.type,
// //         node.latitude,
// //         node.longitude,
// //         node.description || null,
// //         node.fiberCount || null,
// //         node.fiberColor || null,
// //         node.equipment || null,
// //         node.address || null,
// //         node.client || null,
// //         node.status || null
// //       ]
// //     );
// //     return result.lastInsertRowId;
// //   } catch (error) {
// //     console.error('Error al agregar nodo:', error);
// //     throw error;
// //   }
// // };

// // export const getNodesByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Node[]> => {
// //   try {
// //     const result = db.getAllSync('SELECT * FROM nodes WHERE routeId = ?;', [routeId]);
// //     return result as Node[];
// //   } catch (error) {
// //     console.error('Error al obtener nodos:', error);
// //     throw error;
// //   }
// // };

// // // Funciones para conexiones
// // export interface Connection {
// //   id?: number;
// //   routeId: number;
// //   fromNodeId: number;
// //   toNodeId: number;
// //   cableType: 'fibra' | 'drop';
// //   length: number;
// //   pathType: 'subterranea' | 'aerea';
// //   status: 'activo' | 'mantenimiento';
// // }

// // export const addConnection = async (db: SQLite.SQLiteDatabase, connection: Connection): Promise<number> => {
// //   try {
// //     const result = db.runSync(
// //       `INSERT INTO connections 
// //       (routeId, fromNodeId, toNodeId, cableType, length, pathType, status) 
// //       VALUES (?, ?, ?, ?, ?, ?, ?);`,
// //       [
// //         connection.routeId,
// //         connection.fromNodeId,
// //         connection.toNodeId,
// //         connection.cableType,
// //         connection.length,
// //         connection.pathType,
// //         connection.status
// //       ]
// //     );
// //     return result.lastInsertRowId;
// //   } catch (error) {
// //     console.error('Error al agregar conexión:', error);
// //     throw error;
// //   }
// // };

// // export const getConnectionsByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Connection[]> => {
// //   try {
// //     const result = db.getAllSync('SELECT * FROM connections WHERE routeId = ?;', [routeId]);
// //     return result as Connection[];
// //   } catch (error) {
// //     console.error('Error al obtener conexiones:', error);
// //     throw error;
// //   }
// // };

// // // Funciones obsoletas (para compatibilidad)
// // export const addRoutePoint = async () => {
// //   throw new Error('Esta función ha sido reemplazada por addNode');
// // };

// // export const getRoutePoints = async () => {
// //   throw new Error('Esta función ha sido reemplazada por getNodesByRoute');
// // };

// // export const createNodesTable = async () => {
// //   console.log('Las tablas ya se crean automáticamente en initDatabase');
// // };

// // export const createConnectionsTable = async () => {
// //   console.log('Las tablas ya se crean automáticamente en initDatabase');
// // };

// import * as SQLite from 'expo-sqlite';

// // Interfaces
// export interface Route {
//   id?: number;
//   name: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Función para abrir la base de datos (API moderna)
// export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   try {
//     // Usar openDatabaseSync para la nueva API
//     const db = SQLite.openDatabaseSync('fiberRoutes.db');
    
//     // Inicializar las tablas usando withTransactionSync
//     db.withTransactionSync(() => {
//       // Tabla de rutas
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS routes (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL,
//           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
//         );
//       `);
      
//       // Tabla de nodos - ACTUALIZADA con nuevos campos
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS nodes (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           routeId INTEGER,
//           type TEXT NOT NULL,
//           latitude REAL NOT NULL,
//           longitude REAL NOT NULL,
//           description TEXT,
//           fiberCount INTEGER DEFAULT 0,
//           fiberColor TEXT,
//           equipment TEXT,
//           address TEXT,
//           client TEXT,
//           status TEXT DEFAULT 'activo',
//           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
//         );
//       `);
      
//       // Tabla de conexiones
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS connections (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           routeId INTEGER,
//           fromNodeId INTEGER,
//           toNodeId INTEGER,
//           cableType TEXT NOT NULL,
//           length REAL NOT NULL,
//           pathType TEXT NOT NULL,
//           status TEXT NOT NULL DEFAULT 'activo',
//           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE,
//           FOREIGN KEY (fromNodeId) REFERENCES nodes (id),
//           FOREIGN KEY (toNodeId) REFERENCES nodes (id)
//         );
//       `);
//     });
    
//     // Para desarrollo: verificar y migrar estructura si es necesario
//     await migrateDatabaseStructure(db);
    
//     return db;
//   } catch (error) {
//     console.error('Error al abrir la base de datos:', error);
//     throw error;
//   }
// };

// // Función para migrar la estructura de la base de datos si es necesario
// const migrateDatabaseStructure = async (db: SQLite.SQLiteDatabase): Promise<void> => {
//   try {
//     // Verificar si la tabla nodes tiene las columnas nuevas
//     const columns = await db.getAllSync('PRAGMA table_info(nodes)');
//     const columnNames = columns.map((col: any) => col.name);
    
//     // Si falta alguna columna, recrear la tabla con la nueva estructura
//     if (!columnNames.includes('fiberCount') || 
//         !columnNames.includes('fiberColor') || 
//         !columnNames.includes('equipment')) {
      
//       console.log('Migrando estructura de la base de datos...');
      
//       // 1. Crear tabla temporal con la nueva estructura
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS nodes_temp (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           routeId INTEGER,
//           type TEXT NOT NULL,
//           latitude REAL NOT NULL,
//           longitude REAL NOT NULL,
//           description TEXT,
//           fiberCount INTEGER DEFAULT 0,
//           fiberColor TEXT,
//           equipment TEXT,
//           address TEXT,
//           client TEXT,
//           status TEXT DEFAULT 'activo',
//           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
//         );
//       `);
      
//       // 2. Copiar datos existentes si los hay
//       try {
//         const existingData = await db.getAllSync('SELECT * FROM nodes');
//         if (existingData.length > 0) {
//           for (const row of existingData) {
//             db.runSync(
//               `INSERT INTO nodes_temp 
//                (id, routeId, type, latitude, longitude, description, address, client, status) 
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//               [
//                 row.id,
//                 row.routeId,
//                 row.type,
//                 row.latitude,
//                 row.longitude,
//                 row.description || null,
//                 row.address || null,
//                 row.client || null,
//                 row.status || 'activo'
//               ]
//             );
//           }
//         }
//       } catch (error) {
//         console.log('No hay datos existentes para migrar o error en migración:', error);
//       }
      
//       // 3. Eliminar tabla vieja
//       db.execSync('DROP TABLE IF EXISTS nodes');
      
//       // 4. Renombrar tabla temporal
//       db.execSync('ALTER TABLE nodes_temp RENAME TO nodes');
      
//       console.log('Migración completada exitosamente');
//     }
//   } catch (error) {
//     console.error('Error en migración de base de datos:', error);
//   }
// };

// // Funciones para rutas
// export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
//   try {
//     const result = db.runSync(
//       'INSERT INTO routes (name, updatedAt) VALUES (?, datetime("now"));', 
//       [name]
//     );
//     return result.lastInsertRowId;
//   } catch (error) {
//     console.error('Error al agregar ruta:', error);
//     throw error;
//   }
// };

// export const getRoutes = async (db: SQLite.SQLiteDatabase): Promise<Route[]> => {
//   try {
//     const result = db.getAllSync('SELECT * FROM routes ORDER BY updatedAt DESC;');
//     return result as Route[];
//   } catch (error) {
//     console.error('Error al obtener rutas:', error);
//     throw error;
//   }
// };

// export const deleteRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<void> => {
//   try {
//     // Eliminar en cascada: las conexiones y nodos se eliminarán automáticamente
//     db.runSync('DELETE FROM routes WHERE id = ?;', [routeId]);
//   } catch (error) {
//     console.error('Error al eliminar ruta:', error);
//     throw error;
//   }
// };

// // Funciones para nodos - INTERFAZ ACTUALIZADA
// export interface Node {
//   id?: number;
//   routeId: number;
//   type: 'NDF' | 'pedestal' | 'IDF' | 'Unit';
//   latitude: number;
//   longitude: number;
//   description?: string;
//   fiberCount?: number;
//   fiberColor?: string;
//   equipment?: string;
//   address?: string;
//   client?: string;
//   status?: 'activo' | 'inactivo' | 'mantenimiento';
// }

// export const addNode = async (db: SQLite.SQLiteDatabase, node: Node): Promise<number> => {
//   try {
//     const result = db.runSync(
//       `INSERT INTO nodes 
//       (routeId, type, latitude, longitude, description, fiberCount, fiberColor, equipment, address, client, status) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
//       [
//         node.routeId,
//         node.type,
//         node.latitude,
//         node.longitude,
//         node.description || null,
//         node.fiberCount || 0,
//         node.fiberColor || null,
//         node.equipment || null,
//         node.address || null,
//         node.client || null,
//         node.status || 'activo'
//       ]
//     );
    
//     // Actualizar fecha de modificación de la ruta
//     db.runSync('UPDATE routes SET updatedAt = datetime("now") WHERE id = ?;', [node.routeId]);
    
//     return result.lastInsertRowId;
//   } catch (error) {
//     console.error('Error al agregar nodo:', error);
//     throw error;
//   }
// };

// export const getNodesByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Node[]> => {
//   try {
//     const result = db.getAllSync('SELECT * FROM nodes WHERE routeId = ? ORDER BY id;', [routeId]);
//     return result as Node[];
//   } catch (error) {
//     console.error('Error al obtener nodos:', error);
//     throw error;
//   }
// };

// // Funciones para conexiones
// export interface Connection {
//   id?: number;
//   routeId: number;
//   fromNodeId: number;
//   toNodeId: number;
//   cableType: 'fibra' | 'drop';
//   length: number;
//   pathType: 'subterranea' | 'aerea';
//   status: 'activo' | 'mantenimiento';
// }

// export const addConnection = async (db: SQLite.SQLiteDatabase, connection: Connection): Promise<number> => {
//   try {
//     const result = db.runSync(
//       `INSERT INTO connections 
//       (routeId, fromNodeId, toNodeId, cableType, length, pathType, status) 
//       VALUES (?, ?, ?, ?, ?, ?, ?);`,
//       [
//         connection.routeId,
//         connection.fromNodeId,
//         connection.toNodeId,
//         connection.cableType,
//         connection.length,
//         connection.pathType,
//         connection.status || 'activo'
//       ]
//     );
    
//     // Actualizar fecha de modificación de la ruta
//     db.runSync('UPDATE routes SET updatedAt = datetime("now") WHERE id = ?;', [connection.routeId]);
    
//     return result.lastInsertRowId;
//   } catch (error) {
//     console.error('Error al agregar conexión:', error);
//     throw error;
//   }
// };

// export const getConnectionsByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Connection[]> => {
//   try {
//     const result = db.getAllSync('SELECT * FROM connections WHERE routeId = ? ORDER BY id;', [routeId]);
//     return result as Connection[];
//   } catch (error) {
//     console.error('Error al obtener conexiones:', error);
//     throw error;
//   }
// };

// // Función para eliminar todos los datos (solo para desarrollo/testing)
// export const resetDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
//   try {
//     db.execSync('DELETE FROM connections;');
//     db.execSync('DELETE FROM nodes;');
//     db.execSync('DELETE FROM routes;');
//     console.log('Base de datos reiniciada');
//   } catch (error) {
//     console.error('Error al reiniciar base de datos:', error);
//     throw error;
//   }
// };

// // Funciones obsoletas (para compatibilidad)
// export const addRoutePoint = async () => {
//   throw new Error('Esta función ha sido reemplazada por addNode');
// };

// export const getRoutePoints = async () => {
//   throw new Error('Esta función ha sido reemplazada por getNodesByRoute');
// };

// export const createNodesTable = async () => {
//   console.log('Las tablas ya se crean automáticamente en initDatabase');
// };

// export const createConnectionsTable = async () => {
//   console.log('Las tablas ya se crean automáticamente en initDatabase');
// };

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';

// Interfaces
export interface Route {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para los nodos existentes durante la migración
interface ExistingNode {
  id: number;
  routeId: number;
  type: string;
  latitude: number;
  longitude: number;
  description?: string;
  address?: string;
  client?: string;
  status?: string;
}

// Función para abrir la base de datos (API moderna)
// export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   try {
//     // Usar openDatabaseSync para la nueva API
//     const db = SQLite.openDatabaseSync('app.db');
    
//     // Inicializar las tablas usando withTransactionSync
//     db.withTransactionSync(() => {
//       // Tabla de rutas
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS routes (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           name TEXT NOT NULL,
//           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//           updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
//         );
//       `);
      
//       // Tabla de nodos - ACTUALIZADA con nuevos campos
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS nodes (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           routeId INTEGER,
//           type TEXT NOT NULL,
//           latitude REAL NOT NULL,
//           longitude REAL NOT NULL,
//           description TEXT,
//           fiberCount INTEGER DEFAULT 0,
//           fiberColor TEXT,
//           equipment TEXT,
//           address TEXT,
//           client TEXT,
//           status TEXT DEFAULT 'activo',
//           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
//         );
//       `);
      
//       // Tabla de conexiones
//       db.execSync(`
//         CREATE TABLE IF NOT EXISTS connections (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           routeId INTEGER,
//           fromNodeId INTEGER,
//           toNodeId INTEGER,
//           cableType TEXT NOT NULL,
//           length REAL NOT NULL,
//           pathType TEXT NOT NULL,
//           status TEXT NOT NULL DEFAULT 'activo',
//           FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE,
//           FOREIGN KEY (fromNodeId) REFERENCES nodes (id),
//           FOREIGN KEY (toNodeId) REFERENCES nodes (id)
//         );
//       `);
//     });
    
//     // Para desarrollo: verificar y migrar estructura si es necesario
//     await migrateDatabaseStructure(db);
    
//     return db;
//   } catch (error) {
//     console.error('Error al abrir la base de datos:', error);
//     throw error;
//   }
// };
// export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   try {
//     if (Platform.OS === 'android') {
//       // Verificar permisos de almacenamiento en Android
//       const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
//       if (status !== 'granted') {
//         throw new Error('Se necesitan permisos de almacenamiento');
//       }
//     }

//     const db = await SQLite.openDatabaseSync('app.db');
    
//     // Ejecutar las sentencias SQL dentro de una transacción
//     await db.execSync(`
//       CREATE TABLE IF NOT EXISTS routes (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         created_at TEXT DEFAULT (datetime('now')),
//         updated_at TEXT DEFAULT (datetime('now'))
//       );
      
//       CREATE TABLE IF NOT EXISTS nodes (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         route_id INTEGER,
//         type TEXT NOT NULL,
//         latitude REAL NOT NULL,
//         longitude REAL NOT NULL,
//         description TEXT,
//         fiberCount INTEGER DEFAULT 0,
//         fiberColor TEXT,
//         equipment TEXT,
//         address TEXT,
//         client TEXT,
//         status TEXT DEFAULT 'activo',
//         FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE
//       );
      
//       CREATE TABLE IF NOT EXISTS connections (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         route_id INTEGER,
//         from_node_id INTEGER,
//         to_node_id INTEGER,
//         cable_type TEXT NOT NULL,
//         length REAL NOT NULL,
//         path_type TEXT NOT NULL,
//         status TEXT DEFAULT 'activo',
//         FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE,
//         FOREIGN KEY (from_node_id) REFERENCES nodes (id) ON DELETE CASCADE,
//         FOREIGN KEY (to_node_id) REFERENCES nodes (id) ON DELETE CASCADE
//       );
//     `);
    
//     return db;
//   } catch (error) {
//     console.error('Error initializing database:', error);
//     throw error;
//   }
// };
// En database.ts
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    const db = await SQLite.openDatabaseAsync('fiberRoutes.db');
    
    // Crear tabla de rutas (usando snake_case que es más compatible)
    await db.execSync(`
      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Crear tabla de nodos
    await db.execSync(`
      CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        description TEXT,
        fiber_count INTEGER DEFAULT 0,
        fiber_color TEXT,
        equipment TEXT,
        address TEXT,
        client TEXT,
        status TEXT DEFAULT 'activo',
        FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE
      );
    `);
    
    // Crear tabla de conexiones
    await db.execSync(`
      CREATE TABLE IF NOT EXISTS connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL,
        from_node_id INTEGER NOT NULL,
        to_node_id INTEGER NOT NULL,
        cable_type TEXT NOT NULL,
        length REAL NOT NULL,
        path_type TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE
      );
    `);
    
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Función para migrar la estructura de la base de datos si es necesario
const migrateDatabaseStructure = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    // Verificar si la tabla nodes tiene las columnas nuevas
    const columns = await db.getAllSync('PRAGMA table_info(nodes)');
    const columnNames = columns.map((col: any) => col.name);
    
    // Si falta alguna columna, recrear la tabla con la nueva estructura
    if (!columnNames.includes('fiberCount') || 
        !columnNames.includes('fiberColor') || 
        !columnNames.includes('equipment')) {
      
      console.log('Migrando estructura de la base de datos...');
      
      // 1. Crear tabla temporal con la nueva estructura
      db.execSync(`
        CREATE TABLE IF NOT EXISTS nodes_temp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routeId INTEGER,
          type TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          description TEXT,
          fiberCount INTEGER DEFAULT 0,
          fiberColor TEXT,
          equipment TEXT,
          address TEXT,
          client TEXT,
          status TEXT DEFAULT 'activo',
          FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
        );
      `);
      
      // 2. Copiar datos existentes si los hay
      try {
        const existingData = await db.getAllSync('SELECT * FROM nodes');
        if (existingData.length > 0) {
          for (const row of existingData) {
            // Hacer type assertion para que TypeScript sepa la estructura
            const existingNode = row as ExistingNode;
            
            db.runSync(
              `INSERT INTO nodes_temp 
               (id, routeId, type, latitude, longitude, description, address, client, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                existingNode.id,
                existingNode.routeId,
                existingNode.type,
                existingNode.latitude,
                existingNode.longitude,
                existingNode.description || null,
                existingNode.address || null,
                existingNode.client || null,
                existingNode.status || 'activo'
              ]
            );
          }
        }
      } catch (error) {
        console.log('No hay datos existentes para migrar o error en migración:', error);
      }
      
      // 3. Eliminar tabla vieja
      db.execSync('DROP TABLE IF EXISTS nodes');
      
      // 4. Renombrar tabla temporal
      db.execSync('ALTER TABLE nodes_temp RENAME TO nodes');
      
      console.log('Migración completada exitosamente');
    }
  } catch (error) {
    console.error('Error en migración de base de datos:', error);
  }
};

// Funciones para rutas
// export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
//   try {
//     const result = db.runSync(
//       'INSERT INTO routes (name, updatedAt) VALUES (?, datetime("now"));', 
//       [name]
//     );
//     return result.lastInsertRowId;
//   } catch (error) {
//     console.error('Error al agregar ruta:', error);
//     throw error;
//   }
// };
// En tu database.ts, asegúrate de que addRoute use la estructura correcta
export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
  try {
    // Verificar qué estructura tiene la tabla
    const tableInfo = await db.getAllSync("PRAGMA table_info(routes)");
    const hasNewStructure = tableInfo.some((column: any) => column.name === 'created_at');
    
    if (hasNewStructure) {
      const result = await db.runSync(
        "INSERT INTO routes (name, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))",
        [name]
      );
      return result.lastInsertRowId;
    } else {
      const result = await db.runSync(
        "INSERT INTO routes (name, createdAt, updatedAt) VALUES (?, datetime('now'), datetime('now'))",
        [name]
      );
      return result.lastInsertRowId;
    }
  } catch (error) {
    console.error('Error adding route:', error);
    throw error;
  }
};

export const getRoutes = async (db: SQLite.SQLiteDatabase): Promise<Route[]> => {
  try {
    const result = db.getAllSync('SELECT * FROM routes ORDER BY updatedAt DESC;');
    return result as Route[];
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    throw error;
  }
};

export const deleteRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<void> => {
  try {
    // Eliminar en cascada: las conexiones y nodos se eliminarán automáticamente
    db.runSync('DELETE FROM routes WHERE id = ?;', [routeId]);
  } catch (error) {
    console.error('Error al eliminar ruta:', error);
    throw error;
  }
};

// Funciones para nodos - INTERFAZ ACTUALIZADA
export interface Node {
  id?: number;
  routeId: number;
  type: 'NDF' | 'pedestal' | 'IDF' | 'Unit';
  latitude: number;
  longitude: number;
  description?: string;
  fiberCount?: number;
  fiberColor?: string;
  equipment?: string;
  address?: string;
  client?: string;
  status?: 'activo' | 'inactivo' | 'mantenimiento';
}

export const addNode = async (db: SQLite.SQLiteDatabase, node: Node): Promise<number> => {
  try {
    const result = db.runSync(
      `INSERT INTO nodes 
      (routeId, type, latitude, longitude, description, fiberCount, fiberColor, equipment, address, client, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        node.routeId,
        node.type,
        node.latitude,
        node.longitude,
        node.description || null,
        node.fiberCount || 0,
        node.fiberColor || null,
        node.equipment || null,
        node.address || null,
        node.client || null,
        node.status || 'activo'
      ]
    );
    
    // Actualizar fecha de modificación de la ruta
    db.runSync('UPDATE routes SET updatedAt = datetime("now") WHERE id = ?;', [node.routeId]);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al agregar nodo:', error);
    throw error;
  }
};

export const getNodesByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Node[]> => {
  try {
    const result = db.getAllSync('SELECT * FROM nodes WHERE routeId = ? ORDER BY id;', [routeId]);
    return result as Node[];
  } catch (error) {
    console.error('Error al obtener nodos:', error);
    throw error;
  }
};

// Funciones para conexiones
export interface Connection {
  id?: number;
  routeId: number;
  fromNodeId: number;
  toNodeId: number;
  cableType: 'fibra' | 'drop';
  length: number;
  pathType: 'subterranea' | 'aerea';
  status: 'activo' | 'mantenimiento';
}

export const addConnection = async (db: SQLite.SQLiteDatabase, connection: Connection): Promise<number> => {
  try {
    const result = db.runSync(
      `INSERT INTO connections 
      (routeId, fromNodeId, toNodeId, cableType, length, pathType, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        connection.routeId,
        connection.fromNodeId,
        connection.toNodeId,
        connection.cableType,
        connection.length,
        connection.pathType,
        connection.status || 'activo'
      ]
    );
    
    // Actualizar fecha de modificación de la ruta
    db.runSync('UPDATE routes SET updatedAt = datetime("now") WHERE id = ?;', [connection.routeId]);
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al agregar conexión:', error);
    throw error;
  }
};

export const getConnectionsByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Connection[]> => {
  try {
    const result = db.getAllSync('SELECT * FROM connections WHERE routeId = ? ORDER BY id;', [routeId]);
    return result as Connection[];
  } catch (error) {
    console.error('Error al obtener conexiones:', error);
    throw error;
  }
};

// Función para eliminar todos los datos (solo para desarrollo/testing)
export const resetDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    db.execSync('DELETE FROM connections;');
    db.execSync('DELETE FROM nodes;');
    db.execSync('DELETE FROM routes;');
    console.log('Base de datos reiniciada');
  } catch (error) {
    console.error('Error al reiniciar base de datos:', error);
    throw error;
  }
};

// Funciones obsoletas (para compatibilidad)
export const addRoutePoint = async () => {
  throw new Error('Esta función ha sido reemplazada por addNode');
};

export const getRoutePoints = async () => {
  throw new Error('Esta función ha sido reemplazada por getNodesByRoute');
};

export const createNodesTable = async () => {
  console.log('Las tablas ya se crean automáticamente en initDatabase');
};

export const createConnectionsTable = async () => {
  console.log('Las tablas ya se crean automáticamente en initDatabase');
};