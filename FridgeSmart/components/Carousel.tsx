import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import frostTheme from '../theme/theme';

interface CarouselProps {
  data: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  style?: any;
}

const Carousel: React.FC<CarouselProps> = ({
  data,
  autoPlay = true,
  interval = 3000,
  showDots = true,
  showArrows = true,
  style,
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { width: screenWidth } = Dimensions.get('window');
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoPlay && data.length > 1) {
      timer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
      }, interval);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentIndex, data.length, screenWidth, autoPlay, interval]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCurrentIndex(index);
  };

  const handlePrevPress = () => {
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    scrollViewRef.current?.scrollTo({
      x: prevIndex * screenWidth,
      animated: true,
    });
  };

  const handleNextPress = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    scrollViewRef.current?.scrollTo({
      x: nextIndex * screenWidth,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
            listener: handleScroll,
          }
        )}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.slide, { width: screenWidth }]}
          >
            {item}
          </View>
        ))}
      </ScrollView>

      {showDots && data.length > 1 && (
        <View style={styles.pagination}>
          {data.map((_, index) => {
            const inputRange = [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {showArrows && data.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.arrow, styles.arrowLeft]}
            onPress={handlePrevPress}
          >
            <MaterialIcons
              name="chevron-left"
              size={32}
              color={frostTheme.colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrow, styles.arrowRight]}
            onPress={handleNextPress}
          >
            <MaterialIcons
              name="chevron-right"
              size={32}
              color={frostTheme.colors.white}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  slide: {
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: frostTheme.spacing.md,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: frostTheme.colors.white,
    marginHorizontal: 4,
    ...frostTheme.shadows.small,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    ...frostTheme.shadows.medium,
  },
  arrowLeft: {
    left: frostTheme.spacing.md,
  },
  arrowRight: {
    right: frostTheme.spacing.md,
  },
});

export default Carousel; 