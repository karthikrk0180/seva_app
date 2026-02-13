/**
 * Media Service
 * Handles Cloudinary upload with backend-signed uploads.
 *
 * Two flows:
 * - uploadForUrlOnly: signature → upload to Cloudinary → return { public_id, secure_url }.
 *   Use secure_url in UI or send in another API (e.g. event image_url). No /api/media/register.
 * - uploadMedia: signature → upload → register (for media library, list, delete, audit).
 */

import { apiService } from './api.service';
import { logger } from './logger.service';
import { APP_CONFIG } from 'src/config';

export interface MediaSignatureResponse {
  timestamp: number;
  signature: string;
  api_key: string;
  cloud_name: string;
  folder: string;
}

export interface MediaRegisterRequest {
  public_id: string;
}

/** Backend media_assets record (register response or GET /api/media/{id}) */
export interface MediaAsset {
  id: string;
  public_id: string;
  uploaded_by: string;
  role: string;
  created_at: string;
}

export interface MediaRegisterResponse extends MediaAsset {
  secure_url?: string; // optional; build with cloudinaryImageUrl(public_id) if missing
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface LocalImageFile {
  uri: string;
  type?: string;
  name?: string;
  fileSize?: number; // in bytes
}

export class MediaService {
  private readonly cloudName = 'dcgn6ke9j'; // from your .env

  /**
   * Step 1: Get signed upload parameters from backend.
   * JWT is attached by the global API client (SUPERADMIN only on backend).
   */
  async getSignature(): Promise<MediaSignatureResponse> {
    logger.info('Requesting upload signature from backend');
    return apiService.post<MediaSignatureResponse>('/api/media/signature', {});
  }

  /**
   * Step 2: Upload file to Cloudinary using signed parameters.
   * Uses FormData with file, timestamp, signature, api_key, folder.
   */
  async uploadToCloudinary(
    file: LocalImageFile,
    signature: MediaSignatureResponse,
  ): Promise<CloudinaryUploadResult> {
    const formData = new FormData();

    // Append file (React Native FormData format)
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'upload.jpg',
    } as any);

    // Append signed parameters (must match backend signature)
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('api_key', signature.api_key);
    formData.append('folder', signature.folder);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    logger.info('Uploading to Cloudinary', {
      url,
      folder: signature.folder,
      timestamp: signature.timestamp,
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let fetch set it with boundary for FormData
    });

    if (!response.ok) {
      let errorMessage = `Cloudinary upload failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        logger.error('Cloudinary error details', errorData);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        // Response body is not JSON
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    logger.info('Cloudinary upload successful', {
      public_id: data.public_id,
      secure_url: data.secure_url,
    });

    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
    };
  }

  /**
   * Step 3: Register uploaded media with backend.
   * JWT is attached by the global API client.
   */
  async registerMedia(publicId: string): Promise<MediaRegisterResponse> {
    const body: MediaRegisterRequest = { public_id: publicId };
    logger.info('Registering media with backend', { public_id: publicId });
    return apiService.post<MediaRegisterResponse>('/api/media/register', body);
  }

  /**
   * Upload for URL only: signature → upload to Cloudinary. No call to /api/media/register.
   * Use when you only need the image in one place (e.g. event image, profile) and will send
   * secure_url in another API (e.g. PATCH event) or use it in UI state.
   */
  async uploadForUrlOnly(file: LocalImageFile): Promise<CloudinaryUploadResult> {
    const signature = await this.getSignature();
    return this.uploadToCloudinary(file, signature);
  }

  /**
   * Complete upload flow: signature → upload → register (for media library / list / delete).
   */
  async uploadMedia(file: LocalImageFile): Promise<{ upload: CloudinaryUploadResult; registration: MediaRegisterResponse }> {
    const signature = await this.getSignature();
    const uploadResult = await this.uploadToCloudinary(file, signature);
    const registration = await this.registerMedia(uploadResult.public_id);
    return { upload: uploadResult, registration };
  }

  /**
   * Get a single media asset by id (public, no auth).
   */
  async getMedia(id: string): Promise<MediaAsset> {
    return apiService.get<MediaAsset>(`/api/media/${id}`, undefined, true);
  }

  /**
   * Delete a media asset (SUPERADMIN only). Returns 204 on success.
   */
  async deleteMedia(id: string): Promise<void> {
    await apiService.delete(`/api/media/${id}`);
  }
}

export const mediaService = new MediaService();

const CLOUD_NAME = 'dcgn6ke9j';
const DISPLAY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Build Cloudinary image URL for display.
 * @param publicId - e.g. "samples/seva_app/xyz123"
 * @param transform - optional, e.g. "w_300,h_200,c_fill"
 */
export function cloudinaryImageUrl(publicId: string, transform?: string): string {
  if (!publicId) return '';
  const path = transform ? `${transform}/${publicId}` : publicId;
  return `${DISPLAY_BASE}/${path}`;
}
