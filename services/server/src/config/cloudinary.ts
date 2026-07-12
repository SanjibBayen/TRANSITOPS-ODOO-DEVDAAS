import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Storage for documents
export const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TRANSITOPS-ODOO-DEVDAAS/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
    resource_type: 'auto',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

// Storage for vehicle images
export const vehicleImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TRANSITOPS-ODOO-DEVDAAS/vehicles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'fill', quality: 'auto' },
    ],
  },
});

// Storage for receipts
export const receiptStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TRANSITOPS-ODOO-DEVDAAS/receipts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

export class CloudinaryService {
  // Upload single file
  static async uploadFile(file: Express.Multer.File, folder: string = 'TRANSITOPS-ODOO-DEVDAAS') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // Upload multiple files
  static async uploadMultiple(files: Express.Multer.File[], folder: string = 'TRANSITOPS-ODOO-DEVDAAS') {
    const uploads = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploads);
  }

  // Delete file
  static async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  // Delete multiple files
  static async deleteMultiple(publicIds: string[]) {
    return cloudinary.api.delete_resources(publicIds);
  }

  // Generate optimized URL
  static getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  } = {}) {
    return cloudinary.url(publicId, {
      width: options.width || 800,
      height: options.height || 600,
      crop: options.crop || 'limit',
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
      secure: true,
    });
  }

  // Generate thumbnail
  static getThumbnail(publicId: string) {
    return cloudinary.url(publicId, {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'face',
      secure: true,
    });
  }

  // Generate signed URL (for private files)
  static getSignedUrl(publicId: string, expiresIn: number = 3600) {
    return cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'auto',
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    });
  }

  // Get resource info
  static async getResourceInfo(publicId: string) {
    return cloudinary.api.resource(publicId);
  }
}

export default cloudinary;