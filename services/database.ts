import * as SQLite from 'expo-sqlite';

// Interfaces
export interface Route {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Función para abrir la base de datos (API moderna)
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    // Usar openDatabaseSync para la nueva API
    const db = SQLite.openDatabaseSync('app.db');
    // console.log('Base de datos abierta correctamente');
    
    // Inicializar las tablas usando withTransactionSync
    db.withTransactionSync(() => {
      // Tabla de rutas
      db.execSync(`
        CREATE TABLE IF NOT EXISTS routes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Tabla de nodos
      db.execSync(`
        CREATE TABLE IF NOT EXISTS nodes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routeId INTEGER,
          type TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          description TEXT,
          capacity INTEGER,
          connectivityType TEXT,
          equipment TEXT,
          address TEXT,
          client TEXT,
          status TEXT,
          fusionType TEXT,
          FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
        );
      `);
      
      // Tabla de conexiones
      db.execSync(`
        CREATE TABLE IF NOT EXISTS connections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          routeId INTEGER,
          fromNodeId INTEGER,
          toNodeId INTEGER,
          cableType TEXT NOT NULL,
          length REAL NOT NULL,
          pathType TEXT NOT NULL,
          status TEXT NOT NULL,
          FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE,
          FOREIGN KEY (fromNodeId) REFERENCES nodes (id),
          FOREIGN KEY (toNodeId) REFERENCES nodes (id)
        );
      `);
    });
    
    // console.log('Tablas creadas correctamente');
    return db;
  } catch (error) {
    console.error('Error al abrir la base de datos:', error);
    throw error;
  }
};

// Funciones para rutas
export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
  try {
    const result = db.runSync('INSERT INTO routes (name) VALUES (?);', [name]);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al agregar ruta:', error);
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
    db.runSync('DELETE FROM routes WHERE id = ?;', [routeId]);
  } catch (error) {
    console.error('Error al eliminar ruta:', error);
    throw error;
  }
};

// Funciones para nodos
export interface Node {
  id?: number;
  routeId: number;
  type: 'NDF' | 'pedestal' | 'IDF' | 'Unit' | 'fusionPoint';
  latitude: number;
  longitude: number;
  description?: string;
  capacity?: number;
  connectivityType?: string;
  equipment?: string;
  address?: string;
  client?: string;
  status?: string;
  fusionType?: string;
}

export const addNode = async (db: SQLite.SQLiteDatabase, node: Node): Promise<number> => {
  try {
    const result = db.runSync(
      `INSERT INTO nodes 
      (routeId, type, latitude, longitude, description, capacity, connectivityType, equipment, address, client, status, fusionType) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        node.routeId,
        node.type,
        node.latitude,
        node.longitude,
        node.description || null,
        node.type === 'NDF' ? node.capacity : null,
        node.type === 'pedestal' ? node.connectivityType : null,
        node.type === 'IDF' ? node.equipment : null,
        node.type === 'Unit' ? node.address : null,
        node.type === 'Unit' ? node.client : null,
        node.type === 'Unit' ? node.status : null,
        node.type === 'fusionPoint' ? node.fusionType : null
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al agregar nodo:', error);
    throw error;
  }
};

export const getNodesByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Node[]> => {
  try {
    const result = db.getAllSync('SELECT * FROM nodes WHERE routeId = ?;', [routeId]);
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
        connection.status
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error al agregar conexión:', error);
    throw error;
  }
};

export const getConnectionsByRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<Connection[]> => {
  try {
    const result = db.getAllSync('SELECT * FROM connections WHERE routeId = ?;', [routeId]);
    return result as Connection[];
  } catch (error) {
    console.error('Error al obtener conexiones:', error);
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