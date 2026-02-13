/**
 * JWT token helpers — delegate to authTokenService (secure storage).
 * Prefer using authTokenService or useAuth().getToken() directly.
 */

import { authTokenService } from 'src/services/authToken.service';
import { logger } from 'src/services/logger.service';

export async function storeJwtToken(token: string): Promise<void> {
  const { secureAuthStorage } = await import('src/utils/secureAuthStorage');
  await secureAuthStorage.setAccessToken(token);
  logger.info('JWT token stored (via token util)');
}

export async function getJwtToken(): Promise<string | null> {
  return authTokenService.getToken();
}

export async function clearJwtToken(): Promise<void> {
  await authTokenService.logout();
}
