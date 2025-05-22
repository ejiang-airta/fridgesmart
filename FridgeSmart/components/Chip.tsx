import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface ChipProps {
  label: string;
  onPress?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'filled' | 'outlined';
  style?: any;
}

const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  onDelete,
  selected = false,
  disabled = false,
  icon,
  variant = 'filled',
  style,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    if (selected) return frostTheme.colors.primary;
    return variant === 'filled' ? frostTheme.colors.surface : 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return frostTheme.colors.textDisabled;
    if (selected) return frostTheme.colors.white;
    return frostTheme.colors.text;
  };

  const getBorderColor = () => {
    if (disabled) return frostTheme.colors.disabled;
    if (selected) return frostTheme.colors.primary;
    return frostTheme.colors.border;
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outlined' ? getBorderColor() : 'transparent',
        },
        style,
      ]}
      disabled={disabled}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={16}
          color={getTextColor()}
          style={styles.icon}
        />
      )}
      <Text
        variant="body2"
        style={{ color: getTextColor() }}
      >
        {label}
      </Text>
      {onDelete && !disabled && (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          style={styles.deleteButton}
        >
          <MaterialIcons
            name="close"
            size={16}
            color={getTextColor()}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: frostTheme.spacing.xs,
    paddingHorizontal: frostTheme.spacing.sm,
    borderRadius: frostTheme.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: frostTheme.spacing.xs,
  },
  deleteButton: {
    marginLeft: frostTheme.spacing.xs,
  },
});

export default Chip; 