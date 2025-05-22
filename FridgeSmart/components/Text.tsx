import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import frostTheme from '../theme/theme';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
}

const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color,
  style,
  numberOfLines,
}) => {
  const getTextStyle = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: frostTheme.typography.fontSizes.xxl,
          fontWeight: frostTheme.typography.fontWeights.bold as any,
          color: color || frostTheme.colors.text,
        };
      case 'h2':
        return {
          fontSize: frostTheme.typography.fontSizes.xl,
          fontWeight: frostTheme.typography.fontWeights.bold as any,
          color: color || frostTheme.colors.text,
        };
      case 'h3':
        return {
          fontSize: frostTheme.typography.fontSizes.lg,
          fontWeight: frostTheme.typography.fontWeights.semibold as any,
          color: color || frostTheme.colors.text,
        };
      case 'h4':
        return {
          fontSize: frostTheme.typography.fontSizes.md,
          fontWeight: frostTheme.typography.fontWeights.semibold as any,
          color: color || frostTheme.colors.text,
        };
      case 'body1':
        return {
          fontSize: frostTheme.typography.fontSizes.md,
          fontWeight: frostTheme.typography.fontWeights.regular as any,
          color: color || frostTheme.colors.text,
        };
      case 'body2':
        return {
          fontSize: frostTheme.typography.fontSizes.sm,
          fontWeight: frostTheme.typography.fontWeights.regular as any,
          color: color || frostTheme.colors.text,
        };
      case 'caption':
        return {
          fontSize: frostTheme.typography.fontSizes.xs,
          fontWeight: frostTheme.typography.fontWeights.regular as any,
          color: color || frostTheme.colors.subtext,
        };
      case 'button':
        return {
          fontSize: frostTheme.typography.fontSizes.md,
          fontWeight: frostTheme.typography.fontWeights.medium as any,
          color: color || frostTheme.colors.text,
        };
      default:
        return {
          fontSize: frostTheme.typography.fontSizes.md,
          fontWeight: frostTheme.typography.fontWeights.regular as any,
          color: color || frostTheme.colors.text,
        };
    }
  };

  return (
    <RNText
      style={[styles.text, getTextStyle(), style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },
});

export default Text; 