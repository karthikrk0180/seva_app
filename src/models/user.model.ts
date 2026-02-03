/**
 * User Model
 * Represents the authenticated user in the system.
 */

export type UserRole = 'devotee' | 'admin' | 'staff';

export interface User {
  uid: string;
  phoneNumber: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string; // ISO 8601
  lastLoginAt: string; // ISO 8601
  preferences: {
    language: 'en' | 'kn';
    notificationsEnabled: boolean;
  };
}

// Ensure strict typing for updates
export type UserProfileUpdate = Partial<Pick<User, 'displayName' | 'email' | 'photoURL' | 'preferences'>>;
