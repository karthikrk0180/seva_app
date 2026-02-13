/**
 * Auth Token Service
 * JWT token management: store in secure storage, validate expiry, 401 callback.
 * Backend login is called here; all other API calls use the global client that attaches this token.
 */

import { APP_CONFIG } from 'src/config';
import { secureAuthStorage } from 'src/utils/secureAuthStorage';
import { isTokenValid as checkTokenValid } from 'src/utils/jwt';
import { logger } from 'src/services/logger.service';

/** Backend POST /api/auth/login response (200 OK) */
export interface BackendLoginResponse {
  token?: string;
  bearerToken?: string;
  userId: string;
  phone: string;
  role: string;
  message?: string;
}

type OnUnauthorizedCallback = () => void;

let onUnauthorized: OnUnauthorizedCallback | null = null;

/**
 * Register callback for 401 responses. API client will call this and then clear token + redirect.
 */
export function setOnUnauthorized(callback: OnUnauthorizedCallback): void {
  onUnauthorized = callback;
}

export function getOnUnauthorized(): OnUnauthorizedCallback | null {
  return onUnauthorized;
}

/**
 * Call when API client receives 401. Clears token and triggers logout flow.
 */
export function handleUnauthorized(): void {
  logger.warn('401 Unauthorized — clearing token and triggering logout');
  secureAuthStorage.clear();
  if (onUnauthorized) {
    onUnauthorized();
  }
}

/** Get raw JWT from backend response (token or bearerToken with "Bearer " stripped). */
function getRawToken(data: BackendLoginResponse): string | null {
  if (data.token) return data.token;
  if (data.bearerToken) {
    const t = data.bearerToken.replace(/^Bearer\s+/i, '').trim();
    return t || null;
  }
  return null;
}

/** Backend expects digits (e.g. "9999999999"). Strip +91 prefix and non-digits. */
function normalizePhoneForBackend(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits;
}

class AuthTokenService {
  /**
   * Call backend POST /api/auth/login with { phone }.
   * No auth required. Response: token/bearerToken, userId, phone, role.
   * Stores raw JWT and auth_user in secure storage (EncryptedStorage).
   */
  async login(phone: string): Promise<BackendLoginResponse> {
    const url = `${APP_CONFIG.API_BASE_URL}/api/auth/login`;
    const phoneNormalized = normalizePhoneForBackend(phone);
    const body = JSON.stringify({ phone: phoneNormalized });

    logger.info('Calling backend login', { url });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    });

    if (!response.ok) {
      const status = response.status;
      let message = `Login failed: ${response.status} ${response.statusText}`;
      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch {
        // ignore
      }
      logger.error('Backend login failed', { status, message });
      throw new Error(message);
    }

    const data = (await response.json()) as BackendLoginResponse;

    const rawToken = getRawToken(data);
    if (!rawToken) {
      logger.error('Backend login response missing token/bearerToken');
      throw new Error('Invalid login response');
    }

    await secureAuthStorage.setAccessToken(rawToken);
    if (data.role) {
      await secureAuthStorage.setUserRole(data.role);
    }
    await secureAuthStorage.setAuthUser({
      userId: data.userId,
      phone: data.phone,
      role: data.role,
    });
    logger.info('Login success — token and auth_user stored in secure storage');

    return data;
  }

  /**
   * Clear token and role from secure storage. Call on logout.
   */
  async logout(): Promise<void> {
    await secureAuthStorage.clear();
    logger.info('Auth token service — logout (storage cleared)');
  }

  /**
   * Get stored access token (for API client to attach to requests).
   */
  async getToken(): Promise<string | null> {
    return secureAuthStorage.getAccessToken();
  }

  /**
   * Check if we have a valid (existing and not expired) token.
   */
  async isTokenValid(): Promise<boolean> {
    const token = await this.getToken();
    return checkTokenValid(token);
  }

  /**
   * Get stored role from secure storage (set at login).
   */
  async getStoredRole(): Promise<string | null> {
    return secureAuthStorage.getUserRole();
  }
}

export const authTokenService = new AuthTokenService();
