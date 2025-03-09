import { Injectable } from '@nestjs/common';
import { cloudinary } from 'src/config/cloudinary.config';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadToCloudinary(file: Express.Multer.File): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'shopery-organic/products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as { secure_url: string });
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
}
    // Lấy public_id từ URL ảnh trên Cloudinary
  extractPublicId(imageUrl: string): string {
    const matches = imageUrl.match(/\/upload\/v\d+\/(.+)\.\w+$/); // Biểu thức chính quy để lấy public_id
    if (!matches || !matches[1]) {
      throw new Error('Invalid imageUrl format');
    }
    return matches[1]; // Trả về public_id
}

  // Xóa ảnh trên Cloudinary
  async deleteFromCloudinary(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

}
