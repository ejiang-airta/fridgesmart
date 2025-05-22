import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types/item';

const STORAGE_KEYS = {
  ITEMS: '@fridgesmart_items',
  SETTINGS: '@fridgesmart_settings',
  THEME: '@fridgesmart_theme',
};

export interface AppSettings {
  notificationsEnabled: boolean;
  expiryNotificationDays: number;
  sortOrder: 'name' | 'expiry';
  theme: 'light' | 'dark' | 'system';
}

export const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  expiryNotificationDays: 7,
  sortOrder: 'expiry',
  theme: 'system',
};

class StorageService {
  async getItems(): Promise<Item[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ITEMS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading items from storage:', error);
      return [];
    }
  }

  async saveItems(items: Item[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, jsonValue);
    } catch (error) {
      console.error('Error saving items to storage:', error);
    }
  }

  async addItem(item: Item): Promise<void> {
    try {
      const items = await this.getItems();
      items.push(item);
      await this.saveItems(items);
    } catch (error) {
      console.error('Error adding item to storage:', error);
    }
  }

  async updateItem(updatedItem: Item): Promise<void> {
    try {
      const items = await this.getItems();
      const index = items.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        items[index] = updatedItem;
        await this.saveItems(items);
      }
    } catch (error) {
      console.error('Error updating item in storage:', error);
    }
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      const items = await this.getItems();
      const filteredItems = items.filter(item => item.id !== itemId);
      await this.saveItems(filteredItems);
    } catch (error) {
      console.error('Error deleting item from storage:', error);
    }
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultSettings;
    } catch (error) {
      console.error('Error reading settings from storage:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      const jsonValue = JSON.stringify(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, jsonValue);
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  }

  async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storageService = new StorageService(); 