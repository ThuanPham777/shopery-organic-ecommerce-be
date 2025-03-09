import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!file.mimetype.includes('/')) {
      throw new Error('Invalid file type');
    }

    const format = file.mimetype.split('/')[1];
    const filename = file.originalname.split('.')[0];

    return {
      folder: 'shopery-organic/products',
      format,
      public_id: filename.replace(/\s+/g, '_'), // Xóa khoảng trắng trong tên file
    };
  },
});

export { cloudinary, storage };
