import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from 'src/theme';
import { TimingsWidget } from './components/TimingsWidget';
import { NewsCarousel } from './components/NewsCarousel';

import { Button } from 'src/components/common/Button';
import { ROUTES } from 'src/config';
import { VoiceSearchModal } from 'src/components/common/VoiceSearchModal';
import { SimpleChart } from 'src/components/common/SimpleChart';
import { eventService } from 'src/services/event.service';
import { Event } from 'src/models/event.model';

const LOGO_IMAGE_URI = 'https://res.cloudinary.com/dcgn6ke9j/image/upload/v1771014285/logo_ewzdtu.png';
const VISHWOTHAM_IMAGE_URI = 'https://res.cloudinary.com/dcgn6ke9j/image/upload/v1771014285/Vishwotham_vghrjc.png';
const VISHWAVALLABHA_IMAGE_URI = 'https://res.cloudinary.com/dcgn6ke9j/image/upload/v1771014285/Vishwavallabha_n7jddj.png';

export const Images = {
  Vishwotham: { uri: VISHWOTHAM_IMAGE_URI },
  Vishwavallabha: { uri: VISHWAVALLABHA_IMAGE_URI },
};

const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.22, 90); // caps on large screens
const CARD_WIDTH = width - SPACING.m * 2;

export const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const [isVoiceVisible, setIsVoiceVisible] = useState(false);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Data for Chart
  const sevaStats = [
    { x: 'Jan', y: 120 },
    { x: 'Feb', y: 150 },
    { x: 'Mar', y: 180 },
    { x: 'Apr', y: 220 },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventService.getEvents();
      // Filter active events and maybe sort by date
      const activeEvents = data.filter(e => e.isActive !== false);
      setEvents(activeEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceVisible(true);
  };

  const onVoiceResult = (text: string) => {
    setIsVoiceVisible(false);
    navigation.navigate(ROUTES.SERVICES.SEARCH, { initialQuery: text || undefined });
  };

  const onEventScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveEventIndex(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        {/* Row 1: The three logos/photos */}
        <View style={styles.topHeader}>
          <Image source={Images.Vishwotham} style={styles.swamijiOval} />

          <View style={styles.centerHeader}>
            <Image source={{ uri: LOGO_IMAGE_URI }} style={styles.logoImage} />
            <Text style={styles.mathaTitle}>{t('matha_title')}</Text>
          </View>

          <Image source={Images.Vishwavallabha} style={styles.swamijiOval} />
        </View>

        {/* Row 2: Search Bar with Mic icon */}
        <View style={styles.searchBarContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ROUTES.SERVICES.SEARCH)}
          >
            <Text style={styles.searchBarPlaceholder}>{t('search_placeholder')}</Text>
          </TouchableOpacity>
          <Button
            title="🎤"
            variant="secondary"
            onPress={handleVoiceSearch}
            style={styles.voiceButton}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Upcoming Events Carousel */}
        <View style={styles.carouselContainer}>
          {isLoading ? (
            <View style={[styles.eventCard, { justifyContent: 'center', backgroundColor: COLORS.border }]}>
              <Text style={[TYPOGRAPHY.body, { color: COLORS.text.secondary }]}>Loading Events...</Text>
            </View>
          ) : events.length > 0 ? (
            <>
              <FlatList
                data={events}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onEventScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.SERVICES.EVENT_DETAIL, { event: item })}
                  >
                    <View style={styles.eventCard}>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventDate}>{item.eventDate}</Text>
                        <Text style={styles.eventTitle}>{item.titleEn}</Text>
                        <Text style={styles.eventDesc} numberOfLines={1}>
                          {item.tithiEn || item.location || 'Click for details'}
                        </Text>
                      </View>
                      {item.imageUrl && (
                        <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.pagination}>
                {events.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      activeEventIndex === i ? styles.activeDot : {}
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <View style={[styles.eventCard, { justifyContent: 'center', backgroundColor: COLORS.border }]}>
              <Text style={[TYPOGRAPHY.body, { color: COLORS.text.secondary }]}>No upcoming events</Text>
            </View>
          )}
        </View>

        {/* Quick Links */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24, gap: 12 }}>
          <Button
            title={`📅 ${t('events')}`}
            onPress={() => navigation.navigate(ROUTES.SERVICES.EVENTS)}
            style={{ flex: 1, backgroundColor: COLORS.secondary }}
          />
          <Button
            title={`🏨 ${t('rooms')}`}
            onPress={() => navigation.navigate(ROUTES.SERVICES.ROOM_BOOKING)}
            style={{ flex: 1, backgroundColor: COLORS.secondary }}
          />
        </View>

        <View style={styles.section}>
          <TimingsWidget />
        </View>

        <View style={styles.section}>
          <SimpleChart data={sevaStats} title={t('monthly_sevas')} type="bar" />
        </View>

        <View style={styles.section}>
          <NewsCarousel />
        </View>

        {/* Quick Navigation Footer (Logos) */}
        <View style={styles.quickNavFooter}>
          <Text style={styles.sectionTitle}>{t('quick_access')}</Text>
          <View style={styles.quickNavGrid}>
            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => navigation.navigate(ROUTES.TABS.HOME)}
            >
              <View style={[styles.navLogo, { backgroundColor: '#E3F2FD' }]}>
                <Text style={{ fontSize: 24 }}>🏠</Text>
              </View>
              <Text style={styles.navLabel}>{t('nav.home')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => navigation.navigate(ROUTES.TABS.HISTORY)}
            >
              <View style={[styles.navLogo, { backgroundColor: '#F3E5F5' }]}>
                <Text style={{ fontSize: 24 }}>📜</Text>
              </View>
              <Text style={styles.navLabel}>{t('nav.history')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => navigation.navigate(ROUTES.TABS.SEVA)}
            >
              <View style={[styles.navLogo, { backgroundColor: '#E8F5E9' }]}>
                <Text style={{ fontSize: 24 }}>🙏</Text>
              </View>
              <Text style={styles.navLabel}>{t('nav.seva')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => navigation.navigate(ROUTES.TABS.PROFILE)}
            >
              <View style={[styles.navLogo, { backgroundColor: '#FFF3E0' }]}>
                <Text style={{ fontSize: 24 }}>👤</Text>
              </View>
              <Text style={styles.navLabel}>{t('nav.profile')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavItem}
              onPress={() => navigation.navigate(ROUTES.TABS.MORE)}
            >
              <View style={[styles.navLogo, { backgroundColor: '#F5F5F5' }]}>
                <Text style={{ fontSize: 24 }}>⚙️</Text>
              </View>
              <Text style={styles.navLabel}>{t('nav.more')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Links / Footer */}
        <View style={styles.footer}>
          <Text style={TYPOGRAPHY.caption}>@sodematha</Text>
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
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  centerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
  },
  searchBarPlaceholder: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  swamijiOval: {
    width: '20%',
    aspectRatio: 3 / 4,
    borderRadius: 999,
    resizeMode: 'cover',
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    resizeMode: 'contain',
  },
  mathaTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    color: '#E65100',
    fontWeight: '800',
  },
  voiceButton: {
    width: '15%',
    height: '10%',
    paddingHorizontal: 0,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
  },
  scrollContent: { paddingBottom: SPACING.xl },
  carouselContainer: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  eventCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.m,
    padding: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  eventInfo: {
    flex: 1,
  },
  eventDate: {
    ...TYPOGRAPHY.label,
    color: 'rgba(255,255,255,0.8)'
  },
  eventTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.light,
    fontSize: 18,
  },
  eventDesc: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.9)',
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: SPACING.s,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.s,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  activeDot: {
    width: 16,
    backgroundColor: COLORS.primary,
  },
  section: {
    marginBottom: SPACING.l,
  },
  footer: {
    padding: SPACING.l,
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  quickNavFooter: {
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.m,
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOWS.card,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  quickNavGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  quickNavItem: {
    alignItems: 'center',
    width: '18%',
  },
  navLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  navLabel: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
});
