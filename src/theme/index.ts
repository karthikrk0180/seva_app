/**
 * Sode Matha App Design System
 * Premium aesthetic using Saffron/Gold/Dark tones.
 */

export const COLORS = {
  primary: '#E65100', // Saffron / Orange
  primaryDark: '#B93C00',
  secondary: '#FFB300', // Gold
  accent: '#212121', // Dark Gray for premium feel
  background: '#F5F5F5', // Light Gray background
  surface: '#FFFFFF', // White cards
  text: {
    primary: '#212121',
    secondary: '#757575',
    light: '#FFFFFF',
    error: '#D32F2F',
  },
  border: '#E0E0E0',
  success: '#2E7D32',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700', color: COLORS.text.primary, fontFamily: 'System' },
  h2: { fontSize: 24, fontWeight: '600', color: COLORS.text.primary, fontFamily: 'System' },
  h3: { fontSize: 20, fontWeight: '600', color: COLORS.text.primary, fontFamily: 'System' },
  body: { fontSize: 16, fontWeight: '400', color: COLORS.text.primary, fontFamily: 'System' },
  caption: { fontSize: 14, fontWeight: '400', color: COLORS.text.secondary, fontFamily: 'System' },
  button: { fontSize: 16, fontWeight: '600', color: COLORS.text.light, fontFamily: 'System' },
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
