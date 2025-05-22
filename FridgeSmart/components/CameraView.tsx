import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import type { CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { cameraService } from '../services/cameraService';
import frostTheme from '../theme/theme';

interface CameraViewProps {
  onPhotoCaptured: (imageUri: string) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onPhotoCaptured, onClose }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const cameraRef = useRef<typeof Camera | null>(null);

  useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    try {
      setIsInitializing(true);
      await cameraService.initialize();
      setHasPermission(true);
    } catch (error) {
      console.error('Failed to initialize camera:', error);
      setHasPermission(false);
      Alert.alert(
        'Camera Access Required',
        'Please enable camera access in your device settings to use this feature.',
        [
          { text: 'Cancel', onPress: onClose, style: 'cancel' },
          { text: 'Open Settings', onPress: () => Camera.requestCameraPermissionsAsync() }
        ]
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
    if (cameraRef.current) {
      cameraService.setCameraRef(cameraRef.current);
    }
  };

  const handleCapture = async () => {
    if (!isCameraReady || isCapturing) return;

    try {
      setIsCapturing(true);
      const imageUri = await cameraService.takePicture();
      onPhotoCaptured(imageUri);
    } catch (error) {
      console.error('Failed to capture photo:', error);
      Alert.alert(
        'Error',
        'Failed to capture photo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCapturing(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={frostTheme.colors.primary} />
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="camera-alt" size={48} color={frostTheme.colors.danger} />
          <Text style={styles.errorText}>Camera access is required</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeCamera}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type="back"
        onCameraReady={handleCameraReady}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.capturingButton]}
              onPress={handleCapture}
              disabled={!isCameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: frostTheme.colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 