import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';

interface ItemCardProps {
  name: string;
  quantity: number;
  expiryDate: Date;
  category: string;
  onPress: () => void;
  onDelete: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  quantity,
  expiryDate,
  category,
  onPress,
  onDelete,
}) => {
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getExpiryColor = () => {
    if (daysUntilExpiry < 0) return frostTheme.colors.danger;
    if (daysUntilExpiry <= 3) return frostTheme.colors.warning;
    if (daysUntilExpiry <= 7) return frostTheme.colors.info;
    return frostTheme.colors.success;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <MaterialIcons name="delete-outline" size={20} color={frostTheme.colors.danger} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialIcons name="category" size={16} color={frostTheme.colors.subtext} />
            <Text style={styles.detailText}>{category}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="format-list-numbered" size={16} color={frostTheme.colors.subtext} />
            <Text style={styles.detailText}>{quantity} units</Text>
          </View>
        </View>

        <View style={[styles.expiryBadge, { backgroundColor: getExpiryColor() }]}>
          <MaterialIcons name="schedule" size={14} color={frostTheme.colors.white} />
          <Text style={styles.expiryText}>
            {daysUntilExpiry < 0
              ? 'Expired'
              : daysUntilExpiry === 0
              ? 'Expires today'
              : `Expires in ${daysUntilExpiry} days`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: frostTheme.colors.white,
    borderRadius: frostTheme.borderRadius.lg,
    marginBottom: frostTheme.spacing.md,
    ...frostTheme.shadows.sm,
  },
  content: {
    padding: frostTheme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: frostTheme.spacing.sm,
  },
  name: {
    fontSize: frostTheme.typography.fontSizes.lg,
    fontWeight: frostTheme.typography.fontWeights.bold as any,
    color: frostTheme.colors.text,
  },
  deleteButton: {
    padding: frostTheme.spacing.xs,
  },
  details: {
    flexDirection: 'row',
    marginBottom: frostTheme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: frostTheme.spacing.md,
  },
  detailText: {
    fontSize: frostTheme.typography.fontSizes.sm,
    color: frostTheme.colors.subtext,
    marginLeft: frostTheme.spacing.xs,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: frostTheme.spacing.xs,
    paddingHorizontal: frostTheme.spacing.sm,
    borderRadius: frostTheme.borderRadius.sm,
  },
  expiryText: {
    color: frostTheme.colors.white,
    fontSize: frostTheme.typography.fontSizes.sm,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    marginLeft: frostTheme.spacing.xs,
  },
});

export default ItemCard; 