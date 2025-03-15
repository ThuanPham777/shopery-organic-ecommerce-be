import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { ManufacturerController } from './controller/manufacturer.controller';
import { ManufacturerService } from './service/manufacturer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  controllers: [ManufacturerController],
  providers: [ManufacturerService],
})
export class ManufacturerModule {}
