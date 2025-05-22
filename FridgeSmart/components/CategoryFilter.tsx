import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface Category {
  id: string;
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedId?: string;
  onSelect: (id: string) => void;
  style?: any;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedId,
  onSelect,
  style,
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const itemLayouts = React.useRef<{ [key: string]: number }>({}).current;
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handleItemLayout = (id: string, x: number) => {
    itemLayouts[id] = x;
  };

  React.useEffect(() => {
    if (selectedId && itemLayouts[selectedId] !== undefined) {
      scrollViewRef.current?.scrollTo({
        x: Math.max(0, itemLayouts[selectedId] - 16),
        animated: true,
      });
    }
  }, [selectedId, itemLayouts]);

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedId;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onSelect(category.id)}
              onLayout={(event) => {
                handleItemLayout(category.id, event.nativeEvent.layout.x);
              }}
              style={[
                styles.item,
                isSelected && styles.selectedItem,
              ]}
              activeOpacity={0.8}
            >
              {category.icon && (
                <MaterialIcons
                  name={category.icon}
                  size={20}
                  color={
                    isSelected
                      ? frostTheme.colors.white
                      : frostTheme.colors.text
                  }
                  style={styles.icon}
                />
              )}
              <Text
                variant="body2"
                style={{
                  color: isSelected
                    ? frostTheme.colors.white
                    : frostTheme.colors.text,
                }}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: frostTheme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: frostTheme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: frostTheme.spacing.sm,
    paddingHorizontal: frostTheme.spacing.md,
    marginRight: frostTheme.spacing.sm,
    borderRadius: frostTheme.borderRadius.full,
    backgroundColor: frostTheme.colors.card,
    ...frostTheme.shadows.small,
  },
  selectedItem: {
    backgroundColor: frostTheme.colors.primary,
  },
  icon: {
    marginRight: frostTheme.spacing.xs,
  },
});

export default CategoryFilter; 