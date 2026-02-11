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
import { GuruCreateRequest } from 'src/models/guru.model';
import { AdminStackParamList } from 'src/navigation/BottomTabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const schema = yup.object().shape({
    nameEn: yup.string().required('Name (English) is required'),
    nameKn: yup.string().required('Name (Kannada) is required'),
    period: yup.string().required('Period is required'),
    location: yup.string().required('Location is required'),
    descEn: yup.string().required('Description (English) is required'),
    descKn: yup.string().required('Description (Kannada) is required'),
    orderNum: yup.number().typeError('Order Number must be a number').required('Order Number is required'),
    imageUrl: yup.string().url('Must be a valid URL'),
});

type FormData = yup.InferType<typeof schema>;

export const GuruFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<AdminStackParamList, 'GuruForm' | any>>();
    const { addGuru, updateGuru, gurus } = useAdmin();

    const editId = (route.params as any)?.guruId;
    const isEditing = !!editId;

    const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            location: 'Sode',
            orderNum: 1,
        }
    });

    useEffect(() => {
        if (isEditing) {
            console.log('editId', editId);
            // console.log('gurus', gurus);
            const guru = gurus.find(g => g.id === editId);
            if (guru) {
                setValue('nameEn', guru.nameEn);
                setValue('nameKn', guru.nameKn);
                setValue('period', guru.period);
                setValue('location', guru.location);
                setValue('descEn', guru.descEn);
                setValue('descKn', guru.descKn);
                setValue('orderNum', guru.orderNum);
                setValue('imageUrl', guru.imageUrl);
            }
        }
    }, [editId, gurus, setValue, isEditing]);

    const onSubmit = async (data: FormData) => {
        try {
            const guruData: GuruCreateRequest = {
                nameEn: data.nameEn,
                nameKn: data.nameKn,
                period: data.period,
                location: data.location,
                descEn: data.descEn || '',
                descKn: data.descKn || '',
                orderNum: data.orderNum,
                imageUrl: data.imageUrl,
            };

            if (isEditing) {
                await updateGuru(editId, guruData);
                Alert.alert('Success', 'Guru updated successfully');
            } else {
                await addGuru(guruData);
                Alert.alert('Success', 'Guru added successfully');
            }
            navigation.goBack();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save Guru';
            Alert.alert('Error', errorMessage);
            console.error('Guru save error:', error);
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

                    <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.s, marginRight: 15 }]}>
                        {isEditing ? 'Edit Guru' : 'Add New Guru'}
                    </Text>
                </View>


                <Controller
                    control={control}
                    name="nameEn"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Name (English)" value={value} onChangeText={onChange} error={errors.nameEn?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="nameKn"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Name (Kannada)" value={value} onChangeText={onChange} error={errors.nameKn?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="period"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Period (e.g. 15th Century)" value={value} onChangeText={onChange} error={errors.period?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Location" value={value} onChangeText={onChange} error={errors.location?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="orderNum"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Order Number"
                            value={value?.toString()}
                            onChangeText={(text) => onChange(parseInt(text) || 0)}
                            keyboardType="numeric"
                            error={errors.orderNum?.message}
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

                {/* <Controller
                    control={control}
                    name="imageUrl"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Image URL" value={value || ''} onChangeText={onChange} error={errors.imageUrl?.message} />
                    )}
                /> */}

                <View style={styles.buttonContainer}>
                    <Button
                        title={isEditing ? "Update Guru" : "Create Guru"}
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
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
