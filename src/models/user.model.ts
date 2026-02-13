/**
 * User Model
 * Represents the authenticated user in the system.
 */

export type UserRole = 'devotee' | 'admin' | 'staff' | 'superadmin';

export interface User {
  id: any;
  uid: string;
  phoneNumber: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  dob?: string; // Date of birth
  gender?: string;
  photoURL?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string; // ISO 8601
  lastLoginAt: string; // ISO 8601
  preferences: {
    language: 'en' | 'kn';
    notificationsEnabled: boolean;
  };
  /** Devotee profile (3.8 Seva form, 3.13 Registration) */
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  nakshatra?: string;
  rashi?: string;
  gothra?: string;
}

// Ensure strict typing for updates
export type UserProfileUpdate = Partial<Pick<User, 'displayName' | 'firstName' | 'lastName' | 'dob' | 'gender' | 'email' | 'photoURL' | 'preferences' | 'address' | 'city' | 'state' | 'pincode' | 'nakshatra' | 'rashi' | 'gothra'>>;
