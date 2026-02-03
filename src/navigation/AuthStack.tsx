import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from 'src/screens/auth/LoginScreen';
import { OtpScreen } from 'src/screens/auth/OtpScreen';
import { ROUTES } from 'src/config';

export type AuthStackParamList = {
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.AUTH.OTP]: { phoneNumber: string; verificationId: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.AUTH.LOGIN}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.AUTH.OTP} component={OtpScreen} />
    </Stack.Navigator>
  );
};
