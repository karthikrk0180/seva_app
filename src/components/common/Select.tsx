import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onSelect: (value: string) => void;
  options: readonly string[] | { value: string; label: string }[];
  error?: string;
}

export function Select({ label, placeholder = '-- Select --', value, onSelect, options, error }: SelectProps) {
  const [open, setOpen] = useState(false);
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const displayLabel = value ? items.find((i) => i.value === value)?.label ?? value : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}: ${displayLabel}` : displayLabel}
        accessibilityState={{ expanded: open }}
      >
        <Text style={[styles.triggerText, !value && styles.placeholder]}>{displayLabel}</Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={TYPOGRAPHY.body}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.m },
  label: { ...TYPOGRAPHY.caption, fontWeight: '600', marginBottom: SPACING.xs, color: COLORS.text.primary },
  trigger: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: { borderColor: COLORS.text.error },
  triggerText: { ...TYPOGRAPHY.body, color: COLORS.text.primary },
  placeholder: { color: COLORS.text.secondary },
  chevron: { fontSize: 12, color: COLORS.text.secondary },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.text.error, marginTop: SPACING.xs },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: SPACING.l },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 8, maxHeight: 320 },
  option: { padding: SPACING.m, borderBottomWidth: 1, borderBottomColor: COLORS.border },
});
