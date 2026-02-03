/**
 * Application Configuration
 * Centralized constants and environment config.
 */

export const APP_CONFIG = {
  APP_NAME: 'Sode Sri Vadiraja Matha',
  API_TIMEOUT: 10000,
  API_BASE_URL: 'https://api.sode.org/v1', // Placeholder for Spring Boot Backend
  SUPPORT_EMAIL: 'support@sode.org',
  WEBSITE_URL: 'https://sode.org',
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
  },
} as const;
