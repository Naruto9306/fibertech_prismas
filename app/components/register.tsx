import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import * as SQLite from 'expo-sqlite';

// Función para abrir la base de datos (la misma que en login)
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

export default function RegisterScreen() {
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Función para verificar si un usuario o email ya existe
  const checkUserExists = async (field: 'idusuario' | 'correo', value: string): Promise<boolean> => {
    try {
      const db = openDatabase();
      const result = await db.getFirstAsync(
        `SELECT id FROM usuarios WHERE ${field} = ?;`,
        [value]
      );
      return !!result;
    } catch (error) {
      console.error('Error verificando usuario:', error);
      return false;
    }
  };

  // Función para registrar nuevo usuario
  const registerUser = async (): Promise<boolean> => {
    try {
      const db = openDatabase();
      
      await db.runAsync(
        'INSERT INTO usuarios (idusuario, password, token, correo) VALUES (?, ?, ?, ?);',
        [userId, password, `token_${Date.now()}`, email]
      );
      
      return true;
    } catch (error) {
      console.error('Error registrando usuario:', error);
      return false;
    }
  };

  const handleRegister = async () => {
    // Validaciones
    if (!userId || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsLoading(true);

    try {
      // Verificar si el ID de usuario ya existe
      const userIdExists = await checkUserExists('idusuario', userId);
      if (userIdExists) {
        Alert.alert('Error', 'Este nombre de usuario ya está en uso');
        setIsLoading(false);
        return;
      }

      // Verificar si el email ya existe
      const emailExists = await checkUserExists('correo', email);
      if (emailExists) {
        Alert.alert('Error', 'Este correo electrónico ya está registrado');
        setIsLoading(false);
        return;
      }

      // Registrar el usuario
      const success = await registerUser();
      
      if (success) {
        Alert.alert(
          'Éxito', 
          'Usuario registrado correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.back() // Volver al login
            }
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo registrar el usuario');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'Ocurrió un problema al registrar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#999"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              autoComplete="username"
            />
            
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
            
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password"
            />
            
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.registerButtonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginText}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
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
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#66a3ff',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});