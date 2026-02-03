/**
 * Auth Service
 * Abstracted authentication layer.
 * Currently uses mocks, but structured for Firebase Auth.
 */

import { User } from 'src/models/user.model';
import { logger } from './logger.service';
import { delay } from 'src/utils/delay';

class AuthService {
  // TODO: Replace with Firebase Auth instance
  // private auth = auth();

  public async loginWithPhone(phoneNumber: string): Promise<string> {
    logger.info(`Initiating login for ${phoneNumber}`);
    await delay(1000);
    // TODO: Implement firebase.auth().signInWithPhoneNumber(phoneNumber)
    return 'mock-verification-id';
  }

  public async verifyOtp(verificationId: string, code: string): Promise<User> {
    logger.info(`Verifying OTP: ${code} for id: ${verificationId}`);
    await delay(1000);

    // Mock successful user payload
    if (code === '123456') {
      const mockUser: User = {
        uid: 'user-123',
        phoneNumber: '+919876543210',
        role: 'devotee',
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
            language: 'en',
            notificationsEnabled: true
        }
      };
      return mockUser;
    }

    throw new Error('Invalid OTP');
  }

  public async logout(): Promise<void> {
    logger.info('Logging out');
    await delay(500);
    // TODO: auth().signOut()
  }

  public async getCurrentUser(): Promise<User | null> {
    // TODO: Listen to onAuthStateChanged
    return null; 
  }
}

export const authService = new AuthService();
