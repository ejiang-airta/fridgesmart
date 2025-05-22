import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

interface ImageOptions {
  quality?: number;
  width?: number;
  height?: number;
}

const DEFAULT_OPTIONS: ImageOptions = {
  quality: 0.7,
  width: 1024,
  height: 1024,
};

export class CameraService {
  private static instance: CameraService;
  private camera: any | null = null;
  private isInitialized = false;
  private readonly imageDirectory = `${FileSystem.documentDirectory}images/`;

  private constructor() {
    this.ensureImageDirectoryExists();
  }

  private async ensureImageDirectoryExists(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.imageDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.imageDirectory, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error('Error creating image directory:', error);
    }
  }

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission not granted');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing camera:', error);
      throw new Error('Failed to initialize camera service');
    }
  }

  setCameraRef(camera: any | null): void {
    this.camera = camera;
  }

  async takePicture(options: ImageOptions = {}): Promise<string> {
    if (!this.camera) {
      throw new Error('Camera not initialized');
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    try {
      const photo = await this.camera.takePictureAsync({
        quality: mergedOptions.quality,
        base64: true,
        exif: false,
      });

      // Create a unique filename
      const timestamp = new Date().getTime();
      const filename = `fridgesmart_${timestamp}.jpg`;
      const filepath = `${this.imageDirectory}${filename}`;

      // Move and compress the photo
      await this.processAndSaveImage(photo.uri, filepath, mergedOptions);

      return filepath;
    } catch (error) {
      console.error('Error taking picture:', error);
      throw new Error('Failed to take picture');
    }
  }

  private async processAndSaveImage(sourceUri: string, targetUri: string, options: ImageOptions): Promise<void> {
    try {
      // Move the photo to our app's storage
      await FileSystem.moveAsync({
        from: sourceUri,
        to: targetUri,
      });

      // Get file info to check size
      const fileInfo = await FileSystem.getInfoAsync(targetUri);
      if (!fileInfo.exists) {
        throw new Error('Failed to save image');
      }

      // If the file is too large, compress it further
      if (fileInfo.size > 1024 * 1024) { // If larger than 1MB
        const quality = Math.max((options.quality || 0.7) - 0.2, 0.3);
        await this.compressImage(targetUri, quality);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process and save image');
    }
  }

  private async compressImage(uri: string, quality: number): Promise<void> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(uri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to compress image');
    }
  }

  async deleteImage(imageUri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  async getImageBase64(imageUri: string): Promise<string> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image not found');
      }

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error reading image:', error);
      throw new Error('Failed to read image');
    }
  }

  async cleanupOldImages(maxAgeInDays: number = 30): Promise<void> {
    try {
      const contents = await FileSystem.readDirectoryAsync(this.imageDirectory);
      const now = new Date().getTime();
      
      for (const filename of contents) {
        if (!filename.startsWith('fridgesmart_')) continue;
        
        const filepath = `${this.imageDirectory}${filename}`;
        const fileInfo = await FileSystem.getInfoAsync(filepath);
        
        if (!fileInfo.exists) continue;
        
        const timestamp = parseInt(filename.split('_')[1].split('.')[0]);
        const ageInDays = (now - timestamp) / (1000 * 60 * 60 * 24);
        
        if (ageInDays > maxAgeInDays) {
          await this.deleteImage(filepath);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old images:', error);
    }
  }
}

export const cameraService = CameraService.getInstance(); 