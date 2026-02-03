import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { TimingsWidget } from './components/TimingsWidget';
import { NewsCarousel } from './components/NewsCarousel';

import { Button } from 'src/components/common/Button';
import { ROUTES } from 'src/config';
import { VoiceSearchModal } from 'src/components/common/VoiceSearchModal';
import { SimpleChart } from 'src/components/common/SimpleChart';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [isVoiceVisible, setIsVoiceVisible] = React.useState(false);

  // Mock Data for Chart
  const sevaStats = [
    { x: 'Jan', y: 120 },
    { x: 'Feb', y: 150 },
    { x: 'Mar', y: 180 },
    { x: 'Apr', y: 220 },
  ];

  useEffect(() => {
     // Initialize voice listener if needed or generic search listeners
     return () => {};
  }, []);

  const handleVoiceSearch = () => {
    setIsVoiceVisible(true);
  };

  const onVoiceResult = (text: string) => {
      console.log('Voice Result:', text);
      // Logic to navigate based on text
      setIsVoiceVisible(false);
      // Example: If text contains "Room", navigate to Room Booking
      if (text.toLowerCase().includes('room')) {
          navigation.navigate(ROUTES.SERVICES.ROOM_BOOKING);
      }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={TYPOGRAPHY.caption}>Welcome to</Text>
          <Text style={TYPOGRAPHY.h2}>Sode Matha</Text>
        </View>
        <Button 
            title="🎤" 
            variant="secondary" 
            onPress={handleVoiceSearch} 
            style={{ width: 40, height: 40, paddingHorizontal: 0, borderRadius: 20 }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Swamiji Photos (Placeholder for Banner) */}
        <View style={styles.bannerContainer}>
            <View style={[styles.swamijiPhoto, { backgroundColor: '#FFD54F' }]} />
            <View style={[styles.swamijiPhoto, { backgroundColor: '#FFCA28' }]} />
        </View>

        {/* Quick Actions (Flash Updates) */}
        <View style={styles.flashBar}>
             <Text style={[TYPOGRAPHY.caption, { color: COLORS.text.light }]}>
                📢 Upcoming: Paryaya Mahotsava begins next month!
             </Text>
        </View>

        {/* Quick Links */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24, gap: 12 }}>
            <Button 
                title="📅 Events" 
                onPress={() => navigation.navigate(ROUTES.SERVICES.EVENTS)} 
                style={{ flex: 1, backgroundColor: COLORS.secondary }}
            />
            <Button 
                title="🏨 Rooms" 
                onPress={() => navigation.navigate(ROUTES.SERVICES.ROOM_BOOKING)} 
                style={{ flex: 1, backgroundColor: COLORS.secondary }} 
            />
        </View>

        <View style={styles.section}>

            <TimingsWidget />
        </View>

        <View style={styles.section}>
            <SimpleChart data={sevaStats} title="Monthly Sevas" type="bar" />
        </View>

        <View style={styles.section}>
            <NewsCarousel />
        </View>

        {/* Social Links / Footer */}
        <View style={styles.footer}>
            <Text style={TYPOGRAPHY.caption}>@sodematha</Text>
            {/* Icons would go here */}
        </View>
      </ScrollView>

      <VoiceSearchModal 
        visible={isVoiceVisible} 
        onClose={() => setIsVoiceVisible(false)} 
        onResult={onVoiceResult} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.background,
  },
  scrollContent: { paddingBottom: SPACING.xxl },
  bannerContainer: {
    flexDirection: 'row',
    height: 180,
    marginBottom: SPACING.m,
  },
  swamijiPhoto: {
    flex: 1,
    backgroundColor: '#CCC', // Placeholder
  },
  flashBar: {
    backgroundColor: COLORS.accent,
    padding: SPACING.s,
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  section: {
    marginBottom: SPACING.l,
  },
  footer: {
    padding: SPACING.l,
    alignItems: 'center',
  },
});
