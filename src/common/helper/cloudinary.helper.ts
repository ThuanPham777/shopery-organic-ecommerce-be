import { cloudinary } from 'src/config/cloudinary.config';
import { Readable } from 'stream';

/**
 * Upload file lên Cloudinary với folder động
 * @param file - Tệp ảnh cần upload (Express.Multer.File)
 * @param folder - Thư mục lưu trữ trên Cloudinary (mặc định là "default-folder")
 * @returns Đường dẫn ảnh đã upload
 */
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'default-folder'
): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder }, // Thư mục động
      (error, result) => {
        if (error) return reject(error);
        resolve(result as { secure_url: string });
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
};

/**
 * Lấy public_id từ URL ảnh Cloudinary
 * @param imageUrl - Đường dẫn ảnh Cloudinary
 * @returns Public ID của ảnh
 */
export const extractPublicId = (imageUrl: string): string => {
  const matches = imageUrl.match(/\/upload\/v\d+\/(.+)\.\w+$/);
  if (!matches || !matches[1]) {
    throw new Error('Invalid imageUrl format');
  }
  return matches[1];
};

/**
 * Xóa ảnh trên Cloudinary
 * @param publicId - Public ID của ảnh cần xóa
 * @returns Kết quả xóa ảnh
 */
export const deleteFromCloudinary = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
