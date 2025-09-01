import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
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

// Inicializar la base de datos
const initDatabase = async () => {
  try {
    const db = openDatabase();
    
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idusuario TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        token TEXT,
        correo TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  route_id INTEGER,
  connectivity_devices TEXT,
  media_items TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes (id)
);

CREATE TABLE IF NOT EXISTS routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  coordinates TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
    `);
    
    return true;
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    return false;
  }
};

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDbInitialized, setIsDbInitialized] = useState<boolean>(false);

  // Inicializar la base de datos al cargar el componente
  useEffect(() => {
    const initializeDb = async () => {
      const success = await initDatabase();
      setIsDbInitialized(success);
      
      if (success) {
        // Insertar usuario de prueba automáticamente
        await insertTestUser();
      }
    };
    
    initializeDb();
  }, []);

  // Función para autenticar usuario
  const authenticateUser = async (email: string, password: string) => {
    try {
      const db = openDatabase();
      
      const result = await db.getFirstAsync<{
        id: number;
        idusuario: string;
        password: string;
        token: string;
        correo: string;
      }>(
        'SELECT * FROM usuarios WHERE correo = ? AND password = ?;',
        [email, password]
      );
      
      return { success: !!result, user: result };
    } catch (error) {
      console.error('Error en autenticación:', error);
      return { success: false };
    }
  };

  // Función para insertar usuario de prueba
  const insertTestUser = async () => {
    try {
      const db = openDatabase();
      
      // Verificar si ya existe el usuario de prueba
      const existingUser = await db.getFirstAsync(
        'SELECT id FROM usuarios WHERE correo = ?;',
        ['test@example.com']
      );
      
      if (!existingUser) {
        await db.runAsync(
          'INSERT INTO usuarios (idusuario, password, token, correo) VALUES (?, ?, ?, ?);',
          ['testuser', 'password123', 'testtoken', 'test@example.com']
        );
        console.log('Usuario de prueba creado');
      }
    } catch (error) {
      console.error('Error insertando usuario de prueba:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!isDbInitialized) {
      Alert.alert('Error', 'La base de datos no está lista. Intenta nuevamente.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateUser(email, password);
      
      if (result.success) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        router.replace('/dashboard');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas. Usa: test@example.com / password123');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'Ocurrió un problema al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>
          
            <TouchableOpacity 
    style={styles.forgotPassword}
    onPress={() => router.push('./components/change-password')}
  >
    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
  </TouchableOpacity>

          {/* <View style={styles.testCredentials}>
            <Text style={styles.testCredentialsTitle}>Credenciales de prueba:</Text>
            <Text style={styles.testCredentialsText}>Correo: test@example.com</Text>
            <Text style={styles.testCredentialsText}>Contraseña: password123</Text>
          </View> */}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('./components/register')}>
  <Text style={styles.signUpText}>Regístrate</Text>
</TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#66a3ff',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  testCredentials: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testCredentialsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  testCredentialsText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  signUpText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});