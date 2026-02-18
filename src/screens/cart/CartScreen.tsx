import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useCartStore } from 'src/store/cart.store';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Card } from 'src/components/common/Card';
import { ROUTES } from 'src/config';
import { Seva } from 'src/models/seva.model';

export const CartScreen = () => {
    const navigation = useNavigation<any>();
    const { items, removeFromCart, totalAmount, clearCart } = useCartStore();

    const handleCheckout = () => {
        Alert.alert('Checkout', 'Proceed to payment gateway? (Mock)', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Pay Now',
                onPress: () => {
                    Alert.alert('Success', 'Payment Successful! Booking Confirmed.');
                    clearCart();
                    navigation.navigate(ROUTES.TABS.SEVA);
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: Seva }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.info}>
                    <Text style={TYPOGRAPHY.h3}>{item.titleEn}</Text>
                    <Text style={TYPOGRAPHY.caption}>{item.titleKn}</Text>
                    <Text style={[TYPOGRAPHY.body, { color: COLORS.primary, marginTop: SPACING.xs }]}>
                        ₹{item.amount}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                    <MaterialIcons name="delete-outline" size={24} color={COLORS.text.error} />
                </TouchableOpacity>
            </View>
        </Card>
    );

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <View style={{ opacity: 1 }}>
                        <MaterialIcons
                            name="shopping-cart"
                            size={64}
                            color="#000"
                        />
                    </View>


                    <Text style={[TYPOGRAPHY.h2, { marginVertical: SPACING.m }]}>Your Cart is Empty</Text>
                    <Text style={[TYPOGRAPHY.body, { textAlign: 'center', marginBottom: SPACING.xl, color: COLORS.text.secondary }]}>
                        Looks like you haven't added any Sevas yet.
                    </Text>
                    <Button
                        title="Browse Sevas"
                        onPress={() => navigation.navigate(ROUTES.TABS.SEVA)}
                        variant="primary"
                        style={{ width: 200 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={TYPOGRAPHY.h1}>My Cart</Text>
                <Text style={TYPOGRAPHY.body}>{items.length} items</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={TYPOGRAPHY.h3}>Total</Text>
                    <Text style={[TYPOGRAPHY.h2, { color: COLORS.primary }]}>₹{totalAmount()}</Text>
                </View>
                <Button
                    title="Proceed to Pay"
                    onPress={handleCheckout}
                    variant="primary"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        padding: SPACING.l,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    list: { padding: SPACING.l },
    card: { marginBottom: SPACING.m },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: { flex: 1 },
    deleteButton: {
        padding: SPACING.s,
    },
    footer: {
        padding: SPACING.l,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...SHADOWS.card,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    }
});
