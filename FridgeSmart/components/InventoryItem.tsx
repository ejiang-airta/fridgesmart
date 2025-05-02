import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import frostTheme from '../theme/theme';
import { InventoryItem as InventoryItemType } from '../context/AppContext';
import { format, differenceInDays } from 'date-fns';

interface InventoryItemProps {
  item: InventoryItemType;
  onPress?: () => void;
}

const getCategoryIcon = (category: string): keyof typeof MaterialIcons.glyphMap => {
  switch (category) {
    case 'dairy':
      return 'water-drop';
    case 'meat':
      return 'restaurant';
    case 'vegetables':
      return 'eco';
    case 'fruits':
      return 'apple';
    case 'beverages':
      return 'local-cafe';
    default:
      return 'shopping-basket';
  }
};

// Calculate days until expiry
const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get color based on expiry status
const getExpiryColor = (daysUntil: number): string => {
  if (daysUntil < 0) return frostTheme.colors.danger;
  if (daysUntil < 3) return frostTheme.colors.warning;
  return frostTheme.colors.success;
};

const InventoryItemComponent: React.FC<InventoryItemProps> = ({ item, onPress }) => {
  const navigation = useNavigation();
  const daysUntilExpiry = getDaysUntilExpiry(item.expiry);
  const expiryColor = getExpiryColor(daysUntilExpiry);
  const categoryIcon = getCategoryIcon(item.category);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // @ts-ignore - We'll define this screen later
      navigation.navigate('ItemDetail', { itemId: item.id });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={categoryIcon} size={24} color={frostTheme.colors.primary} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.quantity}>Qty: {item.quantity}</Text>
          <View style={styles.expiryContainer}>
            <Text style={[styles.expiry, { color: expiryColor }]}>
              {daysUntilExpiry < 0
                ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                : daysUntilExpiry === 0
                ? 'Expires today'
                : `Expires in ${daysUntilExpiry} days`}
            </Text>
          </View>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={frostTheme.colors.subtext} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: frostTheme.colors.card,
    borderRadius: frostTheme.borderRadius.md,
    padding: frostTheme.spacing.md,
    marginBottom: frostTheme.spacing.md,
    ...frostTheme.shadows.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: frostTheme.borderRadius.sm,
    backgroundColor: `${frostTheme.colors.primary}15`, // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: frostTheme.spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: frostTheme.typography.fontSizes.lg,
    color: frostTheme.colors.text,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    marginBottom: frostTheme.spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: frostTheme.typography.fontSizes.sm,
    color: frostTheme.colors.subtext,
    marginRight: frostTheme.spacing.md,
  },
  expiryContainer: {
    flex: 1,
  },
  expiry: {
    fontSize: frostTheme.typography.fontSizes.sm,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
  },
});

export default InventoryItemComponent; 