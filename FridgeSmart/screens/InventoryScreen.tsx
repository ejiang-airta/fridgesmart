import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import InventoryItem from '../components/InventoryItem';
import EmptyState from '../components/EmptyState';
import frostTheme from '../theme/theme';
import { format } from 'date-fns';

// Sort options
type SortOption = 'name' | 'expiry' | 'recently-added';

// Category filters
type CategoryFilter = 'all' | 'dairy' | 'meat' | 'vegetables' | 'fruits' | 'beverages' | 'other';

const emptyStateStyles = StyleSheet.create({
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

const InventoryScreen = ({ navigation }: any) => {
  const { inventory, theme, deleteItem } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('expiry');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  
  // Identify items expiring within 7 days
  const expiringItems = useMemo(() => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    
    return inventory.filter(item => {
      const expiryDate = new Date(item.expiry);
      return expiryDate >= today && expiryDate <= sevenDaysLater;
    }).sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
  }, [inventory]);
  
  // Filter and sort inventory based on search, category and sort order
  useEffect(() => {
    let filtered = [...inventory];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'expiry') {
      filtered.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
    } else if (sortBy === 'recently-added') {
      filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    setFilteredInventory(filtered);
  }, [inventory, searchQuery, sortBy, categoryFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('AddItem', { item })}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemExpiry}>
          Expires: {format(new Date(item.expiry), 'MMM d, yyyy')}
        </Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (searchQuery || categoryFilter !== 'all') {
      return (
        <EmptyState 
          icon="search-off"
          title="No matching items"
          message="Try adjusting your search or filters"
        />
      );
    }
    
    return (
      <EmptyState 
        icon="inventory"
        title="Your inventory is empty"
        message="Tap the + button to add your first item"
        action={{
          label: "Add Item",
          onPress: () => navigation.navigate('AddItem')
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header and Search */}
      <View style={styles.header}>
        <Text style={styles.title}>My Inventory</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color={theme.colors.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor={theme.colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color={theme.colors.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Expiring Soon Section */}
      {expiringItems.length > 0 && (
        <View style={styles.expiringSection}>
          <View style={styles.expiringHeader}>
            <MaterialIcons name="access-time" size={20} color={theme.colors.warning} />
            <Text style={styles.expiringTitle}>Expiring Soon</Text>
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.expiringItemsContainer}
          >
            {expiringItems.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.expiringItem}
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('ItemDetails', { itemId: item.id });
                }}
              >
                <Image 
                  source={{ uri: item.imageUri || 'https://images.unsplash.com/photo-1583852151375-9d580d501a01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
                  style={styles.expiringItemImage} 
                />
                <View style={styles.expiringItemInfo}>
                  <Text style={styles.expiringItemName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.expiringDateRow}>
                    <MaterialIcons name="event" size={12} color={theme.colors.warning} />
                    <Text style={styles.expiringItemDate}>{item.expiry}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilters}
      >
        {renderCategoryButton('all', 'All', 'category')}
        {renderCategoryButton('dairy', 'Dairy', 'opacity')}
        {renderCategoryButton('meat', 'Meat', 'restaurant')}
        {renderCategoryButton('vegetables', 'Vegetables', 'eco')}
        {renderCategoryButton('fruits', 'Fruits', 'apple')}
        {renderCategoryButton('beverages', 'Beverages', 'local-cafe')}
        {renderCategoryButton('other', 'Other', 'shopping-basket')}
      </ScrollView>

      {/* Sort Options */}
      <View style={styles.sortOptions}>
        <Text style={styles.sortOptionsLabel}>Sort by:</Text>
        <View style={styles.sortButtonsContainer}>
          {renderSortButton('name', 'Name')}
          {renderSortButton('expiry', 'Expiry Date')}
          {renderSortButton('recently-added', 'Recently Added')}
        </View>
      </View>

      {/* Inventory List */}
      <FlatList
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.inventoryList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState()}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddItem')}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  header: {
    padding: frostTheme.spacing.md,
    backgroundColor: frostTheme.colors.white,
  },
  title: {
    fontSize: frostTheme.typography.fontSizes.xl,
    fontWeight: frostTheme.typography.fontWeights.bold as any,
    color: frostTheme.colors.text,
    marginBottom: frostTheme.spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: frostTheme.colors.background,
    borderRadius: frostTheme.borderRadius.md,
    paddingHorizontal: frostTheme.spacing.sm,
    marginBottom: frostTheme.spacing.xs,
  },
  searchIcon: {
    marginRight: frostTheme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: frostTheme.spacing.sm,
    color: frostTheme.colors.text,
    fontSize: frostTheme.typography.fontSizes.md,
  },
  categoryFilters: {
    flexDirection: 'row',
    paddingHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.sm,
    backgroundColor: frostTheme.colors.white,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.xs,
    borderRadius: frostTheme.borderRadius.full,
    marginRight: frostTheme.spacing.sm,
    backgroundColor: frostTheme.colors.background,
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
  },
  categoryButtonActive: {
    backgroundColor: frostTheme.colors.primary,
    borderColor: frostTheme.colors.primary,
  },
  categoryButtonLabel: {
    fontSize: frostTheme.typography.fontSizes.sm,
    marginLeft: frostTheme.spacing.xs,
    color: frostTheme.colors.text,
  },
  categoryButtonLabelActive: {
    color: frostTheme.colors.white,
  },
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.sm,
    backgroundColor: frostTheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: frostTheme.colors.border,
  },
  sortOptionsLabel: {
    fontSize: frostTheme.typography.fontSizes.sm,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    color: frostTheme.colors.subtext,
    marginRight: frostTheme.spacing.sm,
  },
  sortButtonsContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.xs,
    borderRadius: frostTheme.borderRadius.round,
    marginRight: frostTheme.spacing.sm,
    backgroundColor: frostTheme.colors.background,
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
  },
  sortButtonActive: {
    backgroundColor: frostTheme.colors.primary + '20',
  },
  sortButtonLabel: {
    fontSize: frostTheme.typography.fontSizes.sm,
    color: frostTheme.colors.subtext,
  },
  sortButtonLabelActive: {
    color: frostTheme.colors.primary,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
  },
  inventoryList: {
    paddingBottom: frostTheme.spacing.xl,
    paddingHorizontal: frostTheme.spacing.md,
    flexGrow: 1,
  },
  addButton: {
    position: 'absolute',
    right: frostTheme.spacing.lg,
    bottom: frostTheme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: frostTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  expiringSection: {
    backgroundColor: frostTheme.colors.white,
    paddingTop: frostTheme.spacing.sm,
    paddingBottom: frostTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: frostTheme.colors.border,
  },
  expiringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: frostTheme.spacing.md,
    marginBottom: frostTheme.spacing.sm,
  },
  expiringTitle: {
    fontSize: frostTheme.typography.fontSizes.md,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    color: frostTheme.colors.warning,
    marginLeft: frostTheme.spacing.xs,
  },
  expiringItemsContainer: {
    paddingHorizontal: frostTheme.spacing.md,
  },
  expiringItem: {
    width: 120,
    marginRight: frostTheme.spacing.md,
    backgroundColor: frostTheme.colors.background,
    borderRadius: frostTheme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
  },
  expiringItemImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
  },
  expiringItemInfo: {
    padding: frostTheme.spacing.sm,
  },
  expiringItemName: {
    fontSize: frostTheme.typography.fontSizes.sm,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    color: frostTheme.colors.text,
    marginBottom: frostTheme.spacing.xs,
  },
  expiringDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiringItemDate: {
    fontSize: frostTheme.typography.fontSizes.xs,
    color: frostTheme.colors.warning,
    marginLeft: frostTheme.spacing.xs,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemExpiry: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
});

export default InventoryScreen; 