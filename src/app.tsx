import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from 'src/navigation/RootNavigator';
import { ErrorBoundary } from 'src/components/common/ErrorBoundary';
import 'src/i18n'; // Initialize i18n
import { logger } from 'src/services/logger.service';

const App = () => {
  logger.info('App starting up...');

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <RootNavigator />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
