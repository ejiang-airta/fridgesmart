import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item } from '../types/item';
import { AppSettings } from '../services/storage';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notificationService';

interface AppContextType {
  items: Item[];
  settings: AppSettings;
  isLoading: boolean;
  addItem: (item: Omit<Item, 'id' | 'addedDate' | 'lastModified'>) => Promise<void>;
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationIds] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await notificationService.initialize();
      notificationService.setupNotificationHandler();
      
      const [savedItems, savedSettings] = await Promise.all([
        storageService.getItems(),
        storageService.getSettings(),
      ]);

      setItems(savedItems);
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (newItem: Omit<Item, 'id' | 'addedDate' | 'lastModified'>) => {
    try {
      const now = new Date().toISOString();
      const item: Item = {
        ...newItem,
        id: Date.now().toString(),
        addedDate: now,
        lastModified: now,
      };

      await storageService.addItem(item);
      setItems(prevItems => [...prevItems, item]);

      if (settings?.notificationsEnabled) {
        const notificationId = await notificationService.scheduleExpiryNotification(item);
        if (notificationId) {
          notificationIds[item.id] = notificationId;
        }
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItem = async (updatedItem: Item) => {
    try {
      const item = {
        ...updatedItem,
        lastModified: new Date().toISOString(),
      };

      await storageService.updateItem(item);
      setItems(prevItems =>
        prevItems.map(i => (i.id === item.id ? item : i))
      );

      if (settings?.notificationsEnabled) {
        const oldNotificationId = notificationIds[item.id];
        const newNotificationId = await notificationService.updateExpiryNotification(
          item,
          oldNotificationId
        );
        if (newNotificationId) {
          notificationIds[item.id] = newNotificationId;
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await storageService.deleteItem(itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));

      const notificationId = notificationIds[itemId];
      if (notificationId) {
        await notificationService.cancelNotification(notificationId);
        delete notificationIds[itemId];
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    try {
      await storageService.saveSettings(newSettings);
      setSettings(newSettings);

      // Update notifications based on new settings
      if (newSettings.notificationsEnabled) {
        // Schedule notifications for all items
        for (const item of items) {
          const notificationId = await notificationService.scheduleExpiryNotification(item);
          if (notificationId) {
            notificationIds[item.id] = notificationId;
          }
        }
      } else {
        // Cancel all notifications
        await notificationService.cancelAllNotifications();
        Object.keys(notificationIds).forEach(key => delete notificationIds[key]);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const value = {
    items,
    settings: settings || storageService.defaultSettings,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 