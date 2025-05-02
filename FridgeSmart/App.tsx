import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './context/AppContext';
import frostTheme from './theme/theme';

// Import screens
import HomeScreen from './screens/HomeScreen';
import InventoryScreen from './screens/InventoryScreen';
import CameraScreen from './screens/CameraScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import AddItemScreen from './screens/AddItemScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigator for each tab to allow for nested screens
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
  </Stack.Navigator>
);

const InventoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: frostTheme.colors.card,
      },
      headerTitleStyle: {
        color: frostTheme.colors.text,
        fontWeight: frostTheme.typography.fontWeights.semibold as any,
      },
      headerTintColor: frostTheme.colors.primary, // Back button color
      contentStyle: {
        backgroundColor: frostTheme.colors.background,
      }
    }}
  >
    <Stack.Screen name="InventoryMain" component={InventoryScreen} options={{ title: 'Inventory' }} />
    <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ title: 'Item Details' }} />
    <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Add New Item' }} />
  </Stack.Navigator>
);

const CameraStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: frostTheme.colors.card,
      },
      headerTitleStyle: {
        color: frostTheme.colors.text,
        fontWeight: frostTheme.typography.fontWeights.semibold as any,
      },
      headerTintColor: frostTheme.colors.primary,
    }}
  >
    <Stack.Screen name="CameraMain" component={CameraScreen} options={{ title: 'Camera' }} />
    <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Add New Item' }} />
  </Stack.Navigator>
);

// Main tab navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof MaterialIcons.glyphMap;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Inventory') {
          iconName = 'kitchen';
        } else if (route.name === 'Camera') {
          iconName = 'camera-alt';
        } else {
          iconName = 'help';
        }

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: frostTheme.colors.primary,
      tabBarInactiveTintColor: frostTheme.colors.subtext,
      headerShown: true,
      headerStyle: {
        backgroundColor: frostTheme.colors.card,
        shadowColor: frostTheme.shadows.small.shadowColor,
        shadowOpacity: frostTheme.shadows.small.shadowOpacity,
        shadowRadius: frostTheme.shadows.small.shadowRadius,
        shadowOffset: frostTheme.shadows.small.shadowOffset,
        elevation: frostTheme.shadows.small.elevation,
      },
      headerTitleStyle: {
        color: frostTheme.colors.text,
        fontWeight: frostTheme.typography.fontWeights.semibold as any,
      },
      tabBarStyle: {
        backgroundColor: frostTheme.colors.card,
        borderTopColor: frostTheme.colors.border,
        paddingTop: 5,
        height: 60,
        shadowColor: frostTheme.shadows.small.shadowColor,
        shadowOpacity: frostTheme.shadows.small.shadowOpacity,
        shadowRadius: frostTheme.shadows.small.shadowRadius,
        shadowOffset: {
          width: 0,
          height: -2,
        },
        elevation: frostTheme.shadows.small.elevation,
      },
      tabBarLabelStyle: {
        display: 'none',
      },
      tabBarIconStyle: {
        marginTop: 5,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Inventory" component={InventoryStack} options={{ headerShown: false }} />
    <Tab.Screen name="Camera" component={CameraStack} options={{ headerShown: false }} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
