import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
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
  dob: yup.string(),
  gender: yup.string(),
  gotra: yup.string(),
  nakshatra: yup.string(),
  address: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const ProfileScreen = () => {
  const { user, logout, isLoading: authLoading, refreshUserProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: '',
      gotra: '',
      nakshatra: '',
      address: '',
    },
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('dob', user.dob || '');
      setValue('gender', user.gender || '');
      setValue('gotra', user.gothra || '');
      setValue('nakshatra', user.nakshatra || '');
      setValue('address', user.address || '');
    }
  }, [user, setValue]);

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
        dob: data.dob || undefined,
        gender: data.gender || undefined,
        gotra: data.gotra || undefined,
        nakshatra: data.nakshatra || undefined,
        address: data.address || undefined,
      });

      // Refresh user profile in store
      await refreshUserProfile();

      Alert.alert('Success', 'Profile updated successfully');
      logger.info('Profile updated successfully');
    } catch (error) {
      logger.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[TYPOGRAPHY.h2, styles.title]}>My Profile</Text>

        {/* Phone Number (Read-only) */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{user?.phoneNumber || 'N/A'}</Text>
          </View>
        </View>

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

        {/* Date of Birth */}
        <Controller
          control={control}
          name="dob"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Date of Birth (YYYY-MM-DD)"
              value={value}
              onChangeText={onChange}
              placeholder="1990-01-01"
              error={errors.dob?.message}
            />
          )}
        />

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Gender"
              value={value}
              onChangeText={onChange}
              placeholder="Male/Female/Other"
              error={errors.gender?.message}
            />
          )}
        />

        {/* Gotra */}
        <Controller
          control={control}
          name="gotra"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Gotra"
              value={value}
              onChangeText={onChange}
              error={errors.gotra?.message}
            />
          )}
        />

        {/* Nakshatra */}
        <Controller
          control={control}
          name="nakshatra"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nakshatra"
              value={value}
              onChangeText={onChange}
              error={errors.nakshatra?.message}
            />
          )}
        />

        {/* Address */}
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Address"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              error={errors.address?.message}
            />
          )}
        />

        {/* Save Button */}
        <Button
          title="Save Profile"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSaving}
          style={styles.saveButton}
        />

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          isLoading={authLoading}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.l, paddingBottom: SPACING.xxl },
  title: { marginBottom: SPACING.l },
  field: { marginBottom: SPACING.m },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.xs,
    color: COLORS.text.primary,
  },
  readOnlyField: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  readOnlyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  saveButton: {
    marginTop: SPACING.l,
  },
  logoutButton: {
    marginTop: SPACING.m,
  },
});
