import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import {
  SearchBar,
  CategoryFilter,
  ItemCard,
  EmptyState,
  Button,
  LoadingSpinner,
  Text,
} from '../components';
import frostTheme from '../theme';
import { Item } from '../types/item';

type RootStackParamList = {
  ItemDetail: { itemId: string };
  AddItem: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const categories = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'dairy', label: 'Dairy', icon: 'local-drink' },
  { id: 'meat', label: 'Meat', icon: 'restaurant' },
  { id: 'vegetables', label: 'Vegetables', icon: 'eco' },
  { id: 'fruits', label: 'Fruits', icon: 'apple' },
  { id: 'beverages', label: 'Beverages', icon: 'local-cafe' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];

export default function InventoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { items, deleteItem, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'expiry'>('expiry');

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return (
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
          );
        }
      });
  }, [items, searchQuery, selectedCategory, sortOrder]);

  const expiringItems = useMemo(() => {
    return filteredItems.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7;
    });
  }, [filteredItems]);

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={40} message="Loading inventory..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
          style={styles.searchBar}
        />
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
          style={styles.categoryFilter}
        />
      </View>

      {expiringItems.length > 0 && (
        <View style={styles.expiringSection}>
          <Text variant="h4" style={styles.sectionTitle}>
            Expiring Soon
          </Text>
          <FlatList
            horizontal
            data={expiringItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ItemCard
                {...item}
                onPress={() =>
                  navigation.navigate('ItemDetail', { itemId: item.id })
                }
                onDelete={() => handleDeleteItem(item.id)}
                style={styles.expiringItem}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.expiringList}
          />
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ItemCard
            {...item}
            onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            onDelete={() => handleDeleteItem(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="inventory"
            title="No items found"
            description={
              searchQuery
                ? 'Try adjusting your search or filters'
                : 'Add some items to your inventory'
            }
            actionLabel="Add Item"
            onAction={() => navigation.navigate('AddItem')}
          />
        }
        contentContainerStyle={styles.list}
      />

      <Button
        title="Add Item"
        icon="add"
        onPress={() => navigation.navigate('AddItem')}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: frostTheme.spacing.md,
    backgroundColor: frostTheme.colors.white,
    ...frostTheme.shadows.small,
  },
  searchBar: {
    marginBottom: frostTheme.spacing.sm,
  },
  categoryFilter: {
    marginTop: frostTheme.spacing.sm,
  },
  expiringSection: {
    marginTop: frostTheme.spacing.md,
  },
  sectionTitle: {
    marginHorizontal: frostTheme.spacing.md,
    marginBottom: frostTheme.spacing.sm,
  },
  expiringList: {
    paddingHorizontal: frostTheme.spacing.md,
  },
  expiringItem: {
    width: 200,
    marginRight: frostTheme.spacing.md,
  },
  list: {
    padding: frostTheme.spacing.md,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: frostTheme.spacing.xl,
    right: frostTheme.spacing.xl,
  },
}); 