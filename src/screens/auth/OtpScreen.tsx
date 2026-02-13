import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { useAuthStore } from 'src/store/auth.store';
import { authService } from 'src/services/auth.service';
import { APP_CONFIG } from 'src/config';

export const OtpScreen = () => {
  const route = useRoute<any>();

  const { phoneNumber } = route.params || {};

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  const { login, isLoading } = useAuthStore();

  const phoneDigits = (phoneNumber || '').replace(/\D/g, '');
  const isTestPhone = phoneDigits.length >= 10 && APP_CONFIG.DUMMY_OTP_TEST_PHONES?.some((p) => phoneDigits.endsWith(p) || phoneDigits === p);
  const dummyOtpHint = APP_CONFIG.DUMMY_OTP_DEV && isTestPhone ? `Dev: use ${APP_CONFIG.DUMMY_OTP_DEV} or any 6 digits` : null;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleVerify = async () => {
    try {
      await login(phoneNumber, otp);
      // Navigation handled automatically by RootNavigator
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Something went wrong');
    }
  };

  const handleResend = async () => {
    setTimer(30);
    await authService.loginWithPhone(phoneNumber);

    Alert.alert('Sent', 'OTP has been resent to your mobile.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[TYPOGRAPHY.h2, styles.title]}>
            Verify Mobile
          </Text>

          <Text style={[TYPOGRAPHY.body, styles.phoneHint]}>
            OTP sent to {phoneNumber}
          </Text>

          <Text style={[TYPOGRAPHY.caption, styles.helper]}>
            Enter the 6-digit code from the SMS
          </Text>
          {dummyOtpHint ? (
            <Text style={[TYPOGRAPHY.caption, styles.dummyHint]}>{dummyOtpHint}</Text>
          ) : null}
        </View>

        <Input
          label="Enter OTP"
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          style={styles.otpInput}
        />

        <Button
          title="Verify"
          onPress={handleVerify}
          isLoading={isLoading}
        />

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={TYPOGRAPHY.caption}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <Button
              title="Resend OTP"
              variant="text"
              onPress={handleResend}
              textStyle={{ fontSize: 14 }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.l, justifyContent: 'center' },
  header: { marginBottom: SPACING.xl, alignItems: 'center' },
  title: { textAlign: 'center', marginBottom: SPACING.xs },
  phoneHint: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  helper: {
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  dummyHint: {
    color: COLORS.primary,
    marginTop: SPACING.s,
    fontStyle: 'italic',
  },
  otpInput: {
    letterSpacing: 8,
    textAlign: 'center',
    fontSize: 24,
  },
  resendContainer: {
    marginTop: SPACING.m,
    alignItems: 'center',
    minHeight: 48,
  },
});
