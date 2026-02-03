import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SPACING } from 'src/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card = ({ children, style, onPress, variant = 'elevated' }: CardProps) => {
  const containerStyle = [
    styles.card,
    variant === 'elevated' && SHADOWS.card,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  flat: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    padding: 0,
  },
});
