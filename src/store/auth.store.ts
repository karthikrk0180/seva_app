/**
 * Auth Store
 * Manages authentication state globally using Zustand.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'src/models/user.model';
import { authService } from 'src/services/auth.service';
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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (phone, code, verificationId) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.verifyOtp(verificationId, code);
      set({ user, isAuthenticated: true, isLoading: false });
      logger.info('User logged in via store');
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
}), {
  name: 'auth-storage',
  storage: createJSONStorage(() => storage),
  partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
}));
