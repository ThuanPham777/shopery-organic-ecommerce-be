import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { User } from 'src/database/entities/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// auth.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
