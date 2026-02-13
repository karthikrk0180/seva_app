/**
 * React Hook for Cloudinary Upload
 * Provides upload functionality with progress tracking and error handling.
 * Uses backend-signed uploads (SUPERADMIN only).
 */

import { useState, useCallback, useRef } from 'react';
import { mediaService, LocalImageFile, CloudinaryUploadResult } from 'src/services/media.service';
import { authTokenService } from 'src/services/authToken.service';
import { useAuthStore } from 'src/store/auth.store';
import { logger } from 'src/services/logger.service';

export type UploadStep = 'idle' | 'gettingSignature' | 'uploading' | 'registering' | 'done';

export interface UseCloudinaryUploadResult {
  uploadImage: (file: LocalImageFile, maxFileSizeMB?: number) => Promise<CloudinaryUploadResult | null>;
  progress: number; // 0-1
  step: UploadStep;
  isUploading: boolean;
  error: string | null;
  result: {
    publicId: string;
    secureUrl: string;
  } | null;
  reset: () => void;
  cancel: () => void;
}

/**
 * Hook for Cloudinary upload with backend signature.
 * 
 * Flow:
 * 1. Get signature from backend (POST /api/media/signature) - requires JWT + SUPERADMIN
 * 2. Upload file to Cloudinary with signed params
 * 3. Register media with backend (POST /api/media/register) - requires JWT + SUPERADMIN
 * 
 * Requirements:
 * - User must be SUPERADMIN (checked via user.role)
 * - JWT token must be available (from token storage)
 * - File size validation (default max 5MB)
 */
export function useCloudinaryUpload(): UseCloudinaryUploadResult {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<UploadStep>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ publicId: string; secureUrl: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadImage = useCallback(
    async (file: LocalImageFile, maxFileSizeMB: number = 5): Promise<CloudinaryUploadResult | null> => {
      // Prevent multiple uploads
      if (isUploading) {
        logger.warn('Upload already in progress');
        return null;
      }

      // SUPERADMIN / admin only (backend enforces; this is UX guard)
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        const msg = 'Only superadmin users can upload media.';
        setError(msg);
        logger.warn(msg, { role: user?.role });
        return null;
      }

      // File size validation
      const maxBytes = maxFileSizeMB * 1024 * 1024;
      if (file.fileSize != null && file.fileSize > maxBytes) {
        const msg = `File is too large. Maximum allowed size is ${maxFileSizeMB} MB.`;
        setError(msg);
        logger.warn(msg, { fileSize: file.fileSize, maxBytes });
        return null;
      }

      // Token is attached by global API client; we only check it exists
      const token = await authTokenService.getToken();
      if (!token) {
        const msg = 'Missing JWT token. Please log in again.';
        setError(msg);
        logger.error(msg);
        return null;
      }

      // Reset state
      setError(null);
      setResult(null);
      setProgress(0);
      setStep('gettingSignature');
      setIsUploading(true);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Step 1: Get signature from backend (JWT auto-attached by API client)
        logger.info('Step 1: Getting upload signature');
        const signature = await mediaService.getSignature();
        setProgress(0.3);
        setStep('uploading');

        // Step 2: Upload to Cloudinary
        logger.info('Step 2: Uploading to Cloudinary');
        const uploadResult = await mediaService.uploadToCloudinary(file, signature);
        setProgress(0.7);
        setStep('registering');

        // Step 3: Register with backend
        logger.info('Step 3: Registering media with backend');
        await mediaService.registerMedia(uploadResult.public_id);
        setProgress(1);
        setStep('done');

        const finalResult = {
          publicId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
        };
        setResult(finalResult);
        logger.info('Upload flow completed successfully', finalResult);

        return uploadResult;
      } catch (err: any) {
        // Don't set error if upload was cancelled
        if (err.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
          logger.info('Upload cancelled by user');
          return null;
        }

        let errorMessage = 'Upload failed. Please try again.';

        // Parse error based on step and error type
        if (err?.message) {
          if (err.message.includes('403') || err.message.includes('Forbidden')) {
            errorMessage = 'You do not have permission to upload media. Only superadmin users can upload.';
          } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (err.message.includes('signature') || step === 'gettingSignature') {
            errorMessage = 'Failed to get upload authorization. Please try again.';
          } else if (step === 'uploading') {
            errorMessage = 'Failed to upload image. Please check your connection and try again.';
          } else if (step === 'registering') {
            errorMessage = 'Upload succeeded but failed to register. Please contact support.';
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        logger.error('Upload error', { err, step });
        return null;
      } finally {
        setIsUploading(false);
        abortControllerRef.current = null;
      }
    },
    [isUploading, user],
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setError('Upload cancelled');
      setStep('idle');
    }
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setStep('idle');
    setError(null);
    setResult(null);
    setIsUploading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    uploadImage,
    progress,
    step,
    isUploading,
    error,
    result,
    reset,
    cancel,
  };
}
