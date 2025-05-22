import { ConfigService } from '@nestjs/config';
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/database/entities/user/user.entity';
import { SignupDto } from '../dto/signup.dto';
import { LoginResponse } from 'src/type/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  // Kiểm tra username + mật khẩu
  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // loại bỏ trường password trước khi trả về
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Đăng nhập: gọi validateUser, ném Unauthorized nếu sai
  async login(user: Omit<User, 'password'>): Promise<LoginResponse> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      user,
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: `${this.configService.get('JWT_EXPIRES_IN')}`,
      }),
    };
  }

  // Tạo mới user (signup)
  async signup(signupDto: SignupDto): Promise<Omit<User, 'password'>> {
    const exists = await this.userRepository.findOne({
      where: { email: signupDto.username },
    });
    if (exists) {
      throw new UnauthorizedException('Email đã được đăng ký');
    }

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupDto.password, salt);

    const user = this.userRepository.create({
      ...signupDto,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(user);

    const { password, ...result } = saved;
    return result;
  }
}
