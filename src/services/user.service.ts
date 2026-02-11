import { apiService } from './api.service';
import { User } from 'src/models/user.model';
import { logger } from './logger.service';

export interface UserProfileResponse {
  id: string;
  phone: string;
  displayName?: string;
  dob?: string;
  gender?: string;
  gotra?: string;
  nakshatra?: string;
  address?: string;
}

export interface UserProfileUpdateRequest {
  displayName?: string;
  dob?: string;
  gender?: string;
  gotra?: string;
  nakshatra?: string;
  address?: string;
}

class UserService {
  private endpoint = '/v1/profile';
  private usersEndpoint = '/v1/users';

  /**
   * Helper to format phone number (remove +91 country code)
   */
  public formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // If it starts with 91 and is longer than 10 digits, remove 91
    if (digits.length > 10 && digits.startsWith('91')) {
      return digits.substring(2);
    }
    return digits;
  }

  /**
   * Get user profile by user ID (from auth token/header)
   */
  public async getProfile(userId: string): Promise<UserProfileResponse> {
    return apiService.get<UserProfileResponse>(this.endpoint, {
      'X-User-ID': userId,
    });
  }

  /**
   * Update user profile by user ID
   */
  public async updateProfile(
    userId: string,
    profile: UserProfileUpdateRequest
  ): Promise<UserProfileResponse> {
    return apiService.put<UserProfileResponse>(this.endpoint, profile, {
      'X-User-ID': userId,
    });
  }

  /**
   * Get user profile by phone number
   */
  public async getProfileByPhone(phone: string): Promise<UserProfileResponse> {
    const formattedPhone = this.formatPhoneNumber(phone);
    return apiService.get<UserProfileResponse>(`${this.endpoint}/by-phone?phone=${encodeURIComponent(formattedPhone)}`);
  }

  /**
   * Register a new user
   */
  public async registerUser(phone: string): Promise<void> {
    const formattedPhone = this.formatPhoneNumber(phone);
    await apiService.post(`${this.usersEndpoint}/register`, {
      phone: formattedPhone
    });
  }

  /**
   * Update user profile by phone number (matches provided structure)
   */
  public async updateProfileByPhone(
    phone: string,
    profileData: any
  ): Promise<UserProfileResponse> {
    const formattedPhone = this.formatPhoneNumber(phone);
    // Construct the payload matching the curl example
    // We expect profileData to contain the necessary fields to construct the full object or partial updates
    const url = `${this.endpoint }/by-phone?phone=${encodeURIComponent(formattedPhone)}`;
    logger.info(`Updating profile by phone: ${url}`);
    return apiService.put<UserProfileResponse>(
      url,
      profileData
    );
  }

  /**
   * Update basic user details
   */
  public async updateUserByPhone(
    phone: string,
    userData: any
  ): Promise<any> {
    const formattedPhone = this.formatPhoneNumber(phone);
    return apiService.put<any>(
      `${this.usersEndpoint}/by-phone?phone=${encodeURIComponent(formattedPhone)}`,
      userData
    );
  }

  /**
   * Map backend profile response to User model
   */
  public mapProfileToUser(profile: any, existingUser?: Partial<User>): User {
    // Handle nested user object from backend response
    const backendUser = profile.user || {};
    
    // Helper to get value from either object or fallback
    const getValue = (key: string) => backendUser[key] || profile[key];

    // Determine display name
    const firstName = getValue('firstName');
    const lastName = getValue('lastName');
    
    const displayName = getValue('displayName') || 
                       (firstName && lastName 
                        ? `${firstName} ${lastName}` 
                        : firstName || lastName);

    return {
      uid: getValue('id') || getValue('userId') || existingUser?.uid || '',
      phoneNumber: getValue('phone') || existingUser?.phoneNumber || '',
      displayName: displayName || existingUser?.displayName,
      firstName: firstName,
      lastName: lastName,
      email: getValue('email'),
      role: getValue('role') || existingUser?.role || 'devotee',
      isEmailVerified: existingUser?.isEmailVerified || false,
      createdAt: getValue('createdAt') || existingUser?.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: existingUser?.preferences || {
        language: getValue('languagePref') || 'en',
        notificationsEnabled: getValue('notifEnabled') ?? true,
      },
      // Profile fields
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      gothra: profile.gothra || profile.gotra, // Handle potential property name differences
      nakshatra: profile.nakshatra,
      rashi: profile.rashi,
      dob: backendUser.dob, // Assuming DOB might be moving to user object based on newer requirements or profile
      gender: backendUser.gender,
    };
  }
}

export const userService = new UserService();
