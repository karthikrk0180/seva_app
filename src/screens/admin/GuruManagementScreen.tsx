import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdmin } from 'src/context/AdminContext';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { Button } from 'src/components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'src/config';

export const GuruManagementScreen = () => {
    const { gurus, isLoading, refreshData } = useAdmin();
    const navigation = useNavigation<any>();
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setIsRefreshing(true);
        await refreshData();
        setIsRefreshing(false);
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.info}>
                    <Text style={TYPOGRAPHY.h3}>{item.nameEn}</Text>
                    <Text style={TYPOGRAPHY.body}>{item.period}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SERVICES.GURU_FORM, { guruId: item.id })}>
                        <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={TYPOGRAPHY.h2}>Manage Gurus</Text>
                <Button
                    title="+ Add Guru"
                    onPress={() => navigation.navigate(ROUTES.SERVICES.GURU_FORM)}
                    variant="primary"
                    style={styles.addButton}
                />
            </View>

            <FlatList
                data={gurus}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={TYPOGRAPHY.body}>
                            {isLoading ? 'Loading Gurus...' : 'No Gurus found. Add one to get started.'}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.l,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    addButton: { paddingHorizontal: SPACING.m, height: 40 },
    list: { padding: SPACING.l },
    card: { marginBottom: SPACING.m },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    info: { flex: 1 },
    actions: { flexDirection: 'row', gap: SPACING.m },
    editIcon: { fontSize: 18 },
    empty: { padding: SPACING.xxl, alignItems: 'center' },
});
