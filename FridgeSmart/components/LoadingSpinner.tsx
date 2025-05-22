import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  message?: string;
  style?: any;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 32,
  color = frostTheme.colors.primary,
  message,
  style,
}) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spin = () => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    spin();

    return () => {
      spinValue.stopAnimation();
    };
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
      >
        <MaterialIcons
          name="refresh"
          size={size}
          color={color}
        />
      </Animated.View>
      {message && (
        <Text
          variant="body2"
          style={{
            marginTop: frostTheme.spacing.sm,
            textAlign: 'center',
            color: frostTheme.colors.text,
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: frostTheme.spacing.sm,
    textAlign: 'center',
  },
});

export default LoadingSpinner; 