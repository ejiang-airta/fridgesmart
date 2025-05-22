import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}) => {
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
          style,
        ]}
      >
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={20}
            color={error ? frostTheme.colors.danger : frostTheme.colors.subtext}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={frostTheme.colors.subtext}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <MaterialIcons
              name={rightIcon}
              size={20}
              color={error ? frostTheme.colors.danger : frostTheme.colors.subtext}
            />
          </TouchableOpacity>
        )}
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
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: frostTheme.spacing.md,
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: frostTheme.spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: frostTheme.spacing.sm,
  },
  leftIcon: {
    marginLeft: frostTheme.spacing.md,
  },
  rightIcon: {
    marginRight: frostTheme.spacing.md,
  },
  error: {
    color: frostTheme.colors.danger,
    marginTop: frostTheme.spacing.xs,
  },
});

export default Input; 