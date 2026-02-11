import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdmin } from 'src/context/AdminContext';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { Button } from 'src/components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'src/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Event } from 'src/models/event.model';

export const EventManagementScreen = () => {
    const { events, isLoading, refreshData } = useAdmin();
    const navigation = useNavigation<any>();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await refreshData();
        setIsRefreshing(false);
    };

    const renderItem = ({ item }: { item: Event }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.info}>
                    <Text style={TYPOGRAPHY.h3}>{item.titleEn}</Text>
                    <Text style={TYPOGRAPHY.body}>{item.eventDate}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SERVICES.EVENT_FORM, { eventId: item.id })}>
                        <Text style={{ fontSize: 18 }}>✏️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>

            <View style={styles.header}>

                {/* Row 1 */}
                <View style={styles.headerTopRow}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={22}
                            color={COLORS.primary}
                        />
                    </Pressable>

                    <Text style={[TYPOGRAPHY.h2, styles.headerTitle]}>
                        Manage Events
                    </Text>
                </View>

                {/* Row 2 */}
                <View style={styles.headerButtons}>
                    <Button
                        title="+ Add Event"
                        onPress={() => navigation.navigate(ROUTES.SERVICES.EVENT_FORM)}
                        variant="primary"
                        style={styles.actionButton}
                    />
                </View>

            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={TYPOGRAPHY.body}>
                            {isLoading
                                ? 'Loading Events...'
                                : 'No Events found. Add one to get started.'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.m,
    },

    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTitle: {
        fontSize: 25,
        fontWeight: '600',
        marginRight: 10
    },

    headerButtons: {
        marginTop: SPACING.m,
    },

    actionButton: {
        width: '100%',
    },

    backButton: {
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10,
        backgroundColor: '#e1c7c7ff',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    list: { padding: SPACING.l },
    card: { marginBottom: SPACING.m },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    info: { flex: 1 },
    actions: { flexDirection: 'row', gap: SPACING.m },
    empty: { padding: SPACING.xxl, alignItems: 'center' },
});
