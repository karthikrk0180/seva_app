import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Input } from 'src/components/common/Input';
import { Button } from 'src/components/common/Button';
import { useAdmin } from 'src/context/AdminContext';
import { Seva } from 'src/models/seva.model';
import { AdminStackParamList } from 'src/navigation/BottomTabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const schema = yup.object().shape({
    titleEn: yup.string().required('Title (English) is required'),
    titleKn: yup.string().required('Title (Kannada) is required'),
    descEn: yup.string().required('Description (English) is required'),
    descKn: yup.string().required('Description (Kannada) is required'),
    amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
    location: yup.string().oneOf(['Sode', 'Udupi']).required('Location is required'),
    isActive: yup.boolean().required(),
    reqGothra: yup.boolean().required(),
    reqNakshatra: yup.boolean().required(),
});

type FormData = yup.InferType<typeof schema>;

export const SevaFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<AdminStackParamList, 'SevaForm'>>();
    const { addSeva, updateSeva, sevas } = useAdmin();

    const editId = route.params?.sevaId;
    const isEditing = !!editId;

    const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            isActive: true,
            reqGothra: true,
            reqNakshatra: false,
            location: 'Sode',
        }
    });

    useEffect(() => {
        if (isEditing) {
            const seva = sevas.find(s => s.id === editId);
            if (seva) {
                setValue('titleEn', seva.titleEn);
                setValue('titleKn', seva.titleKn);
                setValue('descEn', seva.descEn);
                setValue('descKn', seva.descKn);
                setValue('amount', seva.amount);
                setValue('isActive', seva.isActive);
                setValue('reqGothra', seva.reqGothra);
                setValue('reqNakshatra', seva.reqNakshatra);
                // explicitly handling location if it exists on the object
                if (seva.location) setValue('location', seva.location);
            }
        }
    }, [editId, sevas, setValue, isEditing]);

    const onSubmit = async (data: FormData) => {
        try {
            const sevaData: any = {
                titleEn: data.titleEn,
                titleKn: data.titleKn,
                descEn: data.descEn,
                descKn: data.descKn,
                amount: data.amount,
                currency: 'INR',
                isActive: data.isActive,
                reqGothra: data.reqGothra,
                reqNakshatra: data.reqNakshatra,
                availableDays: 127, // Default to all days (bitmask 1111111)
                location: data.location,
            };

            if (isEditing) {
                await updateSeva(editId, sevaData);
                Alert.alert('Success', 'Seva updated successfully');
            } else {
                await addSeva(sevaData);
                Alert.alert('Success', 'Seva added successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save Seva');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
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

                    <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.l, marginRight: 15 }]}>
                        {isEditing ? 'Edit Seva' : 'Add New Seva'}
                    </Text>
                </View>


                <Controller
                    control={control}
                    name="titleEn"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Title (English)" value={value} onChangeText={onChange} error={errors.titleEn?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="titleKn"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Title (Kannada)" value={value} onChangeText={onChange} error={errors.titleKn?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Amount (₹)"
                            value={value?.toString()}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            error={errors.amount?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="descEn"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Description (English)"
                            value={value}
                            onChangeText={onChange}
                            multiline
                            numberOfLines={3}
                            error={errors.descEn?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="descKn"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Description (Kannada)"
                            value={value}
                            onChangeText={onChange}
                            multiline
                            numberOfLines={3}
                            error={errors.descKn?.message}
                        />
                    )}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title={isEditing ? "Update Seva" : "Create Seva"}
                        onPress={handleSubmit(onSubmit)}
                        isLoading={isSubmitting}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: SPACING.l },
    buttonContainer: { marginTop: SPACING.xl, marginBottom: SPACING.xxl },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
});
