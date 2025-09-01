// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function ScanScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pantalla de Escaneo</Text>
//       <Text style={styles.text}>Aquí irá la funcionalidad de escaneo...</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 16,
//     color: '#666',
//   },
// });

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  SafeAreaView 
} from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  // Solicitar permisos de la cámara
  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  // Función que se ejecuta cuando se escanea un código
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (!scanned) {
      setScanned(true);
      setResult(data);
      setModalVisible(true);
      setCameraActive(false);
      
      // Vibración opcional (necesitarías expo-haptics)
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  // Reiniciar el escaneo
  const handleResetScan = () => {
    setScanned(false);
    setResult('');
    setModalVisible(false);
    setCameraActive(true);
  };

  // Volver al dashboard
  const handleGoBack = () => {
    router.back();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.permissionText}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Se necesitan permisos de cámara para escanear</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Escanear código</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.cameraContainer}>
        {cameraActive ? (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                'aztec',
                'ean13',
                'ean8',
                'qr',
                'pdf417',
                'upc_e',
                'datamatrix',
                'code39',
                'code93',
                'itf14',
                'codabar',
                'code128',
                'upc_a'
              ],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.unfocusedContainer} />
              <View style={styles.middleContainer}>
                <View style={styles.unfocusedContainer} />
                <View style={styles.focusedContainer}>
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                </View>
                <View style={styles.unfocusedContainer} />
              </View>
              <View style={styles.unfocusedContainer} />
            </View>
          </CameraView>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.placeholderText}>Cámara pausada</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.instructions}>
          Enfoca el código QR o de barras dentro del marco
        </Text>
      </View>

      {/* Modal para mostrar resultados */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resultado del escaneo</Text>
            
            <View style={styles.resultContainer}>
              <Text style={styles.resultText} numberOfLines={5}>
                {result}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.copyButton]}
                onPress={() => {
                  // Copiar al portapapeles
                  // (necesitarías expo-clipboard)
                  Alert.alert('Copiado', 'El resultado se ha copiado al portapapeles');
                }}
              >
                <Text style={styles.modalButtonText}>Copiar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.scanAgainButton]}
                onPress={handleResetScan}
              >
                <Text style={styles.modalButtonText}>Escanear de nuevo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focusedContainer: {
    flex: 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#007AFF',
    height: 30,
    width: 30,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#007AFF',
    height: 30,
    width: 30,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#007AFF',
    height: 30,
    width: 30,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#007AFF',
    height: 30,
    width: 30,
  },
  footer: {
    padding: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  instructions: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  resultContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
  },
  scanAgainButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});