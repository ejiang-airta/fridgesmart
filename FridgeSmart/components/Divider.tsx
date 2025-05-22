import React from 'react';
import { View, StyleSheet } from 'react-native';
import frostTheme from '../theme/theme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  length?: number | string;
  style?: any;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = frostTheme.colors.border,
  thickness = 1,
  length,
  style,
}) => {
  const dividerStyle = {
    backgroundColor: color,
    ...(orientation === 'horizontal'
      ? {
          width: length || '100%',
          height: thickness,
        }
      : {
          width: thickness,
          height: length || '100%',
        }),
  };

  return <View style={[styles.divider, dividerStyle, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    alignSelf: 'stretch',
  },
});

export default Divider; 