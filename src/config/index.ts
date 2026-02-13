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
    // android: 'http://192.168.29.138:8181',
    ios: 'http://localhost:8181',
    default: 'http://localhost:8181',
  }),
  SUPPORT_EMAIL: 'support@sode.org',
  WEBSITE_URL: 'https://sode.org',
  ENABLE_MOCK_AUTH: true, // __DEV__, // Always bypass Firebase
  /** Dev only: dummy OTP accepted for test phones (no SMS). e.g. 123456 */
  DUMMY_OTP_DEV: __DEV__ ? '123456' : null,
  /** Dev only: phone numbers that can use dummy OTP (digits only, e.g. 9999999999) */
  DUMMY_OTP_TEST_PHONES: __DEV__ ? ['9999999999', '9111111111', '9222222222'] : [],
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
    CART: 'Cart',
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
    SEARCH: 'Search',
    ROOM_BOOKING: 'RoomBooking',
    EVENTS: 'EventList',
    ADMIN: 'AdminDashboard',
    SEVA_MANAGEMENT: 'SevaManagement',
    SEVA_FORM: 'SevaForm',
    GURU_MANAGEMENT: 'GuruManagement',
    GURU_FORM: 'GuruForm',
    EVENT_MANAGEMENT: 'EventManagement',
    EVENT_FORM: 'EventForm',
    EVENT_DETAIL: 'EventDetail',
    MEDIA_MANAGEMENT: 'MediaManagement',
  },
} as const;
