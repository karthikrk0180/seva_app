import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from 'src/store/auth.store';
import { useAppStore } from 'src/store/app.store';
import { AuthStack } from './AuthStack';
import { BottomTabs } from './BottomTabs';
import { linking } from './linking';
import { logger } from 'src/services/logger.service';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  const { initializeApp, isInitialized } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (!isInitialized) {
    // TODO: Return a proper Splash Screen component
    return null; 
  }

  return (
    <NavigationContainer linking={linking} onStateChange={(state) => logger.info('Navigation state changed', { state })}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : (
          <RootStack.Screen name="Main" component={BottomTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
