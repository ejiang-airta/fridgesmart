import React from 'react';
import { View, StyleSheet } from 'react-native';
import frostTheme from '../theme/theme';
import Text from './Text';

interface BadgeProps {
  value: number | string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const Badge: React.FC<BadgeProps> = ({
  value,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return frostTheme.colors.success;
      case 'warning':
        return frostTheme.colors.warning;
      case 'danger':
        return frostTheme.colors.danger;
      case 'info':
        return frostTheme.colors.info;
      default:
        return frostTheme.colors.primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          minWidth: 16,
          height: 16,
          fontSize: 10,
          paddingHorizontal: 4,
        };
      case 'large':
        return {
          minWidth: 24,
          height: 24,
          fontSize: 14,
          paddingHorizontal: 8,
        };
      default:
        return {
          minWidth: 20,
          height: 20,
          fontSize: 12,
          paddingHorizontal: 6,
        };
    }
  };

  const sizeStyles = getSize();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          minWidth: sizeStyles.minWidth,
          height: sizeStyles.height,
          borderRadius: sizeStyles.height / 2,
        },
        style,
      ]}
    >
      <Text
        variant="body2"
        style={{
          ...styles.text,
          fontSize: sizeStyles.fontSize,
          lineHeight: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: frostTheme.colors.white,
    textAlign: 'center',
  },
});

export default Badge; 