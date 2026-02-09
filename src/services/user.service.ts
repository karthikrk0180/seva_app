import { apiService } from './api.service';
import { User } from 'src/models/user.model';

export interface UserProfileResponse {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  gotra?: string;
  nakshatra?: string;
  address?: string;
}

export interface UserProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  gotra?: string;
  nakshatra?: string;
  address?: string;
}

class UserService {
  private endpoint = '/v1/profile';

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
    return apiService.get<UserProfileResponse>(`${this.endpoint}/by-phone?phone=${encodeURIComponent(phone)}`);
  }

  /**
   * Create or update user profile by phone number
   */
  public async createOrUpdateProfileByPhone(
    phone: string,
    profile: UserProfileUpdateRequest
  ): Promise<UserProfileResponse> {
    return apiService.put<UserProfileResponse>(
      `${this.endpoint}/by-phone?phone=${encodeURIComponent(phone)}`,
      profile
    );
  }

  /**
   * Update user profile by phone number (alias for createOrUpdateProfileByPhone)
   */
  public async updateProfileByPhone(
    phone: string,
    profile: UserProfileUpdateRequest
  ): Promise<UserProfileResponse> {
    return this.createOrUpdateProfileByPhone(phone, profile);
  }

  /**
   * Map backend profile response to User model
   */
  public mapProfileToUser(profile: UserProfileResponse, existingUser?: Partial<User>): User {
    const displayName = profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.firstName || profile.lastName || undefined;

    return {
      uid: profile.id,
      phoneNumber: profile.phone,
      displayName,
      role: existingUser?.role || 'devotee',
      isEmailVerified: existingUser?.isEmailVerified || false,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: existingUser?.preferences || {
        language: 'en',
        notificationsEnabled: true,
      },
      address: profile.address,
      gothra: profile.gotra,
      nakshatra: profile.nakshatra,
    };
  }
}

export const userService = new UserService();
