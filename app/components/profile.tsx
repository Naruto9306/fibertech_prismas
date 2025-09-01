import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

// Tipos de datos
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  projectsCount: number;
  joinedDate: string;
  lastActive: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    phone: '+1 234 567 8900',
    avatar: '',
    projectsCount: 12,
    joinedDate: '2024-01-15',
    lastActive: new Date().toISOString(),
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'phone' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Cargar perfil al iniciar
  useEffect(() => {
    loadProfile();
  }, []);

  // Cargar perfil desde SecureStore
  const loadProfile = async () => {
    try {
      const savedProfile = await SecureStore.getItemAsync('userProfile');
      if (savedProfile) {
        const parsedProfile: UserProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Guardar perfil en SecureStore
  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await SecureStore.setItemAsync('userProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil');
    }
  };

  // Seleccionar imagen de perfil
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newProfile = { ...profile, avatar: result.assets[0].uri };
        await saveProfile(newProfile);
        Alert.alert('Éxito', 'Foto de perfil actualizada');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la foto de perfil');
    }
  };

  // Abrir modal de edición
  const openEditModal = (field: 'name' | 'email' | 'phone', value: string) => {
    setEditField(field);
    setEditValue(value);
    setEditModalVisible(true);
  };

  // Guardar cambios del modal de edición
  const saveEdit = async () => {
    if (!editField) return;

    setSaving(true);
    try {
      const newProfile = { ...profile, [editField]: editValue };
      await saveProfile(newProfile);
      setEditModalVisible(false);
      Alert.alert('Éxito', 'Información actualizada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la información');
    } finally {
      setSaving(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica real de cierre de sesión
            router.replace('/login');
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
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
        <Text style={styles.title}>Mi Perfil</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Contenido */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de Foto de Perfil */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.avatarContainer}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#666" />
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        {/* Sección de Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="person" size={20} color="#007AFF" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre completo</Text>
                <Text style={styles.infoValue}>{profile.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => openEditModal('name', profile.name)}
              >
                <Ionicons name="create" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Ionicons name="mail" size={20} color="#007AFF" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Correo electrónico</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => openEditModal('email', profile.email)}
              >
                <Ionicons name="create" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Ionicons name="call" size={20} color="#007AFF" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => openEditModal('phone', profile.phone)}
              >
                <Ionicons name="create" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sección de Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="folder" size={24} color="#1976d2" />
              </View>
              <Text style={styles.statNumber}>{profile.projectsCount}</Text>
              <Text style={styles.statLabel}>Proyectos</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#e8f5e9' }]}>
                <Ionicons name="calendar" size={24} color="#388e3c" />
              </View>
              <Text style={styles.statNumber}>{formatDate(profile.joinedDate)}</Text>
              <Text style={styles.statLabel}>Miembro desde</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#fff3e0' }]}>
                <Ionicons name="time" size={24} color="#f57c00" />
              </View>
              <Text style={styles.statNumber}>Hoy</Text>
              <Text style={styles.statLabel}>Última actividad</Text>
            </View>
          </View>
        </View>

        {/* Sección de Acciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          
          <View style={styles.actionsCard}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="shield-checkmark" size={22} color="#007AFF" style={styles.actionIcon} />
              <Text style={styles.actionText}>Privacidad y seguridad</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="notifications" size={22} color="#007AFF" style={styles.actionIcon} />
              <Text style={styles.actionText}>Notificaciones</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="help-buoy" size={22} color="#007AFF" style={styles.actionIcon} />
              <Text style={styles.actionText}>Ayuda y soporte</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={22} color="#ff3b30" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        {/* Información de versión */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal de Edición */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editField === 'name' && 'Editar nombre'}
                {editField === 'email' && 'Editar email'}
                {editField === 'phone' && 'Editar teléfono'}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={
                  editField === 'name' ? 'Nombre completo' :
                  editField === 'email' ? 'Correo electrónico' :
                  'Número de teléfono'
                }
                keyboardType={
                  editField === 'email' ? 'email-address' :
                  editField === 'phone' ? 'phone-pad' :
                  'default'
                }
                autoCapitalize={editField === 'name' ? 'words' : 'none'}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveEdit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalButtonTextSave}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    borderBottomColor: '#e0e0e0',
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
    padding: 16,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: -16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonSave: {
    backgroundColor: '#007AFF',
  },
  modalButtonTextCancel: {
    color: '#333',
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: 'white',
    fontWeight: '600',
  },
});