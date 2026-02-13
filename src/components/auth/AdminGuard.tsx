/**
 * AdminGuard — UX guard for superadmin-only screens.
 * Backend is the real security; this only blocks/redirects non-superadmin in the UI.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from 'src/hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

interface AdminGuardProps {
  children: React.ReactNode;
  /** Optional fallback when not allowed (e.g. "Access denied" message) */
  fallback?: React.ReactNode;
}

/**
 * Renders children only if user is superadmin or admin. Otherwise shows fallback or default message.
 */
export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, isSuperAdmin, isAdmin } = useAuth();

  const allowed = isSuperAdmin || isAdmin;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in.</Text>
      </View>
    );
  }

  if (!allowed) {
    if (fallback) return <>{fallback}</>;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access denied</Text>
        <Text style={styles.message}>Only superadmin users can access this section.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.background,
  },
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.s,
    color: COLORS.text.primary,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
