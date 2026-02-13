import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from 'src/navigation/RootNavigator';
import { ErrorBoundary } from 'src/components/common/ErrorBoundary';
import 'src/i18n'; // Initialize i18n
import { logger } from 'src/services/logger.service';
import { firebaseService } from 'src/services/firebase.service';
import { setOnUnauthorized } from 'src/services/authToken.service';
import { authTokenService } from 'src/services/authToken.service';
import { useAuthStore } from 'src/store/auth.store';
import i18n from 'src/i18n';

const App = () => {
  useEffect(() => {
    logger.info('App starting up...');
    firebaseService.setAuthLanguage(i18n.language || 'en').catch(() => {});

    // 401 → clear token and force logout (redirect to login)
    setOnUnauthorized(() => {
      useAuthStore.getState().forceLogout();
    });
  }, []);

  // On startup: if token missing or expired, force logout so we don't show main app with invalid auth
  useEffect(() => {
    const t = setTimeout(async () => {
      const valid = await authTokenService.isTokenValid();
      if (!valid) {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          logger.info('App startup: token invalid or missing — forcing logout');
          await useAuthStore.getState().forceLogout();
        }
      }
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
