import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface QuantityInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  disabled?: boolean;
  containerStyle?: any;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  error,
  disabled = false,
  containerStyle,
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleTextChange = (text: string) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue)) {
      const newValue = Math.min(max, Math.max(min, numericValue));
      onChange(newValue);
    } else if (text === '') {
      onChange(min);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="body2" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        <TouchableOpacity
          onPress={handleDecrease}
          disabled={disabled || value <= min}
          style={[
            styles.button,
            (disabled || value <= min) && styles.buttonDisabled,
          ]}
        >
          <MaterialIcons
            name="remove"
            size={20}
            color={
              disabled || value <= min
                ? frostTheme.colors.subtext
                : frostTheme.colors.primary
            }
          />
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            disabled && styles.inputDisabled,
          ]}
          value={value.toString()}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          editable={!disabled}
          maxLength={2}
        />

        <TouchableOpacity
          onPress={handleIncrease}
          disabled={disabled || value >= max}
          style={[
            styles.button,
            (disabled || value >= max) && styles.buttonDisabled,
          ]}
        >
          <MaterialIcons
            name="add"
            size={20}
            color={
              disabled || value >= max
                ? frostTheme.colors.subtext
                : frostTheme.colors.primary
            }
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: frostTheme.spacing.md,
  },
  label: {
    marginBottom: frostTheme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: frostTheme.colors.white,
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
    borderRadius: frostTheme.borderRadius.md,
    ...frostTheme.shadows.small,
  },
  inputContainerError: {
    borderColor: frostTheme.colors.danger,
  },
  inputContainerDisabled: {
    backgroundColor: frostTheme.colors.background,
    borderColor: frostTheme.colors.border,
  },
  button: {
    padding: frostTheme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: 44,
    textAlign: 'center',
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.text,
  },
  inputError: {
    color: frostTheme.colors.danger,
  },
  inputDisabled: {
    color: frostTheme.colors.subtext,
  },
  error: {
    color: frostTheme.colors.danger,
    marginTop: frostTheme.spacing.xs,
  },
});

export default QuantityInput; 