import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import frostTheme from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: frostTheme.colors.white,
          borderWidth: 1,
          borderColor: frostTheme.colors.border,
        };
      case 'flat':
        return {
          backgroundColor: frostTheme.colors.white,
        };
      default:
        return {
          backgroundColor: frostTheme.colors.white,
          ...frostTheme.shadows.small,
        };
    }
  };

  return (
    <View style={[styles.container, getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: frostTheme.borderRadius.lg,
    padding: frostTheme.spacing.md,
  },
});

export default Card; 