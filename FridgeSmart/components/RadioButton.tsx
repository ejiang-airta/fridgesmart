import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import frostTheme from '../theme/theme';
import Text from './Text';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  style?: any;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onPress,
  label,
  disabled = false,
  error = false,
  style,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const innerScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(innerScale, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [selected, innerScale]);

  const handlePress = () => {
    if (disabled) return;

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const getBorderColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    if (error) return frostTheme.colors.danger;
    return selected ? frostTheme.colors.primary : frostTheme.colors.border;
  };

  const getInnerColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    if (error) return frostTheme.colors.danger;
    return frostTheme.colors.primary;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.radio,
          {
            borderColor: getBorderColor(),
            transform: [{ scale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.inner,
            {
              backgroundColor: getInnerColor(),
              transform: [{ scale: innerScale }],
            },
          ]}
        />
      </Animated.View>
      {label && (
        <Text
          variant="body2"
          style={{
            ...styles.label,
            color: disabled
              ? frostTheme.colors.textDisabled
              : frostTheme.colors.text,
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    marginLeft: frostTheme.spacing.sm,
  },
});

export default RadioButton; 