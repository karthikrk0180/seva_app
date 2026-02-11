/**
 * Auth Service (NO auth logic)
 * Just passes phone number between screens
 */

let lastPhoneNumber: string | null = null;

class AuthService {
  async loginWithPhone(phone: string): Promise<string> {
    lastPhoneNumber = phone;
    return 'local-verification-id';
  }

  async verifyOtp(): Promise<string> {
    if (!lastPhoneNumber) {
      throw new Error('Phone number missing');
    }
    return lastPhoneNumber;
  }

  logout() {
    lastPhoneNumber = null;
  }
}

export const authService = new AuthService();
