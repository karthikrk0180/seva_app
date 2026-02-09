import React, { ReactNode } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

interface InputProps extends TextInputProps {
  label?: ReactNode;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label} maxFontSizeMultiplier={1.3}>
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, error ? styles.inputError : {}, style]}
        placeholderTextColor={COLORS.text.secondary}
        accessibilityLabel={
          props.accessibilityLabel ??
          (typeof label === 'string' ? label : undefined)
        }
        accessibilityHint={error ? `Error: ${error}` : undefined}
        accessibilityState={{ disabled: props.editable === false }}
        {...props}
      />
      {error && (
        <Text style={styles.errorText} maxFontSizeMultiplier={1.3}>
          {error}
        </Text>
      )}
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
    minHeight: 48,
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
