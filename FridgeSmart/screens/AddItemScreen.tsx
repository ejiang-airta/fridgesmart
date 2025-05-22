import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import frostTheme from '../theme/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CameraView } from '../components/CameraView';
import { notificationService } from '../services/notificationService';

type ParamList = {
  AddItem: {
    imageUri?: string;
  };
};

// Placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1583852151375-9d580d501a01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

const AddItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'AddItem'>>();
  const { addItem } = useApp();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<'dairy' | 'meat' | 'vegetables' | 'fruits' | 'beverages' | 'other'>('other');
  const [expiry, setExpiry] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(route.params?.imageUri || null);
  const [showCamera, setShowCamera] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Add New Item',
    });
  }, [navigation]);

  const handleSave = async () => {
    try {
      const newItem = {
        name,
        category: category as any,
        quantity: parseInt(quantity, 10),
        expiry: expiry.toISOString(),
        notes,
        imageUri: imageUri || undefined,
      };

      await addItem(newItem);
      await notificationService.scheduleExpiryNotification({
        id: Date.now().toString(),
        ...newItem,
        addedDate: new Date().toISOString(),
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      // You might want to show an error message to the user here
    }
  };

  const handlePhotoCaptured = (uri: string) => {
    setImageUri(uri);
    setShowCamera(false);
  };

  const renderCategoryOption = (
    value: 'dairy' | 'meat' | 'vegetables' | 'fruits' | 'beverages' | 'other',
    label: string,
    icon: keyof typeof MaterialIcons.glyphMap
  ) => (
    <TouchableOpacity
      style={[
        styles.categoryOption,
        category === value && styles.categoryOptionSelected
      ]}
      onPress={() => setCategory(value)}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={category === value ? frostTheme.colors.white : frostTheme.colors.primary}
      />
      <Text
        style={[
          styles.categoryOptionText,
          category === value && styles.categoryOptionTextSelected
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {showCamera ? (
          <CameraView
            onPhotoCaptured={handlePhotoCaptured}
            onClose={() => setShowCamera(false)}
          />
        ) : (
          <>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={() => setShowCamera(true)}
                >
                  <MaterialIcons name="camera-alt" size={40} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Take Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <Card style={styles.formCard}>
              {/* Name field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Item Name *</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter item name"
                  placeholderTextColor={frostTheme.colors.subtext}
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryContainer}>
                  {renderCategoryOption('dairy', 'Dairy', 'water-drop')}
                  {renderCategoryOption('meat', 'Meat', 'restaurant')}
                  {renderCategoryOption('vegetables', 'Vegetables', 'eco')}
                  {renderCategoryOption('fruits', 'Fruits', 'apple')}
                  {renderCategoryOption('beverages', 'Beverages', 'local-cafe')}
                  {renderCategoryOption('other', 'Other', 'shopping-basket')}
                </View>
              </View>

              {/* Quantity */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(prev => Math.max(1, parseInt(prev) - 1).toString())}
                  >
                    <MaterialIcons name="remove" size={24} color={frostTheme.colors.primary} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(prev => (parseInt(prev) + 1).toString())}
                  >
                    <MaterialIcons name="add" size={24} color={frostTheme.colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Expiry Date */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expiry Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{expiry.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={expiry}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setExpiry(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any additional notes here"
                  placeholderTextColor={frostTheme.colors.subtext}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                type="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Save Item"
                onPress={handleSave}
                icon={<MaterialIcons name="check" size={18} color={frostTheme.colors.white} style={styles.buttonIcon} />}
                style={styles.saveButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
  },
  formCard: {
    margin: frostTheme.spacing.md,
  },
  inputGroup: {
    marginBottom: frostTheme.spacing.lg,
  },
  label: {
    fontSize: frostTheme.typography.fontSizes.sm,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
    color: frostTheme.colors.text,
    marginBottom: frostTheme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
    borderRadius: frostTheme.borderRadius.sm,
    paddingHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.sm,
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.text,
    backgroundColor: frostTheme.colors.white,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: frostTheme.spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: frostTheme.spacing.xs,
  },
  categoryOption: {
    alignItems: 'center',
    marginRight: frostTheme.spacing.md,
    padding: frostTheme.spacing.sm,
    borderRadius: frostTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: frostTheme.colors.primary,
    minWidth: 80,
  },
  categoryOptionSelected: {
    backgroundColor: frostTheme.colors.primary,
  },
  categoryOptionText: {
    fontSize: frostTheme.typography.fontSizes.xs,
    color: frostTheme.colors.primary,
    marginTop: frostTheme.spacing.xs,
  },
  categoryOptionTextSelected: {
    color: frostTheme.colors.white,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: frostTheme.colors.background,
    borderRadius: frostTheme.borderRadius.sm,
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: frostTheme.typography.fontSizes.lg,
    color: frostTheme.colors.text,
    marginHorizontal: frostTheme.spacing.md,
    paddingVertical: frostTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: frostTheme.colors.border,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
    borderRadius: frostTheme.borderRadius.sm,
    padding: frostTheme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: frostTheme.spacing.md,
    marginTop: frostTheme.spacing.sm,
    marginBottom: frostTheme.spacing.xxl,
  },
  cancelButton: {
    flex: 1,
    marginRight: frostTheme.spacing.md,
  },
  saveButton: {
    flex: 1,
    marginLeft: frostTheme.spacing.md,
  },
  buttonIcon: {
    marginRight: frostTheme.spacing.xs,
  },
});

export default AddItemScreen; 