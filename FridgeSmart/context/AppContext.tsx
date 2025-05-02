import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import frostTheme from '../theme/theme';

// Define types for our inventory items
export interface InventoryItem {
  id: string;
  name: string;
  category: 'dairy' | 'meat' | 'vegetables' | 'fruits' | 'beverages' | 'other';
  expiry: string;
  quantity: number;
  notes?: string;
  imageUri?: string;
}

// Type for app context state
interface AppContextState {
  theme: typeof frostTheme;
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  loading: boolean;
}

// Create context
const AppContext = createContext<AppContextState | undefined>(undefined);

// Sample inventory data
const sampleInventory: InventoryItem[] = [
  { id: '1', name: 'Milk', category: 'dairy', expiry: '2023-11-30', quantity: 1 },
  { id: '2', name: 'Eggs', category: 'dairy', expiry: '2023-11-25', quantity: 12 },
  { id: '3', name: 'Bread', category: 'other', expiry: '2023-11-20', quantity: 1 },
  { id: '4', name: 'Cheese', category: 'dairy', expiry: '2023-12-15', quantity: 1 },
  { id: '5', name: 'Yogurt', category: 'dairy', expiry: '2023-11-28', quantity: 4 },
  { id: '6', name: 'Spinach', category: 'vegetables', expiry: '2023-11-15', quantity: 1 },
  { id: '7', name: 'Chicken Breast', category: 'meat', expiry: '2023-11-18', quantity: 2 },
  { id: '8', name: 'Apples', category: 'fruits', expiry: '2023-12-01', quantity: 6 },
  { id: '9', name: 'Orange Juice', category: 'beverages', expiry: '2023-12-10', quantity: 1 }
];

// Provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedInventory = await AsyncStorage.getItem('inventory');
        if (storedInventory) {
          setInventory(JSON.parse(storedInventory));
        } else {
          // Use sample data if no stored data
          setInventory(sampleInventory);
          await AsyncStorage.setItem('inventory', JSON.stringify(sampleInventory));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Default to sample data on error
        setInventory(sampleInventory);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save inventory to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('inventory', JSON.stringify(inventory));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    if (!loading) {
      saveData();
    }
  }, [inventory, loading]);

  // Add a new item
  const addItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString() // Simple ID generation
    };
    setInventory(prev => [...prev, newItem]);
  };

  // Update an existing item
  const updateItem = (id: string, updatedFields: Partial<InventoryItem>) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    );
  };

  // Delete an item
  const deleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const value = {
    theme: frostTheme,
    inventory,
    addItem,
    updateItem,
    deleteItem,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 