import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import frostTheme from '../theme/theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: any;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [value, translateX]);

  const getBackgroundColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    return value ? frostTheme.colors.primary : frostTheme.colors.border;
  };

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: disabled ? frostTheme.colors.textDisabled : frostTheme.colors.white,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    ...frostTheme.shadows.small,
  },
});

export default Switch; 