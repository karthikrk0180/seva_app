import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { Card } from 'src/components/common/Card';
import { Select } from 'src/components/common/Select';
import { SEVA_DATA } from './seva.data';
import { useAuthStore } from 'src/store/auth.store';
import { NAKSHATRAS, RASHIS, GOTHRAS, PAYMENT_MODES, type PrasadamCollection } from 'src/models/devotee.model';
import { parseDateString } from 'src/utils/date';
import type { SevaStackParamList } from 'src/navigation/types';
import { ROUTES } from 'src/config';

const bookingSchema = yup.object().shape({
  date: yup
    .string()
    .required('Date is required')
    .test('is-valid-date', 'Invalid date (DD/MM/YYYY)', (val) => !!val && !!parseDateString(val)),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Valid 10-digit mobile required').required('Phone is required'),
  email: yup.string().email('Valid email').optional(),
  city: yup.string().optional(),
  pincode: yup.string().optional(),
  nakshatra: yup.string().required('Nakshatra is required'),
  paymentMode: yup.string().required('Payment mode is required'),
  devoteeName: yup.string().required('Devotee name is required'),
  address: yup.string().required('Address is required'),
  state: yup.string().optional(),
  rashi: yup.string().required('Rashi is required'),
  gothra: yup.string().required('Gothra is required'),
  consent: yup.boolean().oneOf([true], 'You must consent to data storage').required(),
});

type FormData = yup.InferType<typeof bookingSchema> & {
  prasadamCollection: PrasadamCollection;
  sameAsAbove: boolean;
  postalAddress?: string;
};

type SevaBookingRouteProp = RouteProp<SevaStackParamList, typeof ROUTES.SEVA.SEVA_BOOKING>;

export const SevaBookingScreen = () => {
  const route = useRoute<SevaBookingRouteProp>();
  const navigation = useNavigation();
  const { sevaId } = route.params || {};
  const { user, setUser } = useAuthStore();
  const [showPayment, setShowPayment] = useState(false);
  const [prasadamCollection, setPrasadamCollection] = useState<PrasadamCollection>('personal');
  const [sameAsAbove, setSameAsAbove] = useState(true);

  const seva = SEVA_DATA.find((s) => s.id === sevaId);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(bookingSchema as any),
    defaultValues: {
      date: '',
      phone: '',
      email: '',
      city: '',
      pincode: '',
      nakshatra: '',
      paymentMode: '',
      devoteeName: '',
      address: '',
      state: '',
      rashi: '',
      gothra: '',
      consent: false,
      prasadamCollection: 'personal',
      sameAsAbove: true,
    },
  });

  useEffect(() => {
    if (user) {
      if (user.displayName) setValue('devoteeName', user.displayName);
      if (user.phoneNumber) setValue('phone', user.phoneNumber.replace(/^\+91/, ''));
      if (user.email) setValue('email', user.email);
      if (user.address) setValue('address', user.address);
      if (user.city) setValue('city', user.city);
      if (user.state) setValue('state', user.state);
      if (user.pincode) setValue('pincode', user.pincode);
      if (user.nakshatra) setValue('nakshatra', user.nakshatra);
      if (user.rashi) setValue('rashi', user.rashi);
      if (user.gothra) setValue('gothra', user.gothra);
    }
  }, [user, setValue]);

  const hasProfileChanged = (data: FormData) => {
    if (!user) return false;
    const p = user.phoneNumber.replace(/^\+91/, '');
    return (
      data.phone !== p ||
      (data.email || '') !== (user.email || '') ||
      (data.address || '') !== (user.address || '')
    );
  };

  const onSubmit = (data: FormData) => {
    if (hasProfileChanged(data) && user) {
      Alert.alert(
        'Update profile?',
        'You changed mobile, email or address. Do you want to update this in your profile?',
        [
          { text: 'No', onPress: () => proceedToPayment(data) },
          {
            text: 'Yes',
            onPress: () => {
              setUser({
                ...user,
                displayName: data.devoteeName,
                phoneNumber: '+91' + data.phone,
                email: data.email || user.email,
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                nakshatra: data.nakshatra,
                rashi: data.rashi,
                gothra: data.gothra,
              });
              proceedToPayment(data);
            },
          },
        ]
      );
    } else {
      proceedToPayment(data);
    }
  };

  const proceedToPayment = (_data: FormData) => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    Alert.alert('Booking Successful', 'Receipt has been sent to your email.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (!seva) {
    return (
      <View style={styles.container}>
        <Text>Seva not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Seva List section (as in PDF) */}
          <Card style={styles.sevaCard}>
            <Text style={styles.sectionLabel}>Seva List</Text>
            <Text style={TYPOGRAPHY.h3}>{seva.title.kn}</Text>
            <Text style={[TYPOGRAPHY.caption, { marginTop: SPACING.xs }]}>{seva.title.en}</Text>
            <Text style={[TYPOGRAPHY.h2, { color: COLORS.primary, marginTop: SPACING.s }]}>₹{seva.amount}</Text>
          </Card>

          <Text style={styles.sectionTitle}>2. Devotee Details</Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Date (DD/MM/YYYY)"
                  placeholder="dd/mm/yyyy"
                  value={value}
                  onChangeText={onChange}
                  error={errors.date?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={errors.phone?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputBlock}>
                  <Input label="Email Address" value={value || ''} onChangeText={onChange} keyboardType="email-address" error={errors.email?.message} />
                  <Text style={styles.privacyNote}>We will never share your email with anyone else.</Text>
                </View>
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <Input label="City" value={value || ''} onChangeText={onChange} error={errors.city?.message} />
              )}
            />
            <Controller
              control={control}
              name="pincode"
              render={({ field: { onChange, value } }) => (
                <Input label="Enter Pincode" value={value || ''} onChangeText={onChange} keyboardType="number-pad" maxLength={6} error={errors.pincode?.message} />
              )}
            />
            <Controller
              control={control}
              name="nakshatra"
              render={({ field: { onChange, value } }) => (
                <Select label="Nakshatra" placeholder="-- Select Nakshatra --" value={value || ''} onSelect={onChange} options={NAKSHATRAS} error={errors.nakshatra?.message} />
              )}
            />
            <Controller
              control={control}
              name="paymentMode"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Payment Mode"
                  placeholder="-- Select Payment Mode --"
                  value={value || ''}
                  onSelect={onChange}
                  options={PAYMENT_MODES}
                  error={errors.paymentMode?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="devoteeName"
              render={({ field: { onChange, value } }) => (
                <Input label="Devotee Name" value={value || ''} onChangeText={onChange} error={errors.devoteeName?.message} />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Address"
                  value={value || ''}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  style={{ minHeight: 72 }}
                  error={errors.address?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <Input label="State" value={value || ''} onChangeText={onChange} error={errors.state?.message} />
              )}
            />
            <Controller
              control={control}
              name="rashi"
              render={({ field: { onChange, value } }) => (
                <Select label="Rashi" placeholder="-- Select Rashi --" value={value || ''} onSelect={onChange} options={RASHIS} error={errors.rashi?.message} />
              )}
            />
            <Controller
              control={control}
              name="gothra"
              render={({ field: { onChange, value } }) => (
                <Select label="Gothra" placeholder="-- Select Gothra --" value={value || ''} onSelect={onChange} options={GOTHRAS} error={errors.gothra?.message} />
              )}
            />

            {/* Collect Prasadam */}
            <View style={styles.radioGroup}>
              <Text style={styles.radioLabel}>Collect Prasadam</Text>
              <TouchableOpacity style={styles.radioRow} onPress={() => setPrasadamCollection('personal')}>
                <View style={[styles.radio, prasadamCollection === 'personal' && styles.radioChecked]} />
                <Text style={TYPOGRAPHY.body}>By Personal Visit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow} onPress={() => setPrasadamCollection('post')}>
                <View style={[styles.radio, prasadamCollection === 'post' && styles.radioChecked]} />
                <Text style={TYPOGRAPHY.body}>By Post</Text>
              </TouchableOpacity>
            </View>

            {prasadamCollection === 'post' && (
              <View style={styles.postalSection}>
                <Text style={styles.radioLabel}>Postal Address</Text>
                <TouchableOpacity style={styles.checkboxRow} onPress={() => setSameAsAbove(!sameAsAbove)}>
                  <View style={[styles.checkbox, sameAsAbove && styles.checkboxChecked]} />
                  <Text style={TYPOGRAPHY.body}>Same as above address</Text>
                </TouchableOpacity>
                {!sameAsAbove && (
                  <Input
                    label="Postal Address"
                    placeholder="Enter address for Prasadam delivery"
                    multiline
                    numberOfLines={2}
                    style={{ minHeight: 56 }}
                  />
                )}
              </View>
            )}

            {/* Consent */}
            <Controller
              control={control}
              name="consent"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity onPress={() => onChange(!value)} style={styles.checkboxRow}>
                    <View style={[styles.checkbox, value && styles.checkboxChecked]} />
                    <Text style={[TYPOGRAPHY.caption, { flex: 1 }]}>
                      Consent to data storage for communications. I agree to store this data for Matha communications and updates.
                    </Text>
                  </TouchableOpacity>
                  {errors.consent && <Text style={styles.errorText}>{errors.consent.message}</Text>}
                </View>
              )}
            />

            <TouchableOpacity onPress={() => {}} style={{ marginBottom: SPACING.m }}>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.primary }]}>Cancellation & Refund Policy</Text>
            </TouchableOpacity>

            <Button title="Proceed to Pay" onPress={handleSubmit(onSubmit)} style={{ marginTop: SPACING.l }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showPayment} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={TYPOGRAPHY.h2}>Confirm Payment</Text>
            <Text style={[TYPOGRAPHY.body, { marginVertical: SPACING.m }]}>
              Seva: {seva.title.en}{'\n'}
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
  scroll: { padding: SPACING.l, paddingBottom: SPACING.xxl },
  sevaCard: { marginBottom: SPACING.l },
  sectionLabel: { ...TYPOGRAPHY.caption, marginBottom: SPACING.xs, color: COLORS.text.secondary },
  sectionTitle: { ...TYPOGRAPHY.h3, marginBottom: SPACING.m },
  form: { marginBottom: SPACING.xxl },
  inputBlock: { marginBottom: SPACING.m },
  privacyNote: { ...TYPOGRAPHY.caption, color: COLORS.text.secondary, marginTop: -SPACING.s, marginBottom: SPACING.m },
  radioGroup: { marginVertical: SPACING.m },
  radioLabel: { ...TYPOGRAPHY.caption, fontWeight: '600', marginBottom: SPACING.s },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.s },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, marginRight: SPACING.s },
  radioChecked: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  postalSection: { marginTop: SPACING.s, marginBottom: SPACING.m },
  checkboxContainer: { marginVertical: SPACING.m },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.s },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: COLORS.border, marginRight: SPACING.s, borderRadius: 4 },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  errorText: { ...TYPOGRAPHY.caption, color: COLORS.text.error, marginLeft: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.surface, padding: SPACING.xl, borderRadius: 16, width: '80%', elevation: 5 },
});
