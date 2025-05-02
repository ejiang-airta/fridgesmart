import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import frostTheme from '../theme/theme';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconOnly?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconOnly = false,
}) => {
  const buttonStyle: StyleProp<ViewStyle> = [
    styles.button,
    size === 'small' ? styles.small : size === 'medium' ? styles.medium : styles.large,
    type === 'primary' ? styles.primary : 
    type === 'secondary' ? styles.secondary : 
    type === 'outline' ? styles.outline : styles.text,
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.buttonText,
    size === 'small' ? styles.smallText : 
    size === 'medium' ? styles.mediumText : styles.largeText,
    (type === 'outline' || type === 'text') && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
      {!iconOnly && title && <Text style={textStyles}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: frostTheme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: frostTheme.colors.primary,
  },
  secondary: {
    backgroundColor: frostTheme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: frostTheme.colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: frostTheme.colors.border,
    borderColor: frostTheme.colors.border,
  },
  small: {
    paddingVertical: frostTheme.spacing.xs,
    paddingHorizontal: frostTheme.spacing.md,
    minHeight: 32,
  },
  medium: {
    paddingVertical: frostTheme.spacing.sm,
    paddingHorizontal: frostTheme.spacing.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: frostTheme.spacing.md,
    paddingHorizontal: frostTheme.spacing.xl,
    minHeight: 54,
  },
  iconOnly: {
    paddingHorizontal: frostTheme.spacing.sm,
    aspectRatio: 1,
  },
  buttonText: {
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    color: frostTheme.colors.white,
    textAlign: 'center',
    marginLeft: frostTheme.spacing.xs,
  },
  smallText: {
    fontSize: frostTheme.typography.fontSizes.sm,
  },
  mediumText: {
    fontSize: frostTheme.typography.fontSizes.md,
  },
  largeText: {
    fontSize: frostTheme.typography.fontSizes.lg,
  },
  outlineText: {
    color: frostTheme.colors.primary,
  },
  disabledText: {
    color: frostTheme.colors.subtext,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button; 