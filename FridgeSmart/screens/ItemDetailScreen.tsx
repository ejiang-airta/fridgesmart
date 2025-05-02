import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import frostTheme from '../theme/theme';
import Button from '../components/Button';
import Card from '../components/Card';

// Placeholder image for items without images
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1583852151375-9d580d501a01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

type ParamList = {
  ItemDetail: {
    itemId: string;
  };
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'dairy': return 'Dairy';
    case 'meat': return 'Meat';
    case 'vegetables': return 'Vegetables';
    case 'fruits': return 'Fruits';
    case 'beverages': return 'Beverages';
    default: return 'Other';
  }
};

const ItemDetailScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'ItemDetail'>>();
  const navigation = useNavigation();
  const { inventory, deleteItem } = useApp();
  const { itemId } = route.params;
  
  // Find the item in inventory
  const item = inventory.find(i => i.id === itemId);
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (): number => {
    if (!item) return 0;
    const today = new Date();
    const expiry = new Date(item.expiry);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const daysUntilExpiry = getDaysUntilExpiry();
  
  useEffect(() => {
    // Set screen title
    navigation.setOptions({
      title: item ? item.name : 'Item Details',
      headerRight: () => (
        <Button
          title="Edit"
          type="text"
          // @ts-ignore - We would implement EditItem screen in the future
          onPress={() => navigation.navigate('AddItem', { itemId })}
          textStyle={{ color: frostTheme.colors.primary }}
        />
      ),
    });
  }, [item, navigation, itemId]);
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete ${item?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            if (item) {
              deleteItem(item.id);
              navigation.goBack();
            }
          }
        }
      ]
    );
  };
  
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} style={styles.backButton} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUri || DEFAULT_IMAGE }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <Card style={styles.infoCard}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.categoryTag}>
            <MaterialIcons 
              name={
                item.category === 'dairy' ? 'water-drop' :
                item.category === 'meat' ? 'restaurant' :
                item.category === 'vegetables' ? 'eco' :
                item.category === 'fruits' ? 'apple' :
                item.category === 'beverages' ? 'local-cafe' : 'shopping-basket'
              } 
              size={16} 
              color={frostTheme.colors.white} 
            />
            <Text style={styles.categoryText}>
              {getCategoryLabel(item.category)}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MaterialIcons name="event" size={24} color={frostTheme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>{formatDate(item.expiry)}</Text>
              <Text 
                style={[
                  styles.expiryStatus, 
                  { 
                    color: daysUntilExpiry < 0 
                      ? frostTheme.colors.danger 
                      : daysUntilExpiry <= 3 
                        ? frostTheme.colors.warning 
                        : frostTheme.colors.success 
                  }
                ]}
              >
                {daysUntilExpiry < 0 
                  ? `Expired ${Math.abs(daysUntilExpiry)} days ago` 
                  : daysUntilExpiry === 0 
                    ? 'Expires today' 
                    : `Expires in ${daysUntilExpiry} days`}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="inventory-2" size={24} color={frostTheme.colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>{item.quantity} {item.quantity > 1 ? 'units' : 'unit'}</Text>
            </View>
          </View>
          
          {item.notes && (
            <View style={styles.detailItem}>
              <MaterialIcons name="notes" size={24} color={frostTheme.colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{item.notes}</Text>
              </View>
            </View>
          )}
        </View>
      </Card>
      
      <View style={styles.actionButtons}>
        <Button 
          title="Delete Item" 
          onPress={handleDelete}
          type="outline"
          icon={<MaterialIcons name="delete" size={18} color={frostTheme.colors.primary} style={styles.buttonIcon} />}
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    margin: frostTheme.spacing.md,
    marginBottom: frostTheme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: frostTheme.spacing.md,
  },
  title: {
    fontSize: frostTheme.typography.fontSizes.xl,
    fontWeight: frostTheme.typography.fontWeights.bold as any,
    color: frostTheme.colors.text,
    flex: 1,
  },
  categoryTag: {
    backgroundColor: frostTheme.colors.primary,
    borderRadius: frostTheme.borderRadius.md,
    paddingVertical: frostTheme.spacing.xs,
    paddingHorizontal: frostTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: frostTheme.colors.white,
    fontSize: frostTheme.typography.fontSizes.xs,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    marginLeft: frostTheme.spacing.xs,
  },
  detailsContainer: {
    marginTop: frostTheme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: frostTheme.spacing.md,
    alignItems: 'flex-start',
  },
  detailTextContainer: {
    marginLeft: frostTheme.spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: frostTheme.typography.fontSizes.sm,
    color: frostTheme.colors.subtext,
    marginBottom: frostTheme.spacing.xs,
  },
  detailValue: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.text,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
  },
  expiryStatus: {
    fontSize: frostTheme.typography.fontSizes.sm,
    marginTop: frostTheme.spacing.xs,
  },
  actionButtons: {
    paddingHorizontal: frostTheme.spacing.md,
    marginTop: frostTheme.spacing.sm,
    marginBottom: frostTheme.spacing.xxl,
  },
  deleteButton: {
    marginTop: frostTheme.spacing.md,
  },
  buttonIcon: {
    marginRight: frostTheme.spacing.xs,
  },
  errorText: {
    fontSize: frostTheme.typography.fontSizes.lg,
    color: frostTheme.colors.text,
    textAlign: 'center',
    marginTop: frostTheme.spacing.xl,
  },
  backButton: {
    marginTop: frostTheme.spacing.lg,
    alignSelf: 'center',
  },
});

export default ItemDetailScreen; 