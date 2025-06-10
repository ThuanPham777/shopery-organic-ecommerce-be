import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { BrandController } from './controller/brand.controller';
import { BrandService } from './service/brand.service';
import { BrandAdminController } from './controller/brand.admin.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController, BrandAdminController],
  providers: [BrandService],
})
export class BrandModule { }
