import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { Guru } from 'src/models/guru.model';
import { ROUTES } from 'src/config';
import { guruService } from 'src/services/guru.service';
import { Button } from 'src/components/common/Button';

export const GuruListScreen = () => {
  const navigation = useNavigation<any>();
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGurus = async () => {
      try {
        const data = await guruService.getGurus();
        // Sort by orderNum if available
        const sortedData = data.sort((a, b) => a.orderNum - b.orderNum);
        setGurus(sortedData);
      } catch (err) {
        console.error('Failed to load gurus', err);
      } finally {
        setLoading(false);
      }
    };

    loadGurus();
  }, []);

  const renderItem = ({ item }: { item: Guru }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.HISTORY.GURU_DETAIL, { id: item.id })}
    >
      <View style={styles.cardInner}>
        {/* Helper function or logic to handle image source could go here */}
        <View style={styles.imageSection}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.guruImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={{ fontSize: 24 }}>🧘</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={TYPOGRAPHY.h3}>{item.nameEn}</Text>
          <Text style={TYPOGRAPHY.caption}>{item.period}</Text>
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary }]}>
            {item.orderNum}{getOrdinal(item.orderNum)} Peetadhipathi
          </Text>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h2}>Guru Parampara</Text>
        <Text style={TYPOGRAPHY.body}>Lineage of Sode Matha</Text>
      </View>

      <FlatList
        data={gurus}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: SPACING.l, backgroundColor: COLORS.surface },
  list: { padding: SPACING.l },
  card: { marginBottom: SPACING.m },
  cardInner: { flexDirection: 'row', alignItems: 'center' },
  imageSection: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.m,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  guruImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface
  },
  info: { flex: 1 },
});
