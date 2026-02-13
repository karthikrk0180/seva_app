/**
 * API Service (REST)
 * Single global client. Auto-attaches JWT. On 401: clear token and trigger logout.
 */

import { APP_CONFIG } from 'src/config';
import { logger } from './logger.service';
import { authTokenService, handleUnauthorized } from './authToken.service';

interface ApiRequestConfig extends RequestInit {
  timeout?: number;
  /** Set to true to skip attaching Authorization (e.g. login endpoint) */
  skipAuth?: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.API_BASE_URL;
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const { skipAuth = false, ...fetchConfig } = config;
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((fetchConfig.headers as Record<string, string>) || {}),
    };

    if (!skipAuth) {
      const token = await authTokenService.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    logger.info(`API Request: ${config.method || 'GET'} ${url}`);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), config.timeout || APP_CONFIG.API_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers,
      });

      clearTimeout(id);

      if (response.status === 401) {
        handleUnauthorized();
        const msg = 'Session expired or invalid. Please log in again.';
        logger.warn(msg);
        throw new Error(msg);
      }

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          logger.error('API Error Details:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Response body is not JSON
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        return data as T;
      }

      const text = await response.text();
      logger.warn(`API returned non-JSON: ${text.substring(0, 100)}`);
      throw new Error('Server returned non-JSON response');
    } catch (error) {
      clearTimeout(id);
      logger.error(`API Failed: ${endpoint}`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string, headers?: RequestInit['headers'], skipAuth?: boolean): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers, skipAuth });
  }

  public post<T>(
    endpoint: string,
    body: unknown,
    headers?: RequestInit['headers'],
    skipAuth?: boolean,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
      skipAuth,
    });
  }

  public put<T>(
    endpoint: string,
    body: unknown,
    headers?: RequestInit['headers'],
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    });
  }

  public delete<T>(endpoint: string, headers?: RequestInit['headers']): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiService = new ApiService();
