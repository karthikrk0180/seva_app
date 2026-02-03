import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { SevaStackParamList } from 'src/navigation/types';
import { ROUTES } from 'src/config';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { Card } from 'src/components/common/Card';
import { SEVA_DATA } from './seva.data';
import { useAuthStore } from 'src/store/auth.store';

// Validation Schema
import { parseDateString } from 'src/utils/date';

const bookingSchema = yup.object().shape({
  performeeName: yup.string().required('Name is required'),
  mobile: yup.string().matches(/^[0-9]{10}$/, 'Valid 10-digit mobile required'), 
  date: yup.string()
    .required('Date is required')
    .test('is-valid-date', 'Invalid Date (DD/MM/YYYY)', (val) => !!val && !!parseDateString(val)),
  gotra: yup.string().required('Gotra is required'),
  nakshatra: yup.string().required('Nakshatra is required'),
  consent: yup.boolean().oneOf([true], 'You must agree to data storage').required(),
});



type SevaBookingRouteProp = RouteProp<SevaStackParamList, typeof ROUTES.SEVA.SEVA_BOOKING>;
type SevaBookingNavProp = NativeStackNavigationProp<SevaStackParamList, typeof ROUTES.SEVA.SEVA_BOOKING>;

export const SevaBookingScreen = () => {
  const route = useRoute<SevaBookingRouteProp>();
  const navigation = useNavigation<SevaBookingNavProp>();
  const { sevaId } = route.params || {};
  const { user } = useAuthStore();
  const [showPayment, setShowPayment] = useState(false);

  const seva = SEVA_DATA.find((s) => s.id === sevaId);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      performeeName: '',
      mobile: '',
      date: '',
      gotra: '',
      nakshatra: '',
      consent: false,
    },
  });

  // Pre-fill logic
  useEffect(() => {
    if (user) {
      if (user.displayName) setValue('performeeName', user.displayName);
      if (user.phoneNumber) setValue('mobile', user.phoneNumber.replace('+91', ''));
    }
  }, [user, setValue]);

  const onSubmit = (data: any) => {
    // Show Payment Stub
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    Alert.alert('Booking Successful', 'Receipt has been sent to your email.', [
        { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  if (!seva) return <View><Text>Seva not found</Text></View>;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Seva Summary Card */}
        <Card style={styles.headerCard}>
            <Text style={TYPOGRAPHY.h2}>{seva.title.en}</Text>
            <Text style={[TYPOGRAPHY.h3, { color: COLORS.primary }]}>₹{seva.amount}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Devotee Details</Text>
        
        <View style={styles.form}>
            <Controller
                control={control}
                name="performeeName"
                render={({ field: { onChange, value } }) => (
                    <Input label="Name *" value={value} onChangeText={onChange} error={errors.performeeName?.message} />
                )}
            />
            
            <Controller
                control={control}
                name="mobile"
                render={({ field: { onChange, value } }) => (
                    <Input label="Mobile Number" value={value} onChangeText={onChange} keyboardType="phone-pad" error={errors.mobile?.message} />
                )}
            />

            <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                    <Input label="Seva Date (DD/MM/YYYY) *" value={value} onChangeText={onChange} placeholder="e.g. 15/04/2026" error={errors.date?.message} />
                )}
            />

            <Controller
                control={control}
                name="gotra"
                render={({ field: { onChange, value } }) => (
                    <Input label="Gotra *" value={value} onChangeText={onChange} error={errors.gotra?.message} />
                )}
            />

            <Controller
                control={control}
                name="nakshatra"
                render={({ field: { onChange, value } }) => (
                    <Input label="Nakshatra *" value={value} onChangeText={onChange} error={errors.nakshatra?.message} />
                )}
            />

            {/* Consent Checkbox Mock */}
            <Controller
                control={control}
                name="consent"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.checkboxContainer}>
                        <Button 
                            title={value ? "☑" : "☐"} 
                            onPress={() => onChange(!value)} 
                            variant="text"
                            style={{ width: 40, height: 40, marginRight: 8 }}
                        />
                        <Text style={[TYPOGRAPHY.caption, { flex: 1 }]}>
                            I consent to store this data for Matha communications and updates.
                        </Text>
                    </View>
                )}
            />
            {errors.consent && <Text style={{ color: 'red', marginLeft: 16 }}>{errors.consent.message}</Text>}

            <Button title="Proceed to Pay" onPress={handleSubmit(onSubmit)} style={{ marginTop: SPACING.l }} />
        </View>

      </ScrollView>
      </KeyboardAvoidingView>

      {/* Payment Stub Modal */}
      <Modal visible={showPayment} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={TYPOGRAPHY.h2}>Confirm Payment</Text>
                  <Text style={[TYPOGRAPHY.body, { marginVertical: SPACING.m }]}>
                      Seva: {seva.title.en}{"\n"}
                      Amount: ₹{seva.amount}
                  </Text>
                  <Button title="Pay Now (Razorpay/UPI)" onPress={handlePaymentSuccess} />
                  <Button title="Cancel" variant="outline" onPress={() => setShowPayment(false)} />
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.l },
  headerCard: { marginBottom: SPACING.l, alignItems: 'center' },
  sectionTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.m },
  form: { marginBottom: SPACING.xxl },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.s },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.surface, padding: SPACING.xl, borderRadius: 16, width: '80%', elevation: 5 }
});
