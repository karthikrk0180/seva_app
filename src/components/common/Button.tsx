import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}: ButtonProps) => {
  const backgroundColor =
    variant === 'primary' ? COLORS.primary : variant === 'secondary' ? COLORS.secondary : 'transparent';
  
  const textColor =
    variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.text.light;

  const borderStyle = variant === 'outline' ? { borderWidth: 1, borderColor: COLORS.primary } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor },
        borderStyle,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[TYPOGRAPHY.button, { color: textColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginVertical: SPACING.xs,
  },
  disabled: {
    opacity: 0.6,
  },
});
