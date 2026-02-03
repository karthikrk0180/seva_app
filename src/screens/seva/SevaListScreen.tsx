import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { SEVA_DATA } from './seva.data';
import { ROUTES } from 'src/config';

type LocationFilter = 'Sode' | 'Udupi';

export const SevaListScreen = () => {
  const navigation = useNavigation<any>();
  const [filter, setFilter] = useState<LocationFilter>('Sode');
  const [searchText, setSearchText] = useState('');

  const filteredData = SEVA_DATA.filter(
    (item) =>
      item.location === filter &&
      item.title.en.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: typeof SEVA_DATA[0] }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.SEVA.SEVA_BOOKING, { sevaId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={TYPOGRAPHY.h3}>{item.title.en}</Text>
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.primary }]}>₹{item.amount}</Text>
      </View>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.text.secondary }]}>
        {item.description.en}
      </Text>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search & Header */}
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

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {(['Sode', 'Udupi'] as LocationFilter[]).map((loc) => (
            <TouchableOpacity
                key={loc}
                style={[styles.tab, filter === loc && styles.activeTab]}
                onPress={() => setFilter(loc)}
            >
                <Text style={[
                    TYPOGRAPHY.button, 
                    { color: filter === loc ? COLORS.text.light : COLORS.text.primary }
                ]}>
                    {loc === 'Udupi' ? 'Udupi Paryaya' : 'Sode Kshetra'}
                </Text>
            </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.text.secondary }}>
                No Sevas found.
            </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
      borderBottomColor: COLORS.border
  },
  tab: {
      flex: 1,
      paddingVertical: SPACING.s,
      alignItems: 'center',
      borderRadius: 20,
      marginHorizontal: SPACING.xs
  },
  activeTab: {
      backgroundColor: COLORS.primary
  },
  list: { padding: SPACING.l },
  card: { marginBottom: SPACING.m },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
});
