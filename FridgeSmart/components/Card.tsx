import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import frostTheme from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({ children, style, elevated = false }) => {
  return (
    <View style={[
      styles.card, 
      elevated ? styles.elevatedCard : null,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: frostTheme.colors.card,
    borderRadius: frostTheme.borderRadius.md,
    padding: frostTheme.spacing.md,
    marginVertical: frostTheme.spacing.sm,
    ...frostTheme.shadows.small,
    borderWidth: 1,
    borderColor: 'rgba(221, 230, 240, 0.5)',
  },
  elevatedCard: {
    ...frostTheme.shadows.medium,
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
  },
});

export default Card; 