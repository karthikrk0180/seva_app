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

import { AdminStackParamList } from 'src/navigation/BottomTabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { EventCreateRequest } from 'src/models/event.model';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native';


const eventSchema = yup.object().shape({
    titleEn: yup
        .string()
        .required('Title (English) is required'),

    titleKn: yup
        .string()
        .optional(),

    eventDate: yup
        .string()
        .required('Event Date is required')
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            'Event Date must be in YYYY-MM-DD format'
        ),

    tithiEn: yup
        .string()
        .optional(),

    tithiKn: yup
        .string()
        .optional(),

    location: yup
        .string()
        .optional(),

    isMajor: yup
        .boolean()
        .default(false),

    isActive: yup
        .boolean()
        .default(true),

    imageUrl: yup
        .string()
        .optional(),
});


type FormData = yup.InferType<typeof eventSchema>;

export const EventFormScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<AdminStackParamList, 'EventForm' | any>>();
    const { addEvent, updateEvent, events } = useAdmin();

    const editId = (route.params as any)?.eventId;
    const isEditing = !!editId;

    const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(eventSchema) as any
    });

    useEffect(() => {
        if (isEditing) {
            console.log('editId', editId);
            // console.log('gurus', gurus);
            const event = events.find(e => e.id === editId);
            if (event) {
                setValue('titleEn', event.titleEn);
                setValue('titleKn', event.titleKn);
                setValue('eventDate', event.eventDate);
                setValue('tithiEn', event.tithiEn);
                setValue('tithiKn', event.tithiKn);
                setValue('location', event.location);
                setValue('isMajor', event.isMajor ?? false);
                setValue('isActive', event.isActive ?? true);
                setValue('imageUrl', event.imageUrl);
            }
        }
    }, [editId, events, setValue, isEditing]);

    const onSubmit = async (data: FormData) => {
        try {
            const eventData: EventCreateRequest = {
                titleEn: data.titleEn,
                titleKn: data.titleKn,
                eventDate: data.eventDate,
                tithiEn: data.tithiEn,
                tithiKn: data.tithiKn,
                location: data.location,
                isMajor: data.isMajor,
                isActive: data.isActive,
                imageUrl: data.imageUrl,
            };

            if (isEditing) {
                await updateEvent(editId, eventData);
                Alert.alert('Success', 'Event updated successfully');
            } else {
                await addEvent(eventData);
                Alert.alert('Success', 'Event added successfully');
            }
            navigation.goBack();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save Event';
            Alert.alert('Error', errorMessage);
            console.error('Event save error:', error);
        }
    };

    const [isUploading, setIsUploading] = React.useState(false);

    const pickImage = async (onChange: (uri: string) => void) => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.7,
                maxWidth: 1280,
                maxHeight: 720,
            });

            if (result.didCancel) {
                return;
            }

            if (result.errorCode) {
                Alert.alert('Error', result.errorMessage || 'Failed to pick image');
                return;
            }

            if (result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                if (!uri) return;

                setIsUploading(true);

                try {
                    // upload to server/cloud here
                    const uploadedUrl = await uploadImage(uri);
                    onChange(uploadedUrl);
                } catch (uploadError) {
                    Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
                    console.error('Image upload error:', uploadError);
                } finally {
                    setIsUploading(false);
                }
            }
        } catch (error) {
            console.error('Pick image error:', error);
            Alert.alert('Error', 'An error occurred while picking the image');
        }
    };

    const uploadImage = async (uri: string) => {
        // NOTE: This currently uses placeholders for Cloudinary.
        // The user should update these with real values or moved to a central config/service.
        const CLOUD_NAME = 'dtimrvqqq';
        const UPLOAD_PRESET = 'first_project';

        const formData = new FormData();
        const filename = uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', {
            uri,
            name: filename,
            type,
        } as any);

        formData.append('upload_preset', UPLOAD_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!res.ok) {
            throw new Error(`Upload failed with status ${res.status}`);
        }

        const data = await res.json();
        return data.secure_url;
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
                        {isEditing ? 'Edit Event' : 'Add New Event'}
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
                    name="eventDate"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Event Date (YYYY-MM-DD)"
                            value={value}
                            onChangeText={onChange}
                            error={errors.eventDate?.message}
                            placeholder="YYYY-MM-DD"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="tithiEn"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Tithi (English)" value={value} onChangeText={onChange} error={errors.tithiEn?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="tithiKn"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Tithi (Kannada)" value={value} onChangeText={onChange} error={errors.tithiKn?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, value } }) => (
                        <Input label="Location" value={value} onChangeText={onChange} error={errors.location?.message} />
                    )}
                />

                {/* Checkbox for isMajor and isActive could be added here, but Input doesn't support boolean directly. 
                    For now, assuming standard Input or custom Switch/Checkbox needed.
                    I'll add simple switch-like toggles using Pressables if Input is text-only.
                */}
                {/* TODO: Add proper boolean input components. For now using text inputs for boolean as placeholder or skipping?
                    The schema has defaults, so it might be okay. But usually we want controls.
                    I'll add basic toggle buttons for boolean fields.
                 */}
                <View style={styles.switchContainer}>
                    <Controller
                        control={control}
                        name="isMajor"
                        render={({ field: { onChange, value } }) => (
                            <Pressable onPress={() => onChange(!value)} style={[styles.checkbox, value && styles.checkboxChecked]}>
                                <Text style={styles.checkboxLabel}>{value ? 'Major Event' : 'Minor Event'}</Text>
                            </Pressable>
                        )}
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Controller
                        control={control}
                        name="isActive"
                        render={({ field: { onChange, value } }) => (
                            <Pressable onPress={() => onChange(!value)} style={[styles.checkbox, value && styles.checkboxChecked]}>
                                <Text style={styles.checkboxLabel}>{value ? 'Active' : 'Inactive'}</Text>
                            </Pressable>
                        )}
                    />
                </View>

                <Controller
                    control={control}
                    name="imageUrl"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.imageSection}>
                            <Text style={styles.sectionLabel}>Event Image</Text>
                            <Pressable
                                onPress={() => pickImage(onChange)}
                                style={[styles.imagePicker, value ? styles.imagePickerWithImage : null]}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Text style={styles.imagePickerText}>Uploading...</Text>
                                ) : value ? (
                                    <Image
                                        source={{ uri: value }}
                                        style={styles.previewImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.placeholderContainer}>
                                        <MaterialIcons name="add-a-photo" size={32} color={COLORS.text.secondary} />
                                        <Text style={styles.imagePickerText}>Add Event Image</Text>
                                    </View>
                                )}
                                {value && !isUploading && (
                                    <View style={styles.imageOverlay}>
                                        <MaterialIcons name="edit" size={20} color={COLORS.surface} />
                                        <Text style={styles.overlayText}>Change Image</Text>
                                    </View>
                                )}
                            </Pressable>
                            {errors.imageUrl && (
                                <Text style={styles.errorText}>{errors.imageUrl.message}</Text>
                            )}
                        </View>
                    )}
                />



                <View style={styles.buttonContainer}>
                    <Button
                        title={isEditing ? "Update Event" : "Create Event"}
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
    switchContainer: {
        marginVertical: SPACING.s,
    },
    checkbox: {
        padding: SPACING.m,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    checkboxLabel: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.primary,
    },
    imageSection: {
        marginVertical: SPACING.m,
    },
    sectionLabel: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        marginBottom: SPACING.s,
        color: COLORS.text.primary,
    },
    imagePicker: {
        height: 180,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imagePickerWithImage: {
        borderStyle: 'solid',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    imagePickerText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text.secondary,
        marginTop: SPACING.s,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        padding: SPACING.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: COLORS.surface,
        fontSize: 12,
        marginLeft: SPACING.xs,
    },
    errorText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.text.error,
        marginTop: SPACING.xs,
    },
});
