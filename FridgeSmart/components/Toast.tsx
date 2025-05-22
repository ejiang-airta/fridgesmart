import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  onDismiss?: () => void;
  style?: any;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  style,
}) => {
  const translateY = React.useRef(new Animated.Value(100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const showAnimation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    const hideAnimation = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    showAnimation.start();

    const timer = setTimeout(() => {
      hideAnimation.start(() => {
        if (onDismiss) {
          onDismiss();
        }
      });
    }, duration);

    return () => {
      clearTimeout(timer);
      showAnimation.stop();
      hideAnimation.stop();
    };
  }, [translateY, opacity, duration, onDismiss]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return frostTheme.colors.success;
      case 'warning':
        return frostTheme.colors.warning;
      case 'error':
        return frostTheme.colors.danger;
      default:
        return frostTheme.colors.info;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
    >
      <MaterialIcons
        name={getIcon()}
        size={24}
        color={frostTheme.colors.white}
        style={styles.icon}
      />
      <Text
        variant="body2"
        style={styles.message}
        numberOfLines={2}
      >
        {message}
      </Text>
      <TouchableOpacity
        onPress={onDismiss}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <MaterialIcons
          name="close"
          size={24}
          color={frostTheme.colors.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: frostTheme.spacing.xl,
    left: frostTheme.spacing.md,
    right: frostTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: frostTheme.spacing.md,
    borderRadius: frostTheme.borderRadius.md,
    ...frostTheme.shadows.medium,
  },
  icon: {
    marginRight: frostTheme.spacing.sm,
  },
  message: {
    flex: 1,
    color: frostTheme.colors.white,
    marginRight: frostTheme.spacing.sm,
  },
});

export default Toast; 