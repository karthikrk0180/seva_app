import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdmin } from 'src/context/AdminContext';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Card } from 'src/components/common/Card';
import { Button } from 'src/components/common/Button';
import { useNavigation } from '@react-navigation/native';

export const SevaManagementScreen = () => {
    const { sevas, toggleSevaStatus, deleteSeva } = useAdmin();
    const navigation = useNavigation<any>();

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            'Delete Seva',
            `Are you sure you want to delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteSeva(id) },
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.info}>
                    <Text style={TYPOGRAPHY.h3}>{item.title.en}</Text>
                    <Text style={[TYPOGRAPHY.body, { color: COLORS.primary }]}>₹{item.amount}</Text>
                </View>
                <View style={styles.actions}>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>{item.isActive ? 'Active' : 'Inactive'}</Text>
                        <Switch
                            value={item.isActive}
                            onValueChange={() => toggleSevaStatus(item.id)}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                        />
                    </View>
                    <View style={styles.iconButtons}>
                        <TouchableOpacity onPress={() => navigation.navigate('SevaForm', { sevaId: item.id })}>
                            <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id, item.title.en)}>
                            <Text style={styles.deleteIcon}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={TYPOGRAPHY.h2}>Manage Sevas</Text>
                <Button
                    title="+ Add Seva"
                    onPress={() => navigation.navigate('SevaForm')}
                    variant="primary"
                    style={styles.addButton}
                />
            </View>

            <FlatList
                data={sevas}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={TYPOGRAPHY.body}>No Sevas found. Add one to get started.</Text>
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
    actions: { alignItems: 'flex-end', gap: SPACING.s },
    toggleContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
    toggleLabel: { ...TYPOGRAPHY.caption, fontSize: 10 },
    iconButtons: { flexDirection: 'row', gap: SPACING.m, marginTop: SPACING.xs },
    editIcon: { fontSize: 18 },
    deleteIcon: { fontSize: 18 },
    empty: { padding: SPACING.xxl, alignItems: 'center' },
});
