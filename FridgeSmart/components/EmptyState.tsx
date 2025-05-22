import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';
import Button from './Button';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sentiment-dissatisfied',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name={icon}
        size={64}
        color={frostTheme.colors.subtext}
        style={styles.icon}
      />
      <Text
        variant="h4"
        style={{
          color: frostTheme.colors.text,
          textAlign: 'center',
          marginBottom: description ? frostTheme.spacing.xs : 0,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          variant="body2"
          style={{
            color: frostTheme.colors.subtext,
            textAlign: 'center',
            marginBottom: actionLabel ? frostTheme.spacing.md : 0,
          }}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="primary"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: frostTheme.spacing.xl,
  },
  icon: {
    marginBottom: frostTheme.spacing.md,
  },
});

export default EmptyState; 