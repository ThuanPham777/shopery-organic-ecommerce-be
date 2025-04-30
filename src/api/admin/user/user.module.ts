// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user/user.entity';
import { UserController } from './controller/user.controller';
import { AdminService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminService],
  controllers: [UserController],
  exports: [AdminService],
})
export class UserModule {}
