import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import {
  Input,
  Select,
  DatePicker,
  QuantityInput,
  Button,
  CameraView,
  Modal,
} from '../components';
import frostTheme from '../theme';

const categories = [
  { value: 'dairy', label: 'Dairy', icon: 'local-drink' },
  { value: 'meat', label: 'Meat', icon: 'restaurant' },
  { value: 'vegetables', label: 'Vegetables', icon: 'eco' },
  { value: 'fruits', label: 'Fruits', icon: 'apple' },
  { value: 'beverages', label: 'Beverages', icon: 'local-cafe' },
  { value: 'other', label: 'Other', icon: 'more-horiz' },
];

export default function AddItemScreen() {
  const navigation = useNavigation();
  const { addItem } = useApp();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !category) return;

    setIsSaving(true);
    try {
      await addItem({
        name,
        quantity,
        category,
        expiryDate: expiryDate.toISOString(),
        notes,
        imageUri,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      setIsSaving(false);
    }
  };

  const handlePhotoCaptured = (uri: string) => {
    setImageUri(uri);
    setShowCamera(false);
  };

  return (
    <ScrollView style={styles.container}>
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
          title={imageUri ? 'Retake Photo' : 'Add Photo'}
          icon={imageUri ? 'camera-alt' : 'add-a-photo'}
          onPress={() => setShowCamera(true)}
          variant="outline"
          style={styles.photoButton}
        />

        <Button
          title="Save Item"
          onPress={handleSave}
          loading={isSaving}
          disabled={!name || !category || isSaving}
          style={styles.saveButton}
        />
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
  form: {
    padding: frostTheme.spacing.md,
  },
  photoButton: {
    marginTop: frostTheme.spacing.md,
  },
  saveButton: {
    marginTop: frostTheme.spacing.xl,
  },
}); 