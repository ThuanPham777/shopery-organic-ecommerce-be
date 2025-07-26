import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from 'src/database/entities/attribute/attribute.entity';
import { AttributeController } from './controller/attribute.controller';
import { AttributeAdminController } from './controller/attribute.admin.controller';
import { AttributeService } from './service/attribute.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
  controllers: [AttributeAdminController, AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
