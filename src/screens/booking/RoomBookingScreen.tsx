import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { useAuthStore } from 'src/store/auth.store';

import { parseDateString } from 'src/utils/date';
import { isAfter, startOfDay } from 'date-fns';

const roomBookingSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  mobile: yup.string().required('Mobile is required'),
  checkIn: yup.string()
    .required('Check-in required')
    .test('is-valid-date', 'Invalid Date (DD/MM/YYYY)', (val) => !!val && !!parseDateString(val))
    .test('is-future', 'Must be today or future', (val) => {
        const d = parseDateString(val || '');
        return d ? isAfter(d, startOfDay(new Date())) || d.getTime() === startOfDay(new Date()).getTime() : false;
    }),
  checkOut: yup.string()
    .required('Check-out required')
    .test('is-valid-date', 'Invalid Date (DD/MM/YYYY)', (val) => !!val && !!parseDateString(val))
    .test('is-after-checkin', 'Check-out must be after Check-in', function(val) {
        const { checkIn } = this.parent;
        const dIn = parseDateString(checkIn || '');
        const dOut = parseDateString(val || '');
        return dIn && dOut ? isAfter(dOut, dIn) : false;
    }),
  rooms: yup.number().min(1).required(),
  members: yup.number().min(1).required(),
  consent: yup.boolean().oneOf([true], 'You must agree to data storage').required(),
});

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from 'src/navigation/types';
import { ROUTES } from 'src/config';

type RoomBookingNavProp = NativeStackNavigationProp<HomeStackParamList, typeof ROUTES.SERVICES.ROOM_BOOKING>;

export const RoomBookingScreen = () => {
  const navigation = useNavigation<RoomBookingNavProp>();
  const { user } = useAuthStore();
  
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(roomBookingSchema),
    defaultValues: {
      name: '',
      mobile: '',
      checkIn: '',
      checkOut: '',
      rooms: 1,
      members: 1,
      consent: false,
    },
  });

  useEffect(() => {
    if (user) {
      if (user.displayName) setValue('name', user.displayName);
      if (user.phoneNumber) setValue('mobile', user.phoneNumber.replace('+91', ''));
    }
  }, [user, setValue]);

  const onSubmit = (data: any) => {
    // Simulate Email Trigger
    console.log('Booking Request:', data);
    Alert.alert(
        'Request Sent', 
        'Your room booking request has been emailed to office@sodematha.in. We will contact you shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={TYPOGRAPHY.h2}>Room Booking</Text>
            <Text style={TYPOGRAPHY.caption}>Sode Kshetra Guest House</Text>
        </View>

        <View style={styles.form}>
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <Input 
                        label="Name *" 
                        value={value} 
                        onChangeText={onChange} 
                        error={errors.name?.message}
                        accessibilityLabel="Enter Name"
                        accessibilityHint="Required field for booking"
                    />
                )}
            />
            <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, value } }) => (
                    <Input label="Mobile *" value={value} onChangeText={onChange} keyboardType="phone-pad" error={errors.mobile?.message} />
                )}
            />
            
            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: SPACING.s }}>
                    <Controller
                        control={control}
                        name="checkIn"
                        render={({ field: { onChange, value } }) => (
                            <Input label="Check-In (DD/MM/YYYY) *" value={value} onChangeText={onChange} error={errors.checkIn?.message} />
                        )}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.s }}>
                    <Controller
                        control={control}
                        name="checkOut"
                        render={({ field: { onChange, value } }) => (
                            <Input label="Check-Out (DD/MM/YYYY) *" value={value} onChangeText={onChange} error={errors.checkOut?.message} />
                        )}
                    />
                </View>
            </View>

            <View style={styles.row}>
                 <View style={{ flex: 1, marginRight: SPACING.s }}>
                    <Controller
                        control={control}
                        name="rooms"
                        render={({ field: { onChange, value } }) => (
                            <Input label="Rooms *" value={String(value)} onChangeText={onChange} keyboardType="number-pad" error={errors.rooms?.message} />
                        )}
                    />
                 </View>
                 <View style={{ flex: 1, marginLeft: SPACING.s }}>
                    <Controller
                        control={control}
                        name="members"
                        render={({ field: { onChange, value } }) => (
                            <Input label="Members *" value={String(value)} onChangeText={onChange} keyboardType="number-pad" error={errors.members?.message} />
                        )}
                    />
                 </View>
            </View>

             <Controller
                control={control}
                name="consent"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity onPress={() => onChange(!value)}>
                             <Text style={{ fontSize: 24, marginRight: 8 }}>{value ? "☑" : "☐"}</Text>
                        </TouchableOpacity>
                        <Text style={[TYPOGRAPHY.caption, { flex: 1 }]}>
                            I agree to store this data for booking purposes.
                        </Text>
                    </View>
                )}
            />
            {errors.consent && <Text style={{ color: 'red', marginLeft: 16, marginBottom: 10 }}>{errors.consent.message}</Text>}

            <Button title="Submit Request" onPress={handleSubmit(onSubmit)} />
        </View>


      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.l },
  header: { marginBottom: SPACING.xl, paddingBottom: SPACING.m, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  form: { marginBottom: SPACING.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.m },
});
