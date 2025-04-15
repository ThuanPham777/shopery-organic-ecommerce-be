// auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/api/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    console.log('user', user);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      console.log('result', result);
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    console.log('user', user);
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
