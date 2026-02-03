import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : {}, style]}
        placeholderTextColor={COLORS.text.secondary}
        accessibilityLabel={props.accessibilityLabel || label}
        accessibilityHint={error ? `Error: ${error}` : undefined}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: COLORS.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.surface,
    color: COLORS.text.primary,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.text.error,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.error,
    marginTop: SPACING.xs,
  },
});
