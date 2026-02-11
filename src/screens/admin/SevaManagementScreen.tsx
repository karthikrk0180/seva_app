import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAdmin } from 'src/context/AdminContext';
import { Seva } from 'src/models/seva.model';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { Button } from 'src/components/common/Button';
import { logger } from 'src/services/logger.service';

export const SevaManagementScreen = () => {
  const navigation = useNavigation<any>();

  /**
   * Admin context provides:
   * - ALL sevas (active + inactive)
   * - updateSeva
   * - deleteSeva
   */
  const { sevas, updateSeva, deleteSeva } = useAdmin();

  /**
   * Local copy of sevas for optimistic UI updates
   * (toggle switch without immediately calling API)
   */
  const [localSevas, setLocalSevas] = useState<Seva[]>([]);

  /**
   * Track which sevas were changed (dirty)
   * so we only save what is modified
   */
  const [dirtySevaIds, setDirtySevaIds] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sync local state whenever AdminContext sevas change
   * IMPORTANT:
   * - We do NOT filter here
   * - Admin must see ALL sevas (active + inactive)
   */
  React.useEffect(() => {
    if (sevas) {
      setLocalSevas(sevas);
    }
  }, [sevas]);

  /**
   * Toggle active/inactive status locally
   * (API call happens only when Save is pressed)
   */
  const toggleSevaStatus = (id: string) => {
    setLocalSevas(prev =>
      prev.map(seva =>
        seva.id === id
          ? { ...seva, isActive: !seva.isActive }
          : seva
      )
    );

    // Mark this seva as modified
    setDirtySevaIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  /**
   * Persist only changed sevas to backend
   */
  const saveSevaStatuses = async () => {
    if (dirtySevaIds.size === 0) return;

    setIsLoading(true);

    try {
      const updatedSevas = localSevas.filter(seva =>
        dirtySevaIds.has(seva.id)
      );

      logger.info('Saving Seva status changes', {
        count: updatedSevas.length,
      });

      await Promise.all(
        updatedSevas.map(seva =>
          updateSeva(seva.id, { isActive: seva.isActive })
        )
      );

      setDirtySevaIds(new Set());
      Alert.alert('Success', 'Seva statuses updated successfully');
    } catch (error) {
      logger.error('Failed to save seva statuses', error);
      Alert.alert('Error', 'Failed to update Seva statuses');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete seva (admin-only)
   */
  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Seva',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSeva(id),
        },
      ]
    );
  };

  /**
   * Save button handler
   */
  const handleSave = async () => {
    await saveSevaStatuses();
  };

  /**
   * Render single seva item
   * Shows BOTH Active and Inactive sevas
   */
  const renderItem = ({ item }: { item: Seva }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Seva info */}
        <View style={styles.info}>
          <Text style={TYPOGRAPHY.h3}>{item.titleEn}</Text>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.primary }]}>
            ₹{item.amount}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Active / Inactive toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
            <Switch
              value={item.isActive === true}
              onValueChange={() => toggleSevaStatus(item.id)}
              trackColor={{
                false: COLORS.border,
                true: COLORS.primary,
              }}
            />
          </View>

          {/* Edit & Delete */}
          <View style={styles.iconButtons}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SevaForm', { sevaId: item.id })
              }
            >
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id, item.titleEn)}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[TYPOGRAPHY.h2, styles.headerTitle]}>
          Manage Sevas
        </Text>

        <View style={styles.headerButtons}>
          <Button
            title="+ Add Seva"
            onPress={() => navigation.navigate('SevaForm')}
            variant="primary"
            style={styles.addButton}
          />

          <Button
            title="Save"
            onPress={handleSave}
            variant="primary"
            style={styles.addButton}
            disabled={dirtySevaIds.size === 0 || isLoading}
          />
        </View>
      </View>

      {/* Seva List (ALL sevas) */}
      <FlatList
        data={localSevas} // ⚠️ NO FILTERING → active + inactive
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={TYPOGRAPHY.body}>
              No Sevas found. Add one to get started.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerTitle: {
    flex: 1,
    marginRight: SPACING.m,
  },

  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.s,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  addButton: {
    height: 40,
    paddingHorizontal: SPACING.m,
  },

  list: { padding: SPACING.l },

  card: { marginBottom: SPACING.m },

  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  info: { flex: 1 },

  actions: { alignItems: 'flex-end', gap: SPACING.s },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  toggleLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
  },

  iconButtons: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginTop: SPACING.xs,
  },

  editIcon: { fontSize: 18 },

  deleteIcon: { fontSize: 18 },

  empty: {
    padding: SPACING.xxl,
    alignItems: 'center',
  },
});
