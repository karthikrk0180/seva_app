/**
 * useAuth — auth state + token helpers.
 */

import { useCallback } from 'react';
import { useAuthStore } from 'src/store/auth.store';
import { authTokenService } from 'src/services/authToken.service';
import type { UserRole } from 'src/models/user.model';

export interface UseAuthResult {
  user: ReturnType<typeof useAuthStore>['user'];
  role: UserRole | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (phone: string, code?: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  isTokenValid: () => Promise<boolean>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

export function useAuth(): UseAuthResult {
  const { user, isAuthenticated, isLoading, error, login, logout } = useAuthStore();
  const getToken = useCallback(() => authTokenService.getToken(), []);
  const isTokenValid = useCallback(() => authTokenService.isTokenValid(), []);

  const role = user?.role;
  const isSuperAdmin = role === 'superadmin';
  const isAdmin = role === 'admin' || role === 'superadmin';

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getToken,
    isTokenValid,
    isSuperAdmin,
    isAdmin,
  };
}
