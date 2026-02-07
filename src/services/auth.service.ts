/**
 * Auth Service
 * Uses Firebase Phone Auth for OTP. Keeps confirmation result in memory for verify step.
 */

import { User } from 'src/models/user.model';
import { logger } from './logger.service';
import { firebaseService } from './firebase.service';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// In-memory: Firebase Phone Auth returns ConfirmationResult (not serializable for nav params)
let confirmationResult: FirebaseAuthTypes.ConfirmationResult | null = null;

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
    try {
      const confirmation = await firebaseService.signInWithPhoneNumber(phoneNumber);
      confirmationResult = confirmation;
      return 'firebase-verification-id';
    } catch (error) {
      logger.error('Phone sign-in failed', error);
      throw error;
    }
  }

  public async verifyOtp(_verificationId: string, code: string): Promise<User> {
    logger.info(`Verifying OTP for code length: ${code.length}`);
    if (!confirmationResult) {
      throw new Error('No verification in progress. Please request OTP again.');
    }
    try {
      const userCredential = await confirmationResult.confirm(code);
      confirmationResult = null;
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
