import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
  showIcon?: boolean;
  style?: any;
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  initiallyExpanded = false,
  showIcon = true,
  style,
}) => {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  const [contentHeight, setContentHeight] = React.useState(0);
  const animation = React.useRef(new Animated.Value(initiallyExpanded ? 1 : 0)).current;
  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handlePress = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const handleContentLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.header}
        activeOpacity={0.8}
      >
        <Text variant="body1" style={styles.title}>
          {title}
        </Text>
        {showIcon && (
          <Animated.View
            style={{
              transform: [{ rotate }],
            }}
          >
            <MaterialIcons
              name="expand-more"
              size={24}
              color={frostTheme.colors.text}
            />
          </Animated.View>
        )}
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          {
            height,
            opacity: animation,
          },
        ]}
      >
        <View
          style={styles.innerContent}
          onLayout={handleContentLayout}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: frostTheme.colors.background,
    borderRadius: frostTheme.borderRadius.md,
    ...frostTheme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: frostTheme.spacing.md,
  },
  title: {
    flex: 1,
    marginRight: frostTheme.spacing.sm,
  },
  content: {
    overflow: 'hidden',
  },
  innerContent: {
    position: 'absolute',
    width: '100%',
    padding: frostTheme.spacing.md,
    paddingTop: 0,
  },
});

export default Collapsible; 