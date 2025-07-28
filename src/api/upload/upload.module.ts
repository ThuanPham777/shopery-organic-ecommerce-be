import { Module } from '@nestjs/common';
import { UploadController } from './controller/upload.controller';
import { UploadService } from './service/upload.service';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService], // để sử dụng ở các module khác
})
export class UploadModule {}
