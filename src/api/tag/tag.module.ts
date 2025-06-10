import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { TagController } from './controller/tag.controller';
import { TagService } from './service/tag.service';
import { TagAdminController } from './controller/tag.admin.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController, TagAdminController],
  providers: [TagService],
})
export class TagModule { }
