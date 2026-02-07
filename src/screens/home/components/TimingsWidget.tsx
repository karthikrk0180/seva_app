import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'src/components/common/Card';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';

type Location = 'Sode' | 'Udupi';

export const TimingsWidget = () => {
  const [activeTab, setActiveTab] = useState<Location>('Sode');

  const TIMINGS = {
    Sode: [
      { label: 'Morning Darshan', time: '5:00 AM - 8:30 AM' },
      { label: 'Mahapooja', time: '11:00 AM' },
      { label: 'Prasada', time: '12:30 PM' },
      { label: 'Evening', time: '5:00 PM - 7:30 PM' },
    ],
    Udupi: [
      { label: 'Nirmalya Visarjana', time: '5:30 AM' },
      { label: 'Mahapooja', time: '10:00 AM' },
      { label: 'Chamara Seva', time: '7:00 PM' },
    ],
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={TYPOGRAPHY.h3}>Darshan Timings</Text>
        <View style={styles.tabs}>
          {(['Sode', 'Udupi'] as Location[]).map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[styles.tab, activeTab === loc && styles.activeTab]}
              onPress={() => setActiveTab(loc)}
            >
              <Text
                style={[
                  TYPOGRAPHY.caption,
                  styles.tabText,
                  activeTab === loc && styles.activeTabText,
                ]}
              >
                {loc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {TIMINGS[activeTab].map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={TYPOGRAPHY.body}>{item.label}</Text>
            <Text style={[TYPOGRAPHY.body, { fontWeight: '600' }]}>{item.time}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0, overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: 8, padding: 2 },
  tab: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6 },
  activeTab: { backgroundColor: COLORS.surface, elevation: 2 },
  tabText: { fontWeight: '600' },
  activeTabText: { color: COLORS.primary },
  list: { padding: SPACING.m },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
});
