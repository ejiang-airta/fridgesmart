import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  action 
}: EmptyStateProps): React.ReactElement => (
  <View style={styles.container}>
    <MaterialIcons name={icon} size={64} color={frostTheme.colors.border} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {action && (
      <TouchableOpacity style={styles.button} onPress={action.onPress}>
        <Text style={styles.buttonText}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: frostTheme.spacing.xxl,
    paddingHorizontal: frostTheme.spacing.md,
  },
  title: {
    fontSize: frostTheme.typography.fontSizes.lg,
    fontWeight: frostTheme.typography.fontWeights.bold as any,
    color: frostTheme.colors.text,
    marginTop: frostTheme.spacing.md,
    marginBottom: frostTheme.spacing.sm,
  },
  message: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.subtext,
    textAlign: 'center',
    marginBottom: frostTheme.spacing.lg,
  },
  button: {
    backgroundColor: frostTheme.colors.primary,
    paddingVertical: frostTheme.spacing.sm,
    paddingHorizontal: frostTheme.spacing.lg,
    borderRadius: frostTheme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: frostTheme.colors.white,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    fontSize: frostTheme.typography.fontSizes.md,
  },
});

export default EmptyState; 