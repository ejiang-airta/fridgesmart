import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showClearButton?: boolean;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  autoFocus = false,
  showClearButton = true,
  style,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isFocused || value.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused, value, animation]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    onChangeText('');
    Keyboard.dismiss();
  };

  const clearButtonOpacity = animation;

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name="search"
        size={24}
        color={frostTheme.colors.subtext}
        style={styles.searchIcon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={frostTheme.colors.subtext}
        style={styles.input}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
      />
      {showClearButton && (
        <Animated.View
          style={[
            styles.clearButton,
            {
              opacity: clearButtonOpacity,
              transform: [
                {
                  scale: clearButtonOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={value.length > 0 ? 'auto' : 'none'}
        >
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialIcons
              name="close"
              size={20}
              color={frostTheme.colors.subtext}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: frostTheme.colors.card,
    borderRadius: frostTheme.borderRadius.full,
    paddingHorizontal: frostTheme.spacing.md,
    height: 48,
    ...frostTheme.shadows.small,
  },
  searchIcon: {
    marginRight: frostTheme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: frostTheme.colors.text,
    padding: 0,
  },
  clearButton: {
    marginLeft: frostTheme.spacing.sm,
  },
});

export default SearchBar; 