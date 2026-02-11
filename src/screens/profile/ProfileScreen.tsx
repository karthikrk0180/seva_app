import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Pressable, Modal } from 'react-native';
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
import { Picker } from '@react-native-picker/picker';

const schema = yup.object().shape({
  displayName: yup.string().required('Name is required'),
  dob: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/,
      'Date must be in DD-MM-YYYY format'
    ),
  gender: yup.string(),
  gotra: yup.string(),
  nakshatra: yup.string(),
  rashi: yup.string(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  pincode: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const ProfileScreen = () => {
  const { user, logout, isLoading: authLoading, refreshUserProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);


  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      displayName: '',
      dob: '',
      gender: '',
      gotra: '',
      nakshatra: '',
      address: '',
      rashi: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setValue('displayName', user.displayName || '');
      setValue('dob', user.dob || '');
      setValue('gender', user.gender || '');
      setValue('gotra', user.gothra || '');
      setValue('nakshatra', user.nakshatra || '');
      setValue('rashi', user.rashi || '');
      setValue('address', user.address || '');
      setValue('city', user.city || '');
      setValue('state', user.state || '');
      setValue('pincode', user.pincode || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {

    console.log('SUBMIT CLICKED ✅', data);

    if (!user?.phoneNumber) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    setIsSaving(true);
    try {
      // Construct payload matching the structure provided by user
      const payload = {
        userId: user.uid,
        user: {
          id: user.uid,
          phone: user.phoneNumber,
          displayName: data.displayName,
          dob: data.dob || null,
          gender: data.gender || null,
          role: user.role,
          email: user.email || null,
        },
        // Profile fields
        address: data.address || null,
        gothra: data.gotra || null,
        nakshatra: data.nakshatra || null,
        rashi: data.rashi || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
      };

      await userService.updateProfileByPhone(user.phoneNumber, payload);

      // Refresh user profile in store
      await refreshUserProfile();

      // Optimistic update
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const { setUser } = useAuthStore.getState();
        setUser({
          ...currentUser,
          displayName: data.displayName,
          gothra: data.gotra,
          nakshatra: data.nakshatra,
          rashi: data.rashi,
          address: data.address,
          dob: data.dob,
          gender: data.gender,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        });
      }

      Alert.alert('Success', 'Profile updated successfully');
      logger.info('Profile updated successfully');
    } catch (error) {
      logger.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDob = (text: string) => {
    // Remove everything except digits
    const cleaned = text.replace(/\D/g, '');

    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }

    return formatted.slice(0, 10);
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

        {/* Display Name */}
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Name"
              value={value}
              onChangeText={onChange}
              error={errors.displayName?.message}
            />
          )}
        />

        {/* Date of Birth */}
        <Controller
          control={control}
          name="dob"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Date of Birth"
              value={value}
              placeholder="DD-MM-YYYY"
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={(text) => onChange(formatDob(text))}
              error={errors.dob?.message}
            />
          )}
        />


        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({ field: { value } }) => (
            <View style={styles.verticalField}>
              <Text style={styles.label}>Gender</Text>

              <Pressable
                style={styles.dropdown}
                onPress={() => setGenderModalVisible(true)}
              >
                <Text style={styles.dropdownText}>
                  {value || 'Select Gender'}
                </Text>
              </Pressable>

              {/* Modal */}
              <Modal
                transparent
                visible={genderModalVisible}
                animationType="fade"
                onRequestClose={() => setGenderModalVisible(false)}
              >
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setGenderModalVisible(false)}
                >
                  <View style={styles.modalContent}>
                    {['Male', 'Female', 'Other'].map((item) => (
                      <Pressable
                        key={item}
                        style={styles.modalItem}
                        onPress={() => {
                          setValue('gender', item, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                          setGenderModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </Pressable>
              </Modal>

              {errors.gender && (
                <Text style={styles.errorText}>{errors.gender.message}</Text>
              )}
            </View>
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

        {/* Rashi */}
        <Controller
          control={control}
          name="rashi"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Rashi"
              value={value}
              onChangeText={onChange}
              error={errors.rashi?.message}
            />
          )}
        />

        {/* City */}
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <Input
              label="City"
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
            />
          )}
        />

        {/* State */}
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <Input
              label="State"
              value={value}
              onChangeText={onChange}
              error={errors.state?.message}
            />
          )}
        />

        {/* Pincode */}
        <Controller
          control={control}
          name="pincode"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Pincode"
              value={value}
              onChangeText={onChange}
              error={errors.pincode?.message}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  errorText: {
    color: COLORS.text.error,
    marginTop: 4,
    fontSize: 12,
  },
  verticalField: {
    width: '100%',
    marginBottom: SPACING.m,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  dropdownText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },

  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  modalItemText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },

});
