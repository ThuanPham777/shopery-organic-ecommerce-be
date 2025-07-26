import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueAdminController } from './controller/attributeValue.admin.controller';
import { AttributeValueController } from './controller/attributeValue.controller';
import { AttributeValueService } from './service/attributeValue.service';
import { AttributeValue } from 'src/database/entities/attribute/attribute-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValue])],
  controllers: [AttributeValueAdminController, AttributeValueController],
  providers: [AttributeValueService],
})
export class AttributeValueModule {}
