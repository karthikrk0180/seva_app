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
  login: (phone: string, code?: string, verificationId?: string) => Promise<void>;
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

      login: async (phone: string) => {
        set({ isLoading: true });

        const profile = await userService.getProfileByPhone(phone);
        const user = userService.mapProfileToUser(profile);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
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
        const user = get().user;
        if (!user?.phoneNumber) {
          logger.warn('Cannot refresh profile: no user logged in');
          return;
        }

        try {
          const profile = await userService.getProfileByPhone(user.phoneNumber);
          // logger.info('Refreshed profile from backend:', profile);

          const completeUser = userService.mapProfileToUser(profile, user);
          // logger.info('Mapped complete user:', completeUser);

          set({ user: completeUser });
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
