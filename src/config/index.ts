/**
 * Application Configuration
 * Centralized constants and environment config.
 */

import { Platform } from 'react-native';

export const APP_CONFIG = {
  APP_NAME: 'Sode Sri Vadiraja Matha',
  API_TIMEOUT: 10000,
  API_BASE_URL: Platform.select({
    android: 'http://10.0.2.2:8181',
    ios: 'http://localhost:8181',
    default: 'http://localhost:8181',
  }),
  SUPPORT_EMAIL: 'support@sode.org',
  WEBSITE_URL: 'https://sode.org',
  ENABLE_MOCK_AUTH: __DEV__, // Enable mock auth by default in development
};

export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE: 'app_language',
};

export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    OTP: 'Otp',
  },
  TABS: {
    HOME: 'Home',
    HISTORY: 'History',
    SEVA: 'Seva',
    PROFILE: 'Profile',
    MORE: 'More',
  },
  HISTORY: {
    GURU_LIST: 'GuruList',
    GURU_DETAIL: 'GuruDetail',
  },
  SEVA: {
    SEVA_LIST: 'SevaList',
    SEVA_BOOKING: 'SevaBooking',
  },
  SERVICES: {
    ROOM_BOOKING: 'RoomBooking',
    EVENTS: 'EventList',
    ADMIN: 'AdminDashboard',
    SEVA_MANAGEMENT: 'SevaManagement',
    SEVA_FORM: 'SevaForm',
    GURU_MANAGEMENT: 'GuruManagement',
    GURU_FORM: 'GuruForm',
  },
} as const;
