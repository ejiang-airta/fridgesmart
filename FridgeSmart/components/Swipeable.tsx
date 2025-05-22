import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';

interface SwipeAction {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  onPress: () => void;
}

interface SwipeableProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  style?: any;
}

const Swipeable: React.FC<SwipeableProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  style,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const actionWidth = 80;
  const maxLeftSwipe = leftActions.length * actionWidth;
  const maxRightSwipe = rightActions.length * actionWidth;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState;
        let newX = dx;

        if (dx > 0 && !leftActions.length) newX = 0;
        if (dx < 0 && !rightActions.length) newX = 0;

        if (dx > maxLeftSwipe) newX = maxLeftSwipe;
        if (dx < -maxRightSwipe) newX = -maxRightSwipe;

        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        const isQuickSwipe = Math.abs(vx) > 0.5;

        if (isQuickSwipe) {
          if (vx > 0 && leftActions.length) {
            Animated.spring(translateX, {
              toValue: maxLeftSwipe,
              useNativeDriver: true,
            }).start();
          } else if (vx < 0 && rightActions.length) {
            Animated.spring(translateX, {
              toValue: -maxRightSwipe,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        } else {
          const threshold = actionWidth / 2;

          if (dx > threshold && leftActions.length) {
            Animated.spring(translateX, {
              toValue: maxLeftSwipe,
              useNativeDriver: true,
            }).start();
          } else if (dx < -threshold && rightActions.length) {
            Animated.spring(translateX, {
              toValue: -maxRightSwipe,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }
      },
    })
  ).current;

  const renderActions = (actions: SwipeAction[], isLeft: boolean) => {
    return actions.map((action, index) => {
      const offset = isLeft
        ? index * actionWidth
        : -actionWidth * (index + 1);

      return (
        <TouchableOpacity
          key={`${action.icon}-${index}`}
          style={[
            styles.action,
            {
              backgroundColor: action.color,
              left: isLeft ? offset : undefined,
              right: !isLeft ? -offset - actionWidth : undefined,
              width: actionWidth,
            },
          ]}
          onPress={() => {
            action.onPress();
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }}
        >
          <MaterialIcons
            name={action.icon}
            size={24}
            color={frostTheme.colors.white}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={[styles.container, style]}>
      {leftActions.length > 0 && renderActions(leftActions, true)}
      {rightActions.length > 0 && renderActions(rightActions, false)}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    backgroundColor: frostTheme.colors.background,
  },
  action: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Swipeable; 