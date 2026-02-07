/**
 * App Store
 * Manages global application state (Feature flags, theme, language).
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FeatureFlags, featureFlagService } from 'src/services/featureFlag.service';
import { logger } from 'src/services/logger.service';
import { storage } from 'src/utils/storage';

interface AppState {
  isInitialized: boolean;
  featureFlags: FeatureFlags;
  language: 'en' | 'kn';

  // Actions
  initializeApp: () => Promise<void>;
  setLanguage: (lang: 'en' | 'kn') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isInitialized: false,
      featureFlags: {
          sevaEnabled: true,
          paryayaEnabled: false,
          newHomeDesign: false,
          maintenanceMode: false
      },
      language: 'en',

      initializeApp: async () => {
        try {
          const flags = await featureFlagService.loadFlags();
          set({ featureFlags: flags, isInitialized: true });
          logger.info('App initialized with flags', { flags });
        } catch (e) {
          logger.error('App initialization failed', e);
          // Even if it fails, we mark initialized to let app boot with defaults
          set({ isInitialized: true });
        }
      },

      setLanguage: (language) => {
          set({ language });
          // TODO: Update i18next instance here
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ language: state.language, featureFlags: state.featureFlags }),
    }
  )
);
