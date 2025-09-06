import { useState, useCallback } from 'react';

export interface UseImageUploadResult {
  uploading: boolean;
  error: string | null;
  uploadImage: (file: File, onSuccess: (imageUrl: string) => void) => Promise<void>;
  clearError: () => void;
}

export const useImageUpload = (
  uploadFunction: (file: File) => Promise<{ imageUrl?: string; error?: string }>
): UseImageUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File, onSuccess: (imageUrl: string) => void) => {
    try {
      console.log('🚀 useImageUpload: Starting upload process');
      setUploading(true);
      setError(null);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor selecciona un archivo de imagen válido');
      }
      
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('La imagen debe ser menor a 5MB');
      }

      console.log('✅ File validation passed');
      const result = await uploadFunction(file);
      console.log('📤 Upload function result:', result);
      
      if (result.error) {
        console.error('❌ Upload function returned error:', result.error);
        throw new Error(result.error);
      }
      
      if (result.imageUrl) {
        console.log('✅ Success! Calling onSuccess with URL:', result.imageUrl);
        onSuccess(result.imageUrl);
      } else {
        console.warn('⚠️ No imageUrl returned from upload function');
      }
      
    } catch (err) {
      console.error('❌ useImageUpload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [uploadFunction]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploading,
    error,
    uploadImage,
    clearError,
  };
};