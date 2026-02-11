import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { useAuthStore } from 'src/store/auth.store';
import { authService } from 'src/services/auth.service';

export const OtpScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();

  const { phoneNumber, verificationId } = route.params || {};

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  const { login, isLoading } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    try {
      /**
       * 🔥 OTP IS IGNORED
       * Backend + profile API decides everything
       */
      await login(phoneNumber);

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
