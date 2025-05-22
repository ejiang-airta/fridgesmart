import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import frostTheme from '../theme/theme';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  animated?: boolean;
  duration?: number;
  style?: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = frostTheme.colors.primary,
  height = 4,
  animated = true,
  duration = 300,
  style,
}) => {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated, duration, animatedWidth]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: frostTheme.colors.border,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            width,
            height,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 2,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar; 