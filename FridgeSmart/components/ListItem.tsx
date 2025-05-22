import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  disabled?: boolean;
  showDivider?: boolean;
  style?: any;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon = 'chevron-right',
  onPress,
  disabled = false,
  showDivider = true,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      style={[
        styles.container,
        showDivider && styles.divider,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      {leftIcon && (
        <MaterialIcons
          name={leftIcon}
          size={24}
          color={disabled ? frostTheme.colors.textDisabled : frostTheme.colors.text}
          style={styles.leftIcon}
        />
      )}
      <View style={styles.content}>
        <Text
          variant="body1"
          style={{
            color: disabled ? frostTheme.colors.textDisabled : frostTheme.colors.text,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="body2"
            style={{
              color: disabled ? frostTheme.colors.textDisabled : frostTheme.colors.subtext,
              marginTop: frostTheme.spacing.xs,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightIcon && (
        <MaterialIcons
          name={rightIcon}
          size={24}
          color={disabled ? frostTheme.colors.textDisabled : frostTheme.colors.subtext}
          style={styles.rightIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: frostTheme.spacing.md,
    paddingHorizontal: frostTheme.spacing.md,
    backgroundColor: frostTheme.colors.white,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: frostTheme.colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  leftIcon: {
    marginRight: frostTheme.spacing.md,
  },
  rightIcon: {
    marginLeft: frostTheme.spacing.md,
  },
  content: {
    flex: 1,
  },
});

export default ListItem; 