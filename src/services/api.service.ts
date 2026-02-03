/**
 * API Service (REST)
 * Interface for the Java Spring Boot Backend.
 * Supports standard GET, POST, PUT, DELETE methods.
 */

import { APP_CONFIG } from 'src/config';
import { logger } from './logger.service';

interface ApiRequestConfig extends RequestInit {
  timeout?: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.API_BASE_URL;
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), config.timeout || APP_CONFIG.API_TIMEOUT);

    try {
      logger.info(`API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers,
        },
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
          return {} as T;
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
          try {
             data = await response.json();
          } catch (parseError) {
             throw new Error('Invalid JSON response from server');
          }
      } else {
          // If not JSON, return text or empty logic depending on need, or throw.
          // For safety, we treat unexpected content types as errors if we expect JSON.
          const text = await response.text();
          logger.warn(`API returned non-JSON: ${text.substring(0, 100)}`);
          throw new Error('Server returned non-JSON response');
      }

      return data as T;

    } catch (error) {
      clearTimeout(id);
      logger.error(`API Failed: ${endpoint}`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public post<T>(endpoint: string, body: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });
  }

  public put<T>(endpoint: string, body: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    });
  }

  public delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiService = new ApiService();
