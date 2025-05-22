import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';
import Text from './Text';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightIcon,
  onRightIconPress,
  backgroundColor = frostTheme.colors.white,
  textColor = frostTheme.colors.text,
}) => {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: statusBarHeight,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text
          variant="h4"
          style={StyleSheet.flatten([styles.title, { color: textColor }])}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <MaterialIcons
                name={rightIcon}
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...frostTheme.shadows.small,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: frostTheme.spacing.md,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: frostTheme.spacing.xs,
  },
  rightButton: {
    padding: frostTheme.spacing.xs,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: frostTheme.spacing.md,
  },
});

export default Header; 