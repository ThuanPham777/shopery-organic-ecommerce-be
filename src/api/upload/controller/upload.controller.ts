import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../service/upload.service';
import { ApiRes } from 'src/type/custom-response.type';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload 1 ảnh duy nhất lên Cloudinary
   * @param file - ảnh (form-data key: file)
   * @param type - thư mục lưu trữ (vd: product, category)
   */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string = 'default-folder',
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.uploadService.uploadToCloudinary(file, type);

      return {
        message: 'Upload thành công',
        imageUrl: result.secure_url,
        publicId: this.uploadService.extractPublicId(result.secure_url),
      };
    } catch (error) {
      throw new HttpException(
        'Upload thất bại: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload nhiều ảnh lên Cloudinary
   * @param files - ảnh (form-data key: files[])
   * @param type - thư mục lưu trữ (vd: product, category)
   */
  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10)) // giới hạn 10 ảnh
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('type') type: string = 'default-folder',
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('Files are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const result = await this.uploadService.uploadToCloudinary(
            file,
            type,
          );
          return {
            imageUrl: result.secure_url,
            publicId: this.uploadService.extractPublicId(result.secure_url),
          };
        }),
      );

      return {
        message: 'Upload nhiều ảnh thành công',
        files: results,
      };
    } catch (error) {
      throw new HttpException(
        'Upload thất bại: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Xóa ảnh Cloudinary theo publicId
   * @param publicId - Public ID lấy từ kết quả upload
   */
  @Delete('image')
  async deleteImage(@Query('publicId') publicId: string) {
    if (!publicId) {
      throw new HttpException('Missing publicId', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.uploadService.deleteFromCloudinary(publicId);
      return {
        message: 'Xóa ảnh thành công',
        result,
      };
    } catch (error) {
      throw new HttpException(
        'Xóa ảnh thất bại: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
