import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { GURU_DATA } from './history.data';
import { Guru } from 'src/models/guru.model';
import { ROUTES } from 'src/config';

export const GuruListScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: Guru }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate(ROUTES.HISTORY.GURU_DETAIL, { id: item.id })}
    >
      <View style={styles.avatar}>
         <Text style={{ fontSize: 24 }}>🧘</Text>
      </View>
      <View style={styles.info}>
        <Text style={TYPOGRAPHY.h3}>{item.name.en}</Text>
        <Text style={TYPOGRAPHY.caption}>{item.period}</Text>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary }]}>
            {item.orderInLineage}{ getOrdinal(item.orderInLineage) } Peetadhipathi
        </Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h2}>Guru Parampara</Text>
        <Text style={TYPOGRAPHY.body}>Lineage of Sode Matha</Text>
      </View>
      
      <FlatList
        data={GURU_DATA}
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
  header: { padding: SPACING.l, backgroundColor: COLORS.surface },
  list: { padding: SPACING.l },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  info: { flex: 1 },
});
