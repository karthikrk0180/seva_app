import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from 'src/theme';
import { HomeStackParamList } from 'src/navigation/BottomTabs';
import { ROUTES } from 'src/config';

const { width } = Dimensions.get('window');

export const EventDetailScreen = () => {
    const route = useRoute<RouteProp<HomeStackParamList, typeof ROUTES.SERVICES.EVENT_DETAIL>>();
    const navigation = useNavigation();
    const { event } = route.params;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView bounces={false} contentContainerStyle={styles.scrollContent}>
                {/* Header / Image Section */}
                <View style={styles.imageContainer}>
                    {event.imageUrl ? (
                        <Image source={{ uri: event.imageUrl }} style={styles.image} />
                    ) : (
                        <View style={[styles.image, styles.placeholderImage]}>
                            <MaterialIcons name="event" size={80} color={COLORS.text.secondary} style={{ opacity: 0.3 }} />
                        </View>
                    )}

                    {/* Back Button Overlay */}
                    <Pressable
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.text.primary} />
                    </Pressable>

                    {event.isMajor && (
                        <View style={styles.majorBadge}>
                            <Text style={styles.majorText}>MAJOR EVENT</Text>
                        </View>
                    )}
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <Text style={styles.date}>{event.eventDate}</Text>
                    <Text style={styles.title}>{event.titleEn}</Text>
                    {event.titleKn && <Text style={styles.titleKn}>{event.titleKn}</Text>}

                    <View style={styles.divider} />

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                        {event.tithiEn && (
                            <View style={styles.detailItem}>
                                <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Tithi</Text>
                                    <Text style={styles.detailValue}>{event.tithiEn}</Text>
                                    {event.tithiKn && <Text style={styles.detailValueKn}>{event.tithiKn}</Text>}
                                </View>
                            </View>
                        )}

                        {event.location && (
                            <View style={styles.detailItem}>
                                <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Location</Text>
                                    <Text style={styles.detailValue}>{event.location}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Description Placeholder (as it's not in the current model) */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>About the Event</Text>
                        <Text style={styles.description}>
                            This event is organized by Sode Sri Vadiraja Matha. Please join us for the celebrations and seek the blessings of Lord Krishna and Bhavisameera Sri Vadiraja Teertharu.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    scrollContent: {
        paddingBottom: SPACING.xl,
    },
    imageContainer: {
        width: width,
        height: width * 0.75,
        backgroundColor: COLORS.background,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: SPACING.m,
        left: SPACING.m,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.card,
    },
    majorBadge: {
        position: 'absolute',
        bottom: SPACING.m,
        right: SPACING.m,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: 4,
    },
    majorText: {
        color: COLORS.surface,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    content: {
        padding: SPACING.l,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        backgroundColor: COLORS.surface,
    },
    date: {
        ...TYPOGRAPHY.label,
        color: COLORS.primary,
        fontWeight: '700',
        marginBottom: 4,
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    titleKn: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text.secondary,
        marginBottom: SPACING.m,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.m,
    },
    detailsGrid: {
        gap: SPACING.l,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.m,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text.secondary,
        marginBottom: 2,
    },
    detailValue: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.primary,
        fontWeight: '600',
    },
    detailValueKn: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
        fontSize: 14,
    },
    descriptionSection: {
        marginTop: SPACING.xl,
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.s,
    },
    description: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
        lineHeight: 24,
    },
});
