import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { ROUTES } from 'src/config';
import { sevaService } from 'src/services/seva.service';
import { Seva } from 'src/models/seva.model';
import { useCartStore } from 'src/store/cart.store';
import { Button } from 'src/components/common/Button';

type LocationFilter = 'Sode' | 'Udupi';

export const SevaListScreen = () => {
  const navigation = useNavigation<any>();
  const { addToCart, isInCart } = useCartStore();

  const [sevas, setSevas] = useState<Seva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<LocationFilter>('Sode');
  const [searchText, setSearchText] = useState('');

  const loadSevas = async () => {
    try {
      const data = await sevaService.getSevas();
      setSevas(data);
    } catch (error) {
      console.error('Failed to fetch sevas', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSevas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSevas();
  };

  const filteredData = useMemo(() => {
    return sevas
      .filter(seva => seva.isActive)
      // .filter(seva => seva.location === filter)
      .filter(seva =>
        seva.titleEn.toLowerCase().includes(searchText.toLowerCase())
      );
  }, [sevas, filter, searchText]);

  const handleAddToCart = (seva: Seva) => {
    addToCart(seva);
  };

  const renderItem = ({ item }: { item: Seva }) => {
    const inCart = isInCart(item.id);
    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate(ROUTES.SEVA.SEVA_BOOKING, { sevaId: item.id })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={TYPOGRAPHY.h3}>{item.titleEn}</Text>
          <Text style={[TYPOGRAPHY.h3, { color: COLORS.primary }]}>
            ₹{item.amount}
          </Text>
        </View>

        <Text style={[TYPOGRAPHY.body, { color: COLORS.text.secondary, marginBottom: SPACING.m }]}>
          {item.descEn}
        </Text>

        <Button
          title={inCart ? "Added to Cart" : "Add to Cart"}
          onPress={() => handleAddToCart(item)}
          variant={inCart ? "secondary" : "primary"}
          disabled={inCart}
          style={{ marginTop: SPACING.s }}
        />
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h1}>Seva Booking</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Sevas..."
          placeholderTextColor={COLORS.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabs}>
        {(['Sode', 'Udupi'] as LocationFilter[]).map(loc => (
          <TouchableOpacity
            key={loc}
            style={[styles.tab, filter === loc && styles.activeTab]}
            onPress={() => setFilter(loc)}
          >
            <Text
              style={[
                TYPOGRAPHY.button,
                {
                  color:
                    filter === loc
                      ? COLORS.text.light
                      : COLORS.text.primary,
                },
              ]}
            >
              {loc === 'Udupi' ? 'Udupi Paryaya' : 'Sode Kshetra'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No active sevas found</Text>
            <Text style={styles.emptySubtitle}>
              Try another location or search term.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: { padding: SPACING.l, backgroundColor: COLORS.surface },

  searchBar: {
    marginTop: SPACING.m,
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text.primary,
  },

  tabs: {
    flexDirection: 'row',
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  tab: {
    flex: 1,
    paddingVertical: SPACING.s,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: SPACING.xs,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
  },

  list: { padding: SPACING.l },

  card: { marginBottom: SPACING.m },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },

  emptyState: {
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.l,
    alignItems: 'center',
  },

  emptyIcon: { fontSize: 48, marginBottom: SPACING.m },

  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },

  emptySubtitle: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
  },
});
