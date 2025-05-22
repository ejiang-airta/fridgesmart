import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import frostTheme from '../theme/theme';
import Text from './Text';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: any;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  error,
  disabled = false,
  containerStyle,
  minimumDate,
  maximumDate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="body2" style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.pickerContainer,
          error && styles.pickerContainerError,
          disabled && styles.pickerContainerDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.pickerContent}>
          {value ? (
            <>
              <MaterialIcons
                name="event"
                size={20}
                color={error ? frostTheme.colors.danger : frostTheme.colors.text}
                style={styles.icon}
              />
              <Text
                style={{
                  ...styles.selectedText,
                  ...(error ? styles.selectedTextError : {}),
                  ...(disabled ? styles.selectedTextDisabled : {}),
                }}
              >
                {formatDate(value)}
              </Text>
            </>
          ) : (
            <Text
              style={{
                ...styles.placeholder,
                ...(error ? styles.placeholderError : {}),
                ...(disabled ? styles.placeholderDisabled : {}),
              }}
            >
              {placeholder}
            </Text>
          )}
        </View>
        <MaterialIcons
          name="calendar-today"
          size={20}
          color={error ? frostTheme.colors.danger : frostTheme.colors.subtext}
        />
      </TouchableOpacity>
      {error && (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text variant="h4">Select a date</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={frostTheme.colors.subtext}
                    />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: frostTheme.spacing.md,
  },
  label: {
    marginBottom: frostTheme.spacing.xs,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: frostTheme.colors.white,
    borderWidth: 1,
    borderColor: frostTheme.colors.border,
    borderRadius: frostTheme.borderRadius.md,
    paddingHorizontal: frostTheme.spacing.md,
    height: 44,
    ...frostTheme.shadows.small,
  },
  pickerContainerError: {
    borderColor: frostTheme.colors.danger,
  },
  pickerContainerDisabled: {
    backgroundColor: frostTheme.colors.background,
    borderColor: frostTheme.colors.border,
  },
  pickerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: frostTheme.spacing.sm,
  },
  selectedText: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.text,
  },
  selectedTextError: {
    color: frostTheme.colors.danger,
  },
  selectedTextDisabled: {
    color: frostTheme.colors.subtext,
  },
  placeholder: {
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.subtext,
  },
  placeholderError: {
    color: frostTheme.colors.danger,
  },
  placeholderDisabled: {
    color: frostTheme.colors.subtext,
  },
  error: {
    color: frostTheme.colors.danger,
    marginTop: frostTheme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: frostTheme.colors.white,
    borderTopLeftRadius: frostTheme.borderRadius.xl,
    borderTopRightRadius: frostTheme.borderRadius.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: frostTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: frostTheme.colors.border,
  },
  closeButton: {
    padding: frostTheme.spacing.xs,
  },
});

export default DatePicker; 