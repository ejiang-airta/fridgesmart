import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types/item';

const STORAGE_KEYS = {
  ITEMS: '@fridgesmart_items',
  SETTINGS: '@fridgesmart_settings',
  THEME: '@fridgesmart_theme',
  CATEGORIES: '@fridgesmart_categories',
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

  async batchUpdateItems(items: Item[]): Promise<void> {
    try {
      const existingItems = await this.getItems();
      const updatedItems = existingItems.map(existingItem => {
        const updatedItem = items.find(item => item.id === existingItem.id);
        return updatedItem || existingItem;
      });
      await this.saveItems(updatedItems);
    } catch (error) {
      console.error('Error batch updating items:', error);
      throw new Error('Failed to batch update items');
    }
  }

  async getItemsByCategory(category: string): Promise<Item[]> {
    try {
      const items = await this.getItems();
      return items.filter(item => item.category === category);
    } catch (error) {
      console.error('Error getting items by category:', error);
      return [];
    }
  }

  async getExpiringItems(daysThreshold: number): Promise<Item[]> {
    try {
      const items = await this.getItems();
      const now = new Date();
      return items.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const diffTime = expiryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysThreshold && diffDays > 0;
      });
    } catch (error) {
      console.error('Error getting expiring items:', error);
      return [];
    }
  }

  async searchItems(query: string): Promise<Item[]> {
    try {
      const items = await this.getItems();
      const searchTerm = query.toLowerCase();
      return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.notes?.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error reading categories from storage:', error);
      return [];
    }
  }

  async saveCategories(categories: string[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify([...new Set(categories)]);
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, jsonValue);
    } catch (error) {
      console.error('Error saving categories to storage:', error);
      throw new Error('Failed to save categories');
    }
  }
}

export const storageService = new StorageService(); 