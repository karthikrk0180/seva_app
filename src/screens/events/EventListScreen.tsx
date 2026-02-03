import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { EVENT_DATA, Event } from './events.data';

export const EventListScreen = () => {
    
  const handleRemind = (event: Event) => {
      Alert.alert('Reminder Set', `You will be notified before ${event.title.en}`);
  };

  const renderItem = ({ item }: { item: Event }) => (
    <Card style={[styles.card, item.isMajor && styles.majorCard]}>
      <View style={styles.dateBox}>
         <Text style={styles.day}>{item.date.split('-')[2]}</Text>
         <Text style={styles.month}>Mar</Text> 
         {/* Simplified month logic for mock */}
      </View>
      
      <View style={styles.details}>
         <Text style={TYPOGRAPHY.h3}>{item.title.en}</Text>
         <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary }]}>{item.tithi.en}</Text>
         <Text style={TYPOGRAPHY.body}>{item.location}</Text>
      </View>

      <TouchableOpacity onPress={() => handleRemind(item)} style={styles.bell}>
        <Text>🔔</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h1}>Upcoming Events</Text>
        <Text style={TYPOGRAPHY.body}>Panchanga & Utsavas</Text>
      </View>

      <FlatList
        data={EVENT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
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
  majorCard: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.primary
  },
  dateBox: {
      alignItems: 'center',
      paddingRight: SPACING.m,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
      marginRight: SPACING.m,
      minWidth: 50
  },
  day: { ...TYPOGRAPHY.h2, color: COLORS.primary },
  month: { ...TYPOGRAPHY.caption, textTransform: 'uppercase' },
  details: { flex: 1 },
  bell: { padding: SPACING.s }
});
