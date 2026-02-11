import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { ROUTES } from 'src/config';
import { Button } from 'src/components/common/Button';
import { Guru } from 'src/models/guru.model';
import { guruService } from 'src/services/guru.service';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from 'src/navigation/types';

type GuruDetailNavigationProp = NativeStackNavigationProp<
  HistoryStackParamList,
  typeof ROUTES.HISTORY.GURU_DETAIL
>;

export const GuruDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<GuruDetailNavigationProp>();
  const { id } = route.params || {};

  const [guru, setGuru] = React.useState<Guru | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [nextGuruId, setNextGuruId] = React.useState<string | null>(null);
  const [prevGuruId, setPrevGuruId] = React.useState<string | null>(null);

  

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [currentGuru, allGurus] = await Promise.all([
          guruService.getGuruById(id),
          guruService.getGurus()
        ]);

        setGuru(currentGuru);

        // Calculate Next/Prev
        if (currentGuru && allGurus.length > 0) {
          const sortedGurus = allGurus.sort((a, b) => a.orderNum - b.orderNum);
          const currentIndex = sortedGurus.findIndex(g => g.id === currentGuru.id);

          if (currentIndex !== -1) {
            setPrevGuruId(currentIndex > 0 ? sortedGurus[currentIndex - 1].id : null);
            setNextGuruId(currentIndex < sortedGurus.length - 1 ? sortedGurus[currentIndex + 1].id : null);
          }
        }

      } catch (error) {
        console.error('Failed to load guru details', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const navigateToGuru = (guruId: string | null) => {
  if (!guruId) return;

  navigation.navigate(ROUTES.HISTORY.GURU_DETAIL, {
    id: guruId,
  });
};


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!guru) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Guru not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          {guru.imageUrl ? (
            <Image source={{ uri: guru.imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={{ fontSize: 48 }}>🧘</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={TYPOGRAPHY.h1}>{guru.nameEn}</Text>
          <Text style={[TYPOGRAPHY.h3, { color: COLORS.text.secondary }]}>{guru.nameKn}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.tag}>{guru.period}</Text>
            <Text style={styles.tag}>Brindavana: {guru.location}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={[TYPOGRAPHY.body, { lineHeight: 24 }]}>{guru.descEn}</Text>

          <View style={styles.divider} />

          <View style={styles.footerNav}>
            <Button
              title="Previous"
              variant="text"
              onPress={() => navigateToGuru(prevGuruId)}
              disabled={!prevGuruId}
            />
            <Button
              title="Next Guru"
              variant="outline"
              onPress={() => navigateToGuru(nextGuruId)}
              disabled={!nextGuruId}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: SPACING.xxl },
  imageContainer: { height: 300, backgroundColor: COLORS.surface },
  placeholderImage: { flex: 1, backgroundColor: '#CCC' }, // Gray placeholder
  content: { padding: SPACING.l, marginTop: -20, backgroundColor: COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.s, marginTop: SPACING.m },
  tag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...TYPOGRAPHY.caption
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.l },
  sectionTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.s },
  footerNav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.l }
});
