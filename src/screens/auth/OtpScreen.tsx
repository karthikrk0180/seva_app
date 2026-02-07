import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from 'src/theme';
import { Button } from 'src/components/common/Button';
import { Input } from 'src/components/common/Input';
import { useAuthStore } from 'src/store/auth.store';
import { authService } from 'src/services/auth.service';

export const OtpScreen = () => {
    // Correct type for route params would be strictly defined in navigation types
    // Using any purely for brevity in this implementation step
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { phoneNumber, verificationId } = route.params || {};
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const { login, isLoading, error } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    try {
      await login(phoneNumber, otp, verificationId);
      // Navigation is handled by RootNavigator listening to isAuthenticated
    } catch (e) {
      Alert.alert('Verification Failed', 'Invalid code provided.');
    }
  };

  const handleResend = async () => {
    setTimer(30);
    try {
        await authService.loginWithPhone(phoneNumber);
        Alert.alert('Sent', 'OTP has been resent to your mobile.');
    } catch(e) {
        Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[TYPOGRAPHY.h2, styles.title]} maxFontSizeMultiplier={1.3}>
            Verify Mobile
          </Text>
          <Text style={[TYPOGRAPHY.body, styles.phoneHint]} maxFontSizeMultiplier={1.3}>
            OTP sent to {phoneNumber}
          </Text>
          <Text style={[TYPOGRAPHY.caption, styles.helper]} maxFontSizeMultiplier={1.3}>
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
          accessibilityLabel="One-time password, 6 digits"
        />

        <Button 
          title="Verify" 
          onPress={handleVerify} 
          isLoading={isLoading}
          disabled={otp.length !== 6}
        />

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={TYPOGRAPHY.caption}>Resend OTP in {timer}s</Text>
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
  phoneHint: { color: COLORS.text.secondary, textAlign: 'center', marginBottom: SPACING.xs },
  helper: { color: COLORS.text.secondary, textAlign: 'center' },
  otpInput: { letterSpacing: 8, textAlign: 'center', fontSize: 24 },
  resendContainer: { marginTop: SPACING.m, alignItems: 'center', minHeight: 48 },
});
