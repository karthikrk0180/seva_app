import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from 'src/store/auth.store';
import { useAppStore } from 'src/store/app.store';
import { AuthStack } from './AuthStack';
import { BottomTabs } from './BottomTabs';
import { NamePromptScreen } from 'src/screens/profile/NamePromptScreen';
import { linking } from './linking';
import { logger } from 'src/services/logger.service';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { initializeApp, isInitialized } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (!isInitialized) {
    // TODO: Return a proper Splash Screen component
    return null;
  }

  // Check if user needs to complete their profile
  const needsName = isAuthenticated && user && !user.firstName && !user.displayName;

  return (
    <NavigationContainer linking={linking} onStateChange={(state) => logger.info('Navigation state changed', { state })}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : needsName ? (
          <RootStack.Screen
            name="NamePrompt"
            component={NamePromptScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        ) : (
          <RootStack.Screen name="Main" component={BottomTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
