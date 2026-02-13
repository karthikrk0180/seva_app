/**
 * Auth Store
 * Manages authentication state. JWT stored in secure storage via authTokenService.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'src/models/user.model';
import { authService } from 'src/services/auth.service';
import { authTokenService } from 'src/services/authToken.service';
import { userService } from 'src/services/user.service';
import { logger } from 'src/services/logger.service';
import { storage } from 'src/utils/storage';

type RoleFromBackend = string;

function normalizeRole(role: string | undefined): User['role'] {
  if (!role) return 'devotee';
  const r = role.toLowerCase();
  if (r === 'superadmin' || r === 'admin') return r === 'superadmin' ? 'superadmin' : 'admin';
  if (r === 'staff' || r === 'devotee') return r;
  return 'devotee';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (phone: string, code?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshUserProfile: () => Promise<void>;
  /** Force logout (e.g. on 401). Clears state and persisted auth. */
  forceLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (phone: string, _code?: string) => {
        set({ isLoading: true, error: null });
        try {
          const loginResponse = await authTokenService.login(phone);
          const role = normalizeRole(loginResponse.role as RoleFromBackend);

          const profile = await userService.getProfileByPhone(phone);
          const user = userService.mapProfileToUser(profile);
          user.role = role;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          logger.info('Login success', { userId: loginResponse.userId, role });
        } catch (e: any) {
          logger.error('Login failed in store', e);
          set({
            isLoading: false,
            error: e?.message ?? 'Login failed',
          });
          throw e;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authTokenService.logout();
          await authService.logout();
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
          await storage.removeItem('auth-storage');
          logger.info('User logged out and storage cleared');
        } catch (e) {
          logger.error('Logout failed in store', e);
          set({ user: null, isAuthenticated: false, isLoading: false });
          await storage.removeItem('auth-storage');
        }
      },

      forceLogout: async () => {
        try {
          await authTokenService.logout();
        } catch {
          // ignore
        }
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        await storage.removeItem('auth-storage');
        logger.info('Force logout (e.g. 401) — state and storage cleared');
      },

      refreshUserProfile: async () => {
        const user = get().user;
        if (!user?.phoneNumber) {
          logger.warn('Cannot refresh profile: no user logged in');
          return;
        }
        try {
          const profile = await userService.getProfileByPhone(user.phoneNumber);
          const completeUser = userService.mapProfileToUser(profile, user);
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
