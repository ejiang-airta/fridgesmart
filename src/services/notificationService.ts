import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Item } from '../types/item';
import { storageService } from './storage';

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      await Notifications.setNotificationChannelAsync('expiry-notifications', {
        name: 'Expiry Notifications',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      throw error;
    }
  }

  async scheduleExpiryNotification(item: Item): Promise<string> {
    try {
      const settings = await storageService.getSettings();
      if (!settings.notificationsEnabled) return '';

      const expiryDate = new Date(item.expiryDate);
      const notificationDate = new Date(expiryDate);
      notificationDate.setDate(expiryDate.getDate() - settings.expiryNotificationDays);

      // Don't schedule if the notification date is in the past
      if (notificationDate.getTime() <= Date.now()) return '';

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Food Item Expiring Soon',
          body: `${item.name} will expire in ${settings.expiryNotificationDays} days`,
          data: { itemId: item.id },
        },
        trigger: {
          date: notificationDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }

  async updateExpiryNotification(item: Item, oldNotificationId?: string): Promise<string> {
    try {
      if (oldNotificationId) {
        await this.cancelNotification(oldNotificationId);
      }
      return await this.scheduleExpiryNotification(item);
    } catch (error) {
      console.error('Error updating notification:', error);
      return '';
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  setupNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
}

export const notificationService = NotificationService.getInstance(); 