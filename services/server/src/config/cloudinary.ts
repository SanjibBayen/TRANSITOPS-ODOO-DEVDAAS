import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export class CloudinaryService {
  static async uploadFile(file: Express.Multer.File, folder: string = 'transitops') {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const publicId = `${folder}/${timestamp}_${random}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  static async uploadMultiple(files: Express.Multer.File[], folder: string = 'transitops') {
    const uploads = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploads);
  }

  static async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  static async deleteMultiple(publicIds: string[]) {
    return cloudinary.api.delete_resources(publicIds);
  }

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

  static getThumbnail(publicId: string) {
    return cloudinary.url(publicId, {
      width: 200,
      height: 200,
      crop: 'thumb',
      gravity: 'face',
      secure: true,
    });
  }

  static getSignedUrl(publicId: string, expiresIn: number = 3600) {
    return cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'auto',
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    } as any);
  }

  static async getResourceInfo(publicId: string) {
    return cloudinary.api.resource(publicId);
  }
}

export default cloudinary;