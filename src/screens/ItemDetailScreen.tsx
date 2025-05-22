import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import {
  Text,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  QuantityInput,
  CameraView,
  Modal,
} from '../components';
import frostTheme from '../theme';

type RootStackParamList = {
  ItemDetail: { itemId: string };
};

type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

const categories = [
  { value: 'dairy', label: 'Dairy', icon: 'local-drink' },
  { value: 'meat', label: 'Meat', icon: 'restaurant' },
  { value: 'vegetables', label: 'Vegetables', icon: 'eco' },
  { value: 'fruits', label: 'Fruits', icon: 'apple' },
  { value: 'beverages', label: 'Beverages', icon: 'local-cafe' },
  { value: 'other', label: 'Other', icon: 'more-horiz' },
];

export default function ItemDetailScreen() {
  const route = useRoute<ItemDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { items, updateItem, deleteItem } = useApp();
  const item = items.find(i => i.id === route.params.itemId);

  const [isEditing, setIsEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [category, setCategory] = useState(item?.category || '');
  const [expiryDate, setExpiryDate] = useState(
    item ? new Date(item.expiryDate) : new Date()
  );
  const [notes, setNotes] = useState(item?.notes || '');
  const [imageUri, setImageUri] = useState(item?.imageUri);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text variant="h4">Item not found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!name || !category) return;

    setIsSaving(true);
    try {
      await updateItem({
        ...item,
        name,
        quantity,
        category,
        expiryDate: expiryDate.toISOString(),
        notes,
        imageUri,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handlePhotoCaptured = (uri: string) => {
    setImageUri(uri);
    setShowCamera(false);
  };

  const daysUntilExpiry = Math.ceil(
    (new Date(item.expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getExpiryColor = () => {
    if (daysUntilExpiry < 0) return frostTheme.colors.danger;
    if (daysUntilExpiry <= 3) return frostTheme.colors.warning;
    if (daysUntilExpiry <= 7) return frostTheme.colors.info;
    return frostTheme.colors.success;
  };

  return (
    <ScrollView style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.form}>
            <Input
              label="Item Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter item name"
              leftIcon="label"
            />

            <QuantityInput
              label="Quantity"
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={99}
            />

            <Select
              label="Category"
              value={category}
              options={categories}
              onChange={setCategory}
              placeholder="Select a category"
            />

            <DatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={setExpiryDate}
              minimumDate={new Date()}
            />

            <Input
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes"
              leftIcon="note"
              multiline
              numberOfLines={3}
            />

            <Button
              title={imageUri ? 'Change Photo' : 'Add Photo'}
              icon={imageUri ? 'camera-alt' : 'add-a-photo'}
              onPress={() => setShowCamera(true)}
              variant="outline"
              style={styles.photoButton}
            />

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Save"
                onPress={handleSave}
                loading={isSaving}
                disabled={!name || !category || isSaving}
                style={styles.button}
              />
            </View>
          </View>
        ) : (
          <>
            <Card style={styles.detailsCard}>
              <Text variant="h3">{item.name}</Text>
              <View style={styles.detailRow}>
                <Text variant="body2">Category:</Text>
                <Text variant="body1">{item.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="body2">Quantity:</Text>
                <Text variant="body1">{item.quantity} units</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="body2">Expiry Date:</Text>
                <Text
                  variant="body1"
                  style={{ color: getExpiryColor() }}
                >
                  {new Date(item.expiryDate).toLocaleDateString()}
                  {' ('}
                  {daysUntilExpiry < 0
                    ? 'Expired'
                    : daysUntilExpiry === 0
                    ? 'Expires today'
                    : `${daysUntilExpiry} days left`}
                  {')'}
                </Text>
              </View>
              {item.notes && (
                <View style={styles.notes}>
                  <Text variant="body2">Notes:</Text>
                  <Text variant="body1">{item.notes}</Text>
                </View>
              )}
            </Card>

            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                icon="edit"
                onPress={() => setIsEditing(true)}
                style={styles.button}
              />
              <Button
                title="Delete"
                icon="delete"
                onPress={handleDelete}
                variant="danger"
                style={styles.button}
              />
            </View>
          </>
        )}
      </View>

      <Modal visible={showCamera} onClose={() => setShowCamera(false)}>
        <CameraView
          onPhotoCaptured={handlePhotoCaptured}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: frostTheme.colors.background,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: frostTheme.spacing.md,
  },
  detailsCard: {
    marginBottom: frostTheme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: frostTheme.spacing.sm,
  },
  notes: {
    marginTop: frostTheme.spacing.md,
  },
  form: {
    gap: frostTheme.spacing.md,
  },
  photoButton: {
    marginTop: frostTheme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: frostTheme.spacing.xl,
  },
  button: {
    flex: 1,
    marginHorizontal: frostTheme.spacing.xs,
  },
}); 