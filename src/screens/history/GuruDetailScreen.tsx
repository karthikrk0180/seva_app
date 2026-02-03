import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { GURU_DATA } from './history.data';

export const GuruDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params || {};
  
  const guru = GURU_DATA.find(g => g.id === id);

  if (!guru) {
      return (
          <SafeAreaView style={styles.container}>
              <Text>Guru not found</Text>
          </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
             {/* Placeholder for real image */}
             <View style={styles.placeholderImage} />
        </View>

        <View style={styles.content}>
           <Text style={TYPOGRAPHY.h1}>{guru.name.en}</Text>
           <Text style={[TYPOGRAPHY.h3, { color: COLORS.text.secondary }]}>{guru.name.kn}</Text>
           
           <View style={styles.metaRow}>
              <Text style={styles.tag}>{guru.period}</Text>
              <Text style={styles.tag}>Brindavana: {guru.brindavanaLocation}</Text>
           </View>
           
           <View style={styles.divider} />

           <Text style={styles.sectionTitle}>About</Text>
           <Text style={[TYPOGRAPHY.body, { lineHeight: 24 }]}>{guru.description.en}</Text>
           
           <View style={styles.divider} />
           
           {/* Mock Navigation to Next/Prev */}
           <View style={styles.footerNav}>
                <Button 
                    title="Previous" 
                    variant="text" 
                    onPress={() => {}} 
                    disabled={guru.orderInLineage === 1}
                />
                <Button 
                    title="Next Guru" 
                    variant="outline" 
                    onPress={() => {}} 
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
