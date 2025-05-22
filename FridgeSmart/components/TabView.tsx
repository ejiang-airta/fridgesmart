import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import frostTheme from '../theme/theme';
import Tabs from './Tabs';

interface TabRoute {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabViewProps {
  routes: TabRoute[];
  style?: any;
}

const TabView: React.FC<TabViewProps> = ({ routes, style }) => {
  const [selectedKey, setSelectedKey] = React.useState(routes[0]?.key || '');
  const translateX = React.useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');

  const handleTabChange = (key: string) => {
    const currentIndex = routes.findIndex((route) => route.key === selectedKey);
    const nextIndex = routes.findIndex((route) => route.key === key);
    const direction = nextIndex > currentIndex ? 1 : -1;

    Animated.spring(translateX, {
      toValue: -nextIndex * screenWidth,
      useNativeDriver: true,
      bounciness: 0,
      speed: 14,
    }).start();

    setSelectedKey(key);
  };

  return (
    <View style={[styles.container, style]}>
      <Tabs
        tabs={routes}
        selectedKey={selectedKey}
        onChange={handleTabChange}
      />
      <Animated.View
        style={[
          styles.content,
          {
            width: screenWidth * routes.length,
            transform: [{ translateX }],
          },
        ]}
      >
        {routes.map((route) => (
          <View
            key={route.key}
            style={[styles.route, { width: screenWidth }]}
          >
            {route.content}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  route: {
    flex: 1,
  },
});

export default TabView; 