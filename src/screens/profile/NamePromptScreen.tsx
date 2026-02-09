import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { useAuthStore } from 'src/store/auth.store';
import { userService } from 'src/services/user.service';
import { logger } from 'src/services/logger.service';

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
});

type FormData = yup.InferType<typeof schema>;

export const NamePromptScreen = () => {
    const { user, refreshUserProfile } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            firstName: '',
            lastName: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!user?.phoneNumber) {
            Alert.alert('Error', 'No user logged in');
            return;
        }

        setIsSaving(true);
        try {
            await userService.updateProfileByPhone(user.phoneNumber, {
                firstName: data.firstName,
                lastName: data.lastName,
            });

            // Refresh user profile to update the store
            await refreshUserProfile();

            logger.info('Name saved successfully');
        } catch (error) {
            logger.error('Failed to save name', error);
            Alert.alert('Error', 'Failed to save name. Please try again.');
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                <Text style={[TYPOGRAPHY.h2, styles.title]}>Welcome!</Text>
                <Text style={[TYPOGRAPHY.body, styles.subtitle]}>
                    Please enter your name to continue using the app.
                </Text>

                {/* First Name */}
                <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="First Name *"
                            value={value}
                            onChangeText={onChange}
                            error={errors.firstName?.message}
                            autoFocus
                        />
                    )}
                />

                {/* Last Name */}
                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Last Name *"
                            value={value}
                            onChangeText={onChange}
                            error={errors.lastName?.message}
                        />
                    )}
                />

                {/* Continue Button */}
                <Button
                    title="Continue"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={isSaving}
                    style={styles.continueButton}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    title: {
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: SPACING.xl,
        textAlign: 'center',
        color: COLORS.text.secondary,
    },
    continueButton: {
        marginTop: SPACING.l,
    },
});
