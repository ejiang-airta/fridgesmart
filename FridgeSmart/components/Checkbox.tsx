import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  style?: any;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  error = false,
  style,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

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

  const getBackgroundColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    if (error) return frostTheme.colors.danger;
    return checked ? frostTheme.colors.primary : 'transparent';
  };

  const getBorderColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    if (error) return frostTheme.colors.danger;
    return checked ? frostTheme.colors.primary : frostTheme.colors.border;
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
          styles.checkbox,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            transform: [{ scale }],
          },
        ]}
      >
        {checked && (
          <MaterialIcons
            name="check"
            size={16}
            color={checked ? frostTheme.colors.white : 'transparent'}
          />
        )}
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: frostTheme.borderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: frostTheme.spacing.sm,
  },
});

export default Checkbox; 