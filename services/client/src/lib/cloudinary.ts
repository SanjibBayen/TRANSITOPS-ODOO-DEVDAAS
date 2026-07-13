const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'transitops-uploads';

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  original_filename: string;
}

export const cloudinary = {
  /**
   * Upload a file to Cloudinary
   */
  upload: async (file: File, folder: string = 'transitops'): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  /**
   * Upload multiple files
   */
  uploadMultiple: async (files: File[], folder: string = 'transitops'): Promise<CloudinaryUploadResult[]> => {
    const uploads = files.map(file => cloudinary.upload(file, folder));
    return Promise.all(uploads);
  },

  /**
   * Get optimized image URL
   */
  getOptimizedUrl: (publicId: string, options?: { width?: number; height?: number; quality?: string }): string => {
    const { width = 800, height = 600, quality = 'auto' } = options || {};
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},q_${quality},f_auto/${publicId}`;
  },

  /**
   * Get thumbnail URL
   */
  getThumbnail: (publicId: string): string => {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_200,h_200,c_thumb,g_face/${publicId}`;
  },

  /**
   * Get document URL
   */
  getDocumentUrl: (publicId: string): string => {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`;
  },

  /**
   * Delete a file
   */
  delete: async (publicId: string): Promise<void> => {
    // Note: Deletion requires server-side signature for security
    // backend endpoint instead
    console.warn('Client-side deletion not recommended. Use backend API.');
  },
};