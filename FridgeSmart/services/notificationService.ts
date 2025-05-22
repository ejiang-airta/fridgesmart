import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Item } from '../types/item';
import { storageService } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationSchedule {
  itemId: string;
  notificationId: string;
  scheduledDate: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private schedules: NotificationSchedule[] = [];

  private constructor() {
    // Set up notification received handler
    Notifications.addNotificationReceivedListener(this.handleNotificationReceived);
    // Set up notification response handler
    Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse);
  }

  private handleNotificationReceived = (notification: Notifications.Notification) => {
    console.log('Notification received:', notification);
  };

  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as { itemId: string };
    if (data?.itemId) {
      // Handle navigation to item details or other actions
      console.log('Notification tapped, itemId:', data.itemId);
    }
  };

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

      // Cancel any existing notifications for this item
      await this.cancelNotificationsForItem(item.id);

      // Schedule early warning notification
      const earlyWarningId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Food Item Expiring Soon',
          body: `${item.name} will expire in ${settings.expiryNotificationDays} days`,
          data: { itemId: item.id },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: notificationDate,
          channelId: 'expiry-notifications',
        },
      });

      // Schedule day-of notification
      const dayOfId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Food Item Expires Today',
          body: `${item.name} expires today!`,
          data: { itemId: item.id },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          date: expiryDate,
          channelId: 'expiry-notifications',
        },
      });

      // Store schedule information
      this.schedules.push(
        {
          itemId: item.id,
          notificationId: earlyWarningId,
          scheduledDate: notificationDate,
        },
        {
          itemId: item.id,
          notificationId: dayOfId,
          scheduledDate: expiryDate,
        }
      );

      return earlyWarningId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }

  private async cancelNotificationsForItem(itemId: string): Promise<void> {
    const itemSchedules = this.schedules.filter(schedule => schedule.itemId === itemId);
    for (const schedule of itemSchedules) {
      await this.cancelNotification(schedule.notificationId);
    }
    this.schedules = this.schedules.filter(schedule => schedule.itemId !== itemId);
  }

  async rescheduleAllNotifications(): Promise<void> {
    try {
      const items = await storageService.getItems();
      await this.cancelAllNotifications();
      this.schedules = [];
      
      for (const item of items) {
        await this.scheduleExpiryNotification(item);
      }
    } catch (error) {
      console.error('Error rescheduling notifications:', error);
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

  async getScheduledNotifications(): Promise<NotificationSchedule[]> {
    return [...this.schedules];
  }
}

export const notificationService = NotificationService.getInstance(); 