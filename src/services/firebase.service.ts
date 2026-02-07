import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { logger } from './logger.service';

class FirebaseService {
  
  // --- Authentication ---

  /**
   * Set language for auth (SMS verification messages). Call early, e.g. at app init.
   * @param languageCode ISO code (e.g. 'en', 'hi') or null to use device default
   */
  public async setAuthLanguage(languageCode: string | null): Promise<void> {
    try {
      await auth().setLanguageCode(languageCode);
    } catch (e) {
      logger.warn('setAuthLanguage failed', e);
    }
  }

  /**
   * Send OTP to Phone Number (E.164 format, e.g. +919999999999).
   * On Android, Firebase may use reCAPTCHA/Play Integrity; no extra setup in React Native.
   */
  public async signInWithPhoneNumber(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
    logger.info(`Sending OTP to ${phoneNumber}`);
    try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        return confirmation;
    } catch (error) {
        logger.error('Firebase Auth Error', error);
        throw error;
    }
  }

  public getCurrentUser(): FirebaseAuthTypes.User | null {
      return auth().currentUser;
  }

  public async signOut(): Promise<void> {
      await auth().signOut();
  }

  // --- Messaging (Notifications) ---
  
  public async requestPermission(): Promise<boolean> {
      // Stub for messaging permission
      // import messaging from '@react-native-firebase/messaging';
      // const authStatus = await messaging().requestPermission();
      // return authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return true; 
  }

  public async getFCMToken(): Promise<string | undefined> {
      // return await messaging().getToken();
      return "mock-fcm-token";
  }
}

export const firebaseService = new FirebaseService();
