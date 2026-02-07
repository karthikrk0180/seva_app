import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { useAuthStore } from 'src/store/auth.store';
import { authService } from 'src/services/auth.service';
import { ROUTES } from 'src/config';

// Validation Schema
const loginSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit number'),
});

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [showTerms, setShowTerms] = useState(false);
  const { login } = useAuthStore();
  
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: { phoneNumber: string }) => {
    try {
      // Mock flow: In real app, we'd get a verificationId from firebase here
      const verificationId = await authService.loginWithPhone('+91' + data.phoneNumber);
      navigation.navigate(ROUTES.AUTH.OTP, { 
        phoneNumber: '+91' + data.phoneNumber,
        verificationId 
      });
    } catch (error) {
      Alert.alert('Login Failed', 'Unable to initiate login. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[TYPOGRAPHY.h1, styles.welcomeTitle]} maxFontSizeMultiplier={1.3}>
            Welcome Devotee
          </Text>
          <Text style={[TYPOGRAPHY.body, styles.subtitle]} maxFontSizeMultiplier={1.3}>
            Sode Sri Vadiraja Matha
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, value } }) => (
              <View style={styles.phoneBlock}>
                <Text style={styles.phoneLabel}>Mobile Number</Text>
                <View style={styles.phoneRow}>
                  <View style={styles.countryCode} accessibilityLabel="Country code India">
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <View style={styles.phoneInputWrap}>
                    <Input
                      label=""
                      placeholder="10-digit number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={value}
                      onChangeText={onChange}
                      error={errors.phoneNumber?.message}
                      style={styles.phoneInput}
                    />
                  </View>
                </View>
                {errors.phoneNumber?.message ? (
                  <Text style={styles.phoneError}>{errors.phoneNumber.message}</Text>
                ) : null}
              </View>
            )}
          />

          <View style={styles.termsContainer}>
            <Text style={TYPOGRAPHY.caption} maxFontSizeMultiplier={1.3}>
              By continuing, you agree to our{' '}
            </Text>
            <TouchableOpacity
              onPress={() => setShowTerms(true)}
              style={styles.termsTouchable}
              accessibilityRole="button"
              accessibilityLabel="Terms and Privacy Policy"
            >
              <Text style={[TYPOGRAPHY.caption, styles.termsLink]}>Terms & Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Get OTP"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>
      </View>

      {/* Terms Modal */}
      <Modal visible={showTerms} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <Text style={[TYPOGRAPHY.h2, { marginBottom: SPACING.m }]}>Terms & Conditions</Text>
          <ScrollView style={styles.modalContent}>
             <Text style={TYPOGRAPHY.body}>
               1. Privacy: We collect your mobile number for authentication purposes only. {"\n"}
               2. Data Usage: Your data is stored securely and used for Matha communications. {"\n"}
               3. Consent: By logging in, you agree to receive updates about Sevas and Events. {"\n"}
               {"\n"}
               (Full legal text would go here...)
             </Text>
          </ScrollView>
          <Button title="I Understand" onPress={() => setShowTerms(false)} variant="outline" />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.l, justifyContent: 'center' },
  header: { marginBottom: SPACING.xl, alignItems: 'center' },
  welcomeTitle: { textAlign: 'center', marginBottom: SPACING.xs },
  subtitle: { color: COLORS.text.secondary, textAlign: 'center' },
  form: { width: '100%' },
  phoneBlock: { marginBottom: SPACING.m },
  phoneLabel: { ...TYPOGRAPHY.caption, fontWeight: '600', marginBottom: SPACING.xs, color: COLORS.text.primary },
  phoneRow: { flexDirection: 'row', alignItems: 'stretch' },
  phoneInputWrap: { flex: 1 },
  countryCode: {
    minHeight: 48,
    paddingHorizontal: SPACING.m,
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: COLORS.border,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  countryCodeText: { ...TYPOGRAPHY.body, color: COLORS.text.secondary },
  phoneInput: { flex: 1, marginBottom: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  phoneError: { ...TYPOGRAPHY.caption, color: COLORS.text.error, marginTop: SPACING.xs },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.l,
    minHeight: 48,
  },
  termsTouchable: { padding: SPACING.s },
  termsLink: { color: COLORS.primary, fontWeight: '600' },
  modalContainer: { flex: 1, padding: SPACING.l, paddingTop: SPACING.xl },
  modalContent: { flex: 1, marginBottom: SPACING.m },
});
