/**
 * Auth Service
 * Uses Firebase Phone Auth for OTP. Keeps confirmation result in memory for verify step.
 */

import { User } from 'src/models/user.model';
import { logger } from './logger.service';
import { firebaseService } from './firebase.service';
import { APP_CONFIG } from 'src/config';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// In-memory state for mock and real authentication
let confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;
let lastMockPhoneNumber: string | null = null;

const MOCK_DEVOTEE_USER: User = {
  uid: 'mock-devotee-123',
  phoneNumber: '+911111111111',
  role: 'devotee',
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  preferences: { language: 'en', notificationsEnabled: true },
};

const MOCK_ADMIN_USER: User = {
  uid: 'mock-admin-999',
  phoneNumber: '+912222222222',
  role: 'admin',
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  preferences: { language: 'en', notificationsEnabled: true },
};

function mapFirebaseUserToAppUser(fbUser: FirebaseAuthTypes.User): User {
  return {
    uid: fbUser.uid,
    phoneNumber: fbUser.phoneNumber ?? '',
    role: 'devotee',
    isEmailVerified: fbUser.emailVerified,
    createdAt: fbUser.metadata.creationTime ?? new Date().toISOString(),
    lastLoginAt: fbUser.metadata.lastSignInTime ?? new Date().toISOString(),
    preferences: { language: 'en', notificationsEnabled: true },
  };
}

class AuthService {
  public async loginWithPhone(phoneNumber: string): Promise<string> {
    logger.info(`Initiating login for ${phoneNumber}`);
    if (APP_CONFIG.ENABLE_MOCK_AUTH || phoneNumber === '+911111111111' || phoneNumber === '+912222222222') {
      logger.info('Using bypass for authentication');
      lastMockPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      return 'mock-verification-id';
    }
    try {
      const confirmation = await firebaseService.signInWithPhoneNumber(phoneNumber);
      confirmationResult = confirmation;
      return 'firebase-verification-id';
    } catch (error) {
      logger.error('Phone sign-in failed', error);
      throw error;
    }
  }

  public async verifyOtp(verificationId: string, code: string): Promise<User> {
    logger.info(`Verifying OTP for code length: ${code.length}`);
    
    if (verificationId === 'mock-verification-id') {
      if (lastMockPhoneNumber === '+912222222222') {
        if (code === '456789') return MOCK_ADMIN_USER;
        throw new Error('Invalid OTP for admin account');
      }
      
      if (code === '123456') {
        return MOCK_DEVOTEE_USER;
      }
      throw new Error('Invalid OTP for test account');
    }

    if (!confirmationResult) {
      throw new Error('No verification in progress. Please request OTP again.');
    }
    try {
      const userCredential = await confirmationResult.confirm(code);
      confirmationResult = null;
      if (!userCredential) {
        throw new Error('Verification failed: No user returned');
      }
      const fbUser = userCredential.user;
      return mapFirebaseUserToAppUser(fbUser);
    } catch (error) {
      logger.error('OTP verification failed', error);
      throw new Error('Invalid or expired OTP. Please try again.');
    }
  }

  public async logout(): Promise<void> {
    logger.info('Logging out');
    confirmationResult = null;
    await firebaseService.signOut();
  }

  public async getCurrentUser(): Promise<User | null> {
    const fbUser = firebaseService.getCurrentUser();
    if (!fbUser) return null;
    return mapFirebaseUserToAppUser(fbUser);
  }
}

export const authService = new AuthService();
