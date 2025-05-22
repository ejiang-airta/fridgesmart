import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import frostTheme from '../theme/theme';
import Text from './Text';

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  selectedKey: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
  style?: any;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  selectedKey,
  onChange,
  scrollable = false,
  style,
}) => {
  const [tabLayouts, setTabLayouts] = React.useState<{ [key: string]: number }>({});
  const [containerWidth, setContainerWidth] = React.useState(0);
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handleTabLayout = (key: string, event: LayoutChangeEvent) => {
    const { x } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [key]: x }));
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  React.useEffect(() => {
    if (tabLayouts[selectedKey] !== undefined) {
      Animated.spring(translateX, {
        toValue: tabLayouts[selectedKey],
        useNativeDriver: true,
        bounciness: 1,
      }).start();
    }
  }, [selectedKey, tabLayouts, translateX]);

  const TabsContainer = scrollable ? ScrollView : View;

  const indicatorWidth = containerWidth / tabs.length;

  return (
    <View style={[styles.container, style]} onLayout={handleContainerLayout}>
      <TabsContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollable ? styles.scrollableContent : styles.content}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            onLayout={(event) => handleTabLayout(tab.key, event)}
            style={[
              styles.tab,
              !scrollable && { flex: 1 },
            ]}
          >
            <Text
              variant="body2"
              style={{
                color: tab.key === selectedKey
                  ? frostTheme.colors.primary
                  : frostTheme.colors.text,
                fontWeight: tab.key === selectedKey ? '600' : '400',
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: scrollable ? 20 : indicatorWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      </TabsContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: frostTheme.colors.background,
  },
  content: {
    flexDirection: 'row',
  },
  scrollableContent: {
    flexDirection: 'row',
    paddingHorizontal: frostTheme.spacing.md,
  },
  tab: {
    height: 48,
    paddingHorizontal: frostTheme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: frostTheme.colors.primary,
    borderRadius: 1,
  },
});

export default Tabs; 