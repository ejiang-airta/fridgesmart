import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return frostTheme.colors.border;
    switch (variant) {
      case 'primary':
        return frostTheme.colors.primary;
      case 'secondary':
        return frostTheme.colors.secondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return frostTheme.colors.danger;
      default:
        return frostTheme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return frostTheme.colors.subtext;
    if (variant === 'outline') return frostTheme.colors.primary;
    return frostTheme.colors.white;
  };

  const getBorderColor = () => {
    if (disabled) return frostTheme.colors.border;
    if (variant === 'outline') return frostTheme.colors.primary;
    return 'transparent';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { vertical: frostTheme.spacing.xs, horizontal: frostTheme.spacing.sm };
      case 'large':
        return { vertical: frostTheme.spacing.md, horizontal: frostTheme.spacing.xl };
      default:
        return { vertical: frostTheme.spacing.sm, horizontal: frostTheme.spacing.lg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return frostTheme.typography.fontSizes.sm;
      case 'large':
        return frostTheme.typography.fontSizes.lg;
      default:
        return frostTheme.typography.fontSizes.md;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          paddingVertical: getPadding().vertical,
          paddingHorizontal: getPadding().horizontal,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && (
            <MaterialIcons
              name={icon}
              size={getFontSize()}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: frostTheme.borderRadius.md,
    borderWidth: 1,
  },
  text: {
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    textAlign: 'center',
  },
  icon: {
    marginRight: frostTheme.spacing.xs,
  },
});

export default Button; 