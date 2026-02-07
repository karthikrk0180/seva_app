/**
 * Sode Matha App Design System
 * Material 3–inspired semantic tokens, typography scale, and touch targets.
 * Supports light/dark and accessibility (contrast, font scaling).
 */

/** Minimum touch target size (Material 3 / WCAG) */
export const MIN_TOUCH_TARGET = 48;

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

/** Light theme – semantic tokens (M3-style) */
const LIGHT = {
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#E0E0E0',
  primary: '#E65100',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFDBC9',
  onPrimaryContainer: '#2D1600',
  secondary: '#FFB300',
  onSecondary: '#1C1B1F',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  success: '#2E7D32',
};

/** Dark theme */
const DARK = {
  surface: '#1C1B1F',
  surfaceVariant: '#2D2D2D',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
  outlineVariant: '#49454F',
  primary: '#FFB68C',
  onPrimary: '#4D2600',
  primaryContainer: '#6D3800',
  onPrimaryContainer: '#FFDBC9',
  secondary: '#E6C200',
  onSecondary: '#3D3000',
  error: '#FFB4AB',
  onError: '#690005',
  success: '#81C784',
};

/** Current palette (light by default; switch via ThemeContext if needed) */
const PALETTE = LIGHT;

/** Legacy COLORS for backward compatibility; maps to semantic tokens */
export const COLORS = {
  primary: PALETTE.primary,
  primaryDark: '#B93C00',
  secondary: PALETTE.secondary,
  accent: PALETTE.onSurface,
  background: PALETTE.surfaceVariant,
  surface: PALETTE.surface,
  text: {
    primary: PALETTE.onSurface,
    secondary: PALETTE.onSurfaceVariant,
    light: PALETTE.onPrimary,
    error: PALETTE.error,
  },
  border: PALETTE.outlineVariant,
  success: PALETTE.success,
};

/** Semantic tokens for new components */
export const TOKENS = {
  ...PALETTE,
  minTouchTarget: MIN_TOUCH_TARGET,
};

/** Typography with line height for readability and font scaling */
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    color: COLORS.text.primary,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    color: COLORS.text.secondary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    color: COLORS.text.secondary,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    color: COLORS.text.light,
  },
};

/** Cap font scaling to avoid layout breakage (optional use in Text) */
export const MAX_FONT_SCALE = 1.3;

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

export { LIGHT as LIGHT_THEME, DARK as DARK_THEME };
