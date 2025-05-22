import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

export interface SelectOption {
  label: string;
  value: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

interface SelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: any;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  error,
  disabled = false,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
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
          styles.selectContainer,
          error && styles.selectContainerError,
          disabled && styles.selectContainerDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.selectContent}>
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <MaterialIcons
                  name={selectedOption.icon}
                  size={20}
                  color={error ? frostTheme.colors.danger : frostTheme.colors.text}
                  style={styles.icon}
                />
              )}
              <Text
                style={{
                  ...styles.selectedText,
                  ...(error ? styles.selectedTextError : {}),
                  ...(disabled ? styles.selectedTextDisabled : {}),
                }}
              >
                {selectedOption.label}
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
          name="arrow-drop-down"
          size={24}
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
                  <Text variant="h4">Select an option</Text>
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
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        item.value === value && styles.selectedOption,
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      {item.icon && (
                        <MaterialIcons
                          name={item.icon}
                          size={20}
                          color={
                            item.value === value
                              ? frostTheme.colors.primary
                              : frostTheme.colors.text
                          }
                          style={styles.optionIcon}
                        />
                      )}
                      <Text
                        style={{
                          ...styles.optionText,
                          ...(item.value === value ? styles.selectedOptionText : {}),
                        }}
                      >
                        {item.label}
                      </Text>
                      {item.value === value && (
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={frostTheme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  )}
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
  selectContainer: {
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
  selectContainerError: {
    borderColor: frostTheme.colors.danger,
  },
  selectContainerDisabled: {
    backgroundColor: frostTheme.colors.background,
    borderColor: frostTheme.colors.border,
  },
  selectContent: {
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
    maxHeight: '80%',
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: frostTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: frostTheme.colors.border,
  },
  selectedOption: {
    backgroundColor: frostTheme.colors.background,
  },
  optionIcon: {
    marginRight: frostTheme.spacing.sm,
  },
  optionText: {
    flex: 1,
    fontSize: frostTheme.typography.fontSizes.md,
    color: frostTheme.colors.text,
  },
  selectedOptionText: {
    color: frostTheme.colors.primary,
    fontWeight: frostTheme.typography.fontWeights.medium as any,
  },
});

export default Select; 