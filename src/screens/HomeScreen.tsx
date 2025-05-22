import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Text, Card, Button } from '../components';
import frostTheme from '../theme';

export default function HomeScreen() {
  const { items } = useApp();

  const expiringItems = items.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">Welcome to FridgeSmart</Text>
        <Text variant="body1" style={styles.subtitle}>
          Keep track of your food and reduce waste
        </Text>
      </View>

      <Card style={styles.statsCard}>
        <Text variant="h4">Inventory Overview</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text variant="h2">{items.length}</Text>
            <Text variant="body2">Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="h2" style={{ color: frostTheme.colors.warning }}>
              {expiringItems.length}
            </Text>
            <Text variant="body2">Expiring Soon</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.tipsCard}>
        <Text variant="h4">Food Storage Tips</Text>
        <Text variant="body2" style={styles.tip}>
          • Store fruits and vegetables separately to prevent premature ripening
        </Text>
        <Text variant="body2" style={styles.tip}>
          • Keep dairy products in the back of the fridge where it's coldest
        </Text>
        <Text variant="body2" style={styles.tip}>
          • Use airtight containers to keep food fresh longer
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Add New Item"
          icon="add"
          onPress={() => {
            // @ts-ignore - Navigation prop typing will be added later
            navigation.navigate('Inventory', { screen: 'AddItem' });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  header: {
    padding: frostTheme.spacing.lg,
    backgroundColor: frostTheme.colors.primary,
  },
  subtitle: {
    color: frostTheme.colors.white,
    marginTop: frostTheme.spacing.xs,
  },
  statsCard: {
    margin: frostTheme.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: frostTheme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  tipsCard: {
    margin: frostTheme.spacing.md,
  },
  tip: {
    marginTop: frostTheme.spacing.sm,
  },
  actions: {
    padding: frostTheme.spacing.md,
  },
}); 