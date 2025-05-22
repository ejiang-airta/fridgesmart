import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AppProvider } from '../src/context/AppContext';
import frostTheme from '../src/theme';

// Import screens
import HomeScreen from '../src/screens/HomeScreen';
import InventoryScreen from '../src/screens/InventoryScreen';
import AddItemScreen from '../src/screens/AddItemScreen';
import ItemDetailScreen from '../src/screens/ItemDetailScreen';
import SettingsScreen from '../src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function InventoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InventoryList" 
        component={InventoryScreen}
        options={{ title: 'Inventory' }}
      />
      <Stack.Screen 
        name="ItemDetail" 
        component={ItemDetailScreen}
        options={{ title: 'Item Details' }}
      />
      <Stack.Screen 
        name="AddItem" 
        component={AddItemScreen}
        options={{ title: 'Add Item' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Inventory') {
                iconName = 'list';
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: frostTheme.colors.primary,
            tabBarInactiveTintColor: frostTheme.colors.subtext,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen 
            name="Inventory" 
            component={InventoryStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
} 