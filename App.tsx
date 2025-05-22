import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './FridgeSmart/context/AppContext';
import { AppNavigator } from './FridgeSmart/navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AppProvider>
  );
} 