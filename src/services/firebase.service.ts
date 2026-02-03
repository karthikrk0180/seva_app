import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { logger } from './logger.service';

class FirebaseService {
  
  // --- Authentication ---
  
  /**
   * Send OTP to Phone Number
   * @param phoneNumber E.g., "+919999999999"
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
