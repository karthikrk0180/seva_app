import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { searchService } from 'src/services/search.service';
import type { SearchResult, SearchResultKind } from 'src/types/search.types';
import type { HomeStackParamList } from 'src/navigation/BottomTabs';
import { ROUTES } from 'src/config';
const SECTION_LABELS: Record<SearchResultKind, string> = {
  page: 'Pages',
  event: 'Events',
  seva: 'Sevas',
  guru: 'Parampara',
};

const kindIcon: Record<SearchResultKind, string> = {
  page: 'link',
  event: 'event',
  seva: 'volunteer-activism',
  guru: 'auto-stories',
};

function getSectionOrder(kind: SearchResultKind): number {
  const order: SearchResultKind[] = ['page', 'event', 'seva', 'guru'];
  return order.indexOf(kind);
}

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<HomeStackParamList, typeof ROUTES.SERVICES.SEARCH>>();
  const initialQuery = route.params?.initialQuery ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const list = await searchService.getSearchResults(q);
      setResults(list);
    } catch (e) {
      console.warn('Search error', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), searchService.debounceMs);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      Keyboard.dismiss();
      if ('stackRoute' in item && item.stackRoute) {
        navigation.navigate(item.stackRoute.name, item.stackRoute.params);
      } else if ('tabRoute' in item && item.tabRoute) {
        const { tab, screen, params } = item.tabRoute;
        navigation.navigate(tab, { screen, params });
      }
      navigation.goBack();
    },
    [navigation]
  );

  const renderItem = ({ item }: { item: SearchResult }) => {
    const icon = kindIcon[item.kind];
    return (
      <Pressable
        style={({ pressed }) => [styles.resultRow, pressed && styles.resultRowPressed]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.resultIcon}>
          <MaterialIcons name={icon as any} size={22} color={COLORS.primary} />
        </View>
        <View style={styles.resultText}>
          <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
          ) : null}
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.text.secondary} />
      </Pressable>
    );
  };

  const sections = results.reduce<{ kind: SearchResultKind; data: SearchResult[] }[]>((acc, item) => {
    const existing = acc.find((s) => s.kind === item.kind);
    if (existing) existing.data.push(item);
    else acc.push({ kind: item.kind, data: [item] });
    return acc;
  }, []);
  sections.sort((a, b) => getSectionOrder(a.kind) - getSectionOrder(b.kind));

  const flatData = sections.flatMap((s) => [
    { type: 'header' as const, key: `h-${s.kind}`, kind: s.kind },
    ...s.data.map((r) => ({ type: 'result' as const, key: `${r.kind}-${r.id}`, result: r })),
  ]);

  const renderListItem = ({ item }: { item: typeof flatData[0] }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{SECTION_LABELS[item.kind]}</Text>
        </View>
      );
    }
    return renderItem({ item: item.result });
  };

  const emptyMessage = hasSearched && !loading
    ? (query.trim() ? 'No results. Try a different search.' : 'Type to search Sevas, Events, or Parampara.')
    : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search for Seva, Event, or Priest..."
          placeholderTextColor={COLORS.text.secondary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(i) => i.key}
          renderItem={renderListItem}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            emptyMessage ? (
              <View style={styles.emptyWrap}>
                <MaterialIcons name="search-off" size={48} color={COLORS.text.secondary} />
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.s,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.m,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.l,
    paddingBottom: SPACING.xs,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  resultRowPressed: {
    backgroundColor: COLORS.border,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFDBC9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  resultSubtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginTop: SPACING.m,
    textAlign: 'center',
  },
});
