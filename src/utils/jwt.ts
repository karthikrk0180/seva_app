/**
 * JWT helpers — decode payload only (no signature verification).
 * Used for client-side expiry check. Backend always verifies.
 */

export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  role?: string;
  [key: string]: unknown;
}

/** Base64url decode (works in React Native where atob may be missing) */
function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(padded);
  }
  // Fallback for RN: minimal base64 decode
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < padded.length; i += 4) {
    const a = chars.indexOf(padded[i]);
    const b = chars.indexOf(padded[i + 1]);
    const c = chars.indexOf(padded[i + 2]);
    const d = chars.indexOf(padded[i + 3]);
    if (a === -1 || b === -1) break;
    result += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== -1) result += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    if (d !== -1) result += String.fromCharCode(((c & 3) << 6) | d);
  }
  return result;
}

/**
 * Decode JWT payload (middle part). Does NOT verify signature.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Strip "Bearer " prefix if present (backend sends Authorization: Bearer <jwt>) */
function toRawToken(token: string): string {
  return token.replace(/^Bearer\s+/i, '').trim();
}

/**
 * Check if token is expired (with 60s buffer). Backend expiry: 24h from iat.
 */
export function isTokenExpired(token: string): boolean {
  const raw = toRawToken(token);
  const payload = decodeJwtPayload(raw);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  const buffer = 60;
  return payload.exp < now + buffer;
}

/**
 * Check if token exists and is not expired.
 */
export function isTokenValid(token: string | null): token is string {
  if (!token || token.length === 0) return false;
  return !isTokenExpired(token);
}
