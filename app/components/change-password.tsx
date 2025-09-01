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
import { Ionicons } from '@expo/vector-icons';

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

export default function ChangePasswordScreen() {
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Función para verificar las credenciales actuales
  const verifyCredentials = async (email: string, password: string): Promise<boolean> => {
    try {
      const db = openDatabase();
      const result = await db.getFirstAsync(
        'SELECT id FROM usuarios WHERE correo = ? AND password = ?;',
        [email, password]
      );
      return !!result;
    } catch (error) {
      console.error('Error verificando credenciales:', error);
      return false;
    }
  };

  // Función para actualizar la contraseña
  const updatePassword = async (email: string, newPassword: string): Promise<boolean> => {
    try {
      const db = openDatabase();
      
      await db.runAsync(
        'UPDATE usuarios SET password = ? WHERE correo = ?;',
        [newPassword, email]
      );
      
      return true;
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      return false;
    }
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setIsLoading(true);

    try {
      // Verificar credenciales actuales
      const credentialsValid = await verifyCredentials(email, currentPassword);
      
      if (!credentialsValid) {
        Alert.alert('Error', 'El correo o contraseña actual son incorrectos');
        setIsLoading(false);
        return;
      }

      // Actualizar la contraseña
      const success = await updatePassword(email, newPassword);
      
      if (success) {
        Alert.alert(
          'Éxito', 
          'Contraseña actualizada correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.back() // Volver atrás
            }
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo actualizar la contraseña');
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      Alert.alert('Error', 'Ocurrió un problema al cambiar la contraseña');
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Cambiar Contraseña</Text>
            <View style={styles.headerRight} />
          </View>

          <Text style={styles.subtitle}>Ingresa tus datos para actualizar tu contraseña</Text>
          
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
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña actual"
                placeholderTextColor="#999"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons 
                  name={showCurrentPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nueva contraseña"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons 
                  name={showNewPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.changeButton, isLoading && styles.changeButtonDisabled]} 
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.changeButtonText}>Cambiar Contraseña</Text>
              )}
            </TouchableOpacity>

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Requisitos de contraseña:</Text>
              <Text style={styles.requirement}>• Mínimo 6 caracteres</Text>
              <Text style={styles.requirement}>• Diferente a la contraseña actual</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    top: 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  changeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  changeButtonDisabled: {
    backgroundColor: '#66a3ff',
  },
  changeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordRequirements: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
});