import * as SQLite from 'expo-sqlite';

export interface RoutePoint {
  id?: number;
  routeId: number;
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface Route {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const databaseName = 'app.db';

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync(databaseName);
  
  // Crear tablas si no existen
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS route_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routeId INTEGER NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (routeId) REFERENCES routes (id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_route_points_routeId ON route_points (routeId);
    
  `);
  
  return db;
};

export const addRoute = async (db: SQLite.SQLiteDatabase, name: string): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO routes (name, updatedAt) VALUES (?, datetime("now"))',
    name
  );
  return result.lastInsertRowId as number;
};

export const addRoutePoint = async (
  db: SQLite.SQLiteDatabase, 
  routeId: number, 
  latitude: number, 
  longitude: number
): Promise<void> => {
  await db.runAsync(
    'INSERT INTO route_points (routeId, latitude, longitude) VALUES (?, ?, ?)',
    routeId, latitude, longitude
  );
  
  // Actualizar fecha de modificación de la ruta
  await db.runAsync(
    'UPDATE routes SET updatedAt = datetime("now") WHERE id = ?',
    routeId
  );
};

export const getRoutes = async (db: SQLite.SQLiteDatabase): Promise<Route[]> => {
  const results = await db.getAllAsync<Route>(
    'SELECT * FROM routes ORDER BY updatedAt DESC'
  );
  return results;
};

export const getRoutePoints = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<RoutePoint[]> => {
  const results = await db.getAllAsync<RoutePoint>(
    'SELECT * FROM route_points WHERE routeId = ? ORDER BY timestamp',
    routeId
  );
  return results;
};

export const deleteRoute = async (db: SQLite.SQLiteDatabase, routeId: number): Promise<void> => {
  await db.runAsync('DELETE FROM route_points WHERE routeId = ?', routeId);
  await db.runAsync('DELETE FROM routes WHERE id = ?', routeId);
};

export const updateRouteName = async (
  db: SQLite.SQLiteDatabase, 
  routeId: number, 
  name: string
): Promise<void> => {
  await db.runAsync(
    'UPDATE routes SET name = ?, updatedAt = datetime("now") WHERE id = ?',
    name, routeId
  );
};