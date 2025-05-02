import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import frostTheme from '../theme/theme';
import Button from '../components/Button';

const CameraScreen = () => {
  const navigation = useNavigation();
  const [isPreview, setIsPreview] = useState(false);
  
  // Sample image URI for demo purposes
  const sampleImageUri = 'https://images.unsplash.com/photo-1606790190211-fd03842a6d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  
  const takePicture = () => {
    setIsPreview(true);
  };
  
  const cancelPreview = () => {
    setIsPreview(false);
  };
  
  const proceedWithImage = () => {
    // Mock navigation to AddItem screen
    // @ts-ignore - We'll implement AddItem screen later
    navigation.navigate('Inventory');
  };
  
  if (isPreview) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: sampleImageUri }} style={styles.previewImage} />
          
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={cancelPreview}>
              <MaterialIcons name="close" size={24} color={frostTheme.colors.white} />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.previewButton} onPress={proceedWithImage}>
              <MaterialIcons name="check" size={24} color={frostTheme.colors.white} />
              <Text style={styles.previewButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <View style={styles.cameraContent}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.flipButton}>
              <MaterialIcons name="flip-camera-ios" size={24} color={frostTheme.colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mockViewfinder}>
            <Text style={styles.mockViewfinderText}>Camera Preview</Text>
            <Text style={styles.mockViewfinderSubtext}>
              (The actual camera is not implemented in this demo)
            </Text>
          </View>
          
          <View style={styles.captureContainer}>
            <View style={styles.captureBorder}>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.bottomControls}>
            <Text style={styles.captureText}>Tap the button to take a photo</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.black,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#222',
  },
  cameraContent: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mockViewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockViewfinderText: {
    fontSize: frostTheme.typography.fontSizes.xl,
    color: frostTheme.colors.white,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
  },
  mockViewfinderSubtext: {
    fontSize: frostTheme.typography.fontSizes.sm,
    color: frostTheme.colors.white,
    opacity: 0.7,
    marginTop: frostTheme.spacing.md,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: frostTheme.spacing.md,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureContainer: {
    alignItems: 'center',
    marginBottom: frostTheme.spacing.xl,
  },
  captureBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: frostTheme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: frostTheme.colors.white,
    borderWidth: 2,
    borderColor: frostTheme.colors.black,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: frostTheme.spacing.xl,
  },
  captureText: {
    color: frostTheme.colors.white,
    fontSize: frostTheme.typography.fontSizes.md,
    textAlign: 'center',
    marginHorizontal: frostTheme.spacing.xl,
    marginBottom: frostTheme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.sm,
    borderRadius: frostTheme.borderRadius.md,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: frostTheme.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: frostTheme.spacing.md,
  },
  previewButtonText: {
    color: frostTheme.colors.white,
    fontSize: frostTheme.typography.fontSizes.md,
    marginLeft: frostTheme.spacing.xs,
  },
});

export default CameraScreen; 