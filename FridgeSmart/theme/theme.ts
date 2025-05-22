const frostTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF2D55',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    textDisabled: '#8E8E93',
    subtext: '#8E8E93',
    border: '#C7C7CC',
    disabled: '#E5E5EA',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    info: '#5856D6',
    black: '#000000',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24,
    round: 9999,
    full: 9999,
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  gradients: {
    primary: ['#007AFF', '#5856D6'],
    success: ['#34C759', '#30B350'],
    warning: ['#FF9500', '#FF8000'],
    danger: ['#FF3B30', '#FF2D55'],
  },
};

export default frostTheme; 