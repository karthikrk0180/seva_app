/**
 * Auth Store
 * Manages authentication state globally using Zustand.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'src/models/user.model';
import { authService } from 'src/services/auth.service';
import { userService } from 'src/services/user.service';
import { logger } from 'src/services/logger.service';
import { storage } from 'src/utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (phone: string, code: string, verificationId: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (phone, code, verificationId) => {
        set({ isLoading: true, error: null });
        try {
          // Step 1: Verify OTP and get basic user info
          const basicUser = await authService.verifyOtp(verificationId, code);
          logger.info('OTP verified, fetching user profile');

          // Step 2: Fetch complete profile from backend
          try {
            const profile = await userService.getProfileByPhone(basicUser.phoneNumber);
            const completeUser = userService.mapProfileToUser(profile, basicUser);
            set({ user: completeUser, isAuthenticated: true, isLoading: false });
            logger.info('User logged in with profile data');
          } catch (profileError: any) {
            // If profile doesn't exist (404), create a new profile
            if (profileError?.message?.includes('404') || profileError?.message?.includes('Not Found')) {
              logger.info('No profile found, creating new profile for user');
              try {
                // Create minimal profile with phone number
                const newProfile = await userService.createOrUpdateProfileByPhone(
                  basicUser.phoneNumber,
                  {} // Empty profile - user will fill in details later
                );
                const completeUser = userService.mapProfileToUser(newProfile, basicUser);
                set({ user: completeUser, isAuthenticated: true, isLoading: false });
                logger.info('New profile created successfully');
              } catch (createError) {
                logger.error('Failed to create profile, using basic user info', createError);
                set({ user: basicUser, isAuthenticated: true, isLoading: false });
              }
            } else {
              throw profileError;
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Login failed';
          set({ error: msg, isLoading: false });
          logger.error('Login failed in store', e);
          throw e;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (e) {
          logger.error('Logout failed in store', e);
          set({ isLoading: false });
        }
      },

      refreshUserProfile: async () => {
        const currentUser = get().user;
        if (!currentUser?.phoneNumber) {
          logger.warn('Cannot refresh profile: no user logged in');
          return;
        }

        try {
          const profile = await userService.getProfileByPhone(currentUser.phoneNumber);
          const updatedUser = userService.mapProfileToUser(profile, currentUser);
          set({ user: updatedUser });
          logger.info('User profile refreshed');
        } catch (error) {
          logger.error('Failed to refresh user profile', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
