import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from 'src/navigation/RootNavigator';
import { ErrorBoundary } from 'src/components/common/ErrorBoundary';
import 'src/i18n'; // Initialize i18n
import { logger } from 'src/services/logger.service';
import { firebaseService } from 'src/services/firebase.service';
import i18n from 'src/i18n';

const App = () => {
  useEffect(() => {
    logger.info('App starting up...');
    // Set Firebase Auth language so SMS verification messages match app language
    firebaseService.setAuthLanguage(i18n.language || 'en').catch(() => {});
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
