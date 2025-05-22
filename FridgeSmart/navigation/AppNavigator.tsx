import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { InventoryScreen } from '../screens/InventoryScreen';
import { AddItemScreen } from '../screens/AddItemScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InventoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="InventoryMain"
      component={InventoryScreen}
      options={{ title: 'My Inventory' }}
    />
    <Stack.Screen
      name="AddItem"
      component={AddItemScreen}
      options={{ title: 'Add New Item' }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inventory') {
              iconName = 'list';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }

            return <MaterialIcons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Inventory"
          component={InventoryStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 