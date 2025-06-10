// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user/user.entity';
import { UserAdminController } from './controller/user.admin.controller';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController, UserAdminController],
  exports: [UserService],
})
export class UserModule { }
