/**
 * Auth storage for JWT and role.
 * Uses AsyncStorage so the app works without react-native-encrypted-storage native module.
 * For production, install react-native-encrypted-storage, rebuild, and switch to it if desired.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from 'src/services/logger.service';

const PREFIX = 'auth_secure_';
const ACCESS_TOKEN_KEY = PREFIX + 'auth_token';
const USER_ROLE_KEY = PREFIX + 'user_role';
const AUTH_USER_KEY = PREFIX + 'auth_user';

export interface StoredAuthUser {
  userId: string;
  phone: string;
  role: string;
}

export const secureAuthStorage = {
  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    logger.info('Access token stored');
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async setUserRole(role: string): Promise<void> {
    await AsyncStorage.setItem(USER_ROLE_KEY, role);
  },

  async getUserRole(): Promise<string | null> {
    return AsyncStorage.getItem(USER_ROLE_KEY);
  },

  async setAuthUser(user: StoredAuthUser): Promise<void> {
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  async getAuthUser(): Promise<StoredAuthUser | null> {
    const raw = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredAuthUser;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, USER_ROLE_KEY, AUTH_USER_KEY]);
    logger.info('Auth storage cleared');
  },
};
