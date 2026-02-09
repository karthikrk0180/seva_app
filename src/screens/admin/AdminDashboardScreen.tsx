import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from 'src/theme';
import { useNavigation } from '@react-navigation/native';

import { ROUTES } from 'src/config';

export const AdminDashboardScreen = () => {
    // const { isLoading } = useAdmin();
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={TYPOGRAPHY.h1}>Admin Dashboard</Text>
                    <Text style={TYPOGRAPHY.body}>Select a module to manage</Text>
                </View>

                <View style={styles.grid}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate(ROUTES.SERVICES.SEVA_MANAGEMENT)}
                    >
                        <Text style={styles.icon}>🙏</Text>
                        <Text style={styles.cardTitle}>Seva CRUD</Text>
                        <Text style={TYPOGRAPHY.caption}>Add, Edit, Toggle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => console.log('Navigate to Room Bookings')}
                    >
                        <Text style={styles.icon}>🏨</Text>
                        <Text style={styles.cardTitle}>Room Requests</Text>
                        <Text style={TYPOGRAPHY.caption}>Approve / Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => console.log('Navigate to Event Management')}
                    >
                        <Text style={styles.icon}>📅</Text>
                        <Text style={styles.cardTitle}>Events</Text>
                        <Text style={TYPOGRAPHY.caption}>Update Calendar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: SPACING.l },
    header: { marginBottom: SPACING.xl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.m },
    card: {
        width: '47%',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        ...SHADOWS.card,
    },
    icon: { fontSize: 32, marginBottom: SPACING.s },
    cardTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.xs },
});
