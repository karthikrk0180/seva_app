import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={TYPOGRAPHY.h3}>Profile</Text>
          <Text style={[TYPOGRAPHY.body, styles.subtitle]}>
            Manage your devotee details and preferences
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.l },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.l,
  },
  subtitle: { color: COLORS.text.secondary, marginTop: SPACING.xs },
});
