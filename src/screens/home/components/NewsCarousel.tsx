import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Card } from 'src/components/common/Card';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const MOCK_NEWS = [
  { id: 1, title: 'Inauguration of New Guest House', date: '2 days ago' },
  { id: 2, title: 'Aradhana Mahotsava Schedule', date: '1 week ago' },
  { id: 3, title: 'Upcoming Paryaya Preparations', date: '2 weeks ago' },
];

export const NewsCarousel = () => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h3}>Latest Updates</Text>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary }]}>View All</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {MOCK_NEWS.map((item) => (
          <Card key={item.id} style={styles.card} variant="elevated">
            <View style={styles.imagePlaceholder} />
            <View style={styles.content}>
               <Text style={[TYPOGRAPHY.body, styles.title]} numberOfLines={2}>{item.title}</Text>
               <Text style={TYPOGRAPHY.caption}>{item.date}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.s,
  },
  scroll: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: SPACING.m,
    padding: 0,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: SPACING.m,
  },
  title: {
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
});
