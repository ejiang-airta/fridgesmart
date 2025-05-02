import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import frostTheme from '../theme/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { useApp, InventoryItem } from '../context/AppContext';

interface CategoryCounts {
  [key: string]: number;
}

interface StatsState {
  total: number;
  expiringSoon: number;
  expired: number;
  categories: CategoryCounts;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const { inventory } = useApp();
  const [stats, setStats] = useState<StatsState>({
    total: 0,
    expiringSoon: 0,
    expired: 0,
    categories: {}
  });

  // Calculate stats when inventory changes
  useEffect(() => {
    const today = new Date();
    
    // Count items
    let expiringSoon = 0;
    let expired = 0;
    const categories: CategoryCounts = {};
    
    inventory.forEach(item => {
      // Count by category
      categories[item.category] = (categories[item.category] || 0) + 1;
      
      // Check expiry
      const expiryDate = new Date(item.expiry);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) {
        expired++;
      } else if (daysUntilExpiry <= 3) {
        expiringSoon++;
      }
    });
    
    setStats({
      total: inventory.length,
      expiringSoon,
      expired,
      categories
    });
  }, [inventory]);

  const navigateToInventory = () => {
    // @ts-ignore
    navigation.navigate('Inventory');
  };

  const navigateToCamera = () => {
    // @ts-ignore
    navigation.navigate('Camera');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.titleText}>FridgeSmart</Text>
            <Text style={styles.subtitleText}>Never waste food again</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Fridge Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <MaterialIcons name="kitchen" size={24} color={frostTheme.colors.primary} />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="warning" size={24} color={frostTheme.colors.warning} />
            <Text style={styles.statValue}>{stats.expiringSoon}</Text>
            <Text style={styles.statLabel}>Expiring Soon</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="error" size={24} color={frostTheme.colors.danger} />
            <Text style={styles.statValue}>{stats.expired}</Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToInventory}>
            <MaterialIcons name="list-alt" size={24} color={frostTheme.colors.white} style={styles.actionIcon} />
            <Text style={styles.actionText}>View Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToCamera}>
            <MaterialIcons name="add-circle-outline" size={24} color={frostTheme.colors.white} style={styles.actionIcon} />
            <Text style={styles.actionText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips Section */}
      <Card style={styles.tipsCard}>
        <View style={styles.tipHeader}>
          <MaterialIcons name="lightbulb" size={24} color={frostTheme.colors.warning} />
          <Text style={styles.tipTitle}>Food Storage Tip</Text>
        </View>
        <Text style={styles.tipText}>
          Store dairy products in the coldest part of your fridge, not in the door where temperature fluctuates.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  header: {
    paddingHorizontal: frostTheme.spacing.md,
    paddingTop: frostTheme.spacing.md,
    paddingBottom: frostTheme.spacing.md,
  },
  headerBackground: {
    height: 180,
    justifyContent: 'center',
    borderRadius: frostTheme.borderRadius.lg,
    backgroundColor: frostTheme.colors.primary,
    overflow: 'hidden',
  },
  headerContent: {
    padding: frostTheme.spacing.lg,
  },
  welcomeText: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.white,
    fontWeight: frostTheme.typography.fontWeights.regular as any,
    opacity: 0.9,
  },
  titleText: {
    fontSize: frostTheme.typography.fontSizes.xxxl,
    fontWeight: frostTheme.typography.fontWeights.bold as any,
    color: frostTheme.colors.white,
    marginVertical: frostTheme.spacing.xs,
  },
  subtitleText: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.white,
    fontWeight: frostTheme.typography.fontWeights.regular as any,
    opacity: 0.9,
  },
  statsContainer: {
    paddingHorizontal: frostTheme.spacing.md,
    marginTop: frostTheme.spacing.md,
  },
  statsCard: {
    marginHorizontal: frostTheme.spacing.md,
    padding: frostTheme.spacing.md,
    backgroundColor: frostTheme.colors.card,
  },
  sectionTitle: {
    fontSize: frostTheme.typography.fontSizes.lg,
    fontWeight: frostTheme.typography.fontWeights.semibold as any,
    color: frostTheme.colors.text,
    marginBottom: frostTheme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    padding: frostTheme.spacing.sm,
    flex: 1,
  },
  statValue: {
    fontSize: frostTheme.typography.fontSizes.xl,
    fontWeight: frostTheme.typography.fontWeights.bold as any,
    color: frostTheme.colors.text,
    marginVertical: frostTheme.spacing.xs,
  },
  statLabel: {
    fontSize: frostTheme.typography.fontSizes.xs,
    color: frostTheme.colors.subtext,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: frostTheme.spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: frostTheme.colors.primary,
    borderRadius: frostTheme.borderRadius.md,
    padding: frostTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: frostTheme.spacing.xs,
    ...frostTheme.shadows.small,
  },
  actionIcon: {
    marginRight: frostTheme.spacing.xs,
  },
  actionText: {
    color: frostTheme.colors.white,
    fontSize: frostTheme.typography.fontSizes.md,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
  },
  tipsCard: {
    margin: frostTheme.spacing.md,
    marginBottom: frostTheme.spacing.xxxl,
    paddingBottom: frostTheme.spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: frostTheme.spacing.sm,
  },
  tipTitle: {
    fontSize: frostTheme.typography.fontSizes.md,
    fontWeight: frostTheme.typography.fontWeights.semibold as any,
    color: frostTheme.colors.text,
    marginLeft: frostTheme.spacing.xs,
  },
  tipText: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.subtext,
    lineHeight: 20,
  },
});

export default HomeScreen; 