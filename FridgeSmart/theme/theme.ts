export const frostTheme = {
  colors: {
    primary: '#5B87B0',     // Blue seen in the header and buttons
    secondary: '#77A6D2',   // Lighter blue for secondary elements
    accent: '#4A6F94',      // Darker blue for accents
    background: '#F0F4F8',  // Very light blue/gray background
    card: '#FFFFFF',        // White card background
    text: '#2E4A62',        // Dark blue text for primary content
    subtext: '#6C8098',     // Medium blue/gray for secondary text
    border: '#DDE6F0',      // Light blue/gray border color
    notification: '#E74C3C', // Red notification color
    success: '#2ECC71',     // Green success color
    warning: '#F39C12',     // Orange warning color
    danger: '#E74C3C',      // Red danger color
    black: '#000000',
    white: '#FFFFFF',
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    fontWeights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#8CA4BE',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#8CA4BE',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.16,
      shadowRadius: 3.0,
      elevation: 2,
    },
    large: {
      shadowColor: '#8CA4BE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.20,
      shadowRadius: 5.0,
      elevation: 4,
    },
  },
  gradients: {
    primary: ['#6E9BC5', '#5B87B0'],
    secondary: ['#E8F0F8', '#D2E2F2'],
  }
};

export type ThemeType = typeof frostTheme;
export default frostTheme; 