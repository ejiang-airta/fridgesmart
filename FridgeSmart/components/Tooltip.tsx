import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import frostTheme from '../theme/theme';
import Text from './Text';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  style?: any;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  offset = 8,
  style,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [layout, setLayout] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [tooltipLayout, setTooltipLayout] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.8)).current;

  const showTooltip = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 4,
      }),
    ]).start();
  };

  const hideTooltip = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  };

  const getTooltipPosition = () => {
    if (!layout || !tooltipLayout) return {};

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const { x, y, width, height } = layout;
    const { width: tooltipWidth, height: tooltipHeight } = tooltipLayout;

    let tooltipX = x;
    let tooltipY = y;

    switch (position) {
      case 'top':
        tooltipX = x + width / 2 - tooltipWidth / 2;
        tooltipY = y - tooltipHeight - offset;
        break;
      case 'bottom':
        tooltipX = x + width / 2 - tooltipWidth / 2;
        tooltipY = y + height + offset;
        break;
      case 'left':
        tooltipX = x - tooltipWidth - offset;
        tooltipY = y + height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        tooltipX = x + width + offset;
        tooltipY = y + height / 2 - tooltipHeight / 2;
        break;
    }

    // Keep tooltip within screen bounds
    tooltipX = Math.max(frostTheme.spacing.md, Math.min(tooltipX, screenWidth - tooltipWidth - frostTheme.spacing.md));
    tooltipY = Math.max(frostTheme.spacing.md, Math.min(tooltipY, screenHeight - tooltipHeight - frostTheme.spacing.md));

    return {
      left: tooltipX,
      top: tooltipY,
    };
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={showTooltip}
        onLongPress={showTooltip}
      >
        <View
          onLayout={(event) => {
            const { x, y, width, height } = event.nativeEvent.layout;
            setLayout({ x, y, width, height });
          }}
        >
          {children}
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={hideTooltip}
      >
        <TouchableWithoutFeedback onPress={hideTooltip}>
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.tooltip,
                getTooltipPosition(),
                {
                  opacity,
                  transform: [{ scale }],
                },
                style,
              ]}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setTooltipLayout({ width, height });
              }}
            >
              <Text
                variant="body2"
                style={styles.content}
              >
                {content}
              </Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: frostTheme.colors.text,
    borderRadius: frostTheme.borderRadius.md,
    padding: frostTheme.spacing.sm,
    maxWidth: 200,
    ...Platform.select({
      ios: {
        ...frostTheme.shadows.medium,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    color: frostTheme.colors.white,
    textAlign: 'center',
  },
});

export default Tooltip; 